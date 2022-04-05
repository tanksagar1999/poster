const router = require("express").Router();
const controller = require("./localStorage.controller");
const { guard } = require("../../helper");

/*
 *  Get Top Product Category
 */
router.get(
  "/setup/:id",
  guard.isAuthorized(["admin", "restaurant"]),
  controller.getSetupData
);

module.exports = router;
