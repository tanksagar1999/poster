const Service = require("./shifts.services");
const { commonResponse } = require("../../helper");

module.exports = {
	/*
	 *  Add New
	 */
	add: async (req, res) => {
		try {
			req.body.user_id = req.user.main_register_id;
			req.body.actual_time = new Date();
			req.query.id = req.user.main_register_id;
			let viewSummary = {};
			let salesSummary = {};

			let paymentSummary = {};
			let cashSummary = {};
			let paymentTotal = {};
			let refundOrderTotal = {};
			if (req.body.action == "close" && req.body.actual_time) {
				// let salesPaymentTotal;
				let startRecord = await Service.getStartRecord(req.query);

				console.log("startRecord =>", startRecord);
				viewSummary.startTime = startRecord
					? startRecord
					: new Date(req.body.actual_time);
				let startTime = startRecord.actual_time
					? startRecord.actual_time
					: new Date(req.body.actual_time);

				let endTime = new Date(req.body.actual_time);
				let salesData = await Service.getRecordsonActualTime(
					startTime,
					endTime
				);
				console.log("salesData =>", salesData);
				// Sales Summary calculation function's
				salesSummary.totalSales = await Service.getTotalOrdersByTime(
					startTime,
					endTime
				);
				salesSummary.activeReceipts =
					await Service.getActiveReceiptsByTime(startTime, endTime);
				salesSummary.cancelReceipts =
					await Service.getCancelReceiptsByTime(startTime, endTime);
				viewSummary.salesSummary = salesSummary;

				// Payment Summary calculation function's
				paymentSummary = await Service.paymentSummary(
					startTime,
					endTime
				);
				console.log("paymentSummary =>", paymentSummary);
				viewSummary.paymentSummary = paymentSummary;

				console.log("refundOrderTotal :: =>", refundOrderTotal);

				// payment's total based on tyoe function
				paymentTotal = await Service.getPaymentTotal(
					startTime,
					endTime
				);
				console.log("paymentTotal =>", paymentTotal);
				viewSummary.paymentTotal = paymentTotal;

				// Payment's receipt count calculation function's
				let paymentCount = await Service.getPaymentReceiptCount(
					startTime,
					endTime
				);
				viewSummary.paymentCount = paymentCount;

				// CashSummary Refund Order Calculation function
				let cashOutRefunds = await Service.getCashOutRefunds(
					startTime,
					endTime
				);
				console.log("cashOutRefunds =>", cashOutRefunds);
				let refundOrderSum = 0;
				cashOutRefunds.map((element) => {
					if (element._id == "cash") {
						console.log("refundOrderTotal =>", element.sum);
						refundOrderSum = element.sum;
					}
				});
				cashSummary.cashOutRefunds = cashOutRefunds;
				cashSummary.pettyCashIn = await Service.getPettyCashInCount(
					startTime,
					endTime
				);
				cashSummary.pettyCashOut = await Service.getPettyCashOutCount(
					startTime,
					endTime
				);

				let cashAmount = 0;
				paymentTotal.map((element) => {
					if (element._id == "cash") {
						cashAmount = element.sum ? element.sum : 0;
					}
				});
				let pettyCashIn = cashSummary.pettyCashIn
					? cashSummary.pettyCashIn.sum
					: 0;
				let pettyCashOut = cashSummary.pettyCashOut.sum
					? cashSummary.pettyCashOut.sum
					: 0;
				let opening_balance = 0;
				opening_balance = startRecord.opening_balance
					? startRecord.opening_balance
					: startRecord.closing_balance;

				cashSummary.expectedClosingBalance =
					opening_balance +
					cashAmount +
					pettyCashIn -
					refundOrderSum -
					pettyCashOut;

				cashSummary.actualClosingBalance = parseInt(
					req.body.closing_balance
				);

				cashSummary.excess =
					cashSummary.actualClosingBalance -
					cashSummary.expectedClosingBalance;
				viewSummary.cashSummary = cashSummary;
				console.log("viewSummary =>", viewSummary);
				req.body.view_summary = viewSummary;
			} else {
				console.log("actual time || action is missing");
			}

			let save = await Service.save(req.body);
			if (save) {
				return commonResponse.success(
					res,
					"SHIFT_ADD",
					200,
					save,
					"Shift added successfully"
				);
			} else {
				return commonResponse.error(
					res,
					"DEFAULT_INTERNAL_SERVER_ERROR",
					400
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
	 *  List
	 */
	list: async (req, res) => {
		try {
			let list = await Service.list(req.query);
			if (list.length > 0) {
				return commonResponse.success(
					res,
					"SHIFT_LIST",
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
			console.log("List SHIFT -> ", error);
			return commonResponse.CustomError(
				res,
				"DEFAULT_INTERNAL_SERVER_ERROR",
				500,
				{},
				error.message
			);
		}
	},

	sigleList: async (req, res) => {
		const { id } = req.params;
		try {
			let list = await Service.fetchSingleList(id);
			if (list.length > 0) {
				return commonResponse.success(
					res,
					"SHIFT_LIST",
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
			console.log("List SHIFT -> ", error);
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
