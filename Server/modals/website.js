const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Visit = require("./visit");
const Status = require("./status");

const websiteSchema = new Schema({
    url: {
        type: String,
        required:true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref:"User"
    },
    name: {
        type: String,
        required:true
    },
    logo: {
        type: String,
        required:true
    },
    enableAlerts: {
        type: Boolean,
        default:true,
        required:true
    },
    status: {
        type: String,
        enum: ["Enable", "Disable"],
        default:"Enable"
    },
    lastWebsiteStatus: {
        type: Schema.Types.ObjectId,
        ref: "Status",
        default:null
    }
})

websiteSchema.pre("findOneAndDelete", async function (next) {
  const docToDelete = await this.model.findOne(this.getFilter());

  if (docToDelete) {
    console.log("About to delete website:", docToDelete._id);
      await Visit.deleteMany({ Website: docToDelete._id });
      await Status.deleteMany({ website: docToDelete._id });
    await mongoose
      .model("Status")
      .deleteOne({ _id: docToDelete.lastWebsiteStatus });
  }

  next();
});

const Website = mongoose.model("Website", websiteSchema);


module.exports = Website;