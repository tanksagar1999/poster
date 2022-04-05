const Service = require("./additional_charges.services");
const { commonResponse, commonFunctions } = require("../../helper");

module.exports = {
	/*
	 *  Add Additional charges
	 */
	add: async (req, res) => {
		try {
			req.body.register_id = req.user.main_register_id;
			let checkexist = await Service.list({
				charge_name: {
					$regex: new RegExp("^" + req.body.charge_name + "$", "i"),
				},
				register_id: req.body.register_id,
			});
			if (checkexist.length > 0) {
				return commonResponse.CustomError(
					res,
					"ALREADY_EXIST",
					400,
					{},
					req.body.charge_name + " already exist"
				);
			}
			let save = await Service.save(req.body);
			if (save) {
				return commonResponse.success(
					res,
					"ADDITIONAL_CHARGES_ADD",
					200,
					save,
					"Additional charges added successfully"
				);
			} else {
				return commonResponse.error(
					res,
					"DEFAULT_INTERNAL_SERVER_ERROR",
					400
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
	 *  List Additional charges
	 */
	list: async (req, res, localcheck) => {
		try {
			// console.log("req=>>1234", req);
			req.body.register_id = req.user.main_register_id;
			let list = await Service.list(req.query);
			if (list.length > 0) {
				if (localcheck == "local") {
					return list;
				} else {
					return commonResponse.success(
						res,
						"ADDITIONAL_CHARGES_LIST",
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
	 *  Update Additional charges
	 */
	update: async (req, res) => {
		try {
			req.body.register_id = req.user.main_register_id;
			let checkexist = await Service.list({
				charge_name: {
					$regex: new RegExp("^" + req.body.charge_name + "$", "i"),
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
					req.body.charge_name + " already exist"
				);
			}
			let updateAdditionalCharges = await Service.update(
				req.params.id,
				req.body
			);
			if (updateAdditionalCharges) {
				return commonResponse.success(
					res,
					"ADDITIONAL_CHARGES_UPDATE",
					200,
					updateAdditionalCharges,
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
			console.log("Update Additional charges -> ", error);
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
	 *  Delete Additional charges
	 */
	delete: async (req, res) => {
		try {
			let data = await Service.delete(req.params.id);
			if (data) {
				return commonResponse.success(
					res,
					"ADDITIONAL_CHARGES_DELETE",
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
			console.log("Delete Additional charges -> ", error);
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
					"ADDITIONAL_CHARGES_DELETE",
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
	 *  Get Additional charges Detail
	 */
	get: async (req, res) => {
		try {
			let data = await Service.getById(req.params.id);
			if (data) {
				return commonResponse.success(
					res,
					"ADDITIONAL_CHARGES_DETAIL",
					200,
					data,
					"Success"
				);
			} else {
				return commonResponse.CustomError(
					res,
					"ADDITIONAL_CHARGES_NOT_FOUND",
					400,
					{},
					"Additional charges not found"
				);
			}
		} catch (error) {
			console.log("Get Additional charges Detail -> ", error);
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
