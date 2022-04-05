const { commonResponse } = require("../../helper");
const Model = require("./custom_fields.model");
const mongoose = require("mongoose");

/*
 *  Add New
 */
exports.save = async (reqBody) => {
	const newCustomField = new Model(reqBody);
	return await newCustomField.save();
};

/*
 *  List
 */
exports.list = async (req) => {
	let query = req;
	return await Model.find(query).sort({ created_at: -1 }).lean();
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

exports.getFields = async (req) => {
	let query = req;
	query.user_id = mongoose.Types.ObjectId(req.user_id);
	console.log("query ==>", query);

	return await Model.find(query).select("name type tag_color -_id").lean();
};
