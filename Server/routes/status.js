const express = require("express");
const router = express.Router();
const { requireAuth } = require("@clerk/express");
const WrapAsync = require("../utils/WrapAsync");
const { getAllStatusOfWebsite } = require("../controllers/status");



router.get("/:id", requireAuth(), WrapAsync(getAllStatusOfWebsite));


module.exports = router;