const router = require("express").Router();
const controller = require("./product_variants.controller");
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
 *  Import proview
 */
router.post(
    "/import/preview",
    multerSetting,
    guard.isAuthorized(['admin','restaurant']),
    controller.preview
);

/*
 *  Import Product variant
 */
router.post(
    "/import",
    guard.isAuthorized(['admin','restaurant']),
    controller.import
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
 *  List Product variant
 */
router.get(
    "/bypricebook/:pbookid",
    guard.isAuthorized(['admin','restaurant']),
    controller.bypricebook
);


/*
 *  Export bypricebook Product variant
 */
router.post(
    "/bypricebookexport/:pbookid",
    guard.isAuthorized(['admin','restaurant']),
    controller.bypricebookexport
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
    controller.getProductVariants
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