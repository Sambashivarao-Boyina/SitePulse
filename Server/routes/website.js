const express = require("express");
const WrapAsync = require("../utils/WrapAsync");
const router = express.Router();
const { requireAuth } = require("@clerk/express");
const {
  addWebsite,
  getAllWebsiteOfUser,
  getWebsiteDetails,
  editWebsiteName,
  editWebsiteStatus,
  toggleWebsiteAlerts,
} = require("../controllers/website");

router.get("/:id", requireAuth(), WrapAsync(getWebsiteDetails));
router.get("/", requireAuth(), WrapAsync(getAllWebsiteOfUser));
router.post("/", requireAuth(), WrapAsync(addWebsite));
router.patch("/:id/editName", requireAuth(), WrapAsync(editWebsiteName));
router.patch("/:id/status", requireAuth(), WrapAsync(editWebsiteStatus));
router.patch(
  "/:id/enableAlerts",
  requireAuth(),
  WrapAsync(toggleWebsiteAlerts)
);

module.exports = router;
