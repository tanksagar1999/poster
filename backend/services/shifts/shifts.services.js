const { commonResponse } = require("../../helper");
const mongoose = require("mongoose");
const Model = require("./shifts.model");
const SalesModel = require("../sales/sales.model");
const ProductsModel = require("../products/products.model");
const PettyCashesModel = require("../petty_cash/petty_cash.model");
const serviceModel = require("../sales/sales.model");
const pettyCashModel = require("../petty_cash/petty_cash.model");
/*
 *  Save New
 */
exports.save = async (reqBody) => {
	const newShifts = new Model(reqBody);
	return await newShifts.save();
};

/*
 *  List
 */
exports.list = async (req) => {
	console.log("Req.query in list 123 :: =>", req);
	if (req.register_id != "allRegister") {
		return Model.find({
			// register_id: mongoose.Types.ObjectId(req.register_id),
			user_id: mongoose.Types.ObjectId(req.main_register_id),
		})
			.populate([
				{
					path: "register_id",
					select: "register_name _id",
				},
				{
					path: "created_by",
					select: "full_name _id",
				},
			])
			.sort({ created_at: -1 })
			.limit(5)
			.lean();
	} else {
		return Model.find({
			user_id: mongoose.Types.ObjectId(req.main_register_id),
		})
			.populate([
				{
					path: "register_id",
					select: "register_name _id",
				},
				{
					path: "created_by",
					select: "full_name _id",
				},
			])
			.sort({ created_at: -1 })
			.limit(5)
			.lean();
	}
};

exports.UsersList = async (req) => {
	let query = req;
	if (req.id) {
		return Model.find({ register_id: query.id })
			.populate([
				{
					path: "register_id",
					select: "register_name _id",
				},
				{
					path: "created_by",
					select: "full_name _id",
				},
			])
			.sort({ created_at: -1 })
			.limit(5)
			.lean();
	} else {
		return Model.find()
			.populate([
				{
					path: "register_id",
					select: "register_name _id",
				},
				{
					path: "created_by",
					select: "full_name _id",
				},
			])
			.sort({ created_at: -1 })
			.limit(5)
			.lean();
	}
};

// fetching list by is

(exports.fetchSingleList = async (req) => {
	let query = req;
	let Sales = await SalesModel.findById(query);
	let Product = await ProductsModel.findById(query);
	let PettyCash = await PettyCashesModel.findById(query);

	return { Sales, Product, PettyCash };
}),
	(exports.getById = async (id) => {
		try {
			return await Model.findById(id);
		} catch (error) {
			console.log(error);
		}
	});

// Get by registered ID
exports.getByRegisteredId = async (req) => {
	try {
		return await Model.findOne(req);
	} catch (error) {
		return error;
	}
};

exports.getStartRecord = async (req) => {
	try {
		console.log("getStartRecord() :: req.id =>", req.id);
		let data = await Model.find({ user_id: req.id })
			.sort({ _id: -1 })
			.limit(1);
		return data[0];
	} catch (error) {
		console.log("Error AS =>", error);
	}
};

exports.getRecordsonActualTime = async (startTime, endTime) => {
	try {
		let filterData = await serviceModel.aggregate([
			{
				$match: {
					actual_time: {
						$gte: startTime,
						$lt: endTime,
					},
					deleted: false,
				},
			},
		]);
		return filterData[0];
	} catch (error) {
		console.log("Error As =>", error);
	}
};

// Get Total sales order between shift start and end time
exports.getTotalOrdersByTime = async (startDate, endDate) => {
	try {
		let filter = await serviceModel.aggregate([
			{
				$match: {
					actual_time: {
						$gte: startDate,
						$lt: endDate,
					},
					// _id: mongoose.Types.ObjectId(req),
					"details.paymentStatus": "paid",
					deleted: false,
				},
			},
			{
				$addFields: {
					totals: { $toDouble: "$details.priceSummery.total" },
				},
			},
			{
				$group: {
					_id: null,
					sum: {
						$sum: "$totals",
					},
				},
			},
		]);
		return parseInt(filter.length > 0 ? filter[0].sum : 0);
	} catch (error) {
		console.log("Error =>", error);
	}
};

