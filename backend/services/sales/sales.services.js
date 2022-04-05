const { commonResponse } = require("../../helper");
const Model = require("./sales.model");
const mongoose = require("mongoose");
const moment = require("moment");

/*
 *  Save
 */
exports.save = async (reqBody) => {
	try {
		const newSales = new Model(reqBody);
		return await newSales.save();
	} catch (error) {
		console.log("Error : ", error);
		return new Error(error);
	}
};

/*
 *  List
 */
exports.list = async (req) => {
	try {
		let query = {};

		query = req;

		return await Model.find(query)
			.skip(parseInt(req.offset))
			.limit(parseInt(req.limit))
			.sort({
				created_at: -1,
			})
			.lean();
	} catch (error) {
		console.log("Error : ", error);
		return new Error(error);
	}
};

exports.bookingList = async (req) => {
	try {
		let query = {};

		query = req;
		query["details.saleType"] = "booking";
		query["details.paymentStatus"] = "unpaid";
		query["draftList"] = true;
		return await Model.find(query)
			.skip(parseInt(req.offset))
			.limit(parseInt(req.limit))
			.sort({
				created_at: -1,
			})
			.lean();
	} catch (error) {
		console.log("Error : ", error);
		return new Error(error);
	}
};

/*
 *  Update
 */
exports.update = async (id, reqBody) => {
	try {
		let update = await Model.findOneAndUpdate(
			{
				_id: id,
			},
			{
				$set: reqBody,
			},
			{
				new: true,
			}
		).lean();
		return update;
	} catch (error) {
		console.log("Error : ", error);
		return new Error(error);
	}
};

/*
 *  Delete
 */
exports.delete = async (query) => {
	try {
		return await Model.removeOne({
			_id: id,
		});
	} catch (error) {
		return error;
	}
};

exports.deleteBooking = async (req) => {
	try {
		let query = {};
		query = req;
		return await Model.remove(query);
	} catch (error) {
		return error;
	}
};

/*
 *  Delete multiple
 */
exports.deleteAll = async (reqBody) => {
	try {
		return await Model.removeMany({
			_id: {
				$in: reqBody.ids,
			},
		});
	} catch (error) {
		return error;
	}
};
/*
 *  Get By Registered Id
 */
exports.getByRegisteredId = async (req) => {
	try {
		return await Model.findOne(req);
	} catch (error) {
		return error;
	}
};

/*
 *  Get By Id
 */
exports.getById = async (id) => {
	try {
		return await Model.findById(id);
	} catch (error) {
		return error;
	}
};

exports.getLastPurchaseditems = async (req) => {
	try {
		console.log("Req =>", req);
		let filter = Model.findOne({
			"details.paymentStatus": "paid",
			"customer.mobile": req.mobile,
			// register_id: mongoose.Types.ObjectId(req.register_id),
		})
			.populate([
				{
					path: "register_id",
					select: "register_name -_id",
				},
			])
			.sort({
				created_at: -1,
			})
			.lean();
		return filter;
	} catch (error) {
		console.log("Error =>", error);
	}
};

exports.getOrdersByCustomers = async (req) => {
	console.log("getOrdersByCustomers.req => :: ", req);
	delete req.register_id;
	let filter = await Model.aggregate([
		{
			$match: {
				"details.paymentStatus": "paid",
				deleted: false,
				"customer.mobile": req.mobile,
			},
		},
		{
			$group: {
				_id: null,
				sum: {
					$sum: {
						$toDouble: "$details.priceSummery.total",
					},
				},
				count: {
					$sum: 1,
				},
			},
		},
	]);
	return filter;
};

