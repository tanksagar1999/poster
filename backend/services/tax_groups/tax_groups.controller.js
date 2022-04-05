const Service = require("./tax_groups.services");
const { commonResponse, commonFunctions } = require("../../helper");

module.exports = {
	/*
	 *  Add New Tax Groups
	 */
	add: async (req, res) => {
		try {
			req.body.register_id = req.user.main_register_id;
			let checkexist = await Service.list({
				tax_group_name: {
					$regex: new RegExp(
						"^" + req.body.tax_group_name + "$",
						"i"
					),
				},
				register_id: req.body.register_id,
			});
			if (checkexist.length > 0) {
				return commonResponse.CustomError(
					res,
					"ALREADY_EXIST",
					400,
					{},
					req.body.tax_group_name + " already exist"
				);
			}
			let save = await Service.save(req.body);
			if (save) {
				return commonResponse.success(
					res,
					"TAX_GROUPS_ADD",
					200,
					save,
					"Taxes added successfully"
				);
			} else {
				return commonResponse.error(
					res,
					"DEFAULT_INTERNAL_SERVER_ERROR",
					400
				);
			}
		} catch (error) {
			console.log("Add Tax Groups -> ", error);
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
	 *  List Tax Groups
	 */
	list: async (req, res, localCheck) => {
		try {
			req.body.register_id = req.user.main_register_id;
			let list = await Service.list(req.query);
			if (list.length > 0) {
				if (localCheck == "local") {
					return list;
				} else {
					return commonResponse.success(
						res,
						"TAX_GROUPS_LIST",
						200,
						list,
						"Success"
					);
				}
			} else {
				if (localCheck == "local") {
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
			console.log("List Tax Groups -> ", error);
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
	 *  Update Tax Groups
	 */
	update: async (req, res) => {
		try {
			req.body.register_id = req.user.main_register_id;
			let checkexist = await Service.list({
				tax_group_name: {
					$regex: new RegExp(
						"^" + req.body.tax_group_name + "$",
						"i"
					),
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
					req.body.tax_group_name + " already exist"
				);
			}
			let updateTaxes = await Service.update(req.params.id, req.body);
			if (updateTaxes) {
				return commonResponse.success(
					res,
					"TAX_GROUPS_UPDATE",
					200,
					updateTaxes,
					"Successfully updated service"
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
			console.log("Update Tax Groups -> ", error);
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
	 *  Delete Tax Groups
	 */
	delete: async (req, res) => {
		try {
			let data = await Service.delete(req.params.id);
			if (data) {
				return commonResponse.success(
					res,
					"TAX_GROUPS_DELETE",
					200,
					data,
					"Successfully deleted service"
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
			console.log("Delete Tax Groups -> ", error);
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
			let check = await commonFunctions.checkDependecyOnDelete(
				"products",
				req.body,
				"tax_group",
				false
			);
			if (check) {
				return commonResponse.success(
					res,
					"ALREADY_IN_USE",
					200,
					{},
					"Could't process to delete data because items are associated with another module.please delete them first"
				);
			}
			check = await commonFunctions.checkDependecyOnDelete(
				"additional_charges",
				req.body,
				"tax_group",
				false
			);
			if (check) {
				return commonResponse.success(
					res,
					"ALREADY_IN_USE",
					200,
					{},
					"Could't process to delete data because items are associated with another module.please delete them first"
				);
			}
			let list = await Service.checkIsMain(req.body);
			if (list.length > 0) {
				return commonResponse.success(
					res,
					"CANT_DELETE_MAIN",
					200,
					{},
					"Could't process to delete main Zero Tax Group"
				);
			}
			let data = await Service.deleteAll(req.body);
			if (data) {
				return commonResponse.success(
					res,
					"TAX_GROUPS_DELETE",
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
			console.log("Delete Tax Groups -> ", error);
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
	 *  Get Tax Groups Detail
	 */
	getTaxGroups: async (req, res) => {
		try {
			let data = await Service.getById(req.params.id);
			if (data) {
				return commonResponse.success(
					res,
					"TAX_GROUPS_DETAIL",
					200,
					data,
					"Success"
				);
			} else {
				return commonResponse.CustomError(
					res,
					"TAX_GROUPS_NOT_FOUND",
					400,
					{},
					"Tax Groups not found"
				);
			}
		} catch (error) {
			console.log("Get Tax Groups Detail -> ", error);
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
