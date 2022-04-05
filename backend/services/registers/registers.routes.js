const router = require("express").Router();
const controller = require("./registers.controller");
const { guard } = require('../../helper');


/*
 *  Add Register
 */
router.post(
    "/",
    guard.isAuthorized(['admin','restaurant']),
    controller.add
);

/*
 *  Switch Register
 */
router.post(
    "/switch",
    guard.isAuthorized(['admin','restaurant']),
    controller.switch
);

/*
 *  List Register
 */
router.get(
    "/",
    guard.isAuthorized(['admin','restaurant']),
    controller.list
);

/*
 *  Update Register
 */
router.put(
    "/:id",
    guard.isAuthorized(['admin','restaurant']),
    controller.update
);

/*
 *  Update Register
 */
router.delete(
    "/:id",
    guard.isAuthorized(['admin','restaurant']),
    controller.delete
);

/*
 *  Get Register
 */
router.get(
    "/:id",
    guard.isAuthorized(['admin','restaurant']),
    controller.getRegisters
);

/*
 *  Delete Multiple
 */
router.post(
    "/deleteAll",
    guard.isAuthorized(['admin','restaurant']),
    controller.deleteAll
);


module.exports = router;