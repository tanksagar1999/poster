const router = require("express").Router();
const controller = require("./customers.controller");
const { guard } = require('../../helper');

const multerSetting = require("../../helper/multer").importCsvUpload;

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
 *  Delete  
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
    controller.getCustomers
);

/*
 *  Export
 */
router.post(
    "/export",
    guard.isAuthorized(['admin','restaurant']),
    controller.export
);

router.post(
    "/import/preview",
    multerSetting,
    guard.isAuthorized(['admin','restaurant']),
    controller.preview
);

router.post(
    "/import",
    guard.isAuthorized(['admin','restaurant']),
    controller.import
);

module.exports = router;