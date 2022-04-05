const Service = require("./product_variant_groups.services");
const variantService = require("../product_variants/product_variants.services");
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
					"PRODUCT_VARIANT_GROUPS_ADD",
					200,
					save,
					"Product Variant Groups added successfully"
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
	list: async (req, res) => {
		try {
			req.query.register_id = req.user.main_register_id;
			let list = await Service.list(req.query);
			if (list.length > 0) {
				return commonResponse.success(
					res,
					"PRODUCT_VARIANT_GROUPS_LIST",
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
			console.log("List Product Variant Group -> ", error);
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
					"PRODUCT_VARIANT_GROUPS_UPDATE",
					200,
					updateProductVariantGroups,
					"Successfully updated product variant"
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
			console.log("Update Product Variant Groups -> ", error);
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
					"PRODUCT_VARIANT_GROUPS_DELETE",
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
			console.log("Delete Product Variant Groups -> ", error);
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
				"option_variant_group",
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
					"PRODUCT_VARIANT_GROUPS_DELETE",
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
	getProductVariantGroups: async (req, res) => {
		try {
			let data = await Service.getById(req.params.id);
			if (data) {
				return commonResponse.success(
					res,
					"PRODUCT_VARIANT_GROUPS_DETAIL",
					200,
					data,
					"Success"
				);
			} else {
				return commonResponse.CustomError(
					res,
					"PRODUCT_VARIANT_GROUPS_NOT_FOUND",
					400,
					{},
					"Product variant not found"
				);
			}
		} catch (error) {
			console.log("Get Product Variants Groups Detail -> ", error);
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
			let list = await Service.export(req.query);
			if (list.length > 0) {
				let file = "";
				list = await commonFunctions.changeDateFormat(
					list,
					"created_at"
				);
				if (req.body.type == "CSV") {
					const transformer = (doc) => {
						return {
							Variant_group_name: doc.variant_group_name,
							Variant_name: doc.variant_name,
							Variant_Comments: doc.variant_comment,
							Sort_order: doc.sort_order,
						};
					};
					file = await commonFunctions.exportToCSV(
						"Product_Variant_Groups",
						transformer,
						list
					);
				}
				if (req.body.type == "XLSX") {
					const header = [
						{
							header: "Variant_group_name",
							key: "variant_group_name",
							width: 10,
						},
						{
							header: "Variant_name",
							key: "variant_name",
							width: 30,
						},
						{
							header: "Variant_Comments",
							key: "variant_comment",
							width: 30,
						},
						{ header: "Sort_order", key: "sort_order", width: 30 },
					];
					file = await commonFunctions.exportToXLSX(
						"Product_Variant_Groups",
						header,
						list
					);
				}
				if (req.body.type == "PDF") {
					const header = [
						{
							header: "Variant_group_name",
							key: "variant_group_name",
						},
						{ header: "Variant_name", key: "variant_name" },
						{ header: "Variant_Comments", key: "variant_comment" },
						{ header: "Sort_order", key: "sort_order" },
					];
					file = await commonFunctions.exportToPDF(
						"Product_Variant_Groups",
						header,
						list
					);
				}

				if (file) {
					file = process.env.DOMAIN_URL + "/exports/" + file;
					let emailData = {
						to: req.body.email,
						subject: "Poster || Export Product Variant Groups",
						text: `Your Product Variant Groups report is ready for download`,
						html: `<b>Product Variant Groups</b><br><a href="${file}" target="_blank">Click here to download </a>`,
					};
					nodemailer.sendMail(emailData);
				}

				return commonResponse.success(
					res,
					"PRODUCT_VARIANT_GROUPS_EXPORT",
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
			console.log("Export Product Variant Groups DETAIL -> ", error);
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
	 *  Import preview
	 */
	preview: async (req, res) => {
		try {
			var save = false;
			if (req.files.csvfile) {
				if (
					req.files.csvfile[0].mimetype != "text/csv" &&
					req.files.csvfile[0].mimetype != "application/vnd.ms-excel"
				) {
					await commonFunctions.removeFile(
						"imports/" + req.files.csvfile[0].filename
					);
					return commonResponse.customResponse(
						res,
						"INVALID_FILE",
						400,
						[],
						"Please Upload CSV file only"
					);
				}
			} else {
				return commonResponse.customResponse(
					res,
					"INVALID_FILE",
					400,
					[],
					"Please Upload CSV file"
				);
			}
			let csvfile = req.files.csvfile[0].path;
			const data = await commonFunctions.readCsv(
				csvfile,
				{ skipRows: 0 },
				(clm) => ({
					variant_group_name: clm[0],
					variant_name: clm[1],
					variant_comment: clm[2],
					sort_order: clm[3],
				})
			);
			let response = {},
				preview = [];
			let total_create = (total_update = total_errors = 0);

			response.headers = [
				"Variant Group Name",
				"Variant Name",
				"Variant Comment",
				"Sort Order",
			];
			let csvheader = Object.values(data[0]);
			data.shift();
			let checkheader = response.headers.filter(
				(x) => csvheader.indexOf(x) === -1
			);

			// var uniques = data.map(function(value,i,a) {
			//         return a.filter((v) => v.variant_group_name ==value.variant_group_name );
			// });

			let allvariants = await variantService.list({
				register_id: req.user.main_register_id,
			});
			let allvariantgroups = await Service.list({
				register_id: req.user.main_register_id,
			});

			for (const i in data) {
				preview[i] = { record: data[i] };
				preview[i].isValid = true;
				preview[i].errors = [];
				preview[i].isExisting = false;
				preview[i].isShow = true;

				if (checkheader.length > 0) {
					for (const e of checkheader) {
						preview[i].errors.push(e + " is not specified");
					}
					preview[i].isShow = false;
				}
				if (!data[i].variant_group_name) {
					preview[i].errors.push("Variant Group Name is required");
				}
				if (!data[i].variant_name) {
					preview[i].errors.push("Variant Name is required");
				}

				// if(!data[i].variant_comment){
				//     preview[i].errors.push("Variant Comment is required");
				// }
				if (
					data[i].variant_comment &&
					data[i].variant_comment.length < 3 &&
					data[i].variant_comment.length > 60
				) {
					preview[i].errors.push(
						"Variant comment should be 3 to 60 chacters long"
					);
				}
				// if(data[i].variant_comment && data[i].variant_comment.length<3){
				//     preview[i].errors.push("Variant Comment is required");
				// }

				if (data[i].variant_name) {
					let checkvariant = allvariants.find(
						(x) =>
							x.variant_name == data[i].variant_name &&
							x.comment == data[i].variant_comment
					);
					if (!checkvariant) {
						preview[i].errors.push("Variant does not exists");
					}
				}

				if (
					!parseInt(data[i].sort_order) &&
					data[i].sort_order &&
					data[i].sort_order != 0
				) {
					preview[i].errors.push("Sort order should be a number");
				}
				if (data[i].sort_order && Math.sign(data[i].sort_order) == -1) {
					preview[i].errors.push("Sort order not valid");
				}
				let checkexist = allvariantgroups.find(
					(x) => x.variant_group_name == data[i].variant_group_name
				);
				if (checkexist) {
					preview[i].isExisting = true;
				}
				preview[i].isValid =
					preview[i].errors.length > 0 ? false : true;

				if (
					preview[i].isValid &&
					preview[i].errors.length == 0 &&
					!preview[i].isExisting
				) {
					total_create++;
				}
				if (
					preview[i].isValid &&
					preview[i].errors.length == 0 &&
					preview[i].isExisting
				) {
					total_update++;
				}
				if (preview[i].errors.length > 0) {
					total_errors = total_errors + preview[i].errors.length;
				}
			}
			response.preview = preview;
			response.total_create = total_create;
			response.total_update = total_update;
			response.total_errors = total_errors;
			if (response) {
				await commonFunctions.removeFile(
					"imports/" + req.files.csvfile[0].filename
				);
				return commonResponse.success(
					res,
					"VARINAT_GROUP_PREIVEW",
					200,
					response,
					"Success"
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
	 *  Import product addon data
	 */
	import: async (req, res) => {
		try {
			let data = req.body.previewData;
			let insertData = [],
				updateData = [];

			let allvariants = await variantService.list({
				register_id: req.user.main_register_id,
			});
			let allvariantgroups = await Service.normalList({
				register_id: req.user.main_register_id,
			});

			for (const row of data) {
				row.record.register_id = req.user.main_register_id;
				row.record.sort_order = row.record.sort_order
					? row.record.sort_order
					: 0;

				//make add new array
				if (row.isValid && !row.isExisting) {
					let getvariantid = allvariants.find(
						(x) =>
							x.variant_name == row.record.variant_name &&
							x.comment == row.record.variant_comment
					);
					row.record.product_variants = getvariantid._id;
					insertData.push(row.record);
				}
				//make update existing array
				if (row.isValid && row.isExisting) {
					let checkexist = allvariantgroups.find(
						(x) =>
							x.variant_group_name ==
							row.record.variant_group_name
					);
					if (checkexist) {
						let getvariantid = allvariants.find(
							(x) =>
								x.variant_name == row.record.variant_name &&
								x.comment == row.record.variant_comment
						);
						let alreadyhavevariant =
							checkexist.product_variants.find(
								(x) =>
									x.toString() == getvariantid._id.toString()
							);
						if (!alreadyhavevariant) {
							row.record.product_variants =
								checkexist.product_variants;
							row.record.product_variants.push(getvariantid._id);
						}
						updateData.push(row.record);
					}
				}
			}

			//update
			if (updateData.length > 0) {
				for (const row of updateData) {
					await Service.updateByCondition(
						{
							variant_group_name: row.variant_group_name,
							register_id: row.register_id,
						},
						row
					);
				}
			}

			//add new
			if (insertData.length > 0) {
				var seen = {};

				//merge muliple variant for single group
				insertData = insertData.filter(function (entry) {
					var previous;
					if (seen.hasOwnProperty(entry.variant_group_name)) {
						previous = seen[entry.variant_group_name];

						previous.product_variants.push(entry.product_variants);
						previous.product_variants =
							previous.product_variants.filter(function (
								item,
								i,
								ar
							) {
								return ar.indexOf(item) === i;
							});
						return false;
					}
					if (!Array.isArray(entry.product_variants)) {
						entry.product_variants = [entry.product_variants];
					}
					seen[entry.variant_group_name] = entry;
					return true;
				});
				await Service.saveMany(insertData);
			}
			if (data) {
				let emailData = {
					to: req.body.email,
					subject: "Poster || Import Product variant group",
					text: `Your Product variant group are imported`,
					html: `<b>Product variant group imported successfully</b><br>`,
				};
				nodemailer.sendMail(emailData);
				return commonResponse.success(
					res,
					"VARINAT_GROUP_IMPORT",
					200,
					{},
					"Successfully Imported"
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
