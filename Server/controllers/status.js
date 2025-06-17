const { default: axios } = require("axios");
const User = require("../modals/user");
const Website = require("../modals/website");
const ExpressError = require("../utils/ExpressError");
const Status = require("../modals/status");

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