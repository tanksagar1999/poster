const { commonResponse } = require("../../helper");
const Model = require("./customers.model");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

/*
 *  Save New Registers
 */
exports.save = async (reqBody) => {
	const newCustomers = new Model(reqBody);
	return await newCustomers.save();
};

exports.saveMany = async (reqBody) => {
	return await Model.insertMany(reqBody);
};

/*
 *  List
 */
exports.list = async (req) => {
	let query = {};
	query = Object.assign({}, req);
	// delete query["register_id"];
	console.log("list.query=>", query);
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

	return await Model.find(query)
		.populate([
			{
				path: "register_id",
				select: "register_name",
			},
		])
		.skip(skip)
		.limit(limit)
		.sort({ created_at: -1 })
		.lean();
};
exports.Alllist = async (req) => {
	let query = {};
	query = req;

	return await Model.find(query).lean();
};

exports.getTotalNumberOfCustomers = async (req) => {
	console.log("getTotalNumberOfCustomers.req.query :: =>", req);
	let query = {};
	query = Object.assign({}, req);
	if (query.page && query.limit) {
		delete query.page;
		delete query.limit;
	}
	query.deleted = false;
	return await Model.countDocuments(query).lean();
};
/*
 *  Export
 */
exports.export = async (req) => {
	let query = {};

	query = req;

	return await Model.aggregate([
		{
			$lookup: {
				from: "registers",
				localField: "register_id",
				foreignField: "_id",
				as: "registers",
			},
		},
		{ $unwind: "$registers" },
		{
			$project: {
				mobile: "$mobile",
				name: "$name",
				email: "$email",
				shipping_address: "$shipping_address",
				city: "$city",
				zipcode: "$zipcode",
				register_id: "$register_id",
				register_name: "$registers.register_name",
				created_at: "$created_at",
			},
		},
		{ $sort: { created_at: -1 } },
		{ $match: { register_id: ObjectId(query.register_id) } },
	]);
};
/*
 *  Update
 */
exports.update = async (id, reqBody) => {
	let update = await Model.findOneAndUpdate(
		{ _id: id },
		{ $set: reqBody },
		{ new: true }
	).lean();
	return update;
};

exports.updateByCondition = async (condition, reqBody) => {
	let update = await Model.findOneAndUpdate(
		condition,
		{ $set: reqBody },
		{ new: true }
	).lean();
	return update;
};

/*
 *  Delete
 */
exports.delete = async (id) => {
	return await Model.removeOne({ _id: id });
};

/*
 *  Delete multiple
 */
exports.deleteAll = async (reqBody) => {
	return await Model.removeMany({ _id: { $in: reqBody.ids } });
};
/*
 *  Get By Id
 */
exports.getById = async (id) => {
	return await Model.findById(id)
		.populate([
			{
				path: "register_id",
				select: "register_name",
			},
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
/*
 *  Get number of customers by date
 */
exports.getTotalCustomers = async (req) => {
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
	// 		//   register_id: req.register_id,
	// 	});
	// 	return filter;
	// }
};

exports.getUsersCustomers = async (req) => {
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
			register_id: mongoose.Types.ObjectId(req.id),
		});
		return filter;
	}
};
