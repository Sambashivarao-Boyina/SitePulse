const express = require("express");
const WrapAsync = require("../utils/WrapAsync");
const { createCDNofWebsite } = require("../controllers/cdn");
const router = express.Router();

router.get("/:id", WrapAsync(createCDNofWebsite));


module.exports = router;