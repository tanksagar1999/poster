const router = require("express").Router();
const controller = require("./dashboard.controller");
const { guard } = require("../../helper");

/*
 *  Add
 */
// router.post(
//     "/",
//     guard.isAuthorized(['admin']),
//     controller.add
// );

/*
 *  List
 */
router.get("/", guard.isAuthorized(["admin", "restaurant"]), controller.list);

router.get(
	"/user",
	guard.isAuthorized(["admin", "restaurant"]),
	controller.userList
);

router.get(
	"/viewSummary",
	guard.isAuthorized(["admin", "restaurant"]),
	controller.viewSummary
);

module.exports = router;
