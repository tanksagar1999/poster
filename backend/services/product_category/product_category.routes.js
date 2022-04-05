const router = require("express").Router();
const controller = require("./product_category.controller");
const { guard } = require('../../helper');


/*
 *  Add Service
 */
router.post(
    "/",
    guard.isAuthorized(['admin','restaurant']),
    controller.add
);

/*
 *  List Product Category
 */
router.get(
    "/",
    guard.isAuthorized(['admin','restaurant']),
    controller.list
);

/*
 *  Update Product Category
 */
router.put(
    "/:id",
    guard.isAuthorized(['admin','restaurant']),
    controller.update
);

/*
 *  Delete Product Category
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
 *  Get Product Category
 */
router.get(
    "/:id",
    guard.isAuthorized(['admin','restaurant']),
    controller.getProductCategory
);


module.exports = router;