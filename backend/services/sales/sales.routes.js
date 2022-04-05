const router = require("express").Router();
const controller = require("./sales.controller");
const { guard } = require('../../helper');


/*
 *  Add  
 */
router.post(
    "/",
    guard.isAuthorized(['admin','restaurant']),
    controller.add
);

router.post(
    "/draft",
    guard.isAuthorized(['admin','restaurant']),
    controller.bookingDraft
);

router.get(
    "/getbookings",
    guard.isAuthorized(['admin','restaurant']),
    controller.bookingList
);

// Booking export
router.post(
    "/bookings-export",
    guard.isAuthorized(['admin','restaurant']),
    controller.bookingListExport
);

/*
 *  List  
 */
router.get(
    "/",
    guard.isAuthorized(['admin','restaurant']),
    controller.list
);

// Top List
router.get(
    "/topList",
    guard.isAuthorized(['admin','restaurant']),
    controller.topList    
)

/*
 *  Update  
 */
router.put(
    "/:id",
    guard.isAuthorized(['admin','restaurant']),
    controller.update
);

/*
 *  Cancel sales  
 */
router.put(
    "/cancel/:id",
    guard.isAuthorized(['admin','restaurant']),
    controller.cancel
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
 
module.exports = router;