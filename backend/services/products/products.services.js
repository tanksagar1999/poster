const { commonResponse } = require("../../helper");
const Model = require("./products.model");
const mongoose = require("mongoose");
const { parseString } = require("fast-csv");
const ObjectId = mongoose.Types.ObjectId;

/*
 *  Save New Registers
 */
exports.save = async (reqBody) => {
	const newProducts = new Model(reqBody);
	return await newProducts.save();
};

exports.saveMany = async (reqBody) => {
	return await Model.insertMany(reqBody);
};

/*
 *  List Registers
 */
exports.list = async (req, localCheck) => {
	let query = {};
	query = Object.assign({}, req);

	if (req.limit && req.limit != "") {
		limit = await parseInt(req.limit);
	} else {
		limit = 0;
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

	if (req.product_name) {
		//  query = {product_name:{$regex: '.*' + req.product_name.toLowerCase() + '.*' }};
		//query = {product_name:{$regex: new RegExp("^" + req.product_name.toLowerCase(), "i")}};
		query.product_name = {
			$regex: new RegExp("^" + req.product_name + "$", "i"),
		};
	}

	return Model.find(query)
		.populate([
			{
				path: "register_id",
				select: "register_name _id",
			},
			{
				path: "product_category",
				select: "category_name",
				populate: {
					path: "order_ticket_group",
					select: "order_ticket_group_name _id",
				},
			},
			{
				path: "tax_group",
				select: "tax_group_name taxes_inclusive_in_product_price _id",
				populate: {
					path: "taxes",
					select: "tax_name tax_percentage",
				},
			},
			{
				path: "option_variant_group",
				select: "variant_group_name sort_order _id",
				populate: {
					path: "product_variants",
					// select:"variant_name"
				},
			},
			{
				path: "option_addon_group",
				select: "addon_group_name sort_order minimum_selectable maximum_selectable",
				populate: {
					path: "product_addons",
				},
			},
			{
				path: "option_item_group",
				populate: {
					path: "product_variants products",
					populate: {
						path: "product_id variant_id",
						// select : "product_name price"
					},
				},
				// select: "item_group_name",
			},
		])
		.sort({ sort_order: 1 })
		.skip(skip)
		.limit(limit)
		.lean();
};
exports.listwithfilter = async (req) => {
	let query = {};
	query = Object.assign({}, req);

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

	if (req.product_name && req.product_name != "") {
		query.product_name = {
			$regex: new RegExp(".*" + req.product_name.toLowerCase(), "i"),
		};
		//query.product_name = {$regex: '.*' + req.product_name.toLowerCase() + '.*' };
	} else {
		delete query.product_name;
	}

	if (req.tax_group && req.tax_group.length > 0) {
		query.tax_group = { $in: req.tax_group };
	} else {
		delete query.tax_group;
	}
	if (req.product_category && req.product_category.length > 0) {
		query.product_category = { $in: req.product_category };
	} else {
		delete query.product_category;
	}

	return Model.find(query)
		.populate([
			{
				path: "register_id",
				select: "register_name -_id",
			},
			{
				path: "product_category",
				select: "category_name",
			},
			{
				path: "tax_group",
				select: "tax_group_name -_id",
			},
			{
				path: "option_variant_group",
				select: "variant_group_name -_id",
				populate: {
					path: "product_variants",
					select: "variant_name",
				},
			},
			{
				path: "option_addon_group",
				select: "addon_group_name",
			},
			{
				path: "option_item_group",
				select: "item_group_name",
			},
		])
		.sort({ sort_order: 1 })
		.skip(skip)
		.limit(limit)
		.lean();
};

exports.getTotalNumberOfProducts = async (req) => {
	let query = {};
	query = Object.assign({}, req);
	if (query.page && query.limit) {
		delete query.page;
		delete query.limit;
	}
	query.deleted = false;
	return await Model.count(query).lean();
};
exports.getTotalNumberOfProductsForfilter = async (req) => {
	let query = {};
	query = Object.assign({}, req);
	if (req.product_name) {
		query.product_name = {
			$regex: new RegExp("^" + req.product_name.toLowerCase(), "i"),
		};
	}
	if (query.page && query.limit) {
		delete query.page;
		delete query.limit;
	}
	if (req.tax_group && req.tax_group.length > 0) {
		query.tax_group = { $in: req.tax_group };
	} else {
		delete query.tax_group;
	}
	if (req.product_category && req.product_category.length > 0) {
		query.product_category = { $in: req.product_category };
	} else {
		delete query.product_category;
	}
	query.deleted = false;
	return await Model.count(query).lean();
};
exports.customFind = async (req) => {
	let query = {};
	query = req;
	return Model.find(query).lean();
};
/*
 *  Export
 */
exports.export = async (req) => {
	let query = req;
	return Model.find(query)
		.populate([
			{
				path: "register_id",
				select: "register_name -_id",
			},
			{
				path: "product_category",
				select: "category_name",
			},
			{
				path: "tax_group",
				select: "tax_group_name -_id",
			},
			{
				path: "option_variant_group",
				select: "variant_group_name -_id",
				populate: {
					path: "product_variants",
					select: "variant_name",
				},
			},
			{
				path: "option_addon_group",
				select: "addon_group_name",
			},
			{
				path: "option_item_group",
				select: "item_group_name",
			},
		])
		.lean();
	// return await Model.aggregate([
	//     {
	//         "$lookup": {
	//             "from": "registers",
	//             "localField": "register_id",
	//             "foreignField": "_id",
	//             "as": "registers"
	//         }
	//     },
	//     { "$unwind": "$registers" },
	//     {
	//         "$lookup": {
	//             "from": "product_categories",
	//             "localField": "product_category",
	//             "foreignField": "_id",
	//             "as": "product_categories"
	//         }
	//     },
	//     { "$unwind": "$product_categories" },
	//     {
	//         "$lookup": {
	//             "from": "tax_groups",
	//             "localField": "tax_group",
	//             "foreignField": "_id",
	//             "as": "tax_group"
	//         }
	//     },
	//     { "$unwind": "$tax_group" },

	//     {
	//         "$project": {
	//             "product_name": "$product_name",
	//             "product_category": "$product_categories.category_name",
	//             "tax_group": "$tax_group.tax_group_name",
	//             "price": "$price",
	//             "unit_of_measure" : "$unit_of_measure",
	//             "product_code":"$product_code",
	//             "notes":"$notes",
	//             "register_name": "$registers.register_name",
	//             "register_id":"$register_id",
	//             "created_at": "$created_at"

	//         }
	//     },
	//     { $sort : { created_at : -1 } },
	//     { $match : {register_id:ObjectId(query.register_id)}}
	// ]);
};

/*
 *  Update Registers
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
 *  Delete Registers
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
	return await Model.findById(id).lean();
};

exports.topSellingProductsById = async (id) => {
	return Model.findById(id).populate([
		{
			path: "register_id",
			select: "register_name -_id",
		},
		{
			path: "product_category",
			select: "category_name",
			populate: {
				path: "order_ticket_group",
				select: "order_ticket_group_name _id",
			},
		},
		{
			path: "tax_group",
			select: "tax_group_name taxes_inclusive_in_product_price -_id",
			populate: {
				path: "taxes",
				select: "tax_name tax_percentage",
			},
		},
		{
			path: "option_variant_group",
			select: "variant_group_name sort_order -_id",
			populate: {
				path: "product_variants",
				// select:"variant_name"
			},
		},
		{
			path: "option_addon_group",
			select: "addon_group_name sort_order minimum_selectable maximum_selectable",
			populate: {
				path: "product_addons",
			},
		},
		{
			path: "option_item_group",
			populate: {
				path: "product_variants products",
				populate: {
					path: "product_id variant_id",
					// select : "product_name price"
				},
			},
			// select: "item_group_name",
		},
	]);
};
