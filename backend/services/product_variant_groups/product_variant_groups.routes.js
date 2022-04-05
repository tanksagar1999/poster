const router = require("express").Router();
const controller = require("./product_variant_groups.controller");
const { guard } = require('../../helper');
const multerSetting = require("../../helper/multer").importCsvUpload;


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
 *  Delete Multiple
 */
router.post(
    "/deleteAll",
    guard.isAuthorized(['admin','restaurant']),
    controller.deleteAll
);
/*
 *  Get Product variant
 */
router.get(
    "/:id",
    guard.isAuthorized(['admin','restaurant']),
    controller.getProductVariantGroups
);

/*
 *  Export
 */
router.post(
    "/export",
    guard.isAuthorized(['admin','restaurant']),
    controller.export
);

/*
 *  Import preview
 */
router.post(
    "/import/preview",
    multerSetting,
    guard.isAuthorized(['admin','restaurant']),
    controller.preview
);
/*
 *  Import  csv data
 */
router.post(
    "/import",
    guard.isAuthorized(['admin','restaurant']),
    controller.import
);

module.exports = router;