const router = require("express").Router();
const controller = require("./restaurant_users.controller");
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
 *  Unlock  
 */
router.post(
    "/lock",
    guard.isAuthorized(['admin','restaurant']),
    controller.lock
);


/*
 *  Unlock  
 */
router.post(
    "/secret-pin-auth",
    guard.isAuthorized(['admin','restaurant']),
    controller.unlock
);

/*
 *  Unlock  
 */
router.post(
    "/forgot-pin",
    guard.isAuthorized(['admin','restaurant']),
    controller.forgotPin
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
    controller.getRestaurantUsers
);


module.exports = router;