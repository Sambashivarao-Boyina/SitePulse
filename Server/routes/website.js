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
  updateAlertEmails,
  deleteWebsite,
} = require("../controllers/website");

router.get("/:id", requireAuth(), WrapAsync(getWebsiteDetails));
router.get("/", requireAuth(), WrapAsync(getAllWebsiteOfUser));
router.post("/", requireAuth(), WrapAsync(addWebsite));
router.patch("/:id/editName", requireAuth(), WrapAsync(editWebsiteName));
router.patch("/:id/status", requireAuth(), WrapAsync(editWebsiteStatus));
router.patch("/:id/alertEmails", requireAuth(), WrapAsync(updateAlertEmails));
router.delete("/:id", requireAuth(), WrapAsync(deleteWebsite));

module.exports = router;
