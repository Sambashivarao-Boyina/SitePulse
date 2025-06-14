const express = require("express");
const WrapAsync = require("../utils/WrapAsync");
const { visitWebsite, closeTheVisitedWebsite, addRoutesToVisit } = require("../controllers/visit");
const router = express.Router();


router.post("/:id/close/:visitId", WrapAsync(closeTheVisitedWebsite));
router.post("/:id", WrapAsync(visitWebsite));
router.patch("/:id/:visitId/route", WrapAsync(addRoutesToVisit));



module.exports = router;
