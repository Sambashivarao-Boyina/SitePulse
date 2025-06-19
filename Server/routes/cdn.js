const express = require("express");
const WrapAsync = require("../utils/WrapAsync");
const { createCDNofWebsite, createUiSnippetOfMetrics } = require("../controllers/cdn");
const router = express.Router();

router.get("/:id", WrapAsync(createCDNofWebsite));
router.get("/metrics/:id", WrapAsync(createUiSnippetOfMetrics));


module.exports = router;