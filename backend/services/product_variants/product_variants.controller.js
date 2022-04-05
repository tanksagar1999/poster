const Service = require("./product_variants.services");
const PricebookService = require("../product_price_books/product_price_books.services");
const VariantGroupService = require("../product_variant_groups/product_variant_groups.services");

const Model = require("./product_variants.model");
const { commonResponse, commonFunctions, nodemailer } = require("../../helper");

var csv = require("fast-csv");
var fs = require("fs");
const moment = require("moment");

module.exports = {
	/*
	 *  Add New Product Category
	 */
	add: async (req, res) => {
		try {
			let save = [];
			for (const p of req.body) {
				p.register_id = req.user.main_register_id;
				let checkExist = await Service.checkExist({
					variant_name: {
						$regex: new RegExp("^" + p.variant_name + "$", "i"),
					},
					comment: { $regex: new RegExp("^" + p.comment + "$", "i") },
					register_id: p.register_id,
				});
				if (checkExist) {
					return commonResponse.CustomError(
						res,
						"ALREADY_EXIST",
						400,
						{},
						p.variant_name + " variant already exist"
					);
				}
			}
			for (const p of req.body) {
				p.register_id = req.user.main_register_id;
				save.push(await Service.save(p));
			}
			if (save) {
				return commonResponse.success(
					res,
					"PRODUCT_VARIANTS_ADD",
					200,
					save,
					"Product Variant added successfully"
				);
			} else {
				return commonResponse.error(
					res,
					"DEFAULT_INTERNAL_SERVER_ERROR",
					400
				);
			}
		} catch (error) {
			console.log("Add Product Variants -> ", error);
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
					variant_name: clm[0],
					comment: clm[1],
					price: clm[2],
					sort_order: clm[3],
				})
			);
			let response = {},
				preview = [];
			let total_create = (total_update = total_errors = 0);

			response.headers = [
				"Variant Name",
				"Variant Comment",
				"Price",
				"Sort Order",
			];
			let csvheader = Object.values(data[0]);
			data.shift();
			let checkheader = response.headers.filter(
				(x) => csvheader.indexOf(x) === -1
			);

			let allvariants = await Service.list({
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

				if (!data[i].variant_name) {
					preview[i].isValid = false;
					preview[i].errors.push("Variant name is required");
				}
				// if(!data[i].comment){
				//     preview[i].errors.push("Variant Comment is required");
				// }
				if (
					data[i].comment &&
					data[i].comment.length < 3 &&
					data[i].comment.length > 60
				) {
					preview[i].errors.push(
						"Variant comment should be 3 to 60 chacters long"
					);
				}
				if (
					!parseInt(data[i].price) &&
					data[i].price &&
					data[i].price != 0
				) {
					preview[i].errors.push("Variant price should be a number");
				}
				if (data[i].price && Math.sign(data[i].price) == -1) {
					preview[i].errors.push("Price not valid");
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

				let checkvariant = allvariants.find(
					(x) =>
						x.variant_name == data[i].variant_name &&
						x.comment == data[i].comment
				);
				if (checkvariant) {
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
					"VARIANTS_PREIVEW",
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
	 *  Import product variant data
	 */
	import: async (req, res) => {
		try {
			let data = req.body.previewData;
			let insertData = [];
			for (const row of data) {
				row.record.register_id = req.user.main_register_id;

				//add new
				if (row.isValid && !row.isExisting) {
					insertData.push(row.record);
				}
				//update existing
				if (row.isValid && row.isExisting) {
					await Service.updateByCondition(
						{
							variant_name: row.record.variant_name,
							comment: row.record.comment,
							register_id: row.record.register_id,
						},
						row.record
					);
				}
			}

			if (insertData.length > 0) {
				await Service.saveMany(insertData);
			}
			if (data) {
				let emailData = {
					to: req.body.email,
					subject: "Poster || Import Product variants",
					text: `Your Product variants are imported`,
					html: `<b>Product variants imported successfully</b><br>`,
				};
				nodemailer.sendMail(emailData);
				return commonResponse.success(
					res,
					"VARIANT_IMPORT",
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

	/*
	 *  List Product Category
	 */
	list: async (req, res, localCheck) => {
		try {
			req.query.register_id = req.user.main_register_id;
			let list = await Service.list(req.query);
			// console.log("list ==>", list);
			for (const k in list) {
				// console.log("k ==> ::", k);
				let checkintg = await VariantGroupService.normalList({
					product_variants: { $in: [list[k]._id] },
				});
				if (checkintg.length > 0) {
					list[k].is_linked_to_variant_group = "Yes";
				} else {
					list[k].is_linked_to_variant_group = "No";
				}
			}
			if (list.length > 0) {
				if (localCheck == "local") {
					return list;
				} else {
					return commonResponse.success(
						res,
						"PRODUCT_VARIANTS_LIST",
						200,
						list,
						"Success"
					);
				}
			} else {
				if (localCheck == "local") {
					return list;
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
			console.log("List Product Variants -> ", error);
			return commonResponse.CustomError(
				res,
				"DEFAULT_INTERNAL_SERVER_ERROR",
				500,
				{},
				error.message
			);
		}
	},

	//get by price book
	bypricebook: async (req, res) => {
		try {
			req.query.register_id = req.user.main_register_id;
			let list = await Service.list(req.query);
			let pricebook = await PricebookService.getById(req.params.pbookid);
			let variantgroups = await VariantGroupService.normalList(req.query);
			for (const key in list) {
				let g = [];
				for (const vg of variantgroups) {
					let k = vg.product_variants.map((el) => el.toString());
					if (k.includes(list[key]._id.toString())) {
						g.push(vg.variant_group_name);
					}
				}

				list[key].variant_groups = g;
				let find = pricebook.variants.find(
					(x) => list[key]._id == x.variant_id
				);
				if (find) {
					if (find.price) {
						list[key].is_price_overridden = "Yes";
						list[key].price = find.price;
					}
					if (find.disable) {
						list[key].is_disabled = true;
					}
				}
			}
			if (list.length > 0) {
				return commonResponse.success(
					res,
					"PRODUCT_VARIANTS_LIST",
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
			console.log("List Product Variants -> ", error);
			return commonResponse.CustomError(
				res,
				"DEFAULT_INTERNAL_SERVER_ERROR",
				500,
				{},
				error.message
			);
		}
	},
	// export variant as per pricebook
	bypricebookexport: async (req, res) => {
		try {
			let q = { register_id: req.user.main_register_id };
			let list = await Service.list(q);
			let pricebook = await PricebookService.getById(req.params.pbookid);
			let variantgroups = await VariantGroupService.normalList(q);
			for (const key in list) {
				let g = [];
				for (const vg of variantgroups) {
					let k = vg.product_variants.map((el) => el.toString());
					if (k.includes(list[key]._id.toString())) {
						g.push(vg.variant_group_name);
					}
				}

				list[key].variant_groups = g;
				list[key].variant_groups_string = g.join(",");
				let find = pricebook.variants.find(
					(x) => list[key]._id == x.variant_id
				);
				if (find) {
					if (find.price) {
						list[key].is_price_overridden = "Yes";
						list[key].price = find.price;
					} else {
					}
					if (find.disable) {
						list[key].is_disabled = "Yes";
					} else {
						list[key].is_disabled = "No";
					}
				} else {
					list[key].is_price_overridden = "No";
					list[key].is_disabled = "No";
				}
			}
			if (list.length > 0) {
				if (req.body.type == "CSV") {
					const transformer = (doc) => {
						return {
							Name: doc.variant_name,
							Price: doc.price,
							Variant_Group_Name: doc.variant_groups_string,
							Disabled: doc.is_disabled,
						};
					};
					file = await commonFunctions.exportToCSV(
						"Variants_Price_Book",
						transformer,
						list
					);
				}
				if (req.body.type == "XLSX") {
					const header = [
						{ header: "Name", key: "variant_name", width: 10 },
						{ header: "Price", key: "price", width: 30 },
						{
							header: "Variant_Group_Name",
							key: "variant_groups_string",
							width: 30,
						},
						{ header: "Disabled", key: "is_disabled", width: 30 },
					];
					file = await commonFunctions.exportToXLSX(
						"Variants_Price_Book",
						header,
						list
					);
				}
				if (req.body.type == "PDF") {
					const header = [
						{ header: "Name", key: "variant_name", width: 10 },
						{ header: "Price", key: "price", width: 30 },
						{
							header: "Variant_Group_Name",
							key: "variant_groups_string",
							width: 30,
						},
						{ header: "Disabled", key: "is_disabled", width: 30 },
					];
					file = await commonFunctions.exportToPDF(
						"Variants_Price_Book",
						header,
						list
					);
				}

				if (file) {
					file = process.env.DOMAIN_URL + "/exports/" + file;
					let emailData = {
						to: req.body.email,
						subject: "Poster || Export Variant Price Book",
						text: `Your Variant Price Book report is ready for download`,
						html: `<b>Variant Price Book</b><br><a href="${file}" target="_blank">Click here to download </a>`,
					};
					nodemailer.sendMail(emailData);
				}

				return commonResponse.success(
					res,
					"VARIANT_PRICE_BOOKS_EXPORT",
					200,
					list,
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
			console.log("List Product Variants -> ", error);
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
			let checkExist = await Service.checkExist({
				variant_name: {
					$regex: new RegExp("^" + req.body.variant_name + "$", "i"),
				},
				comment: {
					$regex: new RegExp("^" + req.body.comment + "$", "i"),
				},
				register_id: req.body.register_id,
				_id: { $ne: req.params.id },
			});
			if (checkExist) {
				return commonResponse.CustomError(
					res,
					"ALREADY_EXIST",
					400,
					{},
					req.body.variant_name + " variant already exist"
				);
			}
			let updateProductCategory = await Service.update(
				req.params.id,
				req.body
			);
			if (updateProductCategory) {
				return commonResponse.success(
					res,
					"PRODUCT_VARIANTS_UPDATE",
					200,
					updateProductCategory,
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
			console.log("Update Product Variants -> ", error);
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
					"PRODUCT_VARIANTS_DELETE",
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
			console.log("Delete Product Variants -> ", error);
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
				"product_variant_groups",
				req.body,
				"product_variants",
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
					"PRODUCT_VARIANTS_DELETE",
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
			console.log("Delete Product Variants -> ", error);
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
	getProductVariants: async (req, res) => {
		try {
			let data = await Service.getById(req.params.id);
			if (data) {
				return commonResponse.success(
					res,
					"PRODUCT_VARIANTS_DETAIL",
					200,
					data,
					"Success"
				);
			} else {
				return commonResponse.CustomError(
					res,
					"PRODUCT_VARIANTS_NOT_FOUND",
					400,
					{},
					"Product variant not found"
				);
			}
		} catch (error) {
			console.log("Get Product Variants Detail -> ", error);
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
				//  list = await commonFunctions.changeDateFormat(list,'created_at');

				if (req.body.type == "CSV") {
					const transformer = (doc) => {
						return {
							Variant_name: doc.variant_name,
							Price: doc.price,
							Comment: doc.comment,
							Sort_order: doc.sort_order,
						};
					};
					file = await commonFunctions.exportToCSV(
						"Product_Variants",
						transformer,
						list
					);
				}
				if (req.body.type == "XLSX") {
					const header = [
						{
							header: "Variant_name",
							key: "variant_name",
							width: 10,
						},
						{
							header: "Price",
							key: "price",
							width: 30,
						},
						{
							header: "Comment",
							key: "comment",
							width: 30,
						},
						{
							header: "Sort_order",
							key: "sort_order",
							width: 30,
						},
					];
					file = await commonFunctions.exportToXLSX(
						"Product_Variants",
						header,
						list
					);
				}
				if (req.body.type == "PDF") {
					const header = [
						{
							header: "Variant_name",
							key: "variant_name",
						},
						{
							header: "Price",
							key: "price",
						},
						{
							header: "Comment",
							key: "comment",
						},
						{
							header: "Sort_order",
							key: "sort_order",
						},
					];
					file = await commonFunctions.exportToPDF(
						"Product_Variants",
						header,
						list
					);
				}

				if (file) {
					file = process.env.DOMAIN_URL + "/exports/" + file;
					let emailData = {
						to: req.body.email,
						subject: "Poster || Export Product Variants",
						text: `Your Product Variants report is ready for download`,
						html: `<b>Product Variants</b><br><a href="${file}" download>Click here to download </a>`,
					};
					nodemailer.sendMail(emailData);
				}

				return commonResponse.success(
					res,
					"PRODUCT_VARIANTS_EXPORT",
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
			console.log("Export Product Variants DETAIL -> ", error);
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
