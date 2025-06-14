const express = require("express");
const WrapAsync = require("../utils/WrapAsync");
const router = express.Router();
const { requireAuth } = require("@clerk/express");
const { addWebsite, getAllWebsiteOfUser, getWebsiteDetails, editWebsiteName } = require("../controllers/website");


router.get("/:id", requireAuth(), WrapAsync(getWebsiteDetails));
router.get("/", requireAuth(), WrapAsync(getAllWebsiteOfUser));
router.post("/", requireAuth(), WrapAsync(addWebsite));
router.patch("/:id/editName", requireAuth(), WrapAsync(editWebsiteName));


module.exports = router;