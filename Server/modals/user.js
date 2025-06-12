const mongoose = require("mongoose");
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

const User = mongoose.model("User", userSchema);

module.exports = User;
