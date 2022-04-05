const Service = require("./restaurant_users.services");
const UsersService = require("../users/users.services");
const RegistersService = require("../registers/registers.services");
const guard = require("../../helper/guards");

const { commonResponse, commonFunctions, nodemailer } = require("../../helper");

module.exports = {
	/*
	 *  Add New
	 */
	add: async (req, res) => {
		try {
			let save, message;
			req.body.register_id = req.user.main_register_id;

			let filter = {
				restaurant_admin_id: req.body.register_id,
				$or: [
					{
						username: req.body.username,
					},
					{
						pin: req.body.pin,
					},
				],
			};
			let list = await Service.CheckPinExist(filter);
			if (list.length > 0) {
				save = {};
				message =
					"Unable to create " +
					req.body.role +
					". Make sure PIN / name does not already exist for another user";
				return commonResponse.CustomError(
					res,
					"INVALID_PIN",
					400,
					{},
					message
				);
			} else {
				req.body.restaurant_admin_id = req.body.register_id;
				save = await Service.save(req.body);
				message = "Restaurant users added successfully";
			}
			if (save) {
				return commonResponse.success(
					res,
					"RESTAURANT_USERS_ADD",
					200,
					save,
					message
				);
			} else {
				return commonResponse.error(
					res,
					"DEFAULT_INTERNAL_SERVER_ERROR",
					400
				);
			}
		} catch (error) {
			console.log("Add Restaurant users -> ", error);
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
	 *  unlock
	 */
	unlock: async (req, res) => {
		try {
			var format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

			if (format.test(req.body.pin)) {
				return commonResponse.CustomError(
					res,
					"INVALID_PIN",
					400,
					{},
					"Please enter valid PIN"
				);
			}
			let register = await RegistersService.getById(req.body.register_id);
			//req.body.restaurant_admin_id = req.body.register_id;
			if (!register.is_main) {
				register = await RegistersService.getById(register.register_id);
			}

			delete req.body.register_id;
			req.body.restaurant_admin_id = register._id;
			let list = await Service.unlock(req.body);

			if (list.length > 0) {
				list = list[0];
				save = await Service.update(list._id, {
					account_status: "unlocked",
				});
				let userResponse = await UsersService.get(register.user_id);
				userResponse.role =
					list.role == "owner" ? "restaurant" : list.role;
				if (list.role == "app_user") {
					list.register_assigned_to = list.restaurant_admin_id;
				}
				//userResponse.cashier_detail = list;
				let user = {
					_id: list._id,
					register_id: list.register_assigned_to,
					role: list.role,
					main_register_id: list.restaurant_admin_id,
				};
				console.log(list);
				const token = await guard.createToken(user, list.role);
				userResponse.token = token.token;
				userResponse.username = list.username;
				if (userResponse.role == "cashier") {
					userResponse.has_manager_permission =
						list.has_manager_permission;
				}

				return commonResponse.success(
					res,
					"RESTAURANT_USERS_UNLOCK",
					200,
					userResponse,
					"Success"
				);
			} else {
				return commonResponse.CustomError(
					res,
					"INVALID_PIN",
					400,
					{},
					"Please enter valid PIN"
				);
			}
		} catch (error) {
			console.log("Unlock Restaurant users -> ", error);
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
	 *  lock
	 */
	lock: async (req, res) => {
		try {
			let list = await Service.getById(req.user.id);
			if (list) {
				let register = await RegistersService.getById(
					list.restaurant_admin_id
				);

				let mainuser = await UsersService.getByToken({
					_id: register.user_id,
				});
				console.log("eee", register);
				let user = {
					_id: mainuser._id,
					register_id: register._id,
					role: mainuser.role,
					main_register_id: list.restaurant_admin_id,
				};
				const token = await guard.createToken(user, mainuser.role);
				mainuser.token = token.token;
				save = await Service.update(list._id, {
					account_status: "locked",
				});
				//  mainuser.cashier_detail = list;

				return commonResponse.success(
					res,
					"RESTAURANT_USERS_LOCK",
					200,
					mainuser,
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
			console.log("lock Restaurant users -> ", error);
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
	 *  forgotPin
	 */
	forgotPin: async (req, res) => {
		try {
			let list = await Service.getOwnerPin({
				restaurant_admin_id: req.body.register_id,
			});

			if (list.length > 0) {
				let emailData = {
					to: req.body.email,
					subject: "Posters || PIN ",
					text: `Owner PIN for your Poster account is ${list[0].pin}`,
					html: `<h1> Posters </h1>
                        <p>Owner PIN for your Poster account is <br><br><b>${list[0].pin}</b></p>`,
				};
				nodemailer.sendMail(emailData);
				return commonResponse.success(
					res,
					"RESTAURANT_USERS_FORGOT_PIN",
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
			console.log("Unlock Restaurant users -> ", error);
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
			req.body.register_id = req.user.main_register_id;
			req.query.restaurant_admin_id = req.query.register_id;
			delete req.query.register_id;
			let list = await Service.list(req.query);
			if (list.length > 0) {
				return commonResponse.success(
					res,
					"RESTAURANT_USERS_LIST",
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
			console.log("List Restaurant users -> ", error);
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
	 *  Update
	 */
	update: async (req, res) => {
		try {
			let save, message;
			req.body.register_id = req.user.main_register_id;

			let filter = {
				restaurant_admin_id: req.body.register_id,
				$or: [
					{
						username: req.body.username,
					},
					{
						pin: req.body.pin,
					},
				],
				_id: {
					$ne: req.params.id,
				},
			};
			req.body.restaurant_admin_id = req.body.register_id;
			let list = await Service.list(filter);
			if (list.length > 0) {
				save = {};
				message =
					"Unable to update " +
					req.body.role +
					". Make sure PIN / name does not already exist for another user";
			} else {
				save = await Service.update(req.params.id, req.body);
				message = "Successfully updated Restaurant users";
			}

			if (save) {
				return commonResponse.success(
					res,
					"RESTAURANT_USERS_UPDATE",
					200,
					save,
					message
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
			console.log("Update Restaurant users -> ", error);
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
			let data = await Service.delete(req.params.id);
			if (data) {
				return commonResponse.success(
					res,
					"RESTAURANT_USERS_DELETE",
					200,
					data,
					"Successfully deleted restaurant user"
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
			console.log("Delete Restaurant users -> ", error);
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
			let data = await Service.deleteAll(req.body);
			if (data) {
				return commonResponse.success(
					res,
					"RESTAURANT_USERS_DELETE",
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
			console.log("Delete Product Category -> ", error);
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
	 *  Get Detail
	 */
	getRestaurantUsers: async (req, res) => {
		try {
			let data = await Service.getById(req.params.id);
			if (data) {
				return commonResponse.success(
					res,
					"RESTAURANT_USERS_DETAIL",
					200,
					data,
					"Success"
				);
			} else {
				return commonResponse.CustomError(
					res,
					"RESTAURANT_USERS_FOUND",
					400,
					{},
					"Restaurant users not found"
				);
			}
		} catch (error) {
			console.log("Get Restaurant users Detail -> ", error);
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
