const router = require("express").Router();
const controller = require("./preferences.controller");
const { guard } = require('../../helper');

/*
 *  Add Preferences
 */
router.post(
    "/",
    guard.isAuthorized(['admin']),
    controller.add
);

/*
 *  List Preferences
 */
router.get(
    "/",
    guard.isAuthorized(['admin']),
    controller.list
);

/*
 *  Update Preferences
 */
router.put(
    "/:id",
    guard.isAuthorized(['admin']),
    controller.update
);

/*
 *  Delete Preferences
 */
router.delete(
    "/:id",
    guard.isAuthorized(['admin']),
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
 *  Get Preferences
 */
router.get(
    "/:id",
    guard.isAuthorized(['admin']),
    controller.get
);

module.exports = router;