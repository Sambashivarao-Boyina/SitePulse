const User = require("../modals/user");
const Website = require("../modals/website");
const ExpressError = require("../utils/ExpressError");

module.exports.addWebsite = async (req, res) => {
  const { userId } = req.auth();

  const user = await User.findOne({ clerk_id: userId });
  if (!user) {
    throw ExpressError(404, "User Notfound");
  }

  const newWebsite = await Website({
    ...req.body,
    user: user._id,
  });

  const savedWebsite = await newWebsite.save();

  res
    .status(200)
    .json({ message: "Website Created Successfully", website: savedWebsite });
};

module.exports.getAllWebsiteOfUser = async (req, res) => {
  const { userId } = req.auth();

  const user = await User.findOne({ clerk_id: userId });

  if (!user) {
    throw new ExpressError(401, "You are not authorized");
  }

  const webistes = await Website.find({ user: user._id }).populate(
    "lastWebsiteStatus"
  );

  res.status(200).json(webistes);
};

module.exports.getWebsiteDetails = async (req, res) => {
  const { userId } = req.auth();
  const user = await User.findOne({ clerk_id: userId });

  const website = await Website.findById(req.params.id).populate(
    "lastWebsiteStatus"
  );

  if (!website.user.equals(user._id)) {
    throw new ExpressError(404, "You have no access to this website");
  }

  res.status(200).json(website);
};

module.exports.editWebsiteName = async (req, res) => {
  const { userId } = req.auth();
  const user = await User.findOne({ clerk_id: userId });
  let website = await Website.findById(req.params.id);

  if (!website.user.equals(user._id)) {
    throw new ExpressError(404, "You have no access to this website");
  }

  website.name = req.body.name;

  await website.save();

  website = await Website.findById(req.params.id);

  res.status(200).json(website);
};

module.exports.editWebsiteStatus = async (req, res) => {
  const { userId } = req.auth();
  const user = await User.findOne({ clerk_id: userId });
  let website = await Website.findById(req.params.id);

  if (!website.user.equals(user._id)) {
    throw new ExpressError(404, "You have no access to this website");
  }

  website.status = req.body.status;
  if (req.body.status === "Enable") {
    website.alerts = 0;
  }

  await website.save();

  website = await Website.findById(req.params.id);

  res.status(200).json(website);
};

module.exports.updateAlertEmails = async (req, res) => {
  const { userId } = req.auth();
  const user = await User.findOne({ clerk_id: userId });
  let website = await Website.findById(req.params.id);

  if (!website.user.equals(user._id)) {
    throw new ExpressError(404, "You have no access to this website");
  }

  website.alertEmails = req.body.alertEmails;

  await website.save();

  website = await Website.findById(req.params.id);

  res.status(200).json(website);
};

module.exports.deleteWebsite = async (req, res) => {
  const { userId } = req.auth();
  const user = await User.findOne({ clerk_id: userId });
  let website = await Website.findById(req.params.id);

  if (!website.user.equals(user._id)) {
    throw new ExpressError(404, "You have no access to this website");
  }

  await Website.findOneAndDelete({ _id: website._id });

  res.status(200).json({ message: "Deleted Successfully" });
};
