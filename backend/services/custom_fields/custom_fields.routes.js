const router = require("express").Router();
const controller = require("./custom_fields.controller");
const { guard } = require('../../helper');

/*
 *  Add Custom Fields
 */
router.post(
    "/",
    guard.isAuthorized(['admin','restaurant']),
    controller.add
);

/*
 *  List Custom Fields
 */
router.get(
    "/",
    guard.isAuthorized(['admin','restaurant']),
    controller.list
);

/*
 *  Update Custom Fields
 */
router.put(
    "/:id",
    guard.isAuthorized(['admin','restaurant']),
    controller.update
);

/*
 *  Update Custom Fields
 */
router.delete(
    "/:id",
    guard.isAuthorized(['admin','restaurant']),
    controller.delete
);

/*
 *  Delete Multiple
 */
router.post(
    "/deleteAll",
    guard.isAuthorized(['admin','restaurant']),
    controller.deleteAll
);

/*
 *  Get Custom Fields
 */
router.get(
    "/:id",
    guard.isAuthorized(['admin','restaurant']),
    controller.get
);


module.exports = router;