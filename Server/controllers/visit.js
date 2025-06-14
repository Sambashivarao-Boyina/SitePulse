const Visit = require("../modals/visit");
const Website = require("../modals/website");
const ExpressError = require("../utils/ExpressError");

module.exports.visitWebsite = async (req, res) => {
  const website = await Website.findById(req.params.id);

  if (!website) {
    throw new ExpressError(404, "website not found");
  }

  let ip =
    req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

  let coords = null;

  try {
    const response = await fetch(`http://ip-api.com/json/${ip}`);
    ipData = await response.json();

    // Check if response is successful and contains lat/lon
    if (ipData.status === "success" && ipData.lat && ipData.lon) {
      coords = {
        type: "Point",
        coordinates: [ipData.lon, ipData.lat],
      };
    }
  } catch (error) {
    console.log(error);
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


  const savedVisit = await Visit.findById(req.params.visitId);

  res.status(200).json({ message: "saved" });
};
