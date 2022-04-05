const router = require("express").Router();
const controller = require("./additional_charges.controller");
const { guard } = require('../../helper');

/*
 *  Add Additional charges
 */
router.post(
    "/",
    guard.isAuthorized(['admin','restaurant']),
    controller.add
);

/*
 *  List Additional charges
 */
router.get(
    "/",
    guard.isAuthorized(['admin','restaurant']),
    controller.list
);

/*
 *  Update Additional charges
 */
router.put(
    "/:id",
    guard.isAuthorized(['admin','restaurant']),
    controller.update
);

/*
 *  Delete Additional charges
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
 *  Get Additional charges
 */
router.get(
    "/:id",
    guard.isAuthorized(['admin','restaurant']),
    controller.get
);


module.exports = router;