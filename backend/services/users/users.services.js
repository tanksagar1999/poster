const { commonResponse } = require("../../helper");
const UsersModel = require("./users.model");

/*
 *  Check Email Exist
 */
exports.is_exist = async (reqBody) => {
	let user = await UsersModel.findOne({ email: reqBody.email }).lean();
	if (!user) {
		return false;
	}
	return user;
};

exports.isMobileExist = async (reqBody) => {
	let user = await UsersModel.findOne({ number: reqBody.number }).lean();
	if (!user) {
		return false;
	}
	return user;
};

/*
 *  statuswiselist
 */
exports.statuswiselist = async (req) => {
	let query = {};
	query = req;
	return await UsersModel.find({ status: req.status })
		.skip(parseInt(req.offset))
		.limit(parseInt(req.limit))
		.sort({
			created_at: -1,
		})
		.lean();
};

/*
 *  List
 */
exports.list = async (req) => {
	let query = {};
	query = req;
	return await UsersModel.find({ status: { $nin: ["pending"] } })
		.skip(parseInt(req.offset))
		.limit(parseInt(req.limit))
		.sort({
			created_at: -1,
		})
		.lean();
};

/*
 *  Get By Id
 */
exports.get = async (id) => {
	let user = await UsersModel.findOne({ _id: id }).lean();
	if (!user) {
		throw new Error(commonResponse.getErrorMessage("USER_NOT_FOUND"));
	}
	return user;
};

/*
 *  Get By Token
 */
exports.getByToken = async (q) => {
	let user = await UsersModel.findOne(q).lean();

	return user;
};

/*
 *  Add New User
 */
exports.save = async (reqbody) => {
	const newUser = new UsersModel(reqbody);
	return await newUser.save();
};

/*
 *  Update User
 */
exports.update = async (id, reqBody) => {
	let updateUserData = await UsersModel.findOneAndUpdate(
		{ _id: id },
		{ $set: reqBody },
		{ new: true }
	).lean();
	return updateUserData;
};

/*
 *  Delete
 */
exports.delete = async (id) => {
	return await UsersModel.removeOne({
		_id: id,
	});
};

exports.deleteAll = async (reqBody) => {
	return await UsersModel.removeMany({ _id: { $in: reqBody.ids } });
};
