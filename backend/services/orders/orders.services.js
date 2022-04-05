const { commonResponse } = require("../../helper");
const Model = require("./orders.model");
const mongoose = require("mongoose");

/*
 *  Save
 */
exports.save = async (reqBody) => {
	try {
		const newCustomers = new Model(reqBody);
		return await newCustomers.save();
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
				$lookup: {
					from: "registers",
					localField: "register_id",
					foreignField: "_id",
					as: "registers",
				},
			},
			{
				$unwind: "$registers",
			},
			{
				$lookup: {
					from: "customers",
					localField: "customer_id",
					foreignField: "_id",
					as: "customers",
				},
			},
			{
				$unwind: "$customers",
			},
			{
				$lookup: {
					from: "discount_rules",
					localField: "coupon_applied",
					foreignField: "_id",
					as: "coupons",
				},
			},
			{
				$unwind: "$coupons",
			},

			{
				$project: {
					date: "$created_at",
					mobile: "$customers.mobile",
					name: "$customers.name",
					shipping_address: "$customers.shipping_address",
					register_id: "$registers.register_name",
					payment_status: "$paymentStatus",
					coupon_applied: "$coupons.coupon_code",
					totals: "$totals",
					paid_by: "$payment_type",
					cancellation_reason:
						"$cancellation_details.cancellation_reason",
					refund_amount: "$cancellation_details.refund_amount",
					refund_paid_by: "$cancellation_details.refund_pay_type",
					_id: "$_id",
				},
			},
			{
				$sort: {
					date: -1,
				},
			},
			// {
			//     $match: {
			//         date: {
			//             $gte: new Date(query.startDate + " 00:00:00"),
			//             $lt: new Date(query.endDate + " 23:59:59")
			//         }
			//     }
			// },
		]);
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
exports.delete = async (id) => {
	try {
		return await Model.removeOne({
			_id: id,
		});
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
 *  Get By Id
 */
exports.getById = async (id) => {
	try {
		return await Model.findById(id);
	} catch (error) {
		return error;
	}
};

exports.getTotalOrders = async (req) => {
	let filter = await Model.aggregate([
		{
			$match: {
				created_at: {
					$gte: new Date(req.date + " 00:00:00"),
					$lt: new Date(req.date + " 23:59:59"),
				},
				paymentStatus: "paid",
				deleted: false,
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
};

exports.getPaymentSummary = async (req) => {
	let filter = await Model.aggregate([
		{
			$match: {
				created_at: {
					$gte: new Date(req.date + " 00:00:00"),
					$lt: new Date(req.date + " 23:59:59"),
				},
				paymentStatus: "paid",
				deleted: false,
			},
		},
		{
			$group: {
				_id: {
					type: "$payment_type",
				},
				sales: {
					$sum: "$totals",
				},
			},
		},
	]);
	return filter;
};

exports.getOrdersByDates = async (req) => {
	return Model.find({
		created_at: {
			$gte: new Date(req.startDate + " 00:00:00"),
			$lt: new Date(req.endDate + " 23:59:59"),
		},
		paymentStatus: "paid",
	})
		.populate([
			{
				path: "register_id",
				select: "register_name -_id",
			},
		])
		.lean();

	console.log("Error : ", error);
	return new Error(error);
};

exports.getOrdersByCustomers = async (req) => {
	let filter = await Model.aggregate([
		{
			$match: {
				paymentStatus: "paid",
				deleted: false,
				customer_id: req.customer_id,
			},
		},
		{
			$group: {
				_id: null,
				sum: {
					$sum: "$totals",
				},
				count: {
					$sum: 1,
				},
			},
		},
	]);
	return filter;
};

exports.getLastPurchaseditems = async (req) => {
	let filter = Model.findOne({
		paymentStatus: "paid",
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
};

exports.getDaywiseSales = async (req) => {
	let filter = await Model.aggregate([
		{
			$match: {
				created_at: {
					$gte: new Date(req.startDate + " 00:00:00"),
					$lt: new Date(req.endDate + " 23:59:59"),
				},
				paymentStatus: { $in: req.paymentStatus },
				status: { $in: req.status },
				register_id: mongoose.Types.ObjectId(req.register_id),
				deleted: false,
				payment_type: { $in: req.payment_type },
			},
		},
		{
			$group: {
				_id: {
					$dateToString: {
						format: "%Y-%m-%d",
						date: "$created_at",
					},
				},
				sales: {
					$sum: "$totals",
				},
				count: { $sum: 1 },
			},
		},
		{ $sort: { created_at: -1 } },
	]);
	return filter;
};
