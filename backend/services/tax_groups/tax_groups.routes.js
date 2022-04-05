const router = require("express").Router();
const controller = require("./tax_groups.controller");
const { guard } = require('../../helper');


/*
 *  Add tax groups
 */
router.post(
    "/",
    guard.isAuthorized(['admin','restaurant']),
    controller.add
);

/*
 *  List tax groups
 */
router.get(
    "/",
    guard.isAuthorized(['admin','restaurant']),
    controller.list
);

/*
 *  Update tax groups
 */
router.put(
    "/:id",
    guard.isAuthorized(['admin','restaurant']),
    controller.update
);

/*
 *  Delete tax groups
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
 *  Get tax groups
 */
router.get(
    "/:id",
    guard.isAuthorized(['admin','restaurant']),
    controller.getTaxGroups
);


module.exports = router;