const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const corn = require("node-cron");
const Status = require("./modals/status");
const Website = require("./modals/website");
const { checkWebsiteStatus } = require("./controllers/status");

const userRouter = require("./routes/user");
const websiteRouter = require("./routes/website");
const visitRouter = require("./routes/visit");
const cdnRouter = require("./routes/cdn");
const statusRouter = require("./routes/status");
const sendEmails = require("./utils/sendEmail");


dotenv.config();
app.use(
  cors({
    origin: "*"
  })
);
app.use(express.json());

const PORT = process.env.PORT || 8080;

main()
  .then(() => {
    console.log("connected to Database");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_DB_URL);
}

corn.schedule("*/5 * * * *", async () => {
  const websites = await Website.find();

  websites.forEach(async (site) => {
    if (site.status === "Enable") {
      const websiteStatus = await checkWebsiteStatus(site.url);
      console.log(websiteStatus);
      if (websiteStatus.status === "down") {
        await sendEmails(["boyinasambashivarao@gmail.com"], site, websiteStatus);
      }

      const status = new Status({
        website: site._id,
        websiteStatus: websiteStatus.status,
        responseTime: websiteStatus.responseTime,
        statusCode: websiteStatus.statusCode,
        createdAt: Date.now()
      });

      const savedSatatus = await status.save();
      await Website.findByIdAndUpdate(site._id, {
        lastWebsiteStatus: savedSatatus._id,
      });
    }
  });
});



app.use("/api/user", userRouter);
app.use("/api/website", websiteRouter);
app.use("/api/visit", visitRouter);
app.use("/api/cdn", cdnRouter);
app.use("/api/status", statusRouter);


app.use((err, req, res, next) => {
  let { status = 500, message = "Internal ServerError" } = err;
  res.status(status).json({ message: message });
});

app.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}`);
});
