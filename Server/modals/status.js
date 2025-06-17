const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const statusSchema = new Schema({
  website: {
    type: Schema.Types.ObjectId,
    ref: "Website",
  },
  websiteStatus: {
    type: String,
    enum: ["up", "down"],
  },
  statusCode: {
    type: Number,
    required: true,
  },
  responseTime: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Status = mongoose.model("Status", statusSchema);

module.exports = Status;
