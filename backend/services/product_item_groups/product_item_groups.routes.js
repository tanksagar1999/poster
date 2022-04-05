const router = require("express").Router();
const controller = require("./product_item_groups.controller");
const { guard } = require('../../helper');


/*
 *  Add Product variant
 */
router.post(
    "/",
    guard.isAuthorized(['admin','restaurant']),
    controller.add
);

/*
 *  List Product variant
 */
router.get(
    "/",
    guard.isAuthorized(['admin','restaurant']),
    controller.list
);

/*
 *  Update Product variant
 */
router.put(
    "/:id",
    guard.isAuthorized(['admin','restaurant']),
    controller.update
);

/*
 *  Update Product variant
 */
router.delete(
    "/:id",
    guard.isAuthorized(['admin','restaurant']),
    controller.delete
);

/*
 *  Get Product variant
 */
router.get(
    "/:id",
    guard.isAuthorized(['admin','restaurant']),
    controller.getProductItemGroups
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
 *  Export
 */
router.post(
    "/export",
    guard.isAuthorized(['admin','restaurant']),
    controller.export
);

module.exports = router;