const express = require("express");
const { userWebhook } = require("../controllers/user");
const WrapAsync = require("../utils/WrapAsync");
const router = express.Router();

router.post("/", WrapAsync(userWebhook));

module.exports = router;