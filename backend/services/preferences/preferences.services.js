const { commonResponse } = require("../../helper");
const Model = require("./preferences.model");

/*
 *  Add New
 */
exports.save = async (reqBody) => {
	const newPreferences = new Model(reqBody);
	return await newPreferences.save();
};

/*
 *  List
 */
exports.list = async (req) => {
	let query = req;
	return await Model.find(query).sort({ created_at: -1 }).lean();
};

/*
 *  get By RegisterId
 */
exports.getByRegisterId = async (id) => {
	return await Model.find({ register_id: id });
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
