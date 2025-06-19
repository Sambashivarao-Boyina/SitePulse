const express = require("express");
const WrapAsync = require("../utils/WrapAsync");
const {
  visitWebsite,
  closeTheVisitedWebsite,
  addRoutesToVisit,
  getAllVisitsOfWebsite,
  sendDataForExtrenalSite,
} = require("../controllers/visit");
const router = express.Router();
const { requireAuth } = require("@clerk/express");

router.post("/:id/close/:visitId", WrapAsync(closeTheVisitedWebsite));
router.post("/:id", WrapAsync(visitWebsite));
router.patch("/:id/:visitId/route", WrapAsync(addRoutesToVisit));
router.get("/:id", requireAuth(), WrapAsync(getAllVisitsOfWebsite));
router.get("/extrnalsnippet/:id", WrapAsync(sendDataForExtrenalSite));

module.exports = router;
