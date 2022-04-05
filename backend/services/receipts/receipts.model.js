const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
let softDelete = require("mongoosejs-soft-delete");

const Schema = mongoose.Schema;

const receiptsSchema = new Schema(
	{
		receipt_number: {
			type: String,
			required: true,
		},
		user_id: {
			type: Schema.Types.ObjectId,
			required: true,
		},
		register_id: {
			type: Schema.Types.ObjectId,
			ref: "registers",
			required: true,
		},
		order_id: {
			type: Schema.Types.ObjectId,
			ref: "sales",
			required: true,
		},
		lastNumber: {
			type: Number,
			required: true,
		},
		cookie: {
			type: Number,
			required: false,
		},
		mainRegisterId: {
			type: Schema.Types.ObjectId,
			required: true,
		},
		// status: {
		//     type: String,
		//     enum: ["fulfilled", "cancelled"],
		//     default:"fulfilled",
		//     required:true,
		// },
	},
	{ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

receiptsSchema.plugin(softDelete);

const Receipts = mongoose.model("receipts", receiptsSchema);

module.exports = Receipts;
