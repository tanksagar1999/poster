const { commonResponse } = require("../../helper");
const Model = require("./product_variant_groups.model");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

/*
 *  Save New Product Variant Groups
 */
exports.save = async (reqBody) => {
	const newProductVariantGroups = new Model(reqBody);
	return await newProductVariantGroups.save();
};
exports.saveMany = async (reqBody) => {
	return await Model.insertMany(reqBody);
};
/*
 *  List Product Variant Groups
 */
exports.list = async (req) => {
	let query = req;
	//return await Model.find(query).sort( { created_at: -1 } ).lean();
	return Model.find(query)
		.populate([
			{
				path: "product_variants",
				select: "variant_name",
			},
		])
		.sort({ sort_order: 1 })
		.lean();
};

exports.normalList = async (req) => {
	let query = req;
	return Model.find(query).lean();
};

/*
 *  Update Product Variant Groups
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
 *  Delete Product Variant Groups
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

exports.export = async (req) => {
	let query = req;
	return await Model.aggregate([
		{
			$lookup: {
				from: "product_variants",
				localField: "product_variants",
				foreignField: "_id",
				as: "variants",
			},
		},
		{ $unwind: "$variants" },
		{
			$project: {
				variant_group_name: "$variant_group_name",
				variant_name: "$variants.variant_name",
				variant_comment: "$variants.comment",
				sort_order: "$sort_order",
				register_id: "$register_id",
			},
		},
		{ $sort: { sort_order: 1 } },
		{ $match: { register_id: ObjectId(query.register_id) } },
	]);
};
