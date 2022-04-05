const Service = require("./products.services");
const { commonResponse, commonFunctions, nodemailer } = require("../../helper");
const itemGroupsService = require("../product_item_groups/product_item_groups.services");
const addonGroupsService = require("../product_addon_groups/product_addon_groups.services");
const productcategoryService = require("../product_category/product_category.services");
const variantGroupService = require("../product_variant_groups/product_variant_groups.services");
const taxGroupService = require("../tax_groups/tax_groups.services");
const PricebookService = require("../product_price_books/product_price_books.services");

module.exports = {
	/*
	 *  Add New
	 */
	add: async (req, res) => {
		try {
			let save = [];
			req.body.register_id = req.user.main_register_id;

			for (const product of req.body) {
				let checkproduct = await Service.list({
					product_name: product.product_name,
					register_id: req.body.register_id,
				});
				if (checkproduct.length > 0) {
					return commonResponse.CustomError(
						res,
						"PRODUCT_EXIST",
						400,
						{},
						product.product_name + " already exist in products"
					);
				} else {
					product.register_id = req.body.register_id;
					save.push(await Service.save(product));
				}
			}
			if (save) {
				return commonResponse.success(
					res,
					"PRODUCTS_ADD",
					200,
					save,
					"Product added successfully"
				);
			} else {
				return commonResponse.error(
					res,
					"DEFAULT_INTERNAL_SERVER_ERROR",
					400
				);
			}
		} catch (error) {
			console.log("Add PRODUCTS -> ", error);
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
			req.body.register_id = req.user.main_register_id;

			let list = await Service.list(req.query, localCheck);
			if (list.length > 0) {
				for (const i in list) {
					if (list[i].option_status) {
						if (list[i].option_status == "combo") {
							list[i].product_option = {
								option_addon_group: list[i].option_addon_group
									? list[i].option_addon_group
									: [],
								option_item_group: list[i].option_item_group
									? list[i].option_item_group
									: [],
							};
						} else {
							list[i].product_option = {
								option_addon_group: list[i].option_addon_group
									? list[i].option_addon_group
									: [],
								option_variant_group: list[i]
									.option_variant_group
									? list[i].option_variant_group
									: [],
							};
						}
					} else {
						list[i].product_option = {};
					}
				}
				let data = {};
				let totalproducts = await Service.getTotalNumberOfProducts(
					req.query
				);
				data["total_counts"] = totalproducts;
				data["total_pages"] = Math.ceil(
					totalproducts / parseInt(req.query.limit)
				);
				data["current_page"] = parseInt(req.query.page);

				if (localCheck == "local") {
					return list;
				} else {
					let responce = {
						error: false,
						message: "Success",
						statusCode: 200,
						messageCode: "PRODUCTS_LIST",
						data: list,
						pagination: data,
					};
					return commonResponse.customSuccess(res, responce);
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
			console.log("List PRODUCTS -> ", error);
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
	bypricebook: async (req, res) => {
		try {
			req.body.register_id = req.user.main_register_id;

			let list = await Service.list(req.query);
			let pricebook = await PricebookService.getById(req.params.pbookid);
			if (list.length > 0) {
				for (const i in list) {
					if (list[i].option_status) {
						if (list[i].option_status == "combo") {
							list[i].product_option = {
								option_addon_group: list[i].option_addon_group
									? list[i].option_addon_group
									: [],
								option_item_group: list[i].option_item_group
									? list[i].option_item_group
									: [],
							};
						} else {
							list[i].product_option = {
								option_addon_group: list[i].option_addon_group
									? list[i].option_addon_group
									: [],
								option_variant_group: list[i]
									.option_variant_group
									? list[i].option_variant_group
									: [],
							};
						}
					} else {
						list[i].product_option = {};
					}

					//check if exist in pricebook
					let find = pricebook?.products?.find(
						(x) => list[i]._id == x.product_id
					);
					if (find) {
						if (find.price) {
							list[i].is_price_overridden = "Yes";
							list[i].price = find.price;
						}
						if (find.disable) {
							list[i].is_disabled = true;
						}
					}
				}
				let data = {};
				let totalproducts = await Service.getTotalNumberOfProducts(
					req.query
				);
				data["total_counts"] = totalproducts;
				data["total_pages"] = Math.ceil(
					totalproducts / parseInt(req.query.limit)
				);
				data["current_page"] = parseInt(req.query.page);
				let responce = {
					error: false,
					message: "Success",
					statusCode: 200,
					messageCode: "PRODUCTS_LIST",
					data: list,
					pagination: data,
				};

				return commonResponse.customSuccess(res, responce);
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
			console.log("List PRODUCTS -> ", error);
			return commonResponse.CustomError(
				res,
				"DEFAULT_INTERNAL_SERVER_ERROR",
				500,
				{},
				error.message
			);
		}
	},

	bypricebookexport: async (req, res) => {
		try {
			let q = { register_id: req.user.main_register_id };
			let list = await Service.list(q);
			let pricebook = await PricebookService.getById(req.params.pbookid);
			if (list.length > 0) {
				for (const i in list) {
					list[i].category = list[i].product_category.category_name;
					if (list[i].option_status) {
						if (list[i].option_status == "combo") {
							list[i].product_option = {
								option_addon_group: list[i].option_addon_group
									? list[i].option_addon_group
									: [],
								option_item_group: list[i].option_item_group
									? list[i].option_item_group
									: [],
							};
						} else {
							list[i].product_option = {
								option_addon_group: list[i].option_addon_group
									? list[i].option_addon_group
									: [],
								option_variant_group: list[i]
									.option_variant_group
									? list[i].option_variant_group
									: [],
							};
						}
					} else {
						list[i].product_option = {};
					}

					//check if existin pricebook
					let find = pricebook.products.find(
						(x) => list[i]._id == x.product_id
					);
					if (find) {
						if (find.price) {
							list[i].is_price_overridden = "Yes";
							list[i].price = find.price;
						}
						if (find.disable) {
							list[i].is_disabled = "Yes";
						} else {
							list[i].is_disabled = "No";
						}
					} else {
						list[i].is_price_overridden = "No";
						list[i].is_disabled = "No";
					}
				}
				if (req.body.type == "CSV") {
					const transformer = (doc) => {
						return {
							Name: doc.product_name,
							Price: doc.price,
							Category: doc.category,
							Disabled: doc.is_disabled,
						};
					};
					file = await commonFunctions.exportToCSV(
						"Product_Price_Book",
						transformer,
						list
					);
				}
				if (req.body.type == "XLSX") {
					const header = [
						{ header: "Name", key: "product_name", width: 10 },
						{ header: "Price", key: "price", width: 30 },
						{ header: "Category", key: "category", width: 30 },
						{ header: "Disabled", key: "is_disabled", width: 30 },
					];
					file = await commonFunctions.exportToXLSX(
						"Product_Price_Book",
						header,
						list
					);
				}
				if (req.body.type == "PDF") {
					const header = [
						{ header: "Name", key: "product_name", width: 10 },
						{ header: "Price", key: "price", width: 30 },
						{ header: "Category", key: "category", width: 30 },
						{ header: "Disabled", key: "is_disabled", width: 30 },
					];
					file = await commonFunctions.exportToPDF(
						"Product_Price_Book",
						header,
						list
					);
				}

				if (file) {
					file = process.env.DOMAIN_URL + "/exports/" + file;
					let emailData = {
						to: req.body.email,
						subject: "Poster || Export Product Price Book",
						text: `Your Product Price Book report is ready for download`,
						html: `<b>Product Price Book</b><br><a href="${file}" target="_blank">Click here to download </a>`,
					};
					nodemailer.sendMail(emailData);
				}

				return commonResponse.success(
					res,
					"PRODUCT_PRICE_BOOKS_EXPORT",
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
			console.log("List PRODUCTS -> ", error);
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
					product_name: clm[0],
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

			let allproduct = await Service.customFind({
				register_id: req.user.main_register_id,
			});

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
				if (!data[i].product_name) {
					preview[i].errors.push("Product Name is required");
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

				if (data[i].product_name) {
					let checkexist = allproduct.find(
						(x) => x.product_name == data[i].product_name
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

			let allproduct = await Service.customFind({
				register_id: req.user.main_register_id,
			});

			for (const row of data) {
				//make update existing array
				if (row.isValid && row.isExisting) {
					let checkexist = allproduct.find(
						(x) => x.product_name == row.record.product_name
					);
					if (checkexist) {
						row.record.product_id = checkexist._id.toString();
						row.record.disabled =
							row.record.disabled == "yes" ? true : false;
						delete row.record.product_name;
						let isexistindex = pricebook.products.findIndex(
							(x) => x.product_id == row.record.product_id
						);
						if (isexistindex >= 0) {
							pricebook.products[isexistindex].price =
								row.record.price;
							pricebook.products[isexistindex].disable =
								row.record.disabled;
						} else {
							pricebook.products.push(row.record);
						}
					}
				}
			}

			if (pricebook.products.length > 0) {
				let updateProductPriceBooks = await PricebookService.update(
					req.params.pbookid,
					{ products: pricebook.products }
				);
			}

			if (data) {
				let emailData = {
					to: req.body.email,
					subject:
						"Poster || Import Products Price Book for " +
						pricebook.price_book_name,
					text: `Your Products Price Book are imported`,
					html: `<b>Products Price Book imported successfully</b><br>`,
				};
				nodemailer.sendMail(emailData);
				return commonResponse.success(
					res,
					"PRODUCT_PRICE_BOOK_IMPORT",
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
	 *  List
	 */
	listwithfilter: async (req, res) => {
		try {
			req.body.register_id = req.user.main_register_id;
			let list = await Service.listwithfilter(req.body);
			if (list.length > 0) {
				for (const i in list) {
					if (list[i].option_status) {
						if (list[i].option_status == "combo") {
							list[i].product_option = {
								option_addon_group: list[i].option_addon_group
									? list[i].option_addon_group
									: [],
								option_item_group: list[i].option_item_group
									? list[i].option_item_group
									: [],
							};
						} else {
							list[i].product_option = {
								option_addon_group: list[i].option_addon_group
									? list[i].option_addon_group
									: [],
								option_variant_group: list[i]
									.option_variant_group
									? list[i].option_variant_group
									: [],
							};
						}
					} else {
						list[i].product_option = {};
					}
				}
				let data = {};
				let totalproducts =
					await Service.getTotalNumberOfProductsForfilter(req.body);
				data["total_counts"] = totalproducts;
				data["total_pages"] = Math.ceil(
					totalproducts / parseInt(req.body.limit)
				);
				data["current_page"] = parseInt(req.body.page);
				let responce = {
					error: false,
					message: "Success",
					statusCode: 200,
					messageCode: "PRODUCTS_LIST",
					data: list,
					pagination: data,
				};
				return commonResponse.customSuccess(res, responce);
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
			console.log("List PRODUCTS -> ", error);
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
	 *  get Combo
	 */
	//  getCombo: async (req, res) => {
	//     try {
	//         req.query.register_id = req.user.main_register_id;
	//         let addongroups = await addonGroupsService.list({register_id:req.query.register_id});
	//         let itemsgroups = await itemGroupsService.list({register_id:req.query.register_id});
	//         let combine = Array;
	//         combine['addon_groups'] = addongroups;
	//         combine['items_groups'] = addongroups;
	//         if ( itemsgroups.length > 0 ) {
	//             return commonResponse.success(res, "PRODUCTS_LIST", 200, addongroups, 'Success');
	//         } else {
	//             return commonResponse.success(res, "NO_DATA_FOUND", 200, [], 'No Data Found');
	//         }
	//     } catch (error) {
	//         console.log("List PRODUCTS -> ", error);
	//         return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
	//     }
	// },

	/*
	 *  Update
	 */
	update: async (req, res) => {
		try {
			req.body.register_id = req.user.main_register_id;
			let updateProduct = false;
			let checkproduct = await Service.customFind({
				product_name: req.body.product_name.toLowerCase(),
				register_id: req.body.register_id,
				_id: { $ne: req.params.id },
			});
			if (checkproduct.length > 0) {
				return commonResponse.CustomError(
					res,
					"PRODUCT_EXIST",
					400,
					{},
					req.body.product_name + " already exist in products"
				);
			} else {
				if (req.body.option_status == "combo") {
					req.body.option_variant_group = [];
					req.body.option_addon_group =
						req.body.option_addon_group.length > 0
							? req.body.option_addon_group
							: [];
				}
				updateProduct = await Service.update(req.params.id, req.body);
			}
			if (updateProduct) {
				return commonResponse.success(
					res,
					"PRODUCTS_UPDATE",
					200,
					updateProduct,
					"Successfully updated Product"
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
			console.log("Update PRODUCTS -> ", error);
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
					"PRODUCTS_DELETE",
					200,
					data,
					"Successfully deleted product"
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
			console.log("Delete Product -> ", error);
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
			// let check = await commonFunctions.checkDependecyOnDelete("product_item_groups",req.body,'products',false);
			// if(check){
			//     return commonResponse.success(res, "ALREADY_IN_USE", 200, {}, "Could't process to delete data because items are associated with another module.please delete them first");
			// }
			let data = await Service.deleteAll(req.body);
			if (data) {
				return commonResponse.success(
					res,
					"PRODUCTS_DELETE",
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
	getProducts: async (req, res) => {
		try {
			let data = await Service.getById(req.params.id);
			let checkOnItemGroup = await itemGroupsService.list({
				products: { $in: [req.params.id] },
				register_id: req.user.main_register_id,
			});
			data["is_combo"] = checkOnItemGroup.length > 0 ? false : true;
			let addongroups = await addonGroupsService.customlist(
				{ register_id: req.user.main_register_id },
				"addon_group_name"
			);
			let itemsgroups = await itemGroupsService.list(
				{ register_id: req.user.main_register_id },
				"item_group_name"
			);

			let haveinitem = await itemGroupsService.list(
				{
					register_id: req.user.main_register_id,
					products: { $in: [req.params.id] },
				},
				"item_group_name"
			);
			data["having_on_item_group"] = haveinitem.length > 0 ? true : false;
			data["combo_list"] =
				data.option_status == "combo"
					? { addon_groups: addongroups, items_groups: itemsgroups }
					: { addon_groups: addongroups, items_groups: [] };
			if (data) {
				return commonResponse.success(
					res,
					"PRODUCTS_DETAIL",
					200,
					data,
					"Success"
				);
			} else {
				return commonResponse.CustomError(
					res,
					"PRODUCTS_NOT_FOUND",
					400,
					{},
					"Products not found"
				);
			}
		} catch (error) {
			console.log("Get Products Detail -> ", error);
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
				// let file = "";
				// list = await commonFunctions.changeDateFormat(list,'created_at');
				for (const i in list) {
					list[i].product_category =
						list[i].product_category.category_name;
					list[i].tax_group = list[i].tax_group.tax_group_name;
					list[i].notes = list[i].notes ? list[i].notes : "";
					list[i].unit_of_measure = list[i].notes
						? list[i].unit_of_measure
						: "";
					list[i].product_code = list[i].product_code
						? list[i].product_code
						: "";
					list[i].register_name = list[i].register_id
						? list[i].register_id.register_name
						: "";
					list[i].variant_group_1 =
						list[i].option_variant_group.length > 0
							? list[i].option_variant_group[0].variant_group_name
							: "";
					list[i].variant_group_2 =
						list[i].option_variant_group.length > 1
							? list[i].option_variant_group[1].variant_group_name
							: "";
					list[i].variant_group_3 =
						list[i].option_variant_group.length > 2
							? list[i].option_variant_group[2].variant_group_name
							: "";
					list[i].addon_group_1 =
						list[i].option_addon_group.length > 0
							? list[i].option_addon_group[0].addon_group_name
							: "";
					list[i].addon_group_2 =
						list[i].option_addon_group.length > 1
							? list[i].option_addon_group[1].addon_group_name
							: "";
					list[i].addon_group_3 =
						list[i].option_addon_group.length > 2
							? list[i].option_addon_group[2].addon_group_name
							: "";
					list[i].sort_order = list[i].sort_order
						? list[i].sort_order
						: "";
				}

				if (req.body.type == "CSV") {
					const transformer = (doc) => {
						return {
							Product_name: doc.product_name,
							Product_category: doc.product_category,
							Tax_group: doc.tax_group,
							Price: doc.price,
							Unit_Of_Measure: doc.unit_of_measure,
							Product_Code: doc.product_code,
							Notes: doc.notes,
							Register_Name: doc.register_name,
							Variant_Group_1: doc.variant_group_1,
							Variant_Group_2: doc.variant_group_2,
							Variant_Group_3: doc.variant_group_3,
							Addon_Group_1: doc.addon_group_1,
							Addon_Group_2: doc.addon_group_2,
							Addon_Group_3: doc.addon_group_3,
							Sort_Order: doc.sort_order,
						};
					};
					file = await commonFunctions.exportToCSV(
						"Products",
						transformer,
						list
					);
				}
				if (req.body.type == "XLSX") {
					const header = [
						{
							header: "Product_name",
							key: "product_name",
							width: 20,
						},
						{
							header: "Product_category",
							key: "product_category",
							width: 20,
						},
						{ header: "Tax_group", key: "tax_group", width: 20 },
						{ header: "Price", key: "price", width: 20 },
						{
							header: "Unit_Of_Measure",
							key: "unit_of_measure",
							width: 20,
						},
						{
							header: "Product_Code",
							key: "product_code",
							width: 20,
						},
						{ header: "Notes", key: "notes", width: 10 },
						{
							header: "Register_Name",
							key: "register_name",
							width: 20,
						},
						{
							header: "Variant_Group_1",
							key: "variant_group_1",
							width: 20,
						},
						{
							header: "Variant_Group_2",
							key: "variant_group_2",
							width: 20,
						},
						{
							header: "Variant_Group_3",
							key: "variant_group_3",
							width: 20,
						},
						{
							header: "Addon_Group_1",
							key: "addon_group_1",
							width: 20,
						},
						{
							header: "Addon_Group_2",
							key: "addon_group_2",
							width: 20,
						},
						{
							header: "Addon_Group_3",
							key: "addon_group_3",
							width: 20,
						},
						{ header: "Sort_Order", key: "sort_order", width: 15 },
					];
					file = await commonFunctions.exportToXLSX(
						"Products",
						header,
						list
					);
				}
				if (req.body.type == "PDF") {
					const header = [
						{ header: "Product_name", key: "product_name" },
						{ header: "Product_category", key: "product_category" },
						{ header: "Tax_group", key: "tax_group" },
						{ header: "Price", key: "price" },
						{ header: "Unit_Of_Measure", key: "unit_of_measure" },
						{ header: "Product_Code", key: "product_code" },
						{ header: "Notes", key: "notes" },
						{ header: "Register_Name", key: "register_name" },
						{ header: "Variant_Group_1", key: "variant_group_1" },
						{ header: "Variant_Group_2", key: "variant_group_2" },
						{ header: "Variant_Group_3", key: "variant_group_3" },
						{ header: "Addon_Group_1", key: "addon_group_1" },
						{ header: "Addon_Group_2", key: "addon_group_2" },
						{ header: "Addon_Group_3", key: "addon_group_3" },
						{ header: "Sort_Order", key: "sort_order" },
					];
					file = await commonFunctions.exportToPDF(
						"Products",
						header,
						list
					);
				}

				if (file) {
					file = process.env.DOMAIN_URL + "/exports/" + file;
					let emailData = {
						to: req.body.email,
						subject: "Poster || Export Products",
						text: `Your Products report is ready for download`,
						html: `<b>Products</b><br><a href="${file}" target="_blank" download>Click here to download </a>`,
					};
					nodemailer.sendMail(emailData);
				}

				return commonResponse.success(
					res,
					"PRODUCTS_EXPORT",
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
			console.log("Export Products DETAIL -> ", error);
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
					product_name: clm[0],
					product_category: clm[1],
					tax_group: clm[2],
					price: clm[3],
					unit_of_measure: clm[4],
					product_code: clm[5],
					notes: clm[6],
					register_name: clm[7],
					variant_group_1: clm[8],
					variant_group_2: clm[9],
					variant_group_3: clm[10],
					addon_group_1: clm[11],
					addon_group_2: clm[12],
					addon_group_3: clm[13],
					sort_order: clm[14],
				})
			);
			let response = {},
				preview = [];
			let total_create = (total_update = total_errors = 0);
			response.headers = [
				"Product Name",
				"Product Category",
				"Tax Group",
				"Product Price",
				"Unit of Measure",
				"Product Code",
				"Notes",
				"Register Name",
				"Variant Group 1",
				"Variant Group 2",
				"Variant Group 3",
				"Addon Group 1",
				"Addon Group 2",
				"Addon Group 3",
				"Sort Order",
			];
			let csvheader = Object.values(data[0]);
			data.shift();

			let checkheader = response.headers.filter(
				(x) => csvheader.indexOf(x) === -1
			);

			let allproduct = await Service.customFind({
				register_id: req.user.main_register_id,
			});
			let allcategory = await productcategoryService.list({
				register_id: req.user.main_register_id,
			});
			let alladdongroups = await addonGroupsService.list({
				register_id: req.user.main_register_id,
			});
			let allvariantgroups = await variantGroupService.list({
				register_id: req.user.main_register_id,
			});
			let alltaxgroups = await taxGroupService.list({
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
				if (!data[i].product_name) {
					preview[i].errors.push("Product Name is required");
				}
				if (!data[i].product_category) {
					preview[i].errors.push("Product Categroy is required");
				}
				if (!data[i].tax_group) {
					preview[i].errors.push("Tax Group is required");
				}
				if (data[i].tax_group) {
					let check = alltaxgroups.find(
						(x) => x.tax_group_name == data[i].tax_group
					);
					if (!check) {
						preview[i].errors.push("Tax group does not exists");
					}
				}
				if (data[i].variant_group_1) {
					let check = allvariantgroups.find(
						(x) => x.variant_group_name == data[i].variant_group_1
					);
					if (!check) {
						preview[i].errors.push(
							"Variant Group 1 does not exists"
						);
					}
				}
				if (data[i].variant_group_2) {
					let check = allvariantgroups.find(
						(x) => x.variant_group_name == data[i].variant_group_2
					);
					if (!check) {
						preview[i].errors.push(
							"Variant Group 2 does not exists"
						);
					}
				}
				if (data[i].variant_group_3) {
					let check = allvariantgroups.find(
						(x) => x.variant_group_name == data[i].variant_group_3
					);
					if (!check) {
						preview[i].errors.push(
							"Variant Group 3 does not exists"
						);
					}
				}
				if (data[i].addon_group_1) {
					let check = alladdongroups.find(
						(x) => x.addon_group_name == data[i].addon_group_1
					);
					if (!check) {
						preview[i].errors.push("Addon Group 1 does not exists");
					}
				}
				if (data[i].addon_group_2) {
					let check = alladdongroups.find(
						(x) => x.addon_group_name == data[i].addon_group_2
					);
					if (!check) {
						preview[i].errors.push("Addon Group 2 does not exists");
					}
				}
				if (data[i].addon_group_3) {
					let check = alladdongroups.find(
						(x) => x.addon_group_name == data[i].addon_group_3
					);
					if (!check) {
						preview[i].errors.push("Addon Group 3 does not exists");
					}
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

				if (data[i].product_category) {
					let check = allcategory.find(
						(x) => x.category_name == data[i].product_category
					);
					if (!check) {
						preview[i].errors.push(
							"Product Categroy does not exists"
						);
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

				if (data[i].product_name) {
					let checkexist = allproduct.find(
						(x) => x.product_name == data[i].product_name
					);
					if (checkexist) {
						preview[i].isExisting = true;
					}
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
					"PRODUCT_PREIVEW",
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

			let allproduct = await Service.customFind({
				register_id: req.user.main_register_id,
			});
			let allcategory = await productcategoryService.list({
				register_id: req.user.main_register_id,
			});
			let alladdongroups = await addonGroupsService.list({
				register_id: req.user.main_register_id,
			});
			let allvariantgroups = await variantGroupService.list({
				register_id: req.user.main_register_id,
			});
			let alltaxgroups = await taxGroupService.list({
				register_id: req.user.main_register_id,
			});

			for (const row of data) {
				row.record.register_id = req.user.main_register_id;
				row.record.sort_order = row.record.sort_order
					? row.record.sort_order
					: 0;
				row.record.option_status = "regular";

				let varinatgroups = [];
				let addongroups = [];
				if (row.isValid) {
					if (row.record.variant_group_1) {
						let v1 = allvariantgroups.find(
							(x) =>
								x.variant_group_name ==
								row.record.variant_group_1
						);
						varinatgroups.push(v1._id);
					}
					if (row.record.variant_group_2) {
						let v2 = allvariantgroups.find(
							(x) =>
								x.variant_group_name ==
								row.record.variant_group_2
						);
						let checkalready = varinatgroups.find(
							(x) => x == v2._id
						);
						if (!checkalready) {
							varinatgroups.push(v2._id);
						}
					}
					if (row.record.variant_group_3) {
						let v3 = allvariantgroups.find(
							(x) =>
								x.variant_group_name ==
								row.record.variant_group_3
						);
						let checkalready = varinatgroups.find(
							(x) => x == v3._id
						);
						if (!checkalready) {
							varinatgroups.push(v3._id);
						}
					}
					if (row.record.addon_group_1) {
						let a1 = alladdongroups.find(
							(x) =>
								x.addon_group_name == row.record.addon_group_1
						);
						addongroups.push(a1._id);
					}
					if (row.record.addon_group_2) {
						let a2 = alladdongroups.find(
							(x) =>
								x.addon_group_name == row.record.addon_group_2
						);
						let checkalready = addongroups.find((x) => x == a2._id);
						if (!checkalready) {
							addongroups.push(a2._id);
						}
					}
					if (row.record.addon_group_3) {
						let a3 = alladdongroups.find(
							(x) =>
								x.addon_group_name == row.record.addon_group_3
						);
						let checkalready = addongroups.find((x) => x == a3._id);
						if (!checkalready) {
							addongroups.push(a3._id);
						}
					}
					if (row.record.product_category) {
						let getcategoryid = allcategory.find(
							(x) =>
								x.category_name == row.record.product_category
						);
						row.record.product_category = getcategoryid._id;
					}
					if (row.record.tax_group) {
						let gettaxgroupid = alltaxgroups.find(
							(x) => x.tax_group_name == row.record.tax_group
						);
						row.record.tax_group = gettaxgroupid._id;
					}
					row.record.option_variant_group = varinatgroups;
					row.record.option_addon_group = addongroups;
				}
				//make add new array
				if (row.isValid && !row.isExisting) {
					insertData.push(row.record);
				}
				//make update existing array
				if (row.isValid && row.isExisting) {
					let checkexist = allproduct.find(
						(x) => x.product_name == row.record.product_name
					);
					if (checkexist) {
						updateData.push(row.record);
					}
				}
			}

			//update
			if (updateData.length > 0) {
				for (const row of updateData) {
					await Service.updateByCondition(
						{
							addon_group_name: row.addon_group_name,
							register_id: row.register_id,
						},
						row
					);
				}
			}

			//add new
			let dataSaved;
			if (insertData.length > 0) {
				dataSaved = await Service.saveMany(insertData);
			}
			if (data && dataSaved) {
				let emailData = {
					to: req.body.email,
					subject: "Poster || Import Products ",
					text: `Your Products are imported`,
					html: `<b>Products imported successfully</b><br>`,
				};
				nodemailer.sendMail(emailData);
				return commonResponse.success(
					res,
					"PRODUCT_IMPORT",
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
