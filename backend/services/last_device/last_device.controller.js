const Service = require("./last_device.services");
const { commonResponse, commonFunctions } = require("../../helper");
const { registersServices } = require("../registers");
const { ordersItemsServices } = require("../order_items");
const salesService = require("../sales/sales.services");
const invNum = require("invoice-number");
module.exports = {
	/*
	 *  List
	 */
	add: async (req, res) => {
		try {
			console.log("req.body", req.body);
			req.body.main_register_id = req.user.main_register_id;

			let lastLoginData = await Service.getByRegisteredId(
				req.body.main_register_id
			);
			if (lastLoginData) {
				console.log("lastLoginData ==>", lastLoginData);
				try {
					let updateLastDevice = await Service.update(
						lastLoginData._id,
						req.body
					);
					if (updateLastDevice) {
						return commonResponse.success(
							res,
							"PREFERENCES_UPDATE",
							200,
							updateLastDevice,
							"Successfully updated"
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
					console.log("Update Preferences -> ", error);
					return commonResponse.CustomError(
						res,
						"DEFAULT_INTERNAL_SERVER_ERROR",
						500,
						{},
						error.message
					);
				}
			} else {
				console.log("Else");
				let save = await Service.save(req.body);
				if (save) {
					return commonResponse.success(
						res,
						"LAST_DEVICE_ADD",
						200,
						save,
						"Last device added successfully."
					);
				} else {
					return commonResponse.error(
						res,
						"DEFAULT_INTERNAL_SERVER_ERROR",
						400
					);
				}
			}
		} catch (error) {
			console.log("List RECEIPTS -> ", error);
			return commonResponse.CustomError(
				res,
				"DEFAULT_INTERNAL_SERVER_ERROR",
				500,
				{},
				error.message
			);
		}
	},

	get: async (req, res) => {
		try {
			let data = {};
			data = await Service.getByRegisteredId(req.params.id);
			if (data == null && data == undefined) {
				// console.log("Data1 ==>", data);
				data = await Service.findLastReceiptByMainRegisterId(
					req.user.main_register_id
				);
			}
			if (data) {
				return commonResponse.success(
					res,
					"LAST_DEVICE_DETAIL",
					200,
					data,
					"Success"
				);
			} else {
				return commonResponse.customResponse(
					res,
					"LAST_DEVICE_NOT_FOUND",
					400,
					{},
					"Receipts not found"
				);
			}
		} catch (error) {
			console.log("Get LAST DEVICE Detail -> ", error);
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
