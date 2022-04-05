const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
let softDelete = require("mongoosejs-soft-delete");

const Schema = mongoose.Schema;

const salesSchema = new Schema(
	{
		register_id: {
			type: Schema.Types.ObjectId,
			ref: "registers",
			required: false,
		},
		mainRegisterId: {
			type: Schema.Types.ObjectId,
			ref: "registers",
			required: false,
		},
		user_id: {
			type: Schema.Types.ObjectId,
			// ref : "restaurant_users",
			required: true,
		},
		customer: {
			type: Object,
			required: false,
		},
		details: {
			type: Object,
			required: false,
		},
		order_by: {
			type: Schema.Types.ObjectId,
			ref: "restaurant_users",
			required: true,
		},
		draftList: {
			type: Boolean,
			default: false,
		},
		cancellation: {
			type: Object,
			required: false,
		},
		actual_time: {
			type: Date,
			required: true,
		},
		ReceiptNumber: {
			type: String,
			required: true,
		},
	},
	{ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

salesSchema.plugin(softDelete);

const Sales = mongoose.model("sales", salesSchema);

module.exports = Sales;
