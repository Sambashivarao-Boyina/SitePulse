const express = require("express");
const app = express();
const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT || 8080; 

app.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}`);
});
