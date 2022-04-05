const { commonResponse } = require("../../helper");
const Model = require("./petty_cash.model");
const mongoose = require("mongoose");

/*
 *  Add New
 */
exports.save = async (reqBody) => {
	const newPettyCash = new Model(reqBody);
	return await newPettyCash.save();
};

/*
 *  List
 */
exports.list = async (req) => {
	console.log("req :: =>", req);
	let query = {};
	query.register_id = req.register_id;
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
	console.log("Query ==>", query);
	return await Model.find(query)
		.populate([
			{
				path: "user_id",
				select: "username -_id",
			},
			{
				path: "register_id",
				select: "register_name",
			},
			{
				path: "category",
				select: "name",
			},
		])
		.skip(skip)
		.limit(limit)
		.sort({ created_at: -1 })
		.lean();
};

exports.getTotalNumberOfPettyCash = async (req) => {
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
 *  Search by date
 */
exports.searchbydate = async (req) => {
	console.log("searchbydate req. =>", req);
	return await Model.find({
		created_at: {
			$gte: new Date(req.startDate + " 00:00:00"),
			$lt: new Date(req.endDate + " 23:59:59"),
		},
		register_id: { $in: req.register_id },
	})
		.populate([
			{
				path: "user_id",
				select: "username -_id",
			},
			{
				path: "register_id",
				select: "register_name",
			},
			{
				path: "cancelled_by",
				select: "username -_id",
			},
			{
				path: "category",
				select: "name",
			},
		])
		.lean();
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
	return await Model.findById(id);
};

// Get by registered ID
exports.getByRegisteredId = async (req) => {
	try {
		return await Model.findOne(req);
	} catch (error) {
		return error;
	}
};

exports.getPettyCashInCount = async (req) => {
	console.log("req =>", req);
	if (req.register_id != "allRegister") {
		try {
			console.log("Request =>", req);
			let filter = await Model.aggregate([
				{
					$match: {
						created_at: {
							$gte: new Date(req.startDate + " 00:00:00"),
							$lte: new Date(req.endDate + " 23:59:59"),
						},
						register_id: mongoose.Types.ObjectId(req.register_id),
						user_id: mongoose.Types.ObjectId(req.user_id),
						type: "cash_in",
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
			console.log("Filter Data petty cash => ", filter);
			return filter;
		} catch (error) {
			console.log("Error as =>", error);
			return new Error(error);
		}
	} else {
		try {
			console.log("Request =>", req);
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
						type: "cash_in",
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
			console.log("Filter Data petty cash => ", filter);
			return filter;
		} catch (error) {
			console.log("Error as =>", error);
			return new Error(error);
		}
	}
};

exports.getUsersPettyCashInCount = async (req) => {
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
						type: "cash_in",
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
			console.log("Filter Data petty cash => ", filter);
			return filter;
		} else {
			let filter = await Model.aggregate([
				{
					$match: {
						created_at: {
							$gte: new Date(req.startDate + " 00:00:00"),
							$lte: new Date(req.endDate + " 23:59:59"),
						},
						type: "cash_in",
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
			console.log("Filter Data petty cash => ", filter);
			return filter;
		}
	} catch (error) {
		console.log("Error as =>", error);
		return new Error(error);
	}
};

exports.getPettyCashOutCount = async (req) => {
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
						type: "cash_out",
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
			console.log("Filter Data petty cash out => ", filter);
			return filter;
		} catch (error) {
			console.log("Error as =>", error);
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
						type: "cash_out",
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
			console.log("Filter Data petty cash out => ", filter);
			return filter;
		} catch (error) {
			console.log("Error as =>", error);
			return new Error(error);
		}
	}
};

exports.getUsersPettyCashOutCount = async (req) => {
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
						type: "cash_out",
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
			console.log("Filter Data petty cash out => ", filter);
			return filter;
		} else {
			let filter = await Model.aggregate([
				{
					$match: {
						created_at: {
							$gte: new Date(req.startDate + " 00:00:00"),
							$lte: new Date(req.endDate + " 23:59:59"),
						},
						type: "cash_out",
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
			console.log("Filter Data petty cash out => ", filter);
			return filter;
		}
	} catch (error) {
		console.log("Error as =>", error);
		return new Error(error);
	}
};

exports.getPettyCashCount = async (req) => {
	try {
		let pettyCashInData = 0;
		let pettyCashOutData = 0;
		pettyCashInData = await this.getPettyCashInCount(req);
		pettyCashOutData = await this.getPettyCashOutCount(req);

		if (pettyCashInData) {
			for (cashIn of pettyCashInData) {
				// console.log("cashIn => ",cashIn);
				pettyCashInData = cashIn.sum;
				// console.log("pettyCashInData => ", pettyCashInData);
			}
		}
		console.log("pettyCashInData =>", pettyCashInData);

		if (pettyCashOutData) {
			for (cashOut of pettyCashOutData) {
				// console.log("cashIn => ",cashOut);
				pettyCashOutData = cashOut.sum;
				// console.log("pettyCashOutData => ",pettyCashOutData);
			}
		}
		console.log("pettyCashOutData =>", pettyCashOutData);

		let sum = pettyCashInData - pettyCashOutData;
		let response = {};
		response.cashIn = pettyCashInData;
		response.cashOut = pettyCashOutData;
		response.sum = sum;
		console.log("response => ", response);
		return response;
	} catch (error) {
		console.log("Errors as =>", error);
		return new Error(error);
	}
};

exports.getUsersPettyCashCount = async (req) => {
	try {
		let pettyCashInData = await this.getUsersPettyCashInCount(req);
		let pettyCashOutData = await this.getUsersPettyCashOutCount(req);

		if (pettyCashInData) {
			for (cashIn of pettyCashInData) {
				// console.log("cashIn => ",cashIn);
				pettyCashInData = cashIn.sum;
				// console.log("pettyCashInData => ",pettyCashInData);
			}
		}

		if (pettyCashOutData) {
			for (cashOut of pettyCashOutData) {
				// console.log("cashIn => ",cashOut);
				pettyCashOutData = cashOut.sum;
				// console.log("pettyCashOutData => ",pettyCashOutData);
			}
		}

		let sum = parseInt(pettyCashInData) - parseInt(pettyCashOutData);
		let response = {};
		response.cashIn = pettyCashInData;
		response.cashOut = pettyCashOutData;
		response.sum = sum;
		console.log("response => ", response);
		return response;
	} catch (error) {
		console.log("Errors as =>", error);
		return new Error(error);
	}
};
