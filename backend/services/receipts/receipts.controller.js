const Service = require("./receipts.services");
const { commonResponse, commonFunctions } = require("../../helper");
const { registersServices } = require("../registers");
const { ordersItemsServices } = require("../order_items");
const salesService = require("../sales/sales.services");
const lastDevice = require("../last_device/last_device.services");
const invNum = require("invoice-number");
module.exports = {
	/*
	 *  List
	 */
	list: async (req, res) => {
		try {
			console.log("req.query", req.query);

			let list = await Service.list(req.query);
			if (req.query.startDate && req.query.endDate) {
				list = await Service.searchbydate(req);
			}
			let data = {};
			let totalReceipts = await Service.getTotalNumberOfReceipts(
				req.query
			);
			data["total_counts"] = totalReceipts ? totalReceipts : 0;
			data["total_pages"] = Math.ceil(
				totalReceipts / parseInt(req.query.limit)
			);
			data["current_page"] = parseInt(req.query.page);
			if (list.length > 0) {
				let responce = {
					error: false,
					message: "Success",
					statusCode: 200,
					messageCode: "RECEIPTS_LIST",
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
			console.log("List RECEIPTS -> ", error);
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
			let updateReceipts = await Service.update(req.params.id, req.body);
			if (updateReceipts) {
				return commonResponse.success(
					res,
					"RECEIPTS_UPDATE",
					200,
					updateReceipts,
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
			console.log("Update RECEIPTS -> ", error);
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
					"RECEIPTS_DELETE",
					200,
					data,
					"Successfully deleted receipts"
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
			console.log("Delete RECEIPTS -> ", error);
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
	getReceipts: async (req, res) => {
		try {
			let data = await Service.getById(req.params.id);
			if (data) {
				let items = await ordersItemsServices.getByOrderId(
					data.order_id._id
				);
				data.items = items;
				return commonResponse.success(
					res,
					"RECEIPTS_DETAIL",
					200,
					data,
					"Success"
				);
			} else {
				return commonResponse.customResponse(
					res,
					"RECEIPTS_NOT_FOUND",
					400,
					{},
					"Receipts not found"
				);
			}
		} catch (error) {
			console.log("Get RECEIPTS Detail -> ", error);
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
	 *  Get Last Receipt Detail
	 */
	getLastReceiptsByRegister: async (req, res) => {
		try {
			let data = {};
			data = await Service.findLastReceiptByRegisterId(req.params.id);
			if (data == null && data == undefined) {
				// console.log("Data1 ==>", data);
				data = await Service.findLastReceiptByMainRegisterId(
					req.user.main_register_id
				);
			}

			if (data) {
				// let items = await ordersItemsServices.getByOrderId(
				// 	data.order_id
				// );

				// data.items = items;
				return commonResponse.success(
					res,
					"RECEIPTS_DETAIL",
					200,
					data,
					"Success"
				);
			} else {
				return commonResponse.customResponse(
					res,
					"RECEIPTS_NOT_FOUND",
					400,
					{},
					"Receipts not found"
				);
			}
		} catch (error) {
			console.log("Get RECEIPTS Detail -> ", error);
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
			if (req.body.reportType == "sales_report") {
				let list = await salesService.export({
					startDate: req.body.startDate,
					endDate: req.body.endDate,
					register_id: req.body.register_id,
				});
				console.log("List Length ==>", list.length);
				console.log("List  ==>", list);

				let customArray = [];

				if (list.length > 0) {
					let transformer = {};
					// var tmplist = Object.assign({}, list);
					for (let tmpData in list) {
						// console.log("tmpData", tmpData);
						// console.log("tmplist[key]._id", tmplist[key]._id);
						//list.receipt_number = list[tmpData].ReceiptNumber;

						// console.log(" list[tmpData] ==>", list[tmpData]);

						let tempData = list[tmpData].details.itemsSold;
						// let product_name = "";
						//  refund_amount = "";
						// let refund_paid_by = "";
						for (i = 0; i < tempData.length; i++) {
							let product_name =
								list[tmpData].details.itemsSold[i].display_name;
							let product_quantity =
								list[tmpData].details.itemsSold[i].quantity;
							let totals =
								list[tmpData].details.itemsSold[i]
									.calculatedprice;
							let refund_amount = list[tmpData].cancellation
								? list[tmpData].cancellation.refund_amount
								: "";
							let refund_paid_by = list[tmpData].cncellation
								? list[tmpData].cncellation.refund_paid_by
								: "";
							list[tmpData].product_name = product_name;

							list[tmpData].product_quantity = product_quantity;
							list[tmpData].product_totalPrice = totals;
							list[tmpData].refund_amount = refund_amount;
							list[tmpData].refund_paid_by = refund_paid_by;

							customArray.push({
								created_at: list[tmpData].created_at,
								ReceiptNumber: list[tmpData].ReceiptNumber,
								customer: {
									mobile: list[tmpData].customer.mobile,
									name: list[tmpData].customer.name,
									shippingAddress:
										list[tmpData].customer.shippingAddress,
								},
								product_name: Array.isArray(product_name)
									? product_name.join(" , ")
									: product_name,
								product_quantity: product_quantity,
								totals: totals,
								details: {
									paymentStatus:
										list[tmpData].details.paymentStatus,
								},
								refund_amount: refund_amount,
								refund_paid_by: refund_paid_by,
							});

							let file = "";
							transformer = (doc) => {
								return {
									date: doc.created_at,
									receipt_number: doc.ReceiptNumber,
									customer_mobile: doc.customer.mobile,
									customer_name: doc.customer.name,
									product_name: doc.product_name,
									product_quantity: doc.product_quantity,
									totals: doc.totals,
									payment_status: doc.details.paymentStatus,
									shipping_address:
										doc.customer.shippingAddress,
									refund_amount: doc.refund_amount,
									refund_paid_by: doc.refund_paid_by,
								};
							};
						}
					}
					console.log("List ==>", list);

					console.log("Transformer", transformer.toString());

					file = await commonFunctions.exportToCSV(
						"SalesReport",
						transformer,
						customArray
					);

					// if (file) {
					// 	file = process.env.DOMAIN_URL + "/exports/" + file;
					// 	let emailData = {
					// 		to: req.body.email,
					// 		subject: "Poster || Sales report",
					// 		text: `Your Sales report is ready for download`,
					// 		html: `<b>Sales report from ${req.body.startDate} to ${req.body.endDate} </b><br><a href="${file}" target="_blank">Click here to download </a>`,
					// 	};
					// 	nodemailer.sendMail(emailData);
					// }

					return commonResponse.success(
						res,
						"ORDERS_EXPORT",
						200,
						customArray,
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
			}
		} catch (error) {
			console.log("Export Orders DETAIL -> ", error);
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
