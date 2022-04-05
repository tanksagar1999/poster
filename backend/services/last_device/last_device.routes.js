const router = require("express").Router();
const controller = require("./last_device.controller");
const { guard } = require("../../helper");

/*
 *  List
 */
router.post("/", guard.isAuthorized(["admin", "restaurant"]), controller.add);

router.get("/:id", guard.isAuthorized(["admin", "restaurant"]), controller.get);

module.exports = router;
