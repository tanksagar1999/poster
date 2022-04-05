const router = require("express").Router();
const controller = require("./users.controller");
const { guard } = require('../../helper');
const multerSetting = require("../../helper/multer").userImageUpload;

/*
 *  Register New User
 */
router.post(
    "/register",
    multerSetting,
    controller.register
);

/*
 *  Login
 */
router.post(
    "/login",
    controller.login
);

/*
 *  Resend verification Link
 */
router.post(
    "/resend-verification-link",
    controller.resendVerificationLink
);

/*
 *  Verify User Account
 */
router.post(
    "/verify-user",
    controller.verifyUser
);

/*
 *  Forgot Passowrd
 */
router.post(
    "/forgot-password",
    controller.forgotPassword
);

/*
 *  Reset Passowrd
 */
router.post(
    "/reset-password",
    controller.resetPassword
);

/*
 *  Update Profile
 */
router.post(
    "/update",
    multerSetting,
    guard.isAuthorized(['admin','restaurant']),
    controller.update
);
  
/*
 *  Change Password
 */
router.post(
    "/change-password",
    guard.isAuthorized(['admin','restaurant']),
    controller.changePassword
);

/*
 *  Get Profile
 */
router.get(
    "/get-profile",
    guard.isAuthorized(['admin','restaurant']),
    controller.get
);

/*
 *  logout
 */
router.post(
    "/logout",
    guard.isAuthorized(['admin']),
    controller.logout
);

/*
 *  List  
 */
router.get(
    "/pending",
    guard.isAuthorized(['admin']),
    controller.statuswiselist
);

/*
 *  List  
 */
router.get(
    "/all",
    guard.isAuthorized(['admin']),
    controller.list
);
/*
  status
*/
router.post(
    "/changeStatus",
    guard.isAuthorized(['admin']),
    controller.statusUser
);

/*
  User delete
*/
router.delete(
    "/:id",
    guard.isAuthorized(['admin']),
    controller.delete
);

/*
 *  Delete Multiple
 */
router.post(
    "/deleteAll",
    guard.isAuthorized(['admin']),
    controller.deleteAll
);

/*
 *  Export
 */
router.post(
    "/export",
    guard.isAuthorized(['admin']),
    controller.export
);


module.exports = router;


