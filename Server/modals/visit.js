const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const visitSchema = new Schema({
  website: {
    type: Schema.Types.ObjectId,
    ref: "Website",
  },
  visitedTime: {
    type: Date,
    default: Date.now(),
  },
  deviceType: {
    type: String,
    enum: ["Desktop", "Mobile", "Tablet"],
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  routes: [
    {
      type: String,
    },
  ],
});

const Visit = mongoose.model("Visit", visitSchema);

module.exports = Visit;
