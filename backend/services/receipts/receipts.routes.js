const router = require("express").Router();
const controller = require("./receipts.controller");
const { guard } = require("../../helper");

/*
 *  List
 */
router.get("/", guard.isAuthorized(["admin", "restaurant"]), controller.list);

/*
 *  Update
 */
router.put(
	"/:id",
	guard.isAuthorized(["admin", "restaurant"]),
	controller.update
);

/*
 *  Delete
 */
router.delete(
	"/:id",
	guard.isAuthorized(["admin", "restaurant"]),
	controller.delete
);

/*
 *  Get
 */
router.get(
	"/:id",
	guard.isAuthorized(["admin", "restaurant"]),
	controller.getReceipts
);

/*
 *  GetLastReceiptById
 */
router.get(
	"/getLastReceipt/:id",
	guard.isAuthorized(["admin", "restaurant"]),
	controller.getLastReceiptsByRegister
);

/*
 *  Export
 */
router.post(
	"/export",
	guard.isAuthorized(["admin", "restaurant"]),
	controller.export
);

module.exports = router;
