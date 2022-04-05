const Service = require("./taxes.services");
const TaxgroupService = require("../tax_groups/tax_groups.services");
const { commonResponse, commonFunctions } = require("../../helper");

module.exports = {
	/*
	 *  Add New Product Category
	 */
	add: async (req, res) => {
		try {
			req.body.register_id = req.user.main_register_id;
			let checkexist = await Service.list({
				tax_name: {
					$regex: new RegExp("^" + req.body.tax_name + "$", "i"),
				},
				register_id: req.body.register_id,
			});
			if (checkexist.length > 0) {
				return commonResponse.CustomError(
					res,
					"ALREADY_EXIST",
					400,
					{},
					req.body.tax_name + " already exist"
				);
			}
			let save = await Service.save(req.body);
			if (save) {
				return commonResponse.success(
					res,
					"TAXES_ADD",
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
			console.log("Add Taxes -> ", error);
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
	 *  List Product Category
	 */
	list: async (req, res, localCheck) => {
		try {
			console.log("Req.query =>", req.query);
			req.query.register_id = req.user.main_register_id;
			console.log("Req.query register_id ::  =>", req.query);
			let list = await Service.list(req.query);

			for (const k in list) {
				let checkintg = await TaxgroupService.list({
					taxes: { $in: [list[k]._id] },
				});
				if (checkintg.length > 0) {
					list[k].is_linked_to_tax_group = "Yes";
				} else {
					list[k].is_linked_to_tax_group = "No";
				}
			}
			if (list.length > 0) {
				// return commonResponse.success(
				// 	res,
				// 	"TAXES_LIST",
				// 	200,
				// 	list,
				// 	"Success"
				// );
				if (localCheck == "local") {
					return list;
				} else {
					return commonResponse.success(
						res,
						"TAXES_LIST",
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
			console.log("List Taxes -> ", error);
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
	 *  Update Product Category
	 */
	update: async (req, res) => {
		try {
			req.body.register_id = req.user.main_register_id;
			let checkexist = await Service.list({
				tax_name: {
					$regex: new RegExp("^" + req.body.tax_name + "$", "i"),
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
					req.body.tax_name + " already exist"
				);
			}
			let updateTaxes = await Service.update(req.params.id, req.body);
			if (updateTaxes) {
				return commonResponse.success(
					res,
					"TAXES_UPDATE",
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
			console.log("Update Taxes -> ", error);
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
	 *  Delete Product Category
	 */
	delete: async (req, res) => {
		try {
			let data = await Service.delete(req.params.id);
			if (data) {
				return commonResponse.success(
					res,
					"TAXES_DELETE",
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
			console.log("Delete Taxes -> ", error);
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
	 *  Get Product Category Detail
	 */
	getTaxes: async (req, res) => {
		try {
			req.body.register_id = req.user.main_register_id;
			let data = await Service.getById(req.params.id);
			if (data) {
				return commonResponse.success(
					res,
					"TAXES_DETAIL",
					200,
					data,
					"Success"
				);
			} else {
				return commonResponse.CustomError(
					res,
					"TAXES_NOT_FOUND",
					400,
					{},
					"Taxes not found"
				);
			}
		} catch (error) {
			console.log("Get TAXES Detail -> ", error);
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
				"tax_groups",
				req.body,
				"taxes",
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
			let data = await Service.deleteAll(req.body);
			if (data) {
				return commonResponse.success(
					res,
					"TAX_DELETE",
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
			console.log("Delete Tax -> ", error);
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
