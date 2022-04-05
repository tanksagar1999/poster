const router = require("express").Router();
const controller = require("./shifts.controller");
const { guard } = require('../../helper');


/*
 *  Add  
 */
router.post(
    "/",
    guard.isAuthorized(['admin','restaurant']),
    controller.add
);

/*
 *  List  
 */
router.get(
    "/",
    guard.isAuthorized(['admin']),
    controller.list
);

router.get(
    "/:id",
    guard.isAuthorized(['admin', 'restaurant']),
    controller.sigleList
)
 
module.exports = router;