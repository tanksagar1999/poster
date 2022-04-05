const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
let softDelete = require("mongoosejs-soft-delete");

const Schema = mongoose.Schema;

const shiftsSchema = new Schema(
	{
		userName: {
			type: String,
			defaut: "User",
		},
		register_id: {
			type: Schema.Types.ObjectId,
			ref: "registers",
			required: true,
		},

		action: {
			type: String,
			enum: ["open", "close"],
			required: false,
		},
		ontime: {
			type: Date,
			default: new Date(),
			required: false,
		},
		opening_balance: {
			type: Number,
			required: false,
		},
		closing_balance: {
			type: Number,
			required: false,
		},
		actual_time: {
			type: Date,
			required: true,
		},
		view_summary: {
			type: Object,
			required: false,
		},
		user_id: {
			type: Schema.Types.ObjectId,
			// ref: "restaurant_users",
			required: true,
		},
	},
	{ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

shiftsSchema.plugin(softDelete);

const Shifts = mongoose.model("shifts", shiftsSchema);

module.exports = Shifts;