// Get Active Receipt based on time
exports.getActiveReceiptsByTime = async (startTime, endTime) => {
	try {
		let filter = await serviceModel.aggregate([
			{
				$match: {
					actual_time: {
						$gte: startTime,
						$lt: endTime,
					},
					// _id: mongoose.Types.ObjectId(req),
					"details.paymentStatus": "paid",
					"details.fulfillmentStatus": "Fulfilled",
					deleted: false,
				},
			},
			{
				$count: "sum",
			},
		]);
		return filter.length > 0 ? filter[0].sum : 0;
	} catch (error) {
		console.log("Error =>", error);
	}
};

// Get Cancel Receipt based on time
exports.getCancelReceiptsByTime = async (startTime, endTime) => {
	try {
		let filter = await serviceModel.aggregate([
			{
				$match: {
					actual_time: {
						$gte: startTime,
						$lt: endTime,
					},
					// _id: mongoose.Types.ObjectId(req),
					"details.paymentStatus": "paid",
					"details.fulfillmentStatus": "cancelled",
					deleted: false,
				},
			},
			{
				$count: "sum",
			},
		]);
		return filter.length > 0 ? filter[0].sum : 0;
	} catch (error) {
		console.log("error =>", error);
	}
};

exports.paymentSummary = async (startTime, endTime) => {
	try {
		let filter = await serviceModel.aggregate([
			{
				$match: {
					created_at: {
						$gte: startTime,
						$lte: endTime,
					},
					"details.immediate_sale.multiple_payments_type.value": {
						$ne: null,
					},
					"details.paymentStatus": "paid",
					deleted: false,
				},
			},
			{ $unwind: "$details.immediate_sale.multiple_payments_type" },
			{
				$addFields: {
					totals: {
						$toDouble:
							"$details.immediate_sale.multiple_payments_type.value",
					},
				},
			},
			{
				$group: {
					_id: "$details.immediate_sale.multiple_payments_type.name",
					sum: {
						$sum: "$totals",
					},
				},
			},
		]);

		// Multiple Payment Type amount calcula
		let multiplePaymentType = await serviceModel.aggregate([
			{
				$match: {
					created_at: {
						$gte: startTime,
						$lte: endTime,
					},
					"details.immediate_sale.multiple_payments_type": {
						$ne: null,
					},
					"details.paymentStatus": "paid",
					deleted: false,
				},
			},
			{ $unwind: "$details.immediate_sale.multiple_payments_type" },
			{
				$addFields: {
					paymentList:
						"$details.immediate_sale.multiple_payments_type.payment_type_list",
				},
			},
			{ $unwind: "$paymentList" },
			{
				$addFields: {
					paymentListValue: { $toDouble: "$paymentList.price" },
				},
			},
			{
				$group: {
					_id: "$paymentList.name",
					sum: {
						$sum: "$paymentListValue",
					},
				},
			},
		]);
		console.log("filter =>", filter);
		console.log("multiplePaymentType =>", multiplePaymentType);

		let filterAmount;
		let multiplePaymentTypeAmount;

		// if(filterAmount != null) {
		//     filterAmount = filter.reduce(function (a, b) {
		//         if(aN) {
		//             return {sum: a.sum + b.sum}; // returns object with property x
		//         }else{
		//             return {sum : 0}
		//         }
		//     })
		// }else {
		//    filterAmount.sum = 0;
		// }

		// multiplePaymentTypeAmount = multiplePaymentType.reduce(function (a, b) {
		//     console.log("multiplePaymentTypeAmount -> Loop => ",a);
		//     if(a) {
		//         return {sum: a.sum + b.sum}; // returns object with property x
		//     }else {
		//         return {sum : 0}
		//     }
		// })

		console.log("multiplePaymentType =>", multiplePaymentTypeAmount);

		// let result = filterAmount ? filterAmount.sum : 0 + multiplePaymentTypeAmount ? multiplePaymentTypeAmount.sum : 0;
		let result = {};
		result.filter = filter;
		result.multiplePaymentType = multiplePaymentType;
		return result;
	} catch (error) {
		console.log("Error : ", error);
		return new Error(error);
	}
};

