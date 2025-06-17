const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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

const Website = mongoose.model("Website", websiteSchema);


module.exports = Website;