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
        user: user._id
    })

    await newWebsite.save();

    res.status(200).json({ message: "Website Created Successfully" });
}

module.exports.getAllWebsiteOfUser = async (req, res) => {
    const { userId } = req.auth();

    const user = await User.findOne({ clerk_id: userId });
    const webistes = await Website.find({ user: user._id });

    res.status(200).json(webistes);
}