const router = require("express").Router();
const controller = require("./shops.controller");
const { guard } = require('../../helper');
const multerSetting = require("../../helper/multer").shopImageUpload;

/*
 *  Add  
 */
router.post(
    "/",
    multerSetting,
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
    multerSetting,
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
    controller.getShops
);


module.exports = router;