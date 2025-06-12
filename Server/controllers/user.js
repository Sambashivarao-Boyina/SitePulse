const User = require("../modals/user");

module.exports.userWebhook = async (req, res) => {
    const type = req.body.type;

    if (type === "user.created") {
      const newUser = new User({
        email: req.body.data.email_addresses[0].email_address,
        username: req.body.data.username,
        first_name: req.body.data.first_name,
        last_name: req.body.data.last_name,
        clerk_id: req.body.data.id,
        user_profile: req.body.data.profile_image_url,
      });

      await newUser.save();
      return res.status(201).send("User created");
    } else if (type === "user.updated") {
      const user_id = req.body.data.id;
      const user = await User.findOne({ clerk_id: user_id });

      if (!user) {
        return res.status(404).send("User not found");
      }

      user.username = req.body.data.username;
      user.first_name = req.body.data.first_name;
      user.last_name = req.body.data.last_name;
      user.user_profile = req.body.data.profile_image_url;

      await user.save();
      return res.status(200).send("User updated");
    } else if (type === "user.deleted") {
      const user_id = req.body.data.id;
      await User.deleteOne({ clerk_id: user_id });
      return res.status(200).send("User deleted");
    } else {
      console.warn("⚠️ Unhandled event type:", type);
      return res.status(400).send("Unhandled event type");
    }
};

