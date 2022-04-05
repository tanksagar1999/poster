const Service = require("./petty_cash.services");
const { commonResponse, commonFunctions, nodemailer } = require("../../helper");
const moment = require("moment");

module.exports = {
	/*
	 *  Add
	 */
	add: async (req, res) => {
		try {
			req.body.user_id = req.user.id;
			req.body.mainRegisterId = req.user.main_register_id;
			let save = await Service.save(req.body);
			if (save) {
				return commonResponse.success(
					res,
					"PETTY_CASH_ADD",
					200,
					save,
					"Petty Cash added successfully"
				);
			} else {
				return commonResponse.error(
					res,
					"DEFAULT_INTERNAL_SERVER_ERROR",
					400
				);
			}
		} catch (error) {
			console.log("Add Petty Cash -> ", error);
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
	 *  List Petty Cash
	 */
	list: async (req, res) => {
		try {
			req.body.register_id = [req.body.register_id];
			console.log("req.query :: =>", req.query);
			let list = await Service.list(req.query);
			if (req.query.startDate && req.query.endDate) {
				list = await Service.searchbydate(req.query);
			}
			let data = {};
			let totalPettyCash = await Service.getTotalNumberOfPettyCash(
				req.query
			);
			data["total_counts"] = totalPettyCash;
			data["total_pages"] = Math.ceil(
				totalPettyCash / parseInt(req.query.limit)
			);
			data["current_page"] = parseInt(req.query.page);
			// console.log("list data ::=>", list);
			if (list.length > 0) {
				let responce = {
					error: false,
					message: "Success",
					statusCode: 200,
					messageCode: "CUSTOMERS_LIST",
					data: list,
					pagination: data,
				};
				// return commonResponse.success(
				// 	res,
				// 	"PETTY_CASH_LIST",
				// 	200,
				// 	list,
				// 	"Success"
				// );
				return commonResponse.customSuccess(res, responce);
			} else {
				// return commonResponse.success(
				// 	res,
				// 	"NO_DATA_FOUND",
				// 	200,
				// 	[],
				// 	"No Data Found"
				// );
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
			console.log("List Petty Cash -> ", error);
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
	 *  Update Petty Cash
	 */
	update: async (req, res) => {
		try {
			if (req.body.status == "cancelled") {
				req.body.cancelled_by = req.user.id;
			}
			let pettyCash = await Service.update(req.params.id, req.body);
			if (pettyCash) {
				return commonResponse.success(
					res,
					"PETTY_CASH_UPDATE",
					200,
					pettyCash,
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
			console.log("Update Petty Cash -> ", error);
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
	 *  Delete Petty Cash
	 */
	delete: async (req, res) => {
		try {
			let data = await Service.delete(req.params.id);
			if (data) {
				return commonResponse.success(
					res,
					"PETTY_CASH_DELETE",
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
			console.log("Delete Petty Cash -> ", error);
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
					"PETTY_CASH_DELETE",
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
	 *  Get Petty Cash Detail
	 */
	get: async (req, res) => {
		try {
			let data = await Service.getById(req.params.id);
			if (data) {
				return commonResponse.success(
					res,
					"PETTY_CASH_DETAIL",
					200,
					data,
					"Success"
				);
			} else {
				return commonResponse.CustomError(
					res,
					"PETTY_CASH_NOT_FOUND",
					400,
					{},
					"Petty Cash not found"
				);
			}
		} catch (error) {
			console.log("Get Petty Cash Detail -> ", error);
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
			if (req.body.register == "All") {
				let all = await commonFunctions.getAllRegistersIds(req);
				req.body.register_id = all;
			} else {
				req.body.register_id = [req.body.register];
			}
			if (req.body.dateRange == "today") {
				req.body.startDate = moment().format("YYYY-MM-DD");
				req.body.endDate = moment().format("YYYY-MM-DD");
			} else if (req.body.dateRange == "yesterday") {
				req.body.startDate = moment()
					.subtract(1, "days")
					.format("YYYY-MM-DD");
				req.body.endDate = moment()
					.subtract(1, "days")
					.format("YYYY-MM-DD");
			} else if (req.body.dateRange == "this_month") {
				req.body.startDate = moment()
					.startOf("month")
					.format("YYYY-MM-DD");
				req.body.endDate = moment().endOf("month").format("YYYY-MM-DD");
			} else if (req.body.dateRange == "last_month") {
				req.body.startDate = moment()
					.subtract(1, "month")
					.startOf("month")
					.format("YYYY-MM-DD");
				req.body.endDate = moment()
					.subtract(1, "month")
					.endOf("month")
					.format("YYYY-MM-DD");
			} else {
				req.body.startDate = moment(
					req.body.startDate,
					"DD/MM/YYYY"
				).format("YYYY-MM-DD");
				req.body.endDate = moment(
					req.body.endDate,
					"DD/MM/YYYY"
				).format("YYYY-MM-DD");
			}
			let list = await Service.searchbydate(req.body);
			list = await commonFunctions.changeDateFormat(list, "created_at");
			for (const i in list) {
				list[i].register_name = list[i].register_id.register_name;
				list[i].added_by = list[i].user_id
					? list[i].user_id.username
					: "";
				list[i].cancelled_by =
					list[i].status == "cancelled" && list[i].cancelled_by
						? list[i].cancelled_by.username
						: "";
				list[i].status =
					list[i].status == "cancelled" ? list[i].status : "";
				list[i].type =
					list[i].type == "cash_in" ? "Cash In" : "Cash Out";

				if (list[i].category) {
					list[i].category = list[i].category.name;
				} else {
					list[i].category =
						list[i].type == "cash_in"
							? "Petty Cash In"
							: "Petty Cash Out";
				}
			}
			if (list.length > 0) {
				let file = "";
				if (req.body.type == "CSV") {
					const transformer = (doc) => {
						return {
							Date: doc.created_at,
							Register_name: doc.register_name,
							Amount: doc.amount,
							Type: doc.type,
							Category: doc.category,
							Notes: doc.notes,
							Added_by: doc.added_by,
							Cancelled: doc.status,
							Cancelled_By: doc.cancelled_by,
						};
					};
					file = await commonFunctions.exportToCSV(
						"Petty_Cash",
						transformer,
						list
					);
				}
				if (req.body.type == "XLSX") {
					const header = [
						{ header: "Date", key: "created_at" },
						{ header: "Register_name", key: "register_name" },
						{ header: "Amount", key: "amount" },
						{ header: "Type", key: "type" },
						{ header: "Category", key: "category" },
						{ header: "Notes", key: "notes" },
						{ header: "Added_by", key: "added_by" },
						{ header: "Cancelled", key: "status" },
						{ header: "Cancelled_By", key: "cancelled_by" },
					];
					file = await commonFunctions.exportToXLSX(
						"Petty_Cash",
						header,
						list
					);
				}
				if (req.body.type == "PDF") {
					const header = [
						{ header: "Date", key: "created_at" },
						{ header: "Register_name", key: "register_name" },
						{ header: "Amount", key: "amount" },
						{ header: "Type", key: "type" },
						{ header: "Category", key: "category" },
						{ header: "Notes", key: "notes" },
						{ header: "Added_by", key: "added_by" },
						{ header: "Cancelled", key: "status" },
						{ header: "Cancelled_By", key: "cancelled_by" },
					];
					file = await commonFunctions.exportToPDF(
						"Petty_Cash",
						header,
						list
					);
				}

				if (file) {
					file = process.env.DOMAIN_URL + "/exports/" + file;
					let emailData = {
						to: req.body.email,
						subject: "Poster || Export Petty Cash",
						text: `Your Petty Cash report is ready for download`,
						html: `<b>Petty Cash</b><br><a href="${file}" target="_blank">Click here to download </a>`,
					};
					nodemailer.sendMail(emailData);
				}

				return commonResponse.success(
					res,
					"PETTY_CASH_EXPORT",
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
			console.log("Export Petty Cash -> ", error);
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
