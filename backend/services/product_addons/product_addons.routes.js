const router = require("express").Router();
const controller = require("./product_addons.controller");
const { guard } = require('../../helper');
const multerSetting = require("../../helper/multer").importCsvUpload;


/*
 *  Add product addons
 */
router.post(
    "/",
    guard.isAuthorized(['admin','restaurant']),
    controller.add
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
 *  Import product addons
 */
router.post(
    "/import",
    guard.isAuthorized(['admin','restaurant']),
    controller.import
);


/*
 *  Export product addons
 */
router.post(
    "/export",
    guard.isAuthorized(['admin','restaurant']),
    controller.export
);
/*
 *  List product addons
 */
router.get(
    "/",
    guard.isAuthorized(['admin','restaurant']),
    controller.list
);

/*
 *  List bby pricebookk
 */
router.get(
    "/bypricebook/:pbookid",
    guard.isAuthorized(['admin','restaurant']),
    controller.bypricebook
);

/*
 *  Export by pricebookk
 */
router.post(
    "/bypricebookexport/:pbookid",
    guard.isAuthorized(['admin','restaurant']),
    controller.bypricebookexport
);


/*
 *  Import preview bypricebook 
 */
router.post(
    "/bypricebookexport/import/preview/:pbookid",
    multerSetting,
    guard.isAuthorized(['admin','restaurant']),
    controller.bypricebookimportpreview
);

// Import data  bypricebook 
router.post(
    "/bypricebookexport/import/:pbookid",
    guard.isAuthorized(['admin','restaurant']),
    controller.bypricebookimport
);

/*
 *  Update product addons
 */
router.put(
    "/:id",
    guard.isAuthorized(['admin','restaurant']),
    controller.update
);

/*
 *  Delete product addons
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
 *  Get product addons
 */
router.get(
    "/:id",
    guard.isAuthorized(['admin','restaurant']),
    controller.getProductAddons
);


module.exports = router;