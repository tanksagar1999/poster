const Service = require("./product_item_groups.services");
const { commonResponse, commonFunctions, nodemailer } = require("../../helper");

module.exports = {
	/*
	 *  Add New Product Category
	 */
	add: async (req, res) => {
		try {
			req.body.register_id = req.user.main_register_id;
			let save = await Service.save(req.body);
			if (save) {
				return commonResponse.success(
					res,
					"PRODUCT_ITEM_GROUPS_ADD",
					200,
					save,
					"Product Item Groups added successfully"
				);
			} else {
				return commonResponse.error(
					res,
					"DEFAULT_INTERNAL_SERVER_ERROR",
					400
				);
			}
		} catch (error) {
			console.log("Add Product Variant Group-> ", error);
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
			req.query.register_id = req.user.main_register_id;
			console.log("req.query =>", req.query);
			let list = await Service.list(req.query);
			if (list.length > 0) {
				if (localCheck == "local") {
					return list;
				} else {
					return commonResponse.success(
						res,
						"PRODUCT_ITEM_GROUPS_LIST",
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
			console.log("List Product Item_Group controller -> ", error);
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
			let updateProductVariantGroups = await Service.update(
				req.params.id,
				req.body
			);
			if (updateProductVariantGroups) {
				return commonResponse.success(
					res,
					"PRODUCT_ITEM_GROUPS_UPDATE",
					200,
					updateProductVariantGroups,
					"Successfully updated product item group"
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
			console.log("Update Product Item Groups -> ", error);
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
					"PRODUCT_ITEM_GROUPS_DELETE",
					200,
					data,
					"Successfully deleted product item group"
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
			console.log("Delete Product Item Groups -> ", error);
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
					"PRODUCT_ITEM_GROUPS_DELETE",
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
	 *  Get Product Category Detail
	 */
	getProductItemGroups: async (req, res) => {
		try {
			let data = await Service.getById(req.params.id);
			if (data) {
				return commonResponse.success(
					res,
					"PRODUCT_ITEM_GROUPS_DETAIL",
					200,
					data,
					"Success"
				);
			} else {
				return commonResponse.CustomError(
					res,
					"PRODUCT_ITEM_GROUPS_NOT_FOUND",
					400,
					{},
					"Product Item Groups not found"
				);
			}
		} catch (error) {
			console.log("Get Product Item Groups Detail -> ", error);
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
			req.query.register_id = req.user.main_register_id;
			let list = await Service.list(req.query);
			if (list.length > 0) {
				let file = "";
				list = await commonFunctions.changeDateFormat(
					list,
					"created_at"
				);

				if (req.body.type == "CSV") {
					const transformer = (doc) => {
						return {
							Item_group_name: doc.item_group_name,
							Products: doc.products,
							Created_at: doc.created_at,
						};
					};
					file = await commonFunctions.exportToCSV(
						"Product_Item_Groups",
						transformer,
						list
					);
				}
				if (req.body.type == "XLSX") {
					const header = [
						{
							header: "Item_group_name",
							key: "item_group_name",
							width: 10,
						},
						{ header: "Products", key: "products", width: 30 },
						{ header: "Created_at", key: "created_at", width: 30 },
					];
					file = await commonFunctions.exportToXLSX(
						"Product_Item_Groups",
						header,
						list
					);
				}
				if (req.body.type == "PDF") {
					const header = [
						{ header: "Item_group_name", key: "item_group_name" },
						{ header: "Products", key: "products" },
						{ header: "Created_at", key: "created_at" },
					];
					file = await commonFunctions.exportToPDF(
						"Product_Item_Groups",
						header,
						list
					);
				}

				if (file) {
					file = process.env.DOMAIN_URL + "/exports/" + file;
					let emailData = {
						to: req.body.email,
						subject: "Poster || Export Product Item Groups",
						text: `Your Product Item Groups report is ready for download`,
						html: `<b> Product Item Groups</b><br><a href="${file}" target="_blank">Click here to download </a>`,
					};
					nodemailer.sendMail(emailData);
				}

				return commonResponse.success(
					res,
					"PRODUCT_ITEM_GROUPS_EXPORT",
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
			console.log("Export Product Item Groups DETAIL -> ", error);
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
