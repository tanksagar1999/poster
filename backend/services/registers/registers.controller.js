const Service = require("./registers.services");
const { commonResponse, commonFunctions } = require("../../helper");
const { tablesServices } = require("../tables");
const guard = require("../../helper/guards");
const UsersService = require("../users/users.services");
const RestaurantUsersService = require("../restaurant_users/restaurant_users.services");

module.exports = {
	/*
	 *  Add New
	 */
	add: async (req, res) => {
		try {
			req.body.register_id = req.user.main_register_id;
			let checkexist = await Service.list({
				register_name: {
					$regex: new RegExp("^" + req.body.register_name + "$", "i"),
				},
				register_id: req.body.register_id,
			});
			if (checkexist.length > 0) {
				return commonResponse.CustomError(
					res,
					"ALREADY_EXIST",
					400,
					{},
					req.body.register_name + " already exist"
				);
			}
			req.body.user_id = req.user.id;
			let save = await Service.save(req.body);
			if (save) {
				if (save.table_numbers) {
					let tablestype = [
						"numbers",
						"string",
						"alphanumeric",
						"groups",
					];

					//add default New Take-Away and delivery
					let newtakeaway = {
						register_id: save._id,
						table_prefix: "New Take-away",
						table_number: 1,
						table_type: "take-away",
						status: "Empty",
					};
					let t1 = await tablesServices.save(newtakeaway);

					let newdelivery = {
						register_id: save._id,
						table_prefix: "New Delivery",
						table_number: 1,
						table_type: "delivery",
						status: "Empty",
					};
					let t2 = await tablesServices.save(newdelivery);

					for (var key in req.body.table_data) {
						if (tablestype.indexOf(key) == -1) {
							await Service.delete(save._id);
							await tablesServices.delete(save._id);
							return commonResponse.CustomError(
								res,
								"ALREADY_EXIST",
								400,
								{},
								"Invalid table data.it should be any one from " +
									tablestype.join(",")
							);
						}

						let totaltables = 0;
						if (req.body.table_data.hasOwnProperty(key)) {
							if (
								key == "numbers" ||
								key == "string" ||
								key == "alphanumeric" ||
								key == "take-away" ||
								key == "delivery"
							) {
								totaltables = req.body.table_data[key].length;
							}
							let tableprefix = "",
								tablenumber = 0;

							for (let j = 0; j < totaltables; j++) {
								if (key == "numbers") {
									tableprefix = "";
									tablenumber = req.body.table_data[key][j];

									let checkAvailable =
										await tablesServices.checkExist({
											register_id: save._id,
											table_number: tablenumber,
											table_type: "numbers",
										});
									if (checkAvailable) {
										await Service.delete(save._id);
										await tablesServices.delete(save._id);
										return commonResponse.CustomError(
											res,
											"ALREADY_EXIST",
											400,
											{},
											"Duplicate table numbers are not allowed"
										);
									}
								}
								if (key == "string") {
									tableprefix = req.body.table_data[key][j];
									tablenumber = 0;
									let checkAvailable =
										await tablesServices.checkExist({
											register_id: save._id,
											table_prefix: tableprefix,
											table_type: "string",
										});
									if (checkAvailable) {
										await Service.delete(save._id);
										await tablesServices.delete(save._id);
										return commonResponse.CustomError(
											res,
											"ALREADY_EXIST",
											400,
											{},
											"Duplicate table numbers are not allowed"
										);
									}
								}
								if (key == "alphanumeric") {
									let alphadata =
										req.body.table_data[key][j].split(
											/(\d+)/
										);
									tableprefix = alphadata[0];
									tablenumber = alphadata[1];
									if (alphadata.length < 2) {
										await Service.delete(save._id);
										await tablesServices.delete(save._id);
										return commonResponse.CustomError(
											res,
											"ALREADY_EXIST",
											400,
											{},
											"alphanumeric value not valid"
										);
									}
									let checkAvailable =
										await tablesServices.checkExist({
											register_id: save._id,
											table_number: tablenumber,
											table_prefix: tableprefix,
											table_type: "alphanumeric",
										});
									if (checkAvailable) {
										await Service.delete(save._id);
										await tablesServices.delete(save._id);
										return commonResponse.CustomError(
											res,
											"ALREADY_EXIST",
											400,
											{},
											"Duplicate table numbers are not allowed"
										);
									}
								}

								let tableData = {
									register_id: save._id,
									table_prefix: tableprefix,
									table_number: tablenumber,
									table_type: key,
									status: "Empty",
								};
								await tablesServices.save(tableData);
							}
							if (key == "groups") {
								for (
									let g = 0;
									g < req.body.table_data[key].length;
									g++
								) {
									for (
										let t = 0;
										t <
										req.body.table_data[key][g].tables
											.length;
										t++
									) {
										let checkAvailable =
											await tablesServices.checkExist({
												register_id: save._id,
												group_table_number:
													req.body.table_data[key][g]
														.tables[t],
											});
										if (checkAvailable) {
											await Service.delete(save._id);
											await tablesServices.delete(
												save._id
											);
											return commonResponse.CustomError(
												res,
												"ALREADY_EXIST",
												400,
												{},
												"Duplicate table numbers are not allowed"
											);
										}
										let tableData = {
											register_id: save._id,
											group_name:
												req.body.table_data[key][g]
													.name,
											group_table_number:
												req.body.table_data[key][g]
													.tables[t],
											table_type: key,
											status: "Empty",
										};
										await tablesServices.save(tableData);
									}
								}
							}
						}
					}
				}

				return commonResponse.success(
					res,
					"REGISTERS_ADD",
					200,
					save,
					"Registers added successfully"
				);
			} else {
				return commonResponse.error(
					res,
					"DEFAULT_INTERNAL_SERVER_ERROR",
					400
				);
			}
		} catch (error) {
			console.log("Add Registers -> ", error);
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
	 *  Swith register
	 */
	switch: async (req, res) => {
		try {
			let user = await RestaurantUsersService.getById(req.user.id);
			user.register_id = req.body.switch_to_register_id;
			user.main_register_id = user.restaurant_admin_id;
			let token = await guard.createToken(user, "restaurant");

			//inactive current
			let list = await Service.list({
				$or: [
					{ register_id: req.body.register_id },
					{ _id: req.body.register_id },
				],
			});
			if (list.length > 0) {
				if (list.length == 1 && list[0].register_id) {
					list = await Service.list({
						$or: [
							{ register_id: list[0].register_id },
							{ _id: list[0].register_id },
						],
					});
				}
			}
			for (const iterator of list) {
				await Service.update(iterator._id, { active: false });
			}

			//active to switched
			let register = await Service.update(
				req.body.switch_to_register_id,
				{
					active: true,
				}
			);

			if (register) {
				return commonResponse.success(
					res,
					"SWITCH_REGISTER",
					200,
					{
						token: token.token,
						register_id: register._id,
						register_name: register.register_name,
						isTable: register.table_numbers != "" ? true : false,
					},
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
			console.log("Switch Registers -> ", error);
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
	list: async (req, res, localCheck) => {
		try {
			console.log(req.user);
			let list = await Service.list({
				$or: [
					{ register_id: req.user.main_register_id },
					{ _id: req.user.main_register_id },
				],
			});

			if (list.length > 0) {
				if (list.length == 1 && list[0].register_id) {
					list = await Service.list({
						$or: [
							{ register_id: list[0].register_id },
							{ _id: list[0].register_id },
						],
					});
				}
				if (req.user.role == "cashier") {
					list = await Service.list({
						_id: req.user.main_register_id,
					});
					list[0].active = true;
				}
				if (localCheck == "local") {
					return list;
				} else {
					return commonResponse.success(
						res,
						"REGISTERS_LIST",
						200,
						list,
						"Success"
					);
				}
			} else {
				if (localcheck == "local") {
					return [];
				} else {
					return commonResponse.success(
						res,
						"NO_DATA_FOUND",
						200,
						[],
						"No Data Found"
					);
				}
			}
		} catch (error) {
			console.log("List Registers -> ", error);
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
			req.body.register_id = req.user.main_register_id;
			let checkexist = await Service.list({
				register_name: {
					$regex: new RegExp("^" + req.body.register_name + "$", "i"),
				},
				register_id: req.body.register_id,
				_id: { $ne: req.params.id },
			});
			if (checkexist.length > 0) {
				return commonResponse.CustomError(
					res,
					"ALREADY_EXIST",
					400,
					{},
					req.body.register_name + " already exist"
				);
			}
			let updateRegister = await Service.update(req.params.id, req.body);

			if (updateRegister) {
				if (req.body.table_numbers) {
					await tablesServices.delete(req.params.id);

					let tablestype = [
						"numbers",
						"string",
						"alphanumeric",
						"groups",
					];

					//add default New Take-Away and delivery
					let newtakeaway = {
						register_id: req.params.id,
						table_prefix: "New Take-away",
						table_number: 1,
						table_type: "take-away",
						status: "Empty",
					};
					let t1 = await tablesServices.save(newtakeaway);

					let newdelivery = {
						register_id: req.params.id,
						table_prefix: "New Delivery",
						table_number: 1,
						table_type: "delivery",
						status: "Empty",
					};
					let t2 = await tablesServices.save(newdelivery);

					for (var key in req.body.table_data) {
						if (tablestype.indexOf(key) == -1) {
							await tablesServices.delete(req.params.id);
							return commonResponse.CustomError(
								res,
								"ALREADY_EXIST",
								400,
								{},
								"Invalid table data.it should be any one from " +
									tablestype.join(",")
							);
						}

						let totaltables = 0;
						if (req.body.table_data.hasOwnProperty(key)) {
							if (
								key == "numbers" ||
								key == "string" ||
								key == "alphanumeric" ||
								key == "take-away" ||
								key == "delivery"
							) {
								totaltables = req.body.table_data[key].length;
							}
							let tableprefix = "",
								tablenumber = 0;

							for (let j = 0; j < totaltables; j++) {
								if (key == "numbers") {
									tableprefix = "";
									tablenumber = req.body.table_data[key][j];

									let checkAvailable =
										await tablesServices.checkExist({
											register_id: req.params.id,
											table_number: tablenumber,
											table_type: "numbers",
										});
									if (checkAvailable) {
										await tablesServices.delete(
											req.params.id
										);
										return commonResponse.CustomError(
											res,
											"ALREADY_EXIST",
											400,
											{},
											"Duplicate table numbers are not allowed"
										);
									}
								}
								if (key == "string") {
									tableprefix = req.body.table_data[key][j];
									tablenumber = 0;
									let checkAvailable =
										await tablesServices.checkExist({
											register_id: req.params.id,
											table_prefix: tableprefix,
											table_type: "string",
										});
									if (checkAvailable) {
										await tablesServices.delete(
											req.params.id
										);
										return commonResponse.CustomError(
											res,
											"ALREADY_EXIST",
											400,
											{},
											"Duplicate table numbers are not allowed"
										);
									}
								}
								if (key == "alphanumeric") {
									let alphadata =
										req.body.table_data[key][j].split(
											/(\d+)/
										);
									tableprefix = alphadata[0];
									tablenumber = alphadata[1];
									if (alphadata.length < 2) {
										await tablesServices.delete(
											req.params.id
										);
										return commonResponse.CustomError(
											res,
											"ALREADY_EXIST",
											400,
											{},
											"alphanumeric value not valid"
										);
									}
									let checkAvailable =
										await tablesServices.checkExist({
											register_id: req.params.id,
											table_number: tablenumber,
											table_prefix: tableprefix,
											table_type: "alphanumeric",
										});
									if (checkAvailable) {
										await tablesServices.delete(
											req.params.id
										);
										return commonResponse.CustomError(
											res,
											"ALREADY_EXIST",
											400,
											{},
											"Duplicate table numbers are not allowed"
										);
									}
								}

								let tableData = {
									register_id: req.params.id,
									table_prefix: tableprefix,
									table_number: tablenumber,
									table_type: key,
									status: "Empty",
								};
								await tablesServices.save(tableData);
							}
							if (key == "groups") {
								for (
									let g = 0;
									g < req.body.table_data[key].length;
									g++
								) {
									for (
										let t = 0;
										t <
										req.body.table_data[key][g].tables
											.length;
										t++
									) {
										let checkAvailable =
											await tablesServices.checkExist({
												register_id: req.params.id,
												group_table_number:
													req.body.table_data[key][g]
														.tables[t],
											});
										if (checkAvailable) {
											await tablesServices.delete(
												req.params.id
											);
											return commonResponse.CustomError(
												res,
												"ALREADY_EXIST",
												400,
												{},
												"Duplicate table numbers are not allowed"
											);
										}
										let tableData = {
											register_id: req.params.id,
											group_name:
												req.body.table_data[key][g]
													.name,
											group_table_number:
												req.body.table_data[key][g]
													.tables[t],
											table_type: key,
											status: "Empty",
										};
										await tablesServices.save(tableData);
									}
								}
							}
						}
					}
				}
				return commonResponse.success(
					res,
					"REGISTERS_UPDATE",
					200,
					updateRegister,
					"Successfully updated registers"
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
			console.log("Update Registers -> ", error);
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
					"REGISTERS_DELETE",
					200,
					data,
					"Successfully deleted product variant"
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
			console.log("Delete Registers -> ", error);
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
	getRegisters: async (req, res) => {
		try {
			let data = await Service.getById(req.params.id);
			if (data) {
				return commonResponse.success(
					res,
					"REGISTERS_DETAIL",
					200,
					data,
					"Success"
				);
			} else {
				return commonResponse.CustomError(
					res,
					"REGISTERS_NOT_FOUND",
					400,
					{},
					"Product variant not found"
				);
			}
		} catch (error) {
			console.log("Get Registers Detail -> ", error);
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
			let check = await RestaurantUsersService.checkHaveCashierUsers(
				req.body
			);
			if (check) {
				return commonResponse.success(
					res,
					"ALREADY_IN_USE",
					200,
					{},
					"We could not delete " +
						check +
						" register.make sure you are not having associated cashier"
				);
			}

			let list = await Service.list({
				$or: [
					{ register_id: req.body.register_id },
					{ _id: req.body.register_id },
				],
			});
			if (list.length > 0) {
				if (list.length == 1 && list[0].register_id) {
					list = await Service.list({
						$or: [
							{ register_id: list[0].register_id },
							{ _id: list[0].register_id },
						],
					});
				}
			}
			if (list.length == 1 || list.length == req.body.ids.length) {
				return commonResponse.success(
					res,
					"CAN_NOT_DELETE",
					200,
					{},
					"You can not delete all your register"
				);
			}

			let havemain = await Service.list({
				_id: { $in: req.body.ids },
				is_main: true,
			});
			if (havemain.length > 0) {
				return commonResponse.success(
					res,
					"CAN_NOT_DELETE",
					200,
					{},
					"You can not delete Main Register"
				);
			}
			let data = await Service.deleteAll(req.body);

			//delete all other data

			let deleteTables = await tablesServices.delete(req.body.ids);

			if (data) {
				return commonResponse.success(
					res,
					"REGISTERS_DELETE",
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
			console.log("Delete Registers -> ", error);
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
