const router = require("express").Router();
const controller = require("./products.controller");
const { guard } = require('../../helper');
const multerSetting = require("../../helper/multer").importCsvUpload;


/*
 *  Add  
 */
router.post(
    "/",
    guard.isAuthorized(['admin', 'restaurant']),
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
 *  List by pricebook
 */
router.get(
    "/bypricebook/:pbookid",
    guard.isAuthorized(['admin', 'restaurant']),
    controller.bypricebook
);
/*
 *  Export product by pricebook
 */
router.post(
    "/bypricebookexport/:pbookid",
    guard.isAuthorized(['admin', 'restaurant']),
    controller.bypricebookexport
);

/*
 *  Import preview bypricebook 
 */
router.post(
    "/bypricebookexport/import/preview/:pbookid",
    multerSetting,
    guard.isAuthorized(['admin', 'restaurant']),
    controller.bypricebookimportpreview
);

// Import data  bypricebook 
router.post(
    "/bypricebookexport/import/:pbookid",
    guard.isAuthorized(['admin', 'restaurant']),
    controller.bypricebookimport
);

/*
 *  List  
 */
router.post(
    "/list",
    guard.isAuthorized(['admin', 'restaurant']),
    controller.listwithfilter
);

/*
 *  List  
 */
// router.get(
//     "/getCombo",
//     guard.isAuthorized(['admin','restaurant']),
//     controller.getCombo
// );
/*
 *  Update  
 */
router.put(
    "/:id",
    guard.isAuthorized(['admin', 'restaurant']),
    controller.update
);

/*
 *  Update  
 */
router.delete(
    "/:id",
    guard.isAuthorized(['admin', 'restaurant']),
    controller.delete
);
/*
 *  Delete Multiple
 */
router.post(
    "/deleteAll",
    guard.isAuthorized(['admin', 'restaurant']),
    controller.deleteAll
);

/*
 *  Get  
 */
router.get(
    "/:id",
    guard.isAuthorized(['admin', 'restaurant']),
    controller.getProducts
);

/*
 *  Export
 */
router.post(
    "/export",
    guard.isAuthorized(['admin', 'restaurant']),
    controller.export
);

/*
 *  Import preview
 */
router.post(
    "/import/preview",
    multerSetting,
    guard.isAuthorized(['admin', 'restaurant']),
    controller.preview
);
/*
 *  Import  csv data
 */
router.post(
    "/import",
    guard.isAuthorized(['admin', 'restaurant']),
    controller.import
);
module.exports = router;