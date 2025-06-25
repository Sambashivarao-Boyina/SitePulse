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
    alerts: {
        type: Number,
        default:0
    },
    alertEmails: [
        {
            type:String
        }
    ],
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


async function handleDelete(next) {
  const filter = this.getFilter();
  const docToDelete = await this.model.findOne(filter);

  if (docToDelete) {
    await Visit.deleteMany({ Website: docToDelete._id });
    await Status.deleteMany({ website: docToDelete._id });

    if (docToDelete.lastWebsiteStatus) {
      await mongoose
        .model("Status")
        .deleteOne({ _id: docToDelete.lastWebsiteStatus });
    }
  }

  next();
}
  
websiteSchema.pre("findOneAndDelete", handleDelete);
websiteSchema.pre("findOneAndRemove", handleDelete);
websiteSchema.pre("deleteOne", { document: false, query: true }, handleDelete);
websiteSchema.pre("deleteMany", { document: false, query: true }, handleDelete);


const Website = mongoose.model("Website", websiteSchema);


module.exports = Website;