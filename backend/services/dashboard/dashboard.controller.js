const { commonResponse } = require("../../helper");
const { ordersServices } = require("../orders");
const { salesServices } = require("../sales");
const { shiftsServices } = require("../shifts");
const { receiptsServices } = require("../receipts");
const { customersServices } = require("../customers");
const { pettyCashServices } = require("../petty_cash");
const moment = require("moment");

module.exports = {
	/*
	 *  List
	 */
	list: async (req, res) => {
		try {
			if (!req.query.startDate && !req.query.endDate) {
				req.query.startDate = moment().format("YYYY-MM-DD");
				req.query.endDate = moment().format("YYYY-MM-DD");
			}
			req.query.user_id = req.user.id;
			req.query.main_register_id = req.user.main_register_id;

			console.log("Req.Query => ", req.query);

			// if(req.query.startDate && req.query.endDate){
			//     req.query.startDate = moment().format("YYYY-MM-DD");
			//     req.query.endDate = moment().format("YYYY-MM-DD");
			// }

			let dashboard = {};

			dashboard.total_sales = await salesServices.getTotalOrders(
				req.query
			);
			dashboard.total_bills = await receiptsServices.getTotalBills(
				req.query
			);
			dashboard.new_customers = await customersServices.getTotalCustomers(
				req.query
			);
			dashboard.top_selling = await salesServices.getTopSellingOfDay(
				req.query
			);
			dashboard.hourly_selling = await salesServices.getHourlySelling(
				req.query
			);
			dashboard.total_booking = await salesServices.getTotalBookings(
				req.query
			);

			dashboard.payment_summary = await salesServices.getPaymentSummary(
				req.query
			);
			dashboard.paymentCustomFields =
				await salesServices.getPaymentCustomFieldCount(req.query);
			dashboard.pettyCash = await pettyCashServices.getPettyCashCount(
				req.query
			);
			dashboard.recent_activity = await shiftsServices.list(req.query);
			//dashboard.payment_summary = {};
			//dashboard.payment_summary.card = ps.filter(el => return (el._id.type=='card') ? el.sales : 0 );

			console.log("Dashboard Data =>", dashboard);
			if (dashboard) {
				return commonResponse.success(
					res,
					"DASHBOARD_DETAIL",
					200,
					dashboard,
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

	userList: async (req, res) => {
		try {
			if (!req.query.startDate && !req.query.endDate) {
				req.query.startDate = moment().format("YYYY-MM-DD");
				req.query.endDate = moment().format("YYYY-MM-DD");
			}

			let dashboard = {};

			dashboard.total_sales = await salesServices.getUserOrders(
				req.query
			);
			dashboard.total_bills = await receiptsServices.getUsersBills(
				req.query
			);
			dashboard.new_customers = await customersServices.getUsersCustomers(
				req.query
			);
			dashboard.top_selling = await salesServices.getUsersTopSellingOfDay(
				req.query
			);
			dashboard.hourly_selling =
				await salesServices.getUSersHourlySelling(req.query);
			dashboard.total_booking = await salesServices.getUsersTotalBookings(
				req.query
			);

			dashboard.payment_summary =
				await salesServices.getUsersPaymentSummary(req.query);
			dashboard.paymentCustomFields =
				await salesServices.getUSersPaymentCustomFieldCount(req.query);
			dashboard.pettyCash =
				await pettyCashServices.getUsersPettyCashCount(req.query);
			dashboard.recent_activity = await shiftsServices.UsersList(
				req.query
			);
			if (dashboard) {
				return commonResponse.success(
					res,
					"DASHBOARD_DETAIL",
					200,
					dashboard,
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

	viewSummary: async (req, res) => {
		try {
		} catch (error) {}
	},
};