//Dashboard related apis START
exports.getTotalOrders = async (req) => {
	console.log("getTotalOrders ==> :: Query :: =>", req);
	// if (req.register_id != "allRegister") {
	let filter = await Model.aggregate([
		{
			$match: {
				created_at: {
					$gte: new Date(req.startDate + " 00:00:00"),
					$lt: new Date(req.endDate + " 23:59:59"),
				},
				mainRegisterId: mongoose.Types.ObjectId(req.main_register_id),
				// user_id: mongoose.Types.ObjectId(req.user_id),
				"details.fulfillmentStatus": { $ne: "cancelled" },
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
	return filter.length > 0 ? filter[0].sum : 0;
	// } else {
	// 	let filter = await Model.aggregate([
	// 		{
	// 			$match: {
	// 				created_at: {
	// 					$gte: new Date(req.startDate + " 00:00:00"),
	// 					$lt: new Date(req.endDate + " 23:59:59"),
	// 				},
	// 				// user_id: mongoose.Types.ObjectId(req.user_id),
	// 				"details.fulfillmentStatus": { $ne: "cancelled" },
	// 				"details.paymentStatus": "paid",
	// 				deleted: false,
	// 			},
	// 		},
	// 		{
	// 			$addFields: {
	// 				totals: { $toDouble: "$details.priceSummery.total" },
	// 			},
	// 		},
	// 		{
	// 			$group: {
	// 				_id: null,
	// 				sum: {
	// 					$sum: "$totals",
	// 				},
	// 			},
	// 		},
	// 	]);
	// 	console.log("getTotalOrders :: filter :: =>", filter);
	// 	return filter.length > 0 ? filter[0].sum : 0;
	// }
};

exports.getUserOrders = async (req) => {
	if (req.id) {
		let filter = await Model.aggregate([
			{
				$match: {
					created_at: {
						$gte: new Date(req.startDate + " 00:00:00"),
						$lt: new Date(req.endDate + " 23:59:59"),
					},
					register_id: mongoose.Types.ObjectId(req.id),
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
		return filter.length > 0 ? filter[0].sum : 0;
	} else {
		let filter = await Model.aggregate([
			{
				$match: {
					created_at: {
						$gte: new Date(req.startDate + " 00:00:00"),
						$lt: new Date(req.endDate + " 23:59:59"),
					},
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
		return filter.length > 0 ? filter[0].sum : 0;
	}
};

exports.getTopSellingOfDay = async (req) => {
	// return await Model.aggregate([
	//     //filter the likes creation dates as you need
	//     { $match  :  {
	//          created_at: {
	//                 $gte: new Date(req.startDate + " 00:00:00"),
	//                 $lt: new Date(req.endDate + " 23:59:59")
	//          },
	//          register_id :mongoose.Types.ObjectId(req.register_id)
	//         }
	//     },
	//     // Converting array to object to each raw
	//     { $unwind: "$details.itemsSold" },
	//     //group by post ID and count them
	//     { $group  : { _id: "$details.itemsSold.item", count: {$sum: 1} } },
	//     //sort by count, descending
	//     { $sort   : { count : -1 } },
	//     //limit the results in 5 maximum (if you need only the top 5)
	//     { $limit  : 5 }
	// ]);
	if (req.register_id != "allRegister") {
		let data = await Model.aggregate([
			//filter the likes creation dates as you need
			{
				$match: {
					created_at: {
						$gte: new Date(req.startDate + " 00:00:00"),
						$lt: new Date(req.endDate + " 23:59:59"),
					},
					"details.paymentStatus": "paid",
					"details.fulfillmentStatus": { $ne: "cancelled" },
					register_id: mongoose.Types.ObjectId(req.main_register_id),
					user_id: mongoose.Types.ObjectId(req.user_id),
				},
			},
			// Converting array to object to each raw
			{
				$unwind: "$details.itemsSold",
			},
			{
				$addFields: {
					totals: { $toDouble: "$details.itemsSold.quantity" },
				},
			},
			//group by post ID and count them
			{
				$group: {
					_id: "$details.itemsSold.item",
					count: {
						$sum: "$totals",
					},
				},
			},
			//sort by count, descending
			{
				$sort: {
					count: -1,
				},
			},
			//limit the results in 5 maximum (if you need only the top 5)
			{ $limit: 5 },
		]);
		console.log("Data =>", data);
		return data;
	} else {
		let data = await Model.aggregate([
			//filter the likes creation dates as you need
			{
				$match: {
					created_at: {
						$gte: new Date(req.startDate + " 00:00:00"),
						$lt: new Date(req.endDate + " 23:59:59"),
					},
					"details.paymentStatus": "paid",
					"details.fulfillmentStatus": { $ne: "cancelled" },
					mainRegisterId: mongoose.Types.ObjectId(
						req.main_register_id
					),
				},
			},
			// Converting array to object to each raw
			{
				$unwind: "$details.itemsSold",
			},
			{
				$addFields: {
					totals: { $toDouble: "$details.itemsSold.quantity" },
				},
			},
			//group by post ID and count them
			{
				$group: {
					_id: "$details.itemsSold.item",
					count: {
						$sum: "$totals",
					},
				},
			},
			//sort by count, descending
			{
				$sort: {
					count: -1,
				},
			},
			//limit the results in 5 maximum (if you need only the top 5)
			{ $limit: 5 },
		]);
		console.log("Data =>", data);
		return data;
	}
};

exports.getUsersTopSellingOfDay = async (req) => {
	if (req.id) {
		let data = await Model.aggregate([
			//filter the likes creation dates as you need
			{
				$match: {
					created_at: {
						$gte: new Date(req.startDate + " 00:00:00"),
						$lt: new Date(req.endDate + " 23:59:59"),
					},
					"details.fulfillmentStatus": { $ne: "cancelled" },
					"details.paymentStatus": "paid",
					register_id: mongoose.Types.ObjectId(req.id),
				},
			},
			// Converting array to object to each raw
			{
				$unwind: "$details.itemsSold",
			},
			{
				$addFields: {
					totals: { $toDouble: "$details.itemsSold.quantity" },
				},
			},
			//group by post ID and count them
			{
				$group: {
					_id: "$details.itemsSold.item",
					count: {
						$sum: "$totals",
					},
				},
			},
			//sort by count, descending
			{
				$sort: {
					count: -1,
				},
			},
			//limit the results in 5 maximum (if you need only the top 5)
			{ $limit: 5 },
		]);
		return data;
	} else {
		let data = await Model.aggregate([
			//filter the likes creation dates as you need
			{
				$match: {
					created_at: {
						$gte: new Date(req.startDate + " 00:00:00"),
						$lt: new Date(req.endDate + " 23:59:59"),
					},
					"details.fulfillmentStatus": { $ne: "cancelled" },
					"details.paymentStatus": "paid",
				},
			},
			// Converting array to object to each raw
			{
				$unwind: "$details.itemsSold",
			},
			{
				$addFields: {
					totals: { $toDouble: "$details.itemsSold.quantity" },
				},
			},
			//group by post ID and count them
			{
				$group: {
					_id: "$details.itemsSold.item",
					count: {
						$sum: "$totals",
					},
				},
			},
			//sort by count, descending
			{
				$sort: {
					count: -1,
				},
			},
			//limit the results in 5 maximum (if you need only the top 5)
			{ $limit: 5 },
		]);
		return data;
	}
};

// Top Sell
exports.topList = async (req) => {
	// console.log("date", yesterday, today);
	return await Model.aggregate([
		//filter the likes creation dates as you need
		{
			$match: {
				// created_at: {
				//     $gte: yesterday,
				//     $lt: today
				// },
				register_id: mongoose.Types.ObjectId(req.register_id),
				"details.paymentStatus": "paid",
			},
		},
		// Converting array to object to each raw
		{
			$unwind: "$details.itemsSold",
		},
		{
			$addFields: {
				totals: { $toDouble: "$details.itemsSold.quantity" },
			},
		},
		//group by post ID and count them
		{
			$group: {
				_id: "$details.itemsSold.id",
				count: {
					$sum: "$totals",
				},
			},
		},
		//sort by count, descending
		{
			$sort: {
				created_at: -1,
			},
		},
	]).limit(10);
};

exports.getTotalBookings = async (req) => {
	if (req.register_id != "allRegister") {
		try {
			let filter = await Model.aggregate([
				{
					$match: {
						"details.saleType": "booking",
						"details.paymentStatus": "unpaid",
						"details.fulfillmentStatus": { $ne: "cancelled" },
						created_at: {
							$gte: new Date(req.startDate + " 00:00:00"),
							$lt: new Date(req.endDate + " 23:59:59"),
						},
						user_id: mongoose.Types.ObjectId(req.user_id),
						register_id: mongoose.Types.ObjectId(req.register_id),
						deleted: false,
					},
				},
				{
					$group: {
						_id: null,
						count: {
							$sum: 1,
						},
					},
				},
			]);
			return filter;
		} catch (error) {
			console.log("Error : ", error);
			return new Error(error);
		}
	} else {
		try {
			let filter = await Model.aggregate([
				{
					$match: {
						"details.saleType": "booking",
						"details.paymentStatus": "unpaid",
						"details.fulfillmentStatus": { $ne: "cancelled" },
						created_at: {
							$gte: new Date(req.startDate + " 00:00:00"),
							$lt: new Date(req.endDate + " 23:59:59"),
						},
						// user_id: mongoose.Types.ObjectId(req.user_id),
						mainRegisterId: mongoose.Types.ObjectId(
							req.main_register_id
						),
						deleted: false,
					},
				},
				{
					$group: {
						_id: null,
						count: {
							$sum: 1,
						},
					},
				},
			]);
			return filter;
		} catch (error) {
			console.log("Error : ", error);
			return new Error(error);
		}
	}
};

exports.getUsersTotalBookings = async (req) => {
	try {
		if (req.id) {
			let filter = await Model.aggregate([
				{
					$match: {
						"details.saleType": "booking",
						"details.paymentStatus": "unpaid",
						"details.fulfillmentStatus": { $ne: "cancelled" },
						created_at: {
							$gte: new Date(req.startDate + " 00:00:00"),
							$lt: new Date(req.endDate + " 23:59:59"),
						},
						register_id: mongoose.Types.ObjectId(req.id),
						deleted: false,
					},
				},
				{
					$group: {
						_id: null,
						count: {
							$sum: 1,
						},
					},
				},
			]);
			return filter;
		} else {
			let filter = await Model.aggregate([
				{
					$match: {
						"details.saleType": "booking",
						"details.paymentStatus": "unpaid",
						"details.fulfillmentStatus": { $ne: "cancelled" },
						created_at: {
							$gte: new Date(req.startDate + " 00:00:00"),
							$lt: new Date(req.endDate + " 23:59:59"),
						},
						deleted: false,
					},
				},
				{
					$group: {
						_id: null,
						count: {
							$sum: 1,
						},
					},
				},
			]);
			return filter;
		}
	} catch (error) {
		console.log("Error : ", error);
		return new Error(error);
	}
};

exports.getPaymentSummary = async (req) => {
	if (req.register_id != "allRegister") {
		try {
			let filter = await Model.aggregate([
				{
					$match: {
						created_at: {
							$gte: new Date(req.startDate + " 00:00:00"),
							$lte: new Date(req.endDate + " 23:59:59"),
						},
						register_id: mongoose.Types.ObjectId(req.register_id),
						user_id: mongoose.Types.ObjectId(req.user_id),
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
						sum: {
							$sum: "$totals",
						},
					},
				},
			]);
			console.log("Filter Data => ", filter);
			return filter;
		} catch (error) {
			console.log("Error : ", error);
			return new Error(error);
		}
	} else {
		try {
			let filter = await Model.aggregate([
				{
					$match: {
						created_at: {
							$gte: new Date(req.startDate + " 00:00:00"),
							$lte: new Date(req.endDate + " 23:59:59"),
						},
						mainRegisterId: mongoose.Types.ObjectId(
							req.main_register_id
						),
						// user_id: mongoose.Types.ObjectId(req.user_id),
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
						sum: {
							$sum: "$totals",
						},
					},
				},
			]);
			console.log("Filter Data => ", filter);
			return filter;
		} catch (error) {
			console.log("Error : ", error);
			return new Error(error);
		}
	}
};

exports.getUsersPaymentSummary = async (req) => {
	try {
		if (req.id) {
			let filter = await Model.aggregate([
				{
					$match: {
						created_at: {
							$gte: new Date(req.startDate + " 00:00:00"),
							$lte: new Date(req.endDate + " 23:59:59"),
						},
						register_id: mongoose.Types.ObjectId(req.id),
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
			console.log("Filter Data => ", filter);
			return filter;
		} else {
			let filter = await Model.aggregate([
				{
					$match: {
						created_at: {
							$gte: new Date(req.startDate + " 00:00:00"),
							$lte: new Date(req.endDate + " 23:59:59"),
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
			console.log("Filter Data => ", filter);
			return filter;
		}
	} catch (error) {
		console.log("Error : ", error);
		return new Error(error);
	}
};

exports.getPaymentCustomFieldCount = async (req) => {
	if (req.register_id != "allRegister") {
		try {
			let filter = await Model.aggregate([
				{
					$match: {
						created_at: {
							$gte: new Date(req.startDate + " 00:00:00"),
							$lte: new Date(req.endDate + " 23:59:59"),
						},
						register_id: mongoose.Types.ObjectId(req.register_id),
						user_id: mongoose.Types.ObjectId(req.user_id),
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
						sum: {
							$sum: "$totals",
						},
					},
				},
			]);
			let gpay = 0,
				phonepe = 0,
				paytm = 0,
				sum = 0;
			for (data of filter) {
				console.log("Data => ", data);
				if (data.id != "Cash" && data._id == "Google Pay") {
					// console.log("Google Pay sum,",data.sum);
					gpay = parseInt(data.sum);
				} else if (data._id == "Phone Pe") {
					phonepe = parseInt(data.sum);
				} else if (data._id == "Paytm") {
					paytm = parseInt(data.sum);
				}
				// console.log('GPAY is =>', typeof(gpay) )
				sum = gpay + phonepe + paytm;
				console.log("sum => ", sum);
			}
			return sum;
		} catch (error) {
			console.log("Error : ", error);
			return new Error(error);
		}
	} else {
		try {
			let filter = await Model.aggregate([
				{
					$match: {
						created_at: {
							$gte: new Date(req.startDate + " 00:00:00"),
							$lte: new Date(req.endDate + " 23:59:59"),
						},
						// user_id: mongoose.Types.ObjectId(req.user_id),
						mainRegisterId: mongoose.Types.ObjectId(
							req.main_register_id
						),
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
						sum: {
							$sum: "$totals",
						},
					},
				},
			]);
			let gpay = 0,
				phonepe = 0,
				paytm = 0,
				sum = 0;
			for (data of filter) {
				console.log("Data => ", data);
				if (data.id != "Cash" && data._id == "Google Pay") {
					// console.log("Google Pay sum,",data.sum);
					gpay = parseInt(data.sum);
				} else if (data._id == "Phone Pe") {
					phonepe = parseInt(data.sum);
				} else if (data._id == "Paytm") {
					paytm = parseInt(data.sum);
				}
				// console.log('GPAY is =>', typeof(gpay) )
				sum = gpay + phonepe + paytm;
				console.log("sum => ", sum);
			}
			return sum;
		} catch (error) {
			console.log("Error : ", error);
			return new Error(error);
		}
	}
};

exports.getUSersPaymentCustomFieldCount = async (req) => {
	try {
		if (req.id) {
			let filter = await Model.aggregate([
				{
					$match: {
						created_at: {
							$gte: new Date(req.startDate + " 00:00:00"),
							$lte: new Date(req.endDate + " 23:59:59"),
						},
						register_id: mongoose.Types.ObjectId(req.id),
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
			let gpay = 0,
				phonepe = 0,
				paytm = 0,
				sum = 0;
			for (data of filter) {
				console.log("Data => ", data);
				if (data.id != "Cash" && data._id == "Google Pay") {
					// console.log("Google Pay sum,",data.sum);
					gpay = parseInt(data.sum);
				} else if (data._id == "Phone Pe") {
					phonepe = parseInt(data.sum);
				} else if (data._id == "Paytm") {
					paytm = parseInt(data.sum);
				}
				// console.log('GPAY is =>', typeof(gpay) )
				sum = gpay + phonepe + paytm;
				console.log("sum => ", sum);
			}
			return sum;
		} else {
			let filter = await Model.aggregate([
				{
					$match: {
						created_at: {
							$gte: new Date(req.startDate + " 00:00:00"),
							$lte: new Date(req.endDate + " 23:59:59"),
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
			let gpay = 0,
				phonepe = 0,
				paytm = 0,
				sum = 0;
			for (data of filter) {
				console.log("Data => ", data);
				if (data.id != "Cash" && data._id == "Google Pay") {
					// console.log("Google Pay sum,",data.sum);
					gpay = parseInt(data.sum);
				} else if (data._id == "Phone Pe") {
					phonepe = parseInt(data.sum);
				} else if (data._id == "Paytm") {
					paytm = parseInt(data.sum);
				}
				// console.log('GPAY is =>', typeof(gpay) )
				sum = gpay + phonepe + paytm;
				console.log("sum => ", sum);
			}
			return sum;
		}
	} catch (error) {
		console.log("Error : ", error);
		return new Error(error);
	}
};

exports.getHourlySelling = async (req) => {
	if (req.register_id != "allRegister") {
		try {
			let data;
			console.log("req.query getHourlySelling =>", req);
			if (req.type == "today" || req.type == "yesterday") {
				data = await Model.aggregate([
					{
						$match: {
							created_at: {
								$gte: new Date(req.startDate + " 00:00:00"),
								$lt: new Date(req.endDate + " 23:59:59"),
							},
							register_id: mongoose.Types.ObjectId(
								req.register_id
							),
							user_id: mongoose.Types.ObjectId(req.user_id),
							"details.paymentStatus": "paid",
							"details.fulfillmentStatus": { $ne: "cancelled" },
							deleted: false,
						},
					},
					{
						$project: {
							h: {
								$hour: {
									date: "$created_at",
									timezone: "Asia/Kolkata",
								},
							},
							"details.priceSummery.total": 1,
						},
					},
					{
						$group: {
							_id: "$h",
							total: {
								$sum: {
									$toDouble: "$details.priceSummery.total",
								},
							},
						},
					},
				]);
			} else if (req.type == "this_month") {
				data = await Model.aggregate([
					{
						$match: {
							created_at: {
								$gte: new Date(req.startDate + " 00:00:00"),
								$lt: new Date(req.endDate + " 23:59:59"),
							},
							register_id: mongoose.Types.ObjectId(
								req.register_id
							),
							user_id: mongoose.Types.ObjectId(req.user_id),
							"details.paymentStatus": "paid",
							"details.fulfillmentStatus": { $ne: "cancelled" },
							deleted: false,
						},
					},
					{
						$project: {
							d: {
								$dayOfMonth: {
									date: "$created_at",
									timezone: "Asia/Kolkata",
								},
							},
							"details.priceSummery.total": 1,
						},
					},
					{
						$group: {
							_id: "$d",
							total: {
								$sum: {
									$toDouble: "$details.priceSummery.total",
								},
							},
						},
					},
				]);
			} else if (req.type == "last_month") {
				data = await Model.aggregate([
					{
						$match: {
							created_at: {
								$gte: new Date(req.startDate + " 00:00:00"),
								$lt: new Date(req.endDate + " 23:59:59"),
							},
							register_id: mongoose.Types.ObjectId(
								req.register_id
							),
							user_id: mongoose.Types.ObjectId(req.user_id),
							"details.paymentStatus": "paid",
							"details.fulfillmentStatus": { $ne: "cancelled" },
							deleted: false,
						},
					},
					{
						$project: {
							d: {
								$dayOfMonth: {
									date: "$created_at",
									timezone: "Asia/Kolkata",
								},
							},
							"details.priceSummery.total": 1,
						},
					},
					{
						$group: {
							_id: "$d",
							total: {
								$sum: {
									$toDouble: "$details.priceSummery.total",
								},
							},
						},
					},
				]);
			} else {
				data = await Model.aggregate([
					{
						$match: {
							created_at: {
								$gte: new Date(req.startDate + " 00:00:00"),
								$lt: new Date(req.endDate + " 23:59:59"),
							},
							register_id: mongoose.Types.ObjectId(
								req.register_id
							),
							user_id: mongoose.Types.ObjectId(req.user_id),
							"details.paymentStatus": "paid",
							"details.fulfillmentStatus": { $ne: "cancelled" },
							deleted: false,
						},
					},
					{
						$project: {
							d: {
								$dayOfMonth: {
									date: "$created_at",
									timezone: "Asia/Kolkata",
								},
							},
							"details.priceSummery.total": 1,
						},
					},
					{
						$group: {
							_id: "$d",
							total: {
								$sum: {
									$toDouble: "$details.priceSummery.total",
								},
							},
						},
					},
				]);
			}

			console.log("getHourlySelling =>", data);
			return data;
		} catch (error) {
			console.log("Error as =>", error);
		}
	} else {
		try {
			let data;
			console.log("req.query getHourlySelling =>", req);
			if (req.type == "today" || req.type == "yesterday") {
				data = await Model.aggregate([
					{
						$match: {
							created_at: {
								$gte: new Date(req.startDate + " 00:00:00"),
								$lt: new Date(req.endDate + " 23:59:59"),
							},
							// user_id: mongoose.Types.ObjectId(req.user_id),
							mainRegisterId: mongoose.Types.ObjectId(
								req.main_register_id
							),
							"details.paymentStatus": "paid",
							"details.fulfillmentStatus": { $ne: "cancelled" },
							deleted: false,
						},
					},
					{
						$project: {
							h: {
								$hour: {
									date: "$created_at",
									timezone: "Asia/Kolkata",
								},
							},
							"details.priceSummery.total": 1,
						},
					},
					{
						$group: {
							_id: "$h",
							total: {
								$sum: {
									$toDouble: "$details.priceSummery.total",
								},
							},
						},
					},
				]);
			} else if (req.type == "this_month") {
				data = await Model.aggregate([
					{
						$match: {
							created_at: {
								$gte: new Date(req.startDate + " 00:00:00"),
								$lt: new Date(req.endDate + " 23:59:59"),
							},
							// user_id: mongoose.Types.ObjectId(req.user_id),
							mainRegisterId: mongoose.Types.ObjectId(
								req.main_register_id
							),
							"details.paymentStatus": "paid",
							"details.fulfillmentStatus": { $ne: "cancelled" },
							deleted: false,
						},
					},
					{
						$project: {
							d: {
								$dayOfMonth: {
									date: "$created_at",
									timezone: "Asia/Kolkata",
								},
							},
							"details.priceSummery.total": 1,
						},
					},
					{
						$group: {
							_id: "$d",
							total: {
								$sum: {
									$toDouble: "$details.priceSummery.total",
								},
							},
						},
					},
				]);
			} else if (req.type == "last_month") {
				data = await Model.aggregate([
					{
						$match: {
							created_at: {
								$gte: new Date(req.startDate + " 00:00:00"),
								$lt: new Date(req.endDate + " 23:59:59"),
							},
							// user_id: mongoose.Types.ObjectId(req.user_id),
							mainRegisterId: mongoose.Types.ObjectId(
								req.main_register_id
							),
							"details.paymentStatus": "paid",
							"details.fulfillmentStatus": { $ne: "cancelled" },
							deleted: false,
						},
					},
					{
						$project: {
							d: {
								$dayOfMonth: {
									date: "$created_at",
									timezone: "Asia/Kolkata",
								},
							},
							"details.priceSummery.total": 1,
						},
					},
					{
						$group: {
							_id: "$d",
							total: {
								$sum: {
									$toDouble: "$details.priceSummery.total",
								},
							},
						},
					},
				]);
			} else {
				data = await Model.aggregate([
					{
						$match: {
							created_at: {
								$gte: new Date(req.startDate + " 00:00:00"),
								$lt: new Date(req.endDate + " 23:59:59"),
							},
							// user_id: mongoose.Types.ObjectId(req.user_id),
							mainRegisterId: mongoose.Types.ObjectId(
								req.main_register_id
							),
							"details.paymentStatus": "paid",
							"details.fulfillmentStatus": { $ne: "cancelled" },
							deleted: false,
						},
					},
					{
						$project: {
							d: {
								$dayOfMonth: {
									date: "$created_at",
									timezone: "Asia/Kolkata",
								},
							},
							"details.priceSummery.total": 1,
						},
					},
					{
						$group: {
							_id: "$d",
							total: {
								$sum: {
									$toDouble: "$details.priceSummery.total",
								},
							},
						},
					},
				]);
			}

			console.log("getHourlySelling =>", data);
			return data;
		} catch (error) {
			console.log("Error as =>", error);
		}
	}
};

exports.getUSersHourlySelling = async (req) => {
	try {
		let data;
		if (req.id) {
			if (req.type == "today" || req.type == "yesterday") {
				data = await Model.aggregate([
					{
						$match: {
							created_at: {
								$gte: new Date(req.startDate + " 00:00:00"),
								$lt: new Date(req.endDate + " 23:59:59"),
							},
							register_id: mongoose.Types.ObjectId(req.id),
							"details.paymentStatus": "paid",
							deleted: false,
						},
					},
					{
						$project: {
							h: {
								$hour: {
									date: "$created_at",
									timezone: "Asia/Kolkata",
								},
							},
							"details.priceSummery.total": 1,
						},
					},
					{
						$group: {
							_id: "$h",
							total: {
								$sum: {
									$toDouble: "$details.priceSummery.total",
								},
							},
						},
					},
				]);
			} else if (req.type == "this_month") {
				data = await Model.aggregate([
					{
						$match: {
							created_at: {
								$gte: new Date(req.startDate + " 00:00:00"),
								$lt: new Date(req.endDate + " 23:59:59"),
							},
							register_id: mongoose.Types.ObjectId(req.id),
							"details.paymentStatus": "paid",
							deleted: false,
						},
					},
					{
						$project: {
							d: {
								$dayOfMonth: {
									date: "$created_at",
									timezone: "Asia/Kolkata",
								},
							},
							"details.priceSummery.total": 1,
						},
					},
					{
						$group: {
							_id: "$d",
							total: {
								$sum: {
									$toDouble: "$details.priceSummery.total",
								},
							},
						},
					},
				]);
			} else if (req.type == "last_month") {
				data = await Model.aggregate([
					{
						$match: {
							created_at: {
								$gte: new Date(req.startDate + " 00:00:00"),
								$lt: new Date(req.endDate + " 23:59:59"),
							},
							register_id: mongoose.Types.ObjectId(req.id),
							"details.paymentStatus": "paid",
							deleted: false,
						},
					},
					{
						$project: {
							d: {
								$dayOfMonth: {
									date: "$created_at",
									timezone: "Asia/Kolkata",
								},
							},
							"details.priceSummery.total": 1,
						},
					},
					{
						$group: {
							_id: "$d",
							total: {
								$sum: {
									$toDouble: "$details.priceSummery.total",
								},
							},
						},
					},
				]);
			} else {
				data = await Model.aggregate([
					{
						$match: {
							created_at: {
								$gte: new Date(req.startDate + " 00:00:00"),
								$lt: new Date(req.endDate + " 23:59:59"),
							},
							register_id: mongoose.Types.ObjectId(req.id),
							"details.paymentStatus": "paid",
							deleted: false,
						},
					},
					{
						$project: {
							d: {
								$dayOfMonth: {
									date: "$created_at",
									timezone: "Asia/Kolkata",
								},
							},
							"details.priceSummery.total": 1,
						},
					},
					{
						$group: {
							_id: "$d",
							total: {
								$sum: {
									$toDouble: "$details.priceSummery.total",
								},
							},
						},
					},
				]);
			}
		} else {
			if (req.type == "today" || req.type == "yesterday") {
				data = await Model.aggregate([
					{
						$match: {
							created_at: {
								$gte: new Date(req.startDate + " 00:00:00"),
								$lt: new Date(req.endDate + " 23:59:59"),
							},
							"details.paymentStatus": "paid",
							deleted: false,
						},
					},
					{
						$project: {
							h: {
								$hour: {
									date: "$created_at",
									timezone: "Asia/Kolkata",
								},
							},
							"details.priceSummery.total": 1,
						},
					},
					{
						$group: {
							_id: "$h",
							total: {
								$sum: {
									$toDouble: "$details.priceSummery.total",
								},
							},
						},
					},
				]);
			} else if (req.type == "this_month") {
				data = await Model.aggregate([
					{
						$match: {
							created_at: {
								$gte: new Date(req.startDate + " 00:00:00"),
								$lt: new Date(req.endDate + " 23:59:59"),
							},
							"details.paymentStatus": "paid",
							deleted: false,
						},
					},
					{
						$project: {
							d: {
								$dayOfMonth: {
									date: "$created_at",
									timezone: "Asia/Kolkata",
								},
							},
							"details.priceSummery.total": 1,
						},
					},
					{
						$group: {
							_id: "$d",
							total: {
								$sum: {
									$toDouble: "$details.priceSummery.total",
								},
							},
						},
					},
				]);
			} else if (req.type == "last_month") {
				data = await Model.aggregate([
					{
						$match: {
							created_at: {
								$gte: new Date(req.startDate + " 00:00:00"),
								$lt: new Date(req.endDate + " 23:59:59"),
							},
							"details.paymentStatus": "paid",
							deleted: false,
						},
					},
					{
						$project: {
							d: {
								$dayOfMonth: {
									date: "$created_at",
									timezone: "Asia/Kolkata",
								},
							},
							"details.priceSummery.total": 1,
						},
					},
					{
						$group: {
							_id: "$d",
							total: {
								$sum: {
									$toDouble: "$details.priceSummery.total",
								},
							},
						},
					},
				]);
			} else {
				data = await Model.aggregate([
					{
						$match: {
							created_at: {
								$gte: new Date(req.startDate + " 00:00:00"),
								$lt: new Date(req.endDate + " 23:59:59"),
							},
							"details.paymentStatus": "paid",
							deleted: false,
						},
					},
					{
						$project: {
							d: {
								$dayOfMonth: {
									date: "$created_at",
									timezone: "Asia/Kolkata",
								},
							},
							"details.priceSummery.total": 1,
						},
					},
					{
						$group: {
							_id: "$d",
							total: {
								$sum: {
									$toDouble: "$details.priceSummery.total",
								},
							},
						},
					},
				]);
			}
		}

		return data;
	} catch (error) {
		console.log("Error as =>", error);
	}
};

//Dashboard related apis END

/*
 *  Export
 */
exports.export = async (req) => {
	try {
		let query = {};

		query = req;
		console.log(query);
		return await Model.aggregate([
			{
				$match: {
					created_at: {
						$gte: new Date(query.startDate + " 00:00:00"),
						$lt: new Date(query.endDate + " 23:59:59"),
					},
					register_id: mongoose.Types.ObjectId(req.register_id),
					deleted: false,
				},
			},
			{
				$sort: {
					created_at: -1,
				},
			},
			// {
			// 	$lookup: {
			// 		from: "registers",
			// 		localField: "register_id",
			// 		foreignField: "_id",
			// 		as: "registers",
			// 	},
			// },
			// {
			// 	$unwind: "$registers",
			// return await Model.find(query)
			// 	.skip(parseInt(req.offset))
			// 	.limit(parseInt(req.limit))
			// 	.sort({
			// 		created_at: -1,
			// 	})
			// 	.lean();
			// {
			// 	$sort: {
			// 		created_at: -1,
			// 	},
			// },
			// {
			// 	$match: {
			// 		created_at: {
			// 			$gte: new Date(query.startDate + " 00:00:00"),
			// 			$lt: new Date(query.endDate + " 23:59:59"),
			// 		},
			// 		register_id: mongoose.Types.ObjectId(req.register_id),
			// 	},
			// },
		]);
	} catch (error) {
		console.log("Error : ", error);
		return new Error(error);
	}
};
