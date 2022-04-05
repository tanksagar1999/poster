const { commonResponse } = require("../../helper");
const Model = require("./receipts.model");
const mongoose = require("mongoose");
/*
 *  Save New
 */
exports.save = async (reqBody) => {
	const newTaxes = new Model(reqBody);
	return await newTaxes.save();
};

/*
 *  List
 */
exports.list = async (req) => {
	let query = {};
	// query = Object.assign({}, req);
	query = {
		register_id: req.register_id,
		// user_id: req.id,
	};
	delete query["id"];

	if (req.limit && req.limit != "") {
		limit = await parseInt(req.limit);
	} else {
		limit = 10;
	}

	if (req.page && req.page != "") {
		let page = await parseInt(req.page);
		page = page - 1;
		skip = page * limit;
	} else {
		skip = 0;
	}

	if (query.page && query.limit) {
		delete query.page;
		delete query.limit;
	}

	//return await Model.find(query).skip(parseInt(offset)).limit(parseInt(limit)).sort( { created_at: -1 } ).lean();
	return Model.find(query)
		.populate([
			{
				path: "register_id",
			},
			{
				path: "order_id",
			},
		])
		.skip(skip)
		.limit(parseInt(limit))
		.sort({ created_at: -1 })
		.lean();
};

/*
 *  Update
 */
exports.update = async (id, reqBody) => {
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
};

/*
 *  Delete
 */
exports.delete = async (id) => {
	return await Model.removeOne({
		_id: id,
	});
};

/*
 *  Get By Id
 */
exports.getById = async (id) => {
	//  return await Model.findById(id);
	return Model.findById(id)
		.populate([
			{
				path: "register_id",
			},
			{
				path: "order_id",
				// populate: {
				//     path: "customer_id"
				// },
			},
		])
		.lean();
};

/*
 *  Get By Order Id
 */
exports.getByOrderId = async (id) => {
	let orderId = mongoose.Types.ObjectId(id.order_id);
	console.log("orderId =>", orderId);

	//  return await Model.findById(id);
	return Model.find(id)
		.populate([
			{
				path: "register_id",
			},
			// {
			// 	// path: "order_id",
			// 	// populate: {
			// 	//     path: "customer_id"
			// 	// },
			// },
		])
		.lean();
};

// Get by registered ID
exports.getByRegisteredId = async (req) => {
	try {
		return await Model.findOne(req);
	} catch (error) {
		return error;
	}
};

exports.findLastReceipt = async (query, rid, cookie = "") => {
	// query = {
	//     receipt_number: {
	//         $regex: query + '.*'
	//     },
	//     register_id: rid
	// };
	// // if (cookie) {
	// //     query.cookie = cookie;
	// // }

	// return await Model.findOne(query).sort({
	//     created_at: -1
	// }).lean();

	let data = await Model.find({}).sort({ _id: -1 }).limit(1);
	console.log("data =>", data);
	return data[0];
};

/*
 *  find last receipt with register id
 */
exports.findLastReceiptByRegisterId = async (query, rid, cookie = "") => {
	let data = await Model.find({ register_id: query })
		.sort({ _id: -1 })
		.limit(1);
	console.log("data =>", data);
	return data[0];
};

/*
 *  find last receipt with mainRegisterId
 */
exports.findLastReceiptByMainRegisterId = async (query, rid, cookie = "") => {
	let data = await Model.find({ mainRegisterId: query })
		.sort({ _id: -1 })
		.limit(1);
	console.log("data =>", data);
	return data[0];
};

/*
 *  Search by date
 */
exports.searchbydate = async (req) => {
	return await Model.find({
		created_at: {
			$gte: new Date(req.query.startDate + " 00:00:00"),
			$lt: new Date(req.query.endDate + " 23:59:59"),
		},
	}).lean();
};

/*
 *  Get number of bills by date
 */
exports.getTotalBills = async (req) => {
	// if (req.register_id != "allRegister") {
	let query = {};

	query = req;

	let filter = await Model.countDocuments({
		created_at: {
			$gte: new Date(req.startDate + " 00:00:00"),
			$lt: new Date(req.endDate + " 23:59:59"),
		},
		deleted: false,
		mainRegisterId: mongoose.Types.ObjectId(req.main_register_id),
		// user_id: mongoose.Types.ObjectId(req.user_id),
	});
	return filter;
	// } else {
	// 	let query = {};
	// 	query = req;

	// 	let filter = await Model.countDocuments({
	// 		created_at: {
	// 			$gte: new Date(req.startDate + " 00:00:00"),
	// 			$lt: new Date(req.endDate + " 23:59:59"),
	// 		},
	// 		deleted: false,
	// 		// user_id: mongoose.Types.ObjectId(req.user_id),
	// 	});
	// 	return filter;
	// }
};

exports.getUsersBills = async (req) => {
	let query = {};

	query = req;
	if (req.id) {
		let filter = await Model.countDocuments({
			created_at: {
				$gte: new Date(req.startDate + " 00:00:00"),
				$lt: new Date(req.endDate + " 23:59:59"),
			},
			deleted: false,
			register_id: mongoose.Types.ObjectId(req.id),
		});
		return filter;
	} else {
		let filter = await Model.countDocuments({
			created_at: {
				$gte: new Date(req.startDate + " 00:00:00"),
				$lt: new Date(req.endDate + " 23:59:59"),
			},
			deleted: false,
		});
		return filter;
	}
};

/*
 *  List
 */
exports.getRecentByCustomer = async (req) => {
	return await Model.aggregate([
		{
			$lookup: {
				from: "sales",
				localField: "order_id",
				foreignField: "_id",
				as: "orders",
			},
		},
		{ $unwind: "$orders" },
		{
			$project: {
				created_at: "$created_at",
				receipt_number: "$receipt_number",
				register_id: "$orders.register_id",
				customer_mobile: "$orders.customer.mobile",
				paymentstatus: "$orders.details.paymentStatus",
				deleted: "$deleted",
			},
		},
		{
			$match: {
				customer_mobile: parseInt(req.mobile),
				paymentstatus: "paid",
				// user_id: mongoose.Types.ObjectId(req.user_id),
				deleted: false,
			},
		},
		{ $sort: { created_at: -1 } },
	]);
};

exports.getTotalNumberOfReceipts = async (req) => {
	let query = {};
	query = Object.assign({}, req);
	query = {
		register_id: req.register_id,
		// user_id: req.id,
	};
	if (query.page && query.limit) {
		delete query.page;
		delete query.limit;
	}
	if (query.startDate) {
		query.created_at = {
			$gte: new Date(query.startDate + " 00:00:00"),
			$lt: new Date(query.endDate + " 23:59:59"),
		};
		delete query.startDate;
		delete query.endDate;
	}

	return await Model.countDocuments(query).lean();
};
