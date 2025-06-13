const express = require("express");
const WrapAsync = require("../utils/WrapAsync");
const router = express.Router();
const { requireAuth } = require("@clerk/express");
const { addWebsite, getAllWebsiteOfUser } = require("../controllers/website");


router.get("/", requireAuth(), WrapAsync(getAllWebsiteOfUser));
router.post("/", requireAuth(), WrapAsync(addWebsite));


module.exports = router;