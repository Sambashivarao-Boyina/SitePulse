const express = require("express");
const router = express.Router();
const { requireAuth } = require("@clerk/express");
const WrapAsync = require("../utils/WrapAsync");
const { getAllStatusOfWebsite, deteleStatuses } = require("../controllers/status");



router.get("/:id", requireAuth(), WrapAsync(getAllStatusOfWebsite));
router.delete("/:id", requireAuth(), WrapAsync(deteleStatuses));


module.exports = router;