exports.getPaymentTotal = async (startTime, endTime) => {
	try {
		let filter = await serviceModel.aggregate([
			{
				$match: {
					created_at: {
						$gte: startTime,
						$lte: endTime,
					},
					"details.immediate_sale.multiple_payments_type.value": {
						$ne: null,
					},
					"details.paymentStatus": "paid",
					deleted: false,
				},
			},
			{ $unwind: "$details.immediate_sale.multiple_payments_type" },
			{
				$addFields: {
					totals: {
						$toDouble:
							"$details.immediate_sale.multiple_payments_type.value",
					},
				},
			},
			{
				$group: {
					_id: "$details.immediate_sale.multiple_payments_type.name",
					sum: {
						$sum: "$totals",
					},
				},
			},
		]);
		console.log("filter =>", filter);
		return filter;
	} catch (error) {
		console.log("error in getPaymentTotal=>", error);
	}
};

exports.getPaymentReceiptCount = async (startTime, endTime) => {
	try {
		let count = {};
		let receipt = await serviceModel.aggregate([
			{
				$match: {
					created_at: {
						$gte: startTime,
						$lte: endTime,
					},
					"details.paymentStatus": "paid",
					"details.fulfillmentStatus": { $ne: "cancelled" },
					deleted: false,
				},
			},
			{ $unwind: "$details.immediate_sale.multiple_payments_type" },
			{
				$addFields: {
					totals: {
						$toDouble:
							"$details.immediate_sale.multiple_payments_type.value",
					},
				},
			},
			{
				$group: {
					_id: "$details.immediate_sale.multiple_payments_type.name",
					count: {
						$sum: 1,
					},
				},
			},
		]);
		console.log("receits :: >", receipt);
		count.receipts = receipt.length > 0 ? receipt : [];

		// Refunded records count calculation
		let refundFilter = await serviceModel.aggregate([
			{
				$match: {
					created_at: {
						$gte: startTime,
						$lte: endTime,
					},
					// 'details.paymentStatus': "paid",
					cancellation: {
						$exists: true,
					},
					deleted: false,
				},
			},
			{
				$addFields: {
					totals: {
						$toDouble: "$cancellation.refund_amount",
					},
				},
			},
			{
				$group: {
					_id: "$cancellation.refund_pay_type",
					count: {
						$sum: 1,
					},
				},
			},
		]);

		count.refunds = refundFilter.length > 0 ? refundFilter : [];
		return count;
	} catch (error) {
		console.log("Error : ", error);
		return new Error(error);
	}
};

exports.getCashOutRefunds = async (startTime, endTime) => {
	try {
		let receipt = await serviceModel.aggregate([
			{
				$match: {
					created_at: {
						$gte: startTime,
						$lte: endTime,
					},
					"cancellation.refund_amount": { $ne: null },
					deleted: false,
				},
			},
			{ $unwind: "$cancellation" },
			{
				$addFields: {
					totals: { $toDouble: "$cancellation.refund_amount" },
				},
			},
			{
				$group: {
					_id: "$cancellation.refund_pay_type",
					sum: {
						$sum: "$totals",
					},
				},
			},
		]);
		return receipt.length > 0 ? receipt : [];
	} catch (error) {
		console.log("error as =>", error);
	}
};

exports.getPettyCashInCount = async (startTime, endTime) => {
	try {
		let filter = await pettyCashModel.aggregate([
			{
				$match: {
					created_at: {
						$gte: startTime,
						$lte: endTime,
					},
					type: "cash_in",
					status: "uncancelled",
					deleted: false,
				},
			},
			{
				$addFields: {
					totals: { $toDouble: "$amount" },
				},
			},
			{
				$group: {
					_id: "$type",
					sum: {
						$sum: "$totals",
					},
				},
			},
		]);
		// console.log("Filter Data petty cash => ", filter);
		return filter.length > 0 ? filter[0] : 0;
	} catch (error) {
		console.log("Error as =>", error);
		return new Error(error);
	}
};

exports.getPettyCashOutCount = async (startDate, endDate) => {
	try {
		let filter = await pettyCashModel.aggregate([
			{
				$match: {
					created_at: {
						$gte: startDate,
						$lte: endDate,
					},
					type: "cash_out",
					status: "uncancelled",
					deleted: false,
				},
			},
			{
				$addFields: {
					totals: { $toDouble: "$amount" },
				},
			},
			{
				$group: {
					_id: "$type",
					// type : {type : '$type'},
					sum: {
						$sum: "$totals",
					},
				},
			},
		]);
		// console.log("Filter Data petty cash out => ", filter);
		return filter.length > 0 ? filter[0] : 0;
	} catch (error) {
		console.log("Error as =>", error);
		return new Error(error);
	}
};
