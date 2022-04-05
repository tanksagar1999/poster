const Service = require("./sales.services");
const { commonResponse, commonFunctions, nodemailer } = require("../../helper");
const receiptsServices = require("../receipts/receipts.services");
const orderitemsServices = require("../order_items/order_items.services");
const ticketsServices = require("../tickets/tickets.services");
const customerServices = require("../customers/customers.services");
const registerServices = require("../registers/registers.services");
const productsServices = require("../products/products.services");
const discountrulesServices = require("../discount_rules/discount_rules.services");
const invNum = require("invoice-number");
const mongoose = require("mongoose");
module.exports = {
	/*
	 *  Add New
	 */
	add: async (req, res) => {
		try {
			req.body.user_id = req.user.id;
			let salesTypes = ["immediate", "booking"];
			if (
				req.body.details.saleType == "" ||
				salesTypes.indexOf(req.body.details.saleType) == -1
			) {
				return commonResponse.customResponse(
					res,
					"INVALID_DATA",
					400,
					[],
					"Invalid sales Type.it should be immediate or booking"
				);
			}

			let paymentStatus = ["paid", "unpaid"];
			if (
				req.body.details.paymentStatus == "" ||
				paymentStatus.indexOf(req.body.details.paymentStatus) == -1
			) {
				return commonResponse.customResponse(
					res,
					"INVALID_DATA",
					400,
					[],
					"Invalid payment Status.it should be paid or unpaid"
				);
			}
			if (req.body.details.itemsSold.length == 0) {
				return commonResponse.customResponse(
					res,
					"INVALID_DATA",
					400,
					[],
					"Atlease 1 item should required"
				);
			}

			if (
				req.body.details.saleType == "booking" &&
				req.body.details.paymentStatus == "paid" &&
				req.body.details.bookingDetails.booking_number
			) {
				await Service.deleteBooking({
					"details.bookingDetails.booking_number":
						req.body.details.bookingDetails.booking_number,
				});
			}

			if (req.body.details.coupons) {
				if (req.body.details.coupons.length > 0) {
					for (const c of req.body.details.coupons) {
						let d = await discountrulesServices.getById(c);
						if (d) {
							if (d.discount_type == "fixed_amount") {
								req.body.details.priceSummery.discount =
									d.discount;
								req.body.details.priceSummery.total =
									req.body.details.priceSummery.subtotal -
									d.discount;
							}
						}
					}
				}
			}

			//save or update customer
			if (
				req.body.customer.mobile != null &&
				req.body.customer.mobile != "Add Customer" &&
				req.body.customer.mobile != ""
			) {
				let checkmobile = await customerServices.list({
					mobile: req.body.customer.mobile,
					register_id: req.user.register_id,
				});
				req.body.customer.user_id = req.user.id;
				if (checkmobile.length > 0) {
					checkmobile = checkmobile[0];
					await customerServices.update(
						checkmobile._id,
						req.body.customer
					);
				} else {
					req.body.customer.user_id = req.user.id;
					req.body.customer.register_id = req.user.register_id;
					console.log("req.body.customer else =>", req.body.customer);

					// req.body.customer.register_id = req.body.register_id;
					// req.body.customer.mobile =
					await customerServices.save(req.body.customer);
					// console.log("customerData :: =>", customerData);
				}
			}

			req.body.order_by = req.user.id;
			req.body.mainRegisterId = req.user.main_register_id;
			// req.body.actual_time = new Date();
			console.log("Req.body Full :: ==>", req.body);
			let save = await Service.save(req.body);
			if (save) {
				//save receipt start
				console.log("req.body.register_id =>", req.body.register_id);
				let register = await registerServices.getById(
					req.body.register_id
				);
				console.log("register =>", register);

				let receipt = {};
				receipt.register_id = req.body.register_id;
				receipt.mainRegisterId = req.user.main_register_id;

				receipt.order_id = save._id;

				let lastReceipt = await receiptsServices.findLastReceipt(
					register.receipt_number_prefix,
					req.body.register_id
				);
				console.log("lastReceipt =>", lastReceipt);
				if (lastReceipt != null && lastReceipt != undefined) {
					lastReceipt.lastNumber += 1;
					console.log(
						"lastReceipt.lastNumber =>",
						lastReceipt.lastNumber
					);
					let new_receipt_number =
						register.receipt_number_prefix +
						lastReceipt.lastNumber +
						" " +
						"/" +
						" " +
						req.body.ReceiptNumber;
					receipt.receipt_number = new_receipt_number;
					receipt.lastNumber = lastReceipt.lastNumber;
					receipt.user_id = req.user.id;
				} else {
					receipt.lastNumber = 1;
					console.log("lastNumber =>", receipt.lastNumber);

					let new_receipt_number =
						register.receipt_number_prefix +
						receipt.lastNumber +
						" " +
						"/" +
						" " +
						req.body.ReceiptNumber;
					console.log("new_receipt_number =>", new_receipt_number);
					receipt.receipt_number = new_receipt_number;
					receipt.user_id = req.user.id;
				}
				console.log("receipt =>", receipt);

				let receiptData = await receiptsServices.save(receipt);
				console.log("receiptData =>", receiptData.receipt_number);
				save.details.receipt_number = receiptData.receipt_number;
				console.log("save Data => ", save);

				//save receipt end
				return commonResponse.success(
					res,
					"ORDERS_ADD",
					200,
					save,
					"Order added successfully"
				);
			} else {
				return commonResponse.error(
					res,
					"DEFAULT_INTERNAL_SERVER_ERROR",
					400
				);
			}
		} catch (error) {
			console.log("Add ORDERS -> ", error);
			return commonResponse.CustomError(
				res,
				"DEFAULT_INTERNAL_SERVER_ERROR",
				500,
				{},
				error.message
			);
		}
	},

	bookingDraft: async (req, res) => {
		try {
			// console.log("Req ==>", req);
			req.body.user_id = req.user.id;
			console.log("Req.Body 111 ==>", req.body);
			if (
				!parseInt(req.body.customer.mobile) ||
				req.body.customer.mobile == ""
			) {
				return commonResponse.customResponse(
					res,
					"INVALID_DATA",
					400,
					[],
					"Customer mobile not valid"
				);
			}

			let salesTypes = ["immediate", "booking"];
			if (
				req.body.details.saleType == "" ||
				salesTypes.indexOf(req.body.details.saleType) == -1
			) {
				return commonResponse.customResponse(
					res,
					"INVALID_DATA",
					400,
					[],
					"Invalid sales Type.it should be immediate or booking"
				);
			}

			let paymentStatus = ["paid", "unpaid"];
			if (
				req.body.details.paymentStatus == "" ||
				paymentStatus.indexOf(req.body.details.paymentStatus) == -1
			) {
				return commonResponse.customResponse(
					res,
					"INVALID_DATA",
					400,
					[],
					"Invalid payment Status.it should be paid or unpaid"
				);
			}

			// let fulfillmentStatus = ["fulfilled", "cancelled"];
			// if(req.body.details.fulfillmentStatus=="" || fulfillmentStatus.indexOf(req.body.details.fulfillmentStatus) == -1){
			//     return commonResponse.customResponse(res, "INVALID_DATA", 400, [], "Invalid fulfillment Status");
			// }

			if (req.body.details.itemsSold.length == 0) {
				return commonResponse.customResponse(
					res,
					"INVALID_DATA",
					400,
					[],
					"Atlease 1 item should required"
				);
			}

			//save or update customer
			// let checkmobile = await customerServices.list({
			// 	mobile: req.body.customer.mobile,
			// 	register_id: req.body.register_id,
			// });
			// if (checkmobile.length > 0) {
			// 	checkmobile = checkmobile[0];
			// 	await customerServices.update(
			// 		checkmobile._id,
			// 		req.body.customer
			// 	);
			// } else {
			// 	await customerServices.save(req.body.customer);
			// }
			if (
				req.body.customer.mobile != null &&
				req.body.customer.mobile != "Add Customer" &&
				req.body.customer.mobile != ""
			) {
				let checkmobile = await customerServices.list({
					mobile: req.body.customer.mobile,
					register_id: req.user.register_id,
				});
				req.body.customer.user_id = req.user.id;
				if (checkmobile.length > 0) {
					checkmobile = checkmobile[0];
					await customerServices.update(
						checkmobile._id,
						req.body.customer
					);
				} else {
					req.body.customer.user_id = req.user.id;
					req.body.customer.register_id = req.user.register_id;
					await customerServices.save(req.body.customer);
				}
			}

			req.body.order_by = req.user.id;
			req.body.draftList = true;
			console.log("req.body =>", req.body);
			// req.body.actual_time = new Date();
			console.log("req.body ==>", req.body);
			let save = await Service.save(req.body);

			if (save) {
				return commonResponse.success(
					res,
					"ORDERS_ADD",
					200,
					save,
					"Booking added successfully"
				);
			} else {
				return commonResponse.error(
					res,
					"DEFAULT_INTERNAL_SERVER_ERROR",
					400
				);
			}
		} catch (error) {
			console.log("Add ORDERS -> ", error);
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
			let list = await Service.list(req.query);
			if (list.length > 0) {
				return commonResponse.success(
					res,
					"ORDERS_LIST",
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
			console.log("List ORDERS -> ", error);
			return commonResponse.CustomError(
				res,
				"DEFAULT_INTERNAL_SERVER_ERROR",
				500,
				{},
				error.message
			);
		}
	},

	// Top List
	topList: async (req, res) => {
		let forYesterday = new Date();
		forYesterday.setHours(0, 0, 0, 0);
		let yesterday = new Date(forYesterday);
		yesterday.setDate(yesterday.getDate() - 1);

		let today = new Date();
		today.setHours(24, 0, 0, 0);

		try {
			let list = await Service.topList(req.user);
			// console.log(list)
			// list.map(async(element) => {
			//     console.log(element)
			//     element._id = await productsServices.getById(element._id)
			// })
			let productList = [];
			for (let i of list) {
				productList.push(
					await productsServices.topSellingProductsById(i._id)
				);
			}
			if (list.length > 0) {
				return commonResponse.success(
					res,
					"ORDERS_LIST",
					200,
					productList,
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
			console.log("List ORDERS -> ", error);
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
	bookingList: async (req, res) => {
		try {
			let lists = await Service.bookingList(req.query);
			let draftLists = lists.filter(
				(draftList) => draftList.draftList == true
			);
			if (draftLists.length > 0) {
				return commonResponse.success(
					res,
					"BOOKINGS_LIST",
					200,
					draftLists,
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
			console.log("List ORDERS -> ", error);
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
	 *  export booking
	 */
	bookingListExport: async (req, res) => {
		try {
			req.query.created_at = {
				$gte: new Date(req.body.startDate + " 00:00:00"),
				$lt: new Date(req.body.endDate + " 23:59:59"),
			};
			let list = await Service.bookingList(req.query);
			if (list.length > 0) {
				return commonResponse.success(
					res,
					"BOOKINGS_LIST",
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
			console.log("List ORDERS -> ", error);
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
			let updateOrder = await Service.update(req.params.id, req.body);
			if (updateOrder) {
				return commonResponse.success(
					res,
					"ORDERS_UPDATE",
					200,
					updateOrder,
					"Successfully updated Order"
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
			console.log("Update ORDERS -> ", error);
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
	 *  Cancel
	 */
	cancel: async (req, res) => {
		try {
			req.body["details.fulfillmentStatus"] = "cancelled";
			let updateOrder = await Service.update(req.params.id, req.body);
			if (updateOrder) {
				return commonResponse.success(
					res,
					"ORDERS_CANCELLED",
					200,
					updateOrder,
					"Successfully updated Order"
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
			console.log("CANCEL ORDERS -> ", error);
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
					"ORDERS_DELETE",
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
			console.log("Delete Order -> ", error);
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
					"ORDERS_DELETE",
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
			console.log("Delete Order -> ", error);
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
	getOrders: async (req, res) => {
		try {
			let data = await Service.getById(req.params.id);
			if (data) {
				return commonResponse.success(
					res,
					"ORDERS_DETAIL",
					200,
					data,
					"Success"
				);
			} else {
				return commonResponse.CustomError(
					res,
					"ORDERS_NOT_FOUND",
					400,
					{},
					"Orders not found"
				);
			}
		} catch (error) {
			console.log("Get Orders Detail -> ", error);
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
