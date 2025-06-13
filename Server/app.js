const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const { default: mongoose } = require("mongoose");

dotenv.config();

app.use(cors());
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

const userRouter = require("./routes/user");
const websiteRouter = require("./routes/website");

app.use("/api/user", userRouter);
app.use("/api/website", websiteRouter);

app.use((err, req, res, next) => {
  let { status = 500, message = "Internal ServerError" } = err;
  res.status(status).json({ message: message });
});

app.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}`);
});
