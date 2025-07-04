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
const { Server } = require("socket.io");
const http = require("http")
const socketStore = require("./utils/socketStore");
const User = require("./modals/user");
const path = require("path");


const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*", methods:["GET","POST","PATCH","DELETE"] },
});

app.use(express.static(path.join(__dirname, "/dist")));

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
  await mongoose.connect(process.env.MONGO_ATLAS_URL);
}



corn.schedule("*/5 * * * *", async () => {
  const websites = await Website.find().populate("user");
  websites.forEach(async (site) => {
    if (site.status === "Enable") {
      const socket = socketStore.getSocketOfUser(site.user._id.toString());
      const websiteStatus = await checkWebsiteStatus(site.url);
      if (websiteStatus.status === "down") {
        await sendEmails([...site.alertEmails, site.user.email], site, websiteStatus);
        if (site.alerts < 2) {
          await Website.findByIdAndUpdate(site._id, {
            alerts: site.alerts + 1,
          });
        } else {
          await Website.findByIdAndUpdate(site._id, {
            alerts: site.alerts + 1,
            status: "Disable",
          });
        }
      }

      const status = new Status({
        website: site._id,
        websiteStatus: websiteStatus.status,
        responseTime: websiteStatus.responseTime,
        statusCode: websiteStatus.statusCode,
        createdAt: Date.now(),
        errorMessage: websiteStatus?.response,
      });


      const savedSatatus = await status.save();
      if (savedSatatus.websiteStatus === "down") {
        await Website.findByIdAndUpdate(site._id, {
          lastWebsiteStatus: savedSatatus._id,
        });
      } else {
        await Website.findByIdAndUpdate(site._id, {
          lastWebsiteStatus: savedSatatus._id,
          alerts: 0
        });
      }

      if (socket) {
        const website = await Website.findById(site._id).populate(
          "lastWebsiteStatus"
        );
        io.to(socket).emit("websiteUpdate", website);
        io.to(socket).emit("newStatus", savedSatatus);
      }

    
    }
  });
});


io.on("connection", (socket) => {
  const createConnection = async () => {
    const clerkId = socket.handshake.auth.userId;
    const user = await User.findOne({ clerk_id: clerkId });
    if (user) {
      socketStore.addUser(socket.id, user._id.toString());
    }
  }
  
  createConnection();

  socket.on("disconnect", () => {
    socketStore.removeUser(socket.id);
  })
})


app.use((req, res, next) => {
  req.io = io;
  req.socketStore = socketStore;
  next();
});

app.use("/api/user", userRouter);
app.use("/api/website", websiteRouter);
app.use("/api/visit", visitRouter);
app.use("/api/cdn", cdnRouter);
app.use("/api/status", statusRouter);

//client rendering
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "/dist/index.html"));
});



app.use((err, req, res, next) => {
  let { status = 500, message = "Internal ServerError" } = err;
  res.status(status).json({ message: message });
});

httpServer.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}`);
});
