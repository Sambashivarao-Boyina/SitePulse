const { default: axios } = require("axios");
const User = require("../modals/user");
const Website = require("../modals/website");
const ExpressError = require("../utils/ExpressError");
const Status = require("../modals/status");
const sendEmails = require("../utils/sendEmail");
const { response } = require("express");

module.exports.checkWebsiteStatus = async(url) => {
    try {
      const start = Date.now();
      const response = await axios.get(url);
      const duration = Date.now() - start;
      return {
        status: "up",
        statusCode: response.status,
        responseTime: duration,
      };
    } catch (err) {
      return {
        status: "down",
        statusCode: err.response?.status || 0,
        responseTime: 0,
        response: err.response.data
      };
    }
}

module.exports.getAllStatusOfWebsite = async (req, res) => {
  const { userId } = req.auth();

  const user = await User.findOne({ clerk_id: userId });
  const website = await Website.findById(req.params.id);

 

  if (!website) {
    throw new ExpressError(404, "Website not found");
  }

  if (!website.user.equals(user._id)) {
    throw new ExpressError(400, "You have no access to this website");
  }

  const statuses = await Status.find({website: website._id});

  res.status(200).json(statuses);
}

module.exports.deteleStatuses = async (req, res) => {
  const website = await Website.findById(req.params.id);

  const { userId } = req.auth();

  const user = await User.findOne({ clerk_id: userId });
  if (!website) {
    throw new ExpressError("website not found");
  }

  if (!website.user.equals(user._id)) {
    throw new ExpressError(404, "You have no access to this website");
  }

  
  await Status.deleteMany({ _id: { $in: req.body.ids } });

  const statuses = await Status.find({ website: website._id });

  res.status(200).json(statuses);
}