const passport = require("passport");
const UsersService = require("./users.services");
const registerService = require("../registers/registers.services");
const shopService = require("../shops/shops.services");
const productCategoryService = require("../product_category/product_category.services");
const productsServices = require("../products/products.services");
const orderticketsgroupsService = require("../order_ticket_groups/order_ticket_groups.services");
const taxesServices = require("../taxes/taxes.services");
const taxeGroupsServices = require("../tax_groups/tax_groups.services");
const restaurantUsersServices = require("../restaurant_users/restaurant_users.services");

const guard = require("../../helper/guards");
const { commonResponse, commonFunctions, nodemailer } = require("../../helper");

const FRONT_LINK = "http://172.105.35.50/poster/";

module.exports = {
	/*
	 *  Register New User
	 */
	register: async (req, res, next) => {
		try {
			req.body.email = req.body.email.toLowerCase();
			let is_exist = await UsersService.is_exist(req.body);
			if (is_exist) {
				return next(new Error("EMAIL_EXIST"));
			}

			let isMobileExist = await UsersService.isMobileExist(req.body);
			if (isMobileExist) {
				return next(new Error("MOBILE_EXIST"));
			}

			if (req.files != undefined && req.files.image != undefined) {
				req.body.image =
					process.env.DOMAIN_URL +
					"/user-profile/" +
					req.files.image[0].filename;
			}

			req.body.password = await commonFunctions.encryptStringCrypt(
				req.body.password
			);

			req.body.otp = await commonFunctions.randomSixDigit();
			//req.body.otp = "123456";
			let user = await UsersService.save(req.body);

			if (user) {
				//add default main register
				let register = {
					user_id: user._id,
					register_name: "Main register",
					receipt_number_prefix: "PS",
					printer_type: "80mm",
					print_receipts: true,
					active: true,
					is_main: true,
				};
				let registersave = await registerService.save(register);
				if (registersave._id) {
					req.body.main_register_id = registersave._id;
					await UsersService.update(user._id, req.body);
				}
				//add shop name
				let shop = {
					user_id: user._id,
					shop_name: req.body.shop_name,
				};
				let saveShop = await shopService.save(shop);

				//add default order ticket group
				let order_ticket_group = {
					order_ticket_group_name: "Main Kitchen",
					register_id: registersave._id,
				};
				let saveorderticketsgroups =
					await orderticketsgroupsService.save(order_ticket_group);

				//add default category
				let product_category = {
					category_name: "General",
					register_id: registersave._id,
					order_ticket_group: saveorderticketsgroups._id,
				};
				let saveProductcategory = await productCategoryService.save(
					product_category
				);

				//add default tax
				let tax = {
					tax_name: "Zero Tax",
					register_id: registersave._id,
				};
				let saveTax = await taxesServices.save(tax);

				//add default tax groups
				let tax_group = {
					tax_group_name: "Zero Tax Group",
					register_id: registersave._id,
					taxes: [saveTax._id],
				};
				let saveTaxGroups = await taxeGroupsServices.save(tax_group);

				//add default products
				let products = [
					{
						product_name: "Burger",
						product_category: saveProductcategory._id,
						order_ticket_group: saveorderticketsgroups._id,
						tax_group: saveTaxGroups._id,
						register_id: registersave._id,
						price: 100,
					},
					{
						product_name: "Coffee",
						product_category: saveProductcategory._id,
						order_ticket_group: saveorderticketsgroups._id,
						tax_group: saveTaxGroups._id,
						register_id: registersave._id,
						price: 50,
					},
					{
						product_name: "Snack",
						product_category: saveProductcategory._id,
						order_ticket_group: saveorderticketsgroups._id,
						tax_group: saveTaxGroups._id,
						register_id: registersave._id,
						price: 75,
					},
				];
				for (const p of products) {
					await productsServices.save(p);
				}

				/* Send Account Verification Link */
				let emailData = {
					to: user.email,
					subject: "Poster || Account Verification OTP",
					text: `Your account verification Link Is ${user.otp}`,
					// html: `<h1> Poster </h1> <p>Your account verification OTP is :  ${user.otp}</b></p>`,
					html: "<h1> Welcome to Poster </h1><p>Your registration is successful. We will notify you once your account is approved.</p>",
				};
				nodemailer.sendMail(emailData);

				let getUser = await UsersService.get(user._id);
				commonResponse.success(
					res,
					"USER_CREATED",
					200,
					getUser,
					"Your registration is successfull. We will notify you once your account is approved"
				);
			} else {
				return commonResponse.customResponse(
					res,
					"SERVER_ERROR",
					400,
					user,
					"Something went wrong, Please try again"
				);
			}
		} catch (error) {
			console.log("Create User -> ", error);
			return commonResponse.CustomError(
				res,
				"DEFAULT_INTERNAL_SERVER_ERROR",
				500,
				{},
				error.message
			);
		}
	},

	/*
	 *  Login
	 */
	login: async (req, res, next) => {
		passport.authenticate("user", async function (err, user, info) {
			if (err) {
				var err = err;
				err.status = 400;
				return next(err);
			}

			if (info) {
				var err = new Error("Missing_Credentials");
				err.status = 400;
				return next(err);
			}

			if (user) {
				// if(user.role != req.body.role){
				//     return commonResponse.customResponse(res, "EMAIL_NOT_EXIST", 400, {}, "Email does not exist");
				// }

				if (user.status == "pending") {
					return commonResponse.customResponse(
						res,
						"USER_NOT_VERIFIED",
						400,
						user,
						"Please verify your email to login"
					);
				}
				if (user.status == "deactivated") {
					return commonResponse.customResponse(
						res,
						"USER_DEACTIVATED",
						400,
						user,
						"Your account has been deactivated, Please contact admin to activate your account"
					);
				}

				await UsersService.update(user._id, {
					fcm_token: req.body.fcm_token ? req.body.fcm_token : "",
					device_type: req.body.device_type
						? req.body.device_type
						: "android",
					device_id: req.body.device_id ? req.body.device_id : "",
				});

				let userResponse = await UsersService.get(user._id);
				const token = await guard.createToken(user, userResponse.role);
				userResponse.token = token.token;
				userResponse.register_id = user.register_id;
				userResponse.register_name = user.register_name;
				userResponse.username = user.username ? user.username : "";
				return commonResponse.success(
					res,
					"LOGIN_SUCCESS",
					200,
					userResponse
				);
			} else {
				return commonResponse.customResponse(
					res,
					"USER_NOT_FOUND",
					400,
					{},
					"User not found"
				);
			}
		})(req, res, next);
	},

	/*
	 *  Resend Verification Link
	 */
	resendVerificationLink: async (req, res) => {
		try {
			req.body.email = req.body.email.toLowerCase();
			let user = await UsersService.is_exist(req.body);
			if (user) {
				//let otp = await commonFunctions.randomSixDigit();
				let otp = "123456";
				let updateData = {
					otp: otp,
				};
				let updateUser = await UsersService.update(
					user._id,
					updateData
				);
				if (updateUser) {
					/* Send Account Verification OTP */
					let emailData = {
						to: updateUser.email,
						subject: "Posters || Account Verification OTP",
						text: `Your account verification Link Is ${updateUser.otp}`,
						html: `<h1> Posters </h1>
                                <p>Your account verification OTP is :  ${updateUser.otp}</b></p>`,
					};
					// nodemailer.sendMail(emailData);

					return commonResponse.success(
						res,
						"RESEND_VERIFICATION_LINK_SUCCESS",
						200,
						updateUser,
						"We have sent account verification OTP to your email, Please verify your account to continue"
					);
				} else {
					return commonResponse.customResponse(
						res,
						"SERVER_ERROR",
						400,
						{},
						"Something went wrong please try again"
					);
				}
			} else {
				return commonResponse.customResponse(
					res,
					"EMAIL_NOT_EXIST",
					400,
					{},
					"Email does not exist"
				);
			}
		} catch (error) {
			console.log("Resend User Verification Link -> ", error);
			return commonResponse.CustomError(
				res,
				"DEFAULT_INTERNAL_SERVER_ERROR",
				500,
				{},
				error.message
			);
		}
	},

	/*
	 *  Verify User
	 */
	verifyUser: async (req, res) => {
		try {
			let getUser = await UsersService.is_exist(req.body);
			if (getUser) {
				if (getUser.status == "deactivated") {
					return commonResponse.customResponse(
						res,
						"USER_DEACTIVATED",
						400,
						getUser,
						"Your account has been deactivated, Please contact admin to activate your account"
					);
				}
				if (
					req.body.otp != getUser.otp ||
					req.body.otp == 0 ||
					req.body.otp == "0"
				) {
					return commonResponse.customResponse(
						res,
						"INVALID_OTP",
						400,
						getUser,
						"Please enter valid otp"
					);
				}

				let updateData = {
					status: "activated",
					otp: 0,
				};

				let updateUserDetails = await UsersService.update(
					getUser._id,
					updateData
				);
				if (updateUserDetails) {
					const token = await guard.createToken(
						updateUserDetails,
						"user"
					);
					updateUserDetails.token = token.token;
					return commonResponse.success(
						res,
						"USER_VERIFIED_SUCCESS",
						200,
						updateUserDetails,
						"Success"
					);
				} else {
					return commonResponse.customResponse(
						res,
						"SERVER_ERROR",
						400,
						{},
						"Something went wrong please try again"
					);
				}
			} else {
				return commonResponse.customResponse(
					res,
					"EMAIL_NOT_EXIST",
					400,
					{},
					"Email does not exist"
				);
			}
		} catch (error) {
			console.log("Verify User -> ", error);
			return commonResponse.CustomError(
				res,
				"DEFAULT_INTERNAL_SERVER_ERROR",
				500,
				{},
				error.message
			);
		}
	},

	/*
	 *  Change user status
	 */
	statusUser: async (req, res) => {
		try {
			let getUser = await UsersService.get(req.body.user_id);

			if (getUser) {
				if (getUser.status == "deactivated") {
					return commonResponse.customResponse(
						res,
						"USER_DEACTIVATED",
						400,
						getUser,
						"Your account has been deactivated, Please contact admin to activate your account"
					);
				}

				let updateData = {
					status: req.body.status,
					otp: 0,
				};

				let updateUserDetails = await UsersService.update(
					getUser._id,
					updateData
				);
				if (updateUserDetails) {
					if (req.body.status == "activated") {
						let link = FRONT_LINK + "login";
						let emailData = {
							to: updateUserDetails.email,
							subject: "Posters || Approved your register",
							text: `Your account is Approved by Poster admin`,
							html: `<h1> Posters </h1>
                                    <p>Congratulation!! Your account has been approved by poster admin.. Go to login ${link}</p>`,
						};
						nodemailer.sendMail(emailData);
					}
					return commonResponse.success(
						res,
						"USER_VERIFIED_SUCCESS",
						200,
						updateUserDetails,
						"Success"
					);
				} else {
					return commonResponse.customResponse(
						res,
						"SERVER_ERROR",
						400,
						{},
						"Something went wrong please try again"
					);
				}
			} else {
				return commonResponse.customResponse(
					res,
					"USER_NOT_EXIST",
					400,
					{},
					"Email does not exist"
				);
			}
		} catch (error) {
			console.log("Verify User -> ", error);
			return commonResponse.CustomError(
				res,
				"DEFAULT_INTERNAL_SERVER_ERROR",
				500,
				{},
				error.message
			);
		}
	},

	/*
	 *  Forgot Password
	 */
	forgotPassword: async (req, res) => {
		try {
			req.body.email = req.body.email.toLowerCase();
			let checkUserExist = await UsersService.is_exist(req.body);
			if (checkUserExist) {
				// if(checkUserExist.role != req.body.role){
				//     return commonResponse.customResponse(res, "EMAIL_NOT_EXIST", 400, {}, "Email does not exist");
				// }

				if (checkUserExist.status == "deactivated") {
					return commonResponse.customResponse(
						res,
						"USER_DEACTIVATED",
						400,
						checkUserExist,
						"Your account has been deactivated, Please contact admin to activate your account"
					);
				}

				let otp = await commonFunctions.createToken(
					checkUserExist,
					"user"
				);
				otp = otp.token;
				let updateData = {
					otp: otp,
				};
				let updateUser = await UsersService.update(
					checkUserExist._id,
					updateData
				);

				/* Send Reset Password Link */
				let link = FRONT_LINK + "resetPassword?token=" + otp;
				let emailData = {
					to: updateUser.email,
					subject: "Posters || Reset Password link",
					text: `Your Reset Password Link Is ${link}`,
					html: `<h1> Posters </h1>
                            <p>Your Reset Password verification link is <br><br><a href="${link}" target="_blank" >Click here</a></p>`,
				};
				nodemailer.sendMail(emailData);

				return commonResponse.success(
					res,
					"FORGOT_PASSWORD_SUCCESS",
					200,
					{ token: otp },
					"We have send reset password link to your email"
				);
			} else {
				return commonResponse.customResponse(
					res,
					"EMAIL_NOT_EXIST",
					400,
					{},
					"Email does not exist"
				);
			}
		} catch (error) {
			console.log("User Forgot Password -> ", error);
			return commonResponse.CustomError(
				res,
				"DEFAULT_INTERNAL_SERVER_ERROR",
				500,
				{},
				error.message
			);
		}
	},

	/*
	 *  Reset Password
	 */
	resetPassword: async (req, res) => {
		try {
			let getTokenValues = await commonFunctions.verifyToken(
				req.query.token
			);
			if (getTokenValues == 0) {
				return commonResponse.customResponse(
					res,
					"INVALID_LINK",
					400,
					[],
					"Link are expired please try again with forgot possword"
				);
			}
			let user = await UsersService.getByToken({
				_id: getTokenValues.id,
				otp: req.query.token,
			});
			if (user) {
				if (user.status == "pending") {
					return commonResponse.customResponse(
						res,
						"USER_NOT_VERIFIED",
						400,
						user,
						"Please verify your email"
					);
				}
				if (user.status == "deactivated") {
					return commonResponse.customResponse(
						res,
						"USER_DEACTIVATED",
						400,
						user,
						"Your account has been deactivated, Please contact admin to activate your account"
					);
				}

				if (req.body.new_password == req.body.confirm_password) {
					req.body.new_password =
						await commonFunctions.encryptStringCrypt(
							req.body.new_password
						);
					let updateData = {
						password: req.body.new_password,
						otp: "0",
					};
					let updateUserDetails = await UsersService.update(
						user._id,
						updateData
					);
					if (updateUserDetails) {
						return commonResponse.success(
							res,
							"PASSWORD_RESET_SUCCESS",
							200,
							updateUserDetails,
							"Password reset successfully"
						);
					} else {
						return commonResponse.customResponse(
							res,
							"SERVER_ERROR",
							400,
							{},
							"Something went wrong please try again"
						);
					}
				} else {
					return commonResponse.customResponse(
						res,
						"INVALID_CONFIRM_PASSWORD",
						400,
						{},
						"Confirm password did not match, Please try again"
					);
				}
			} else {
				//return commonResponse.customResponse(res, "USER_NOT_FOUND", 400, {}, "User not found");
				return commonResponse.customResponse(
					res,
					"INVALID_LINK",
					400,
					[],
					"Link are expired please try again with forgot possword"
				);
			}
		} catch (error) {
			console.log("User Reset Password -> ", error);
			return commonResponse.CustomError(
				res,
				"DEFAULT_INTERNAL_SERVER_ERROR",
				500,
				{},
				error.message
			);
		}
	},

	/*
	 *  Update Profile
	 */
	update: async (req, res) => {
		try {
			let reg = await registerService.getById(req.user.main_register_id);
			if (req.files != undefined && req.files.image != undefined) {
				req.body.image =
					process.env.DOMAIN_URL +
					"/user-profile/" +
					req.files.image[0].filename;
			}
			let updateOwner = await restaurantUsersServices.findAndupdate(
				{
					role: "owner",
					restaurant_admin_id: req.user.main_register_id,
				},
				{ username: req.body.username }
			);
			let updatedUser = await UsersService.update(reg.user_id, req.body);

			commonResponse.success(
				res,
				"USER_PROFILE_UPDATE",
				200,
				updatedUser
			);
		} catch (error) {
			return commonResponse.CustomError(
				res,
				"DEFAULT_INTERNAL_SERVER_ERROR",
				500,
				{},
				error.message
			);
		}
	},

	/*
	 *  Change Password
	 */
	changePassword: async (req, res) => {
		try {
			let getUser = await UsersService.get(req.user.id);
			if (getUser) {
				let isPasswordValid = await commonFunctions.matchPassword(
					req.body.old_password,
					getUser.password
				);
				if (isPasswordValid) {
					if (req.body.new_password == req.body.confirm_password) {
						req.body.new_password =
							await commonFunctions.encryptStringCrypt(
								req.body.new_password
							);
						let updateData = {
							password: req.body.new_password,
						};
						let updatePassword = await UsersService.update(
							req.user.id,
							updateData
						);
						if (updatePassword) {
							return commonResponse.success(
								res,
								"PASSWORD_CHANGED_SUCCESS",
								200,
								updatePassword,
								"Password changed successfully"
							);
						} else {
							return commonResponse.customResponse(
								res,
								"SERVER_ERROR",
								400,
								{},
								"Something went wrong please try again"
							);
						}
					} else {
						return commonResponse.customResponse(
							res,
							"INVALID_CONFIRM_PASSWORD",
							400,
							{},
							"Confirm password did not match, Please try again"
						);
					}
				} else {
					return commonResponse.customResponse(
						res,
						"INVALID_OLD_PASSWORD",
						400,
						{},
						"Invalid old password"
					);
				}
			} else {
				return commonResponse.customResponse(
					res,
					"USER_NOT_FOUND",
					400,
					{},
					"User not found"
				);
			}
		} catch (error) {
			console.log("User Change Password -> ", error);
			return commonResponse.CustomError(
				res,
				"DEFAULT_INTERNAL_SERVER_ERROR",
				500,
				{},
				error.message
			);
		}
	},

	/*
	 *  Get Profile
	 */
	get: async (req, res) => {
		try {
			let reg = await registerService.getById(req.user.main_register_id);
			let User = await UsersService.get(reg.user_id);
			commonResponse.success(res, "GET_PROFILE", 200, User, "Success");
		} catch (error) {
			return commonResponse.CustomError(
				res,
				"DEFAULT_INTERNAL_SERVER_ERROR",
				500,
				{},
				error.message
			);
		}
	},

	/*
	 *  logout
	 */
	logout: async (req, res) => {
		try {
			let updateData = {
				fcm_token: "",
				device_id: "",
			};
			let update = await UsersService.update(req.user.id, updateData);
			if (update) {
				return commonResponse.success(
					res,
					"USER_LOGOUT",
					200,
					update,
					"Successfully logout"
				);
			} else {
				return commonResponse.customResponse(
					res,
					"SERVER_ERROR",
					400,
					{},
					"Something went wrong please try again"
				);
			}
		} catch (error) {
			return commonResponse.CustomError(
				res,
				"DEFAULT_INTERNAL_SERVER_ERROR",
				500,
				{},
				error.message
			);
		}
	},
	/*
	 *  List
	 */
	statuswiselist: async (req, res) => {
		try {
			req.query.status = "pending";
			let list = await UsersService.statuswiselist(req.query);
			if (list.length > 0) {
				return commonResponse.success(
					res,
					"USER_LIST",
					200,
					list,
					"Success"
				);
			} else {
				return commonResponse.success(
					res,
					"NO_DATA_FOUND",
					200,
					[],
					"No Data Found"
				);
			}
		} catch (error) {
			console.log("List Users -> ", error);
			return commonResponse.CustomError(
				res,
				"DEFAULT_INTERNAL_SERVER_ERROR",
				500,
				{},
				error.message
			);
		}
	},
	/*
	 *  List
	 */
	list: async (req, res) => {
		try {
			let list = await UsersService.list(req.query);
			if (list.length > 0) {
				return commonResponse.success(
					res,
					"USER_LIST",
					200,
					list,
					"Success"
				);
			} else {
				return commonResponse.success(
					res,
					"NO_DATA_FOUND",
					200,
					[],
					"No Data Found"
				);
			}
		} catch (error) {
			console.log("List Users -> ", error);
			return commonResponse.CustomError(
				res,
				"DEFAULT_INTERNAL_SERVER_ERROR",
				500,
				{},
				error.message
			);
		}
	},

	/*
	 *  Delete
	 */
	delete: async (req, res) => {
		try {
			let getUser = await UsersService.get(req.params.id);
			let data;
			if (getUser) {
				if (getUser.status == "activated") {
					return commonResponse.customResponse(
						res,
						"USER_DELETE_FAILD",
						400,
						getUser,
						"Sorry,User is in active mode.only deactivated user can be deleted"
					);
				}
				if (getUser.status == "deactivated") {
					data = await UsersService.delete(req.params.id);
				}
			}

			if (data) {
				return commonResponse.success(
					res,
					"USER_DELETE",
					200,
					data,
					"Successfully deleted user"
				);
			} else {
				return commonResponse.CustomError(
					res,
					"DEFAULT_INTERNAL_SERVER_ERROR",
					400,
					{}
				);
			}
		} catch (error) {
			console.log("Delete user -> ", error);
			return commonResponse.CustomError(
				res,
				"DEFAULT_INTERNAL_SERVER_ERROR",
				500,
				{},
				error.message
			);
		}
	},

	/*
	 *  Delete Multiple
	 */
	deleteAll: async (req, res) => {
		try {
			let data = await UsersService.deleteAll(req.body);
			for (const u of req.body.ids) {
				let getmain = await registerService.list({
					user_id: u,
					is_main: true,
				});
				let main_register_id = getmain[0]._id;
				await registerService.deleteAllByRegister({
					_id: main_register_id,
				});
				await registerService.deleteAllByRegister({
					register_id: main_register_id,
				});
				await restaurantUsersServices.deleteAllByRegister({
					restaurant_admin_id: main_register_id,
				});
			}

			if (data) {
				return commonResponse.success(
					res,
					"USER_DELETE",
					200,
					data,
					"Successfully deleted"
				);
			} else {
				return commonResponse.CustomError(
					res,
					"DEFAULT_INTERNAL_SERVER_ERROR",
					400,
					{}
				);
			}
		} catch (error) {
			console.log("Delete Users -> ", error);
			return commonResponse.CustomError(
				res,
				"DEFAULT_INTERNAL_SERVER_ERROR",
				500,
				{},
				error.message
			);
		}
	},

	/*
	 *  Export
	 */
	export: async (req, res) => {
		try {
			let list = await UsersService.list(req.query);
			if (list.length > 0) {
				let file = "";
				list = await commonFunctions.changeDateFormat(
					list,
					"created_at"
				);

				if (req.body.type == "CSV") {
					const transformer = (doc) => {
						return {
							Mobile: doc.number,
							Email: doc.email,
							Registered_On: doc.created_at,
						};
					};
					file = await commonFunctions.exportToCSV(
						"Users",
						transformer,
						list
					);
				}
				if (req.body.type == "XLSX") {
					const header = [
						{
							header: "Mobile",
							key: "number",
							width: 30,
						},
						{
							header: "Email",
							key: "email",
							width: 30,
						},
						{
							header: "Registered_On",
							key: "created_at",
							width: 30,
						},
					];
					file = await commonFunctions.exportToXLSX(
						"Users",
						header,
						list
					);
				}
				if (req.body.type == "PDF") {
					const header = [
						{
							header: "Mobile",
							key: "number",
						},
						{
							header: "Email",
							key: "email",
						},
						{
							header: "Registered_On",
							key: "created_at",
						},
					];
					file = await commonFunctions.exportToPDF(
						"Users",
						header,
						list
					);
				}

				if (file) {
					file = process.env.DOMAIN_URL + "/exports/" + file;
					let emailData = {
						to: req.body.email,
						subject: "Poster || Export Users",
						text: `Your Users report is ready for download`,
						html: `<b>Users</b><br><a href="${file}" download>Click here to download </a>`,
					};
					nodemailer.sendMail(emailData);
				}

				return commonResponse.success(
					res,
					"USERS_EXPORT",
					200,
					[],
					"Successfully send exported data to email"
				);
			} else {
				return commonResponse.success(
					res,
					"NO_DATA_FOUND",
					200,
					[],
					"No Data Found"
				);
			}
		} catch (error) {
			console.log("Export Users -> ", error);
			return commonResponse.CustomError(
				res,
				"DEFAULT_INTERNAL_SERVER_ERROR",
				500,
				{},
				error.message
			);
		}
	},
};
