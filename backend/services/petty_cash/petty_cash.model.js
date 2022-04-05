const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
let softDelete = require("mongoosejs-soft-delete");

const Schema = mongoose.Schema;

const pettyCashSchema = new Schema(
	{
		type: {
			type: String,
			enum: ["cash_in", "cash_out"],
			default: "cash_in",
			required: true,
		},
		register_id: {
			type: Schema.Types.ObjectId,
			ref: "registers",
			required: false,
		},
		mainRegisterId: {
			type: Schema.Types.ObjectId,
			ref: "registers",
			required: true,
		},
		user_id: {
			type: Schema.Types.ObjectId,
			ref: "restaurant_users",
			required: false,
		},
		category: {
			type: Schema.Types.ObjectId,
			ref: "custom_fields",
			required: false,
		},
		amount: {
			type: Number,
			default: 0,
			required: true,
		},
		notes: {
			type: String,
			default: "",
			//  required: true
		},
		status: {
			type: String,
			enum: ["cancelled", "uncancelled"],
			default: "uncancelled",
			required: true,
		},
		actual_time: {
			type: Date,
			required: true,
		},
		cancelled_by: {
			type: Schema.Types.ObjectId,
			ref: "restaurant_users",
			required: false,
		},
	},
	{ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

pettyCashSchema.plugin(softDelete);

const pettyCash = mongoose.model("petty_cash", pettyCashSchema);

module.exports = pettyCash;
