const { default: axios } = require("axios");
const Visit = require("../modals/visit");
const Website = require("../modals/website");
const ExpressError = require("../utils/ExpressError");
const User = require("../modals/user");

module.exports.visitWebsite = async (req, res) => {
  const website = await Website.findById(req.params.id);
  if (!website) {
    throw new ExpressError(404, "website not found");
  }
  let ip =
    req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

  let coords = null;

  try {
    const response = await axios.get(`http://ip-api.com/json/${ip}`);
    ipData = response.data;

    // Check if response is successful and contains lat/lon
    if (ipData.status === "success" && ipData.lat && ipData.lon) {
      coords = {
        type: "Point",
        coordinates: [ipData.lat, ipData.lon],
      };
    } 
  } catch (error) {
    
  }

  let newVisit = null;
  if (coords != null) {
    newVisit = new Visit({
      website: website._id,
      deviceType: req.body.deviceType,
      location: coords,
    });
  } else {
    newVisit = new Visit({
      website: website._id,
      deviceType: req.body.deviceType,
    });
  }

  const saved = await newVisit.save();

  const io = req.io;
  const socketStore = req.socketStore;

  const socket = socketStore.getSocketOfUser(website.user.toString());
  if (socket) {
    io.to(socket).emit("visitAdded", saved);
  }

  res.status(202).json({ message: "Visit saved", id: saved._id });
};

module.exports.closeTheVisitedWebsite = async (req, res) => {
  const website = await Website.findById(req.params.id);
  if (!website) {
    throw new ExpressError(404, "website not found");
  }
  const visit = await Visit.findById(req.params.visitId);
  visit.closedTime = Date.now();

  await visit.save();

  const updatedVisit = await Visit.findById(req.params.visitId); 

  const io = req.io;
  const socketStore = req.socketStore;

  const socket = socketStore.getSocketOfUser(website.user.toString());
  if (socket) {
    io.to(socket).emit("visitUpdated", updatedVisit);
  }

  res.status(200).json({ message: "website visit closed" });
};

module.exports.addRoutesToVisit = async (req, res) => {
  const website = await Website.findById(req.params.id);
  if (!website) {
    throw new ExpressError(404, "website not found");
  }
  const visit = await Visit.findById(req.params.visitId);

  const idx = visit.routes.indexOf(req.body.route);
  if (idx == -1) {
    visit.routes.push(req.body.route);
  }

  await visit.save();

  const updatedVisit = await Visit.findById(req.params.visitId);

  const io = req.io;
  const socketStore = req.socketStore;

  const socket = socketStore.getSocketOfUser(website.user.toString());
  if (socket) {
    io.to(socket).emit("visitUpdated", updatedVisit);
  }

  res.status(200).json({ message: "saved" });
};


module.exports.getAllVisitsOfWebsite = async (req, res) => {
  const website = await Website.findById(req.params.id);

  const { userId } = req.auth();
  if (!website) {
    throw new ExpressError(404, "Website not found");
  }

  const user = await User.findOne({ clerk_id: userId });
  if (!user) {
    throw new ExpressError("user not found");
  }
  
  if (!website.user.equals(user._id)) {
    throw new ExpressError(404, "You have no access to this website");
  }

  const visits = await Visit.find({ website: website._id });

  res.status(200).json(visits);

  
}

module.exports.sendDataForExtrenalSite = async (req, res) => {
  const website = await Website.findById(req.params.id);

  if (!website) {
    throw new ExpressError("Website Not Found", 404);
  }

  const visits = await Visit.find({ website: website._id });

  // Active users (based on the virtual field)
  const activeUsers = visits.filter((visit) => visit.isActive).length;

  // Calculate average session time in milliseconds
  const completedSessions = visits.filter((v) => v.closedTime);
  let totalSessionTime = 0;

  completedSessions.forEach((visit) => {
    const duration = new Date(visit.closedTime) - new Date(visit.visitedTime);
    totalSessionTime += duration;
  });

  const averageSessionTime =
    completedSessions.length > 0
      ? Math.round(totalSessionTime / completedSessions.length)
      : 0;

  // Date ranges
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);

  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(now.getDate() - 30);

  const past7daysUsers = visits.filter(
    (v) => new Date(v.visitedTime) >= sevenDaysAgo
  ).length;

  const pastMonthUsers = visits.filter(
    (v) => new Date(v.visitedTime) >= thirtyDaysAgo
  ).length;

  return res.json({
    past3MonthsUsers: visits.length,
    activeUsers,
    averageSessionTime, // in milliseconds
    past7daysUsers,
    pastMonthUsers,
  });
}