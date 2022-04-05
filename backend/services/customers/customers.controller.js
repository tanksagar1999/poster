const Service = require("./customers.services");
const { commonResponse, commonFunctions, nodemailer } = require("../../helper");
const ordersService = require("../orders/orders.services");
const salesService = require("../sales/sales.services");
const orderitemsService = require("../order_items/order_items.services");
const receiptsService = require("../receipts/receipts.services");
const customFieldsService = require("../custom_fields/custom_fields.services");
const csv = require("@fast-csv/parse");
const fs = require("fs");

module.exports = {
	/*
	 *  Add New
	 */
	add: async (req, res) => {
		try {
			req.body.user_id = req.user.id;
			req.body.register_id = req.user.main_register_id;
			req.body.mainRegisterId = req.user.main_register_id;
			let checkmobile = await Service.list({
				mobile: req.body.mobile,
				register_id: req.body.register_id,
			});
			if (checkmobile.length > 0) {
				return commonResponse.CustomError(
					res,
					"MOBILE_EXIST",
					400,
					{},
					"Mobile number already exist"
				);
			}
			let save = await Service.save(req.body);

			if (save) {
				return commonResponse.success(
					res,
					"CUSTOMERS_ADD",
					200,
					save,
					"Customer added successfully"
				);
			} else {
				return commonResponse.error(
					res,
					"DEFAULT_INTERNAL_SERVER_ERROR",
					400
				);
			}
		} catch (error) {
			console.log("Add CUSTOMERS -> ", error);
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
	list: async (req, res) => {
		try {
			console.log("LISTING CUSTOMERS");
			console.log("list.query :: =>", req.query);
			// req.body.register_id = req.user.main_register_id;
			let list = await Service.list(req.query);
			console.log("list ==>", list);
			for (const key in list) {
				if (list[key].mobile) {
					let o = await salesService.getOrdersByCustomers({
						mobile: parseInt(list[key].mobile),
						register_id: req.body.register_id,
					});
					// console.table(o);
					list[key].order_count = o.length > 0 ? o[0].sum : 0;
					list[key].order_value = o.length > 0 ? o[0].count : 0;
					let last_order = await salesService.getLastPurchaseditems({
						mobile: parseInt(list[key].mobile),
						register_id: req.body.register_id,
					});
					console.log(last_order);
					list[key].last_seen = last_order
						? last_order.created_at
						: "";
					list[key].last_purchase_items = last_order
						? last_order
						: "";
				}
			}
			let data = {};
			let totalcustomers = await Service.getTotalNumberOfCustomers(
				req.query
			);
			data["total_counts"] = totalcustomers;
			data["total_pages"] = Math.ceil(
				totalcustomers / parseInt(req.query.limit)
			);
			data["current_page"] = parseInt(req.query.page);
			if (list.length > 0) {
				let responce = {
					error: false,
					message: "Success",
					statusCode: 200,
					messageCode: "CUSTOMERS_LIST",
					data: list,
					pagination: data,
				};
				return commonResponse.customSuccess(res, responce);
			} else {
				let pagination = {
					total_counts: 0,
					total_pages: 0,
					current_page: 0,
				};
				let responce = {
					error: false,
					message: "No Data Found",
					statusCode: 200,
					messageCode: "NO_DATA_FOUND",
					data: list,
					pagination,
				};
				return commonResponse.customSuccess(res, responce);
			}
		} catch (error) {
			console.log("List CUSTOMERS -> ", error);
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
			let updateCustomer = await Service.update(req.params.id, req.body);
			if (updateCustomer) {
				return commonResponse.success(
					res,
					"CUSTOMERS_UPDATE",
					200,
					updateCustomer,
					"Successfully updated Customer"
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
			console.log("Update CUSTOMERS -> ", error);
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
					"CUSTOMERS_DELETE",
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
			console.log("Delete Customer -> ", error);
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
					"CUSTOMERS_DELETE",
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
			console.log("Delete Customer -> ", error);
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
				(row) => ({
					mobile: row[0],
					name: row[1],
					email: row[2],
					address: row[3],
					city: row[4],
					zipcode: row[5],
				})
			);
			let response = {},
				preview = [];
			let total_create = (total_update = total_errors = 0);
			let csvheader = Object.values(data[0]);
			data.shift();

			response.headers = [
				"Mobile Number",
				"Name",
				"Email",
				"Street Address",
				"City",
				"Zipcode",
			];

			let checkheader = response.headers.filter(
				(x) => csvheader.indexOf(x) === -1
			);

			let allcustomers = await Service.Alllist({
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
				if (!data[i].mobile) {
					preview[i].errors.push("Variant name is required");
				}
				if (!parseInt(data[i].mobile) && data[i].mobile) {
					preview[i].errors.push(
						"Customer mobile should be a number"
					);
				} else {
					let check = allcustomers.find(
						(x) => x.mobile == parseInt(data[i].mobile)
					);
					if (check) {
						preview[i].isExisting = true;
					}
				}
				if (!parseInt(data[i].zipcode) && data[i].zipcode) {
					preview[i].errors.push("Zipcode should be a number");
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
					"CUSTOMERS_PREIVEW",
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
			console.log("Delete Customer -> ", error);
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
	 *  Import data
	 */
	import: async (req, res) => {
		try {
			let data = req.body.previewData;
			let insertData = [];
			for (const row of data) {
				row.record.register_id = req.user.main_register_id;
				row.record.shipping_address = row.record.address;
				row.record.user_id = req.user.id;
				//add new
				if (row.isValid && !row.isExisting) {
					console.log("row.record ==>", row.record);
					insertData.push(row.record);
				}
				//update existing
				if (row.isValid && row.isExisting) {
					await Service.updateByCondition(
						{
							mobile: row.record.mobile,
							register_id: row.record.register_id,
						},
						row.record
					);
				}
			}
			console.log("insertData ==>", insertData);
			let importedData;
			if (insertData.length > 0) {
				importedData = await Service.saveMany(insertData);
			}
			if (data && importedData) {
				let emailData = {
					to: req.body.email,
					subject: "Poster || Import Customers",
					text: `Your Customers are imported`,
					html: `<b>Customers imported successfully</b><br>`,
				};
				nodemailer.sendMail(emailData);
				return commonResponse.success(
					res,
					"CUSTOMERS_IMPORT",
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
			console.log("Delete Customer -> ", error);
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
	getCustomers: async (req, res) => {
		try {
			let data = await Service.getById(req.params.id);
			console.log("data ==>", data);
			if (data) {
				let o = await salesService.getOrdersByCustomers({
					mobile: parseInt(data.mobile),
					// user_id: req.user.id,
				});

				let last_order = await salesService.getLastPurchaseditems({
					mobile: parseInt(data.mobile),
					// register_id: req.body.register_id,
					// user_id: req.user.id,
				});
				console.log("last_order ==>", last_order);
				let last_purchase;
				let recent_receipts = [];
				if (last_order) {
					if (last_order.details.itemsSold.length > 0) {
						last_purchase = last_order.details.itemsSold;
					}
					recent_receipts = await receiptsService.getRecentByCustomer(
						{
							mobile: data.mobile,
							user_id: data.user_id,
						}
					);
				}

				data.order_count = o && o.length > 0 ? o[0].sum : 0;
				data.associated_name =
					data.register_id != null
						? data.register_id.register_name
						: "";
				data.order_value = o && o.length > 0 ? o[0].count : 0;
				data.last_purchase = last_purchase ? last_purchase : "";
				data.last_seen = last_order ? last_order.created_at : "";
				data.recent_receipts = recent_receipts;

				let mainregister = "";
				let getExtraCustomerFields =
					await customFieldsService.getFields({
						type: { $in: ["additional_detail", "tag"] },
						sub_type: "customer",
						user_id: req.user.id,
					});
				console.log(
					"getExtraCustomerFields ==>",
					getExtraCustomerFields
				);
				if (getExtraCustomerFields.length > 0) {
					if (data.custom_fields && data.custom_fields.length > 0) {
						for (
							let index = 0;
							index < getExtraCustomerFields.length;
							index++
						) {
							let checks = data.custom_fields.find(
								(o) =>
									o.name ===
										getExtraCustomerFields[index].name &&
									o.type ===
										getExtraCustomerFields[index].type
							);
							if (checks && checks.type == "additional_detail") {
								getExtraCustomerFields[index]["value"] = checks
									? checks.value
									: "";
							} else if (checks && checks.type == "tag") {
								getExtraCustomerFields[index]["value"] = checks
									? checks.value
									: false;
							} else {
								getExtraCustomerFields[index]["value"] =
									getExtraCustomerFields[index].type ==
									"additional_detail"
										? ""
										: false;
							}
						}
					} else {
						for (
							let index = 0;
							index < getExtraCustomerFields.length;
							index++
						) {
							getExtraCustomerFields[index]["value"] =
								getExtraCustomerFields[index].type ==
								"additional_detail"
									? ""
									: false;
						}
					}
				}

				// data.custom_fields = getExtraCustomerFields;

				return commonResponse.success(
					res,
					"CUSTOMERS_DETAIL",
					200,
					data,
					"Success"
				);
			} else {
				return commonResponse.CustomError(
					res,
					"CUSTOMERS_NOT_FOUND",
					400,
					{},
					"Customers not found"
				);
			}
		} catch (error) {
			console.log("Get Customers Detail -> ", error);
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
				list = await commonFunctions.changeDateFormat(
					list,
					"created_at"
				);
				if (req.body.type == "CSV") {
					const transformer = (doc) => {
						return {
							Mobile_Number: doc.mobile,
							Name: doc.name,
							Email: doc.email,
							Street_address: doc.shipping_address,
							City: doc.city,
							Zipcode: doc.zipcode,
							Associated_Registers: doc.register_name,
							Created_at: doc.created_at,
						};
					};
					file = await commonFunctions.exportToCSV(
						"Customers",
						transformer,
						list
					);
				}
				if (req.body.type == "XLSX") {
					const header = [
						{ header: "Mobile_Number", key: "mobile" },
						{ header: "Name", key: "name" },
						{ header: "Email", key: "email" },
						{ header: "Street_address", key: "shipping_address" },
						{ header: "City", key: "city" },
						{ header: "Zipcode", key: "zipcode" },
						{
							header: "Associated_Registers",
							key: "register_name",
						},
						{ header: "Created_at", key: "created_at" },
					];
					file = await commonFunctions.exportToXLSX(
						"Customers",
						header,
						list
					);
				}
				if (req.body.type == "PDF") {
					const header = [
						{ header: "Mobile_Number", key: "mobile" },
						{ header: "Name", key: "name" },
						{ header: "Email", key: "email" },
						{ header: "Street_address", key: "shipping_address" },
						{ header: "City", key: "city" },
						{ header: "Zipcode", key: "zipcode" },
						{
							header: "Associated_Registers",
							key: "register_name",
						},
						{ header: "Created_at", key: "created_at" },
					];
					file = await commonFunctions.exportToPDF(
						"Customers",
						header,
						list
					);
				}

				if (file) {
					file = process.env.DOMAIN_URL + "/exports/" + file;
					let emailData = {
						to: req.body.email,
						subject: "Poster || Export Customers",
						text: `Your Customers report is ready for download`,
						html: `<b>Customers</b><br><a href="${file}" target="_blank">Click here to download </a>`,
					};
					nodemailer.sendMail(emailData);
				}

				return commonResponse.success(
					res,
					"CUSTOMERS_EXPORT",
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
			console.log("Export Customers DETAIL -> ", error);
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
