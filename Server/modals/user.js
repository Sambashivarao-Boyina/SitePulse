const mongoose = require("mongoose");
const Website = require("./website");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  clerk_id: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: String,
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  user_profile: {
    type: String,
    required: true,
  },
});

userSchema.pre("findOneAndDelete", async function (next) {
  const docToDelete = await this.model.findOne(this.getFilter());

  if (docToDelete) {
    await Website.deleteMany({ user: docToDelete._id });
    await mongoose
      .model("Status")
      .deleteOne({ _id: docToDelete.lastWebsiteStatus });
  }

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
