const router = require("express").Router();
const controller = require("./product_price_books.controller");
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
 *  Manage   
 */
router.put(
    "/manage/:id",
    guard.isAuthorized(['admin','restaurant']),
    controller.update
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
 *  Delete Multiple
 */
router.post(
    "/deleteAll",
    guard.isAuthorized(['admin','restaurant']),
    controller.deleteAll
);
/*
 *  Get  
 */
router.get(
    "/:id",
    guard.isAuthorized(['admin','restaurant']),
    controller.get
);

/*
 *  Export
 */
router.post(
    "/export",
    guard.isAuthorized(['admin','restaurant']),
    controller.export
);

module.exports = router;