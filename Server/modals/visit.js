const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const visitSchema = new Schema({
  website: {
    type: Schema.Types.ObjectId,
    ref: "Website",
  },
  visitedTime: {
    type: Date,
    default: Date.now,
  },
  closedTime: {
    type: Date,
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
      type: [Number, Number], // [longitude, latitude]
      required: true,
    },
  },
  routes: [
    {
      type: String,
    },
  ],
});
visitSchema.index({ visitedTime: 1 }, { expireAfterSeconds: 7776000 });
visitSchema.virtual("isActive").get(function () {
  if (!this.closedTime) return true;

  // Check if closedTime is within 1 minute of current time
  const timeDiff = Math.abs(new Date() - this.closedTime);
  const oneMinute = 60 * 1000; 

  return timeDiff <= oneMinute;
});

// Make sure virtual fields are included in JSON output
visitSchema.set("toJSON", { virtuals: true });
visitSchema.set("toObject", { virtuals: true });

const Visit = mongoose.model("Visit", visitSchema);

module.exports = Visit;
