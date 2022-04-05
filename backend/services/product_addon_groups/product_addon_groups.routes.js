const router = require("express").Router();
const controller = require("./product_addon_groups.controller");
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
 *  List product addons
 */
router.get(
    "/",
    guard.isAuthorized(['admin','restaurant']),
    controller.list
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
 *  Update product addons
 */
router.delete(
    "/:id",
    guard.isAuthorized(['admin','restaurant']),
    controller.delete
);

/*
 *  Get product addons
 */
router.get(
    "/:id",
    guard.isAuthorized(['admin','restaurant']),
    controller.getProductAddonGroups
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