const Service = require("./product_addons.services");
const Model = require("./product_addons.model");
const PricebookService = require("../product_price_books/product_price_books.services");
const ProductAddonGroupService = require("../product_addon_groups/product_addon_groups.services");

const { commonResponse, commonFunctions, nodemailer } = require("../../helper");
const fs = require("fs");
var csv = require("fast-csv");

module.exports = {
	/*
	 *  Add New Product Category
	 */
	add: async (req, res) => {
		try {
			let save = [];
			let checkExist = "";
			//Check duplicate
			let valueArr = req.body.map(function (item) {
				return item.addon_name;
			});
			let isDuplicate = valueArr.some(function (item, idx) {
				return valueArr.indexOf(item) != idx;
			});
			for (const p of req.body) {
				p.register_id = req.user.main_register_id;
				checkExist = await Service.checkExist({
					addon_name: {
						$regex: new RegExp("^" + p.addon_name + "$", "i"),
					},
					register_id: p.register_id,
				});
			}

			if (isDuplicate || checkExist) {
				return commonResponse.CustomError(
					res,
					"ALREADY_EXIST",
					400,
					{},
					"Unable to create product addon. Make sure the product addon does not already exist"
				);
			}

			for (const p of req.body) {
				p.register_id = req.user.main_register_id;
				save.push(await Service.save(p));
			}
			if (save) {
				return commonResponse.success(
					res,
					"PRODUCT_ADDONS_ADD",
					200,
					save,
					"Product Addons added successfully"
				);
			} else {
				return commonResponse.error(
					res,
					"DEFAULT_INTERNAL_SERVER_ERROR",
					400
				);
			}
		} catch (error) {
			console.log("Add Product Addons Category -> ", error);
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
					addon_name: clm[0],
					price: clm[1],
					sort_order: clm[2],
				})
			);
			let response = {},
				preview = [];
			let total_create = (total_update = total_errors = 0);

			response.headers = ["Addon Name", "Price", "Sort Order"];
			let csvheader = Object.values(data[0]);
			data.shift();
			let checkheader = response.headers.filter(
				(x) => csvheader.indexOf(x) === -1
			);

			let alladdon = await Service.list({
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
				if (!data[i].addon_name) {
					preview[i].errors.push("Addon name is required");
				}
				if (!data[i].price) {
					preview[i].errors.push("Price is required");
				}
				if (!parseInt(data[i].price) && data[i].price) {
					preview[i].errors.push("Price should be a number");
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
				let check = alladdon.find(
					(x) => x.addon_name == parseInt(data[i].addon_name)
				);
				if (check) {
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
					"ADDON_PREIVEW",
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
							addon_name: row.record.addon_name,
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
					subject: "Poster || Import Product addon",
					text: `Your Product addon are imported`,
					html: `<b>Product addon imported successfully</b><br>`,
				};
				nodemailer.sendMail(emailData);
				return commonResponse.success(
					res,
					"ADDON_IMPORT",
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
	 *  Export
	 */
	export: async (req, res) => {
		try {
			let list = await Service.export({
				register_id: req.user.main_register_id,
			});
			if (list.length > 0) {
				let file = "";
				if (req.body.type == "CSV") {
					const transformer = (doc) => {
						return {
							Addon_Name: doc.addon_name,
							Price: doc.price,
							Sort_Order: doc.sort_order,
						};
					};
					file = await commonFunctions.exportToCSV(
						"Product_Addon",
						transformer,
						list
					);
				}
				if (req.body.type == "XLSX") {
					const header = [
						{ header: "Addon_Name", key: "addon_name", width: 10 },
						{ header: "Price", key: "price", width: 30 },
						{ header: "Sort_Order", key: "sort_order", width: 30 },
					];
					file = await commonFunctions.exportToXLSX(
						"Product_Addon",
						header,
						list
					);
				}
				if (req.body.type == "PDF") {
					const header = [
						{ header: "Addon_Name", key: "addon_name" },
						{ header: "Price", key: "price" },
						{ header: "Sort_Order", key: "sort_order" },
					];
					file = await commonFunctions.exportToPDF(
						"Product_Addon",
						header,
						list
					);
				}

				if (file) {
					file = process.env.DOMAIN_URL + "/exports/" + file;
					let emailData = {
						to: req.body.email,
						subject: "Poster || Export Product addons",
						text: `Your addons report is ready for download`,
						html: `<b>Product addons</b><br><a href="${file}" target="_blank">Click here to download </a>`,
					};
					nodemailer.sendMail(emailData);
				}

				return commonResponse.success(
					res,
					"PRODUCT_ADDONS_EXPORT",
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
			console.log("List ProductAddons -> ", error);
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
	 *  List Product addon
	 */
	list: async (req, res, localCheck) => {
		try {
			req.query.register_id = req.user.main_register_id;
			let list = await Service.list(req.query);
			for (const k in list) {
				// console.log("k ==> ::", k);
				let checkintg = await ProductAddonGroupService.normalList({
					product_addons: { $in: [list[k]._id] },
				});
				if (checkintg.length > 0) {
					list[k].is_linked_to_addon_group = "Yes";
				} else {
					list[k].is_linked_to_addon_group = "No";
				}
			}
			if (list.length > 0) {
				if (localCheck == "local") {
					return list;
				} else {
					return commonResponse.success(
						res,
						"PRODUCT_ADDONS_LIST",
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
			console.log("List ProductAddons -> ", error);
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
	 *  List Product addon
	 */
	bypricebook: async (req, res) => {
		try {
			req.query.register_id = req.user.main_register_id;
			let list = await Service.list(req.query);
			let pricebook = await PricebookService.getById(req.params.pbookid);
			let addongroups = await ProductAddonGroupService.normalList(
				req.query
			);
			for (const key in list) {
				let g = [];
				for (const vg of addongroups) {
					let k = vg.product_addons.map((el) => el.toString());
					if (k.includes(list[key]._id.toString())) {
						g.push(vg.addon_group_name);
					}
				}
				list[key].addon_groups = g;
				let find = pricebook.addons.find(
					(x) => list[key]._id == x.addon_id
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
					"PRODUCT_ADDONS_LIST",
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
			console.log("List ProductAddons -> ", error);
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
	 *  Export by pricebook
	 */
	bypricebookexport: async (req, res) => {
		try {
			let q = { register_id: req.user.main_register_id };
			let list = await Service.list(q);
			let pricebook = await PricebookService.getById(req.params.pbookid);
			let addongroups = await ProductAddonGroupService.normalList(q);
			for (const key in list) {
				let g = [];
				for (const vg of addongroups) {
					let k = vg.product_addons.map((el) => el.toString());
					if (k.includes(list[key]._id.toString())) {
						g.push(vg.addon_group_name);
					}
				}
				list[key].addon_groups = g;
				list[key].addon_groups_string = g.join(",");
				let find = pricebook.addons.find(
					(x) => list[key]._id == x.addon_id
				);
				if (find) {
					if (find.price) {
						list[key].is_price_overridden = "Yes";
						list[key].price = find.price;
					}
					if (find.disable) {
						list[key].is_disabled = "Yes";
					} else {
						list[key].is_disabled = "No";
					}
				} else {
					list[key].is_disabled = "No";
				}
			}
			if (list.length > 0) {
				if (req.body.type == "CSV") {
					const transformer = (doc) => {
						return {
							Name: doc.addon_name,
							Price: doc.price,
							Addon_Group_Name: doc.addon_groups_string,
							Disabled: doc.is_disabled,
						};
					};
					file = await commonFunctions.exportToCSV(
						"Addon_Price_Book",
						transformer,
						list
					);
				}
				if (req.body.type == "XLSX") {
					const header = [
						{ header: "Name", key: "addon_name", width: 10 },
						{ header: "Price", key: "price", width: 30 },
						{
							header: "Addon_Group_Name",
							key: "addon_groups_string",
							width: 30,
						},
						{ header: "Disabled", key: "is_disabled", width: 30 },
					];
					file = await commonFunctions.exportToXLSX(
						"Addon_Price_Book",
						header,
						list
					);
				}
				if (req.body.type == "PDF") {
					const header = [
						{ header: "Name", key: "addon_name", width: 10 },
						{ header: "Price", key: "price", width: 30 },
						{
							header: "Addon_Group_Name",
							key: "addon_groups_string",
							width: 30,
						},
						{ header: "Disabled", key: "is_disabled", width: 30 },
					];
					file = await commonFunctions.exportToPDF(
						"Addon_Price_Book",
						header,
						list
					);
				}

				if (file) {
					file = process.env.DOMAIN_URL + "/exports/" + file;
					let emailData = {
						to: req.body.email,
						subject: "Poster || Export Addon Price Book",
						text: `Your Addon Price Book report is ready for download`,
						html: `<b>Addon Price Book</b><br><a href="${file}" target="_blank">Click here to download </a>`,
					};
					nodemailer.sendMail(emailData);
				}

				return commonResponse.success(
					res,
					"ADDON_PRICE_BOOKS_EXPORT",
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
			console.log("List ProductAddons -> ", error);
			return commonResponse.CustomError(
				res,
				"DEFAULT_INTERNAL_SERVER_ERROR",
				500,
				{},
				error.message
			);
		}
	},
	//-----
	bypricebookimportpreview: async (req, res) => {
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
					addon_name: clm[0],
					price: clm[1],
					disabled: clm[2],
				})
			);
			let response = {},
				preview = [];
			let total_create = (total_update = total_errors = 0);
			response.headers = ["Name", "Price", "Disabled"];
			let disabledvalues = ["yes", "no"];
			let csvheader = Object.values(data[0]);
			data.shift();
			console.log(csvheader);
			let checkheader = response.headers.filter(
				(x) => csvheader.indexOf(x) === -1
			);

			let alladdons = await Service.list({
				register_id: req.user.main_register_id,
			});
			console.log("alladdons-->", alladdons);

			for (const i in data) {
				preview[i] = { record: data[i] };
				preview[i].isValid = true;
				preview[i].errors = [];
				preview[i].isExisting = false;
				preview[i].isShow = true;
				data[i].disabled = data[i].disabled.toLowerCase();

				if (checkheader.length > 0) {
					for (const e of checkheader) {
						preview[i].errors.push(e + " is not specified");
					}
					preview[i].isShow = false;
				}
				if (!data[i].addon_name) {
					preview[i].errors.push("Addon Name is required");
				}

				if (!data[i].price) {
					preview[i].errors.push("Price is required");
				}

				if (
					!parseInt(data[i].price) &&
					data[i].price &&
					data[i].price != 0
				) {
					preview[i].errors.push("Price should be a number");
				}

				if (data[i].price && Math.sign(data[i].price) == -1) {
					preview[i].errors.push("Price not valid");
				}

				if (data[i].addon_name) {
					let checkexist = alladdons.find(
						(x) => x.addon_name == data[i].addon_name
					);
					if (!checkexist) {
						preview[i].errors.push("Item does not exist");
					} else {
						preview[i].isExisting = true;
					}
				}

				if (
					data[i].disabled &&
					!disabledvalues.includes(data[i].disabled)
				) {
					preview[i].errors.push("Disabled can either be YES or NO");
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
					"PRODUCT_PRICE_BOOK_PREIVEW",
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
	//----
	//==
	bypricebookimport: async (req, res) => {
		try {
			let data = req.body.previewData;

			let pricebook = await PricebookService.getById(req.params.pbookid);

			let alladdons = await Service.list({
				register_id: req.user.main_register_id,
			});

			for (const row of data) {
				//make update existing array
				if (row.isValid && row.isExisting) {
					let checkexist = alladdons.find(
						(x) => x.addon_name == row.record.addon_name
					);
					if (checkexist) {
						row.record.addon_id = checkexist._id.toString();
						row.record.disable =
							row.record.disabled == "yes" ? true : false;
						delete row.record.addon_name;
						let isexistindex = pricebook.addons.findIndex(
							(x) => x.addon_id == row.record.addon_id
						);
						if (isexistindex >= 0) {
							pricebook.addons[isexistindex].price =
								row.record.price;
							pricebook.addons[isexistindex].disable =
								row.record.disable;
						} else {
							pricebook.addons.push(row.record);
						}
					}
				}
			}

			if (pricebook.addons.length > 0) {
				let updateAddonPriceBooks = await PricebookService.update(
					req.params.pbookid,
					{ addons: pricebook.addons }
				);
			}

			if (data) {
				let emailData = {
					to: req.body.email,
					subject:
						"Poster || Import Addons Price Book for " +
						pricebook.price_book_name,
					text: `Your Addons Price Book are imported`,
					html: `<b>Addons Price Book imported successfully</b><br>`,
				};
				nodemailer.sendMail(emailData);
				return commonResponse.success(
					res,
					"ADDON_PRICE_BOOK_IMPORT",
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
	//==
	/*
	 *  Update Product Category
	 */
	update: async (req, res) => {
		try {
			req.body.register_id = req.user.main_register_id;
			let checkExist = await Service.checkExist({
				addon_name: {
					$regex: new RegExp("^" + req.body.addon_name + "$", "i"),
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
					"Unable to update product category. Make sure the category name does not already exist"
				);
			}
			let updateProductCategory = await Service.update(
				req.params.id,
				req.body
			);
			if (updateProductCategory) {
				return commonResponse.success(
					res,
					"PRODUCT_ADDONS_UPDATE",
					200,
					updateProductCategory,
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
			console.log("Update Product Addons -> ", error);
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
					"PRODUCT_ADDONS_DELETE",
					200,
					data,
					"Successfully deleted product addons"
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
			console.log("Delete Product Addons -> ", error);
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
				"product_addon_groups",
				req.body,
				"product_addons",
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
					"PRODUCT_ADDONS_DELETE",
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
	getProductAddons: async (req, res) => {
		try {
			let data = await Service.getById(req.params.id);
			if (data) {
				return commonResponse.success(
					res,
					"PRODUCT_ADDONS_DETAIL",
					200,
					data,
					"Success"
				);
			} else {
				return commonResponse.CustomError(
					res,
					"PRODUCT_ADDONS_NOT_FOUND",
					400,
					{},
					"Product Addons not found"
				);
			}
		} catch (error) {
			console.log("Get Product Addons Detail -> ", error);
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
