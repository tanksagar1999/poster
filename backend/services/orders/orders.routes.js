const router = require("express").Router();
const controller = require("./orders.controller");
const { guard } = require('../../helper');


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
    controller.getOrders
);

/*
 *  Export sales-report
 */
router.post(
    "/sales-report",
    guard.isAuthorized(['admin','restaurant']),
    controller.salesReport
);

/*
 *  Export sales-report
 */
router.post(
    "/order-ticket-report",
    guard.isAuthorized(['admin','restaurant']),
    controller.orderTicketsReport
);

/*
 *  Productwise report 
 */
router.post(
    "/productwise-report",
    guard.isAuthorized(['admin','restaurant']),
    controller.productWiseReport
);

/*
 *  daily sales and payments 
 */
router.post(
    "/dailysales-report",
    guard.isAuthorized(['admin','restaurant']),
    controller.dailySalesReport
);
module.exports = router;