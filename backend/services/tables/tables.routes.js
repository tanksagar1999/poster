const router = require("express").Router();
const controller = require("./tables.controller");
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
    guard.isAuthorized(['admin','restaurant']),
    controller.list
);

/*
 *  Update  
 */
router.put(
    "/:id",
    guard.isAuthorized(['admin','restaurant']),
    controller.update
);

/*
 *  Swaper  
 */
router.put(
    "/swap/:id",
    guard.isAuthorized(['admin','restaurant']),
    controller.swapeTable
);

/*
 *  Split  
 */
router.put(
    "/split/:id",
    guard.isAuthorized(['admin','restaurant']),
    controller.splitTable
);

/*
 *  Update  
 */
router.delete(
    "/:id",
    guard.isAuthorized(['admin','restaurant']),
    controller.delete
);

/*
 *  Get  
 */
router.get(
    "/:id",
    guard.isAuthorized(['admin','restaurant']),
    controller.getTables
);


module.exports = router;