const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
let softDelete = require("mongoosejs-soft-delete");

const Schema = mongoose.Schema;

const receiptsSchema = new Schema(
	{
		last_receipt_number: {
			type: String,
			required: true,
		},
		register_id: {
			type: Schema.Types.ObjectId,
			ref: "registers",
			required: true,
		},
		main_register_id: {
			type: Schema.Types.ObjectId,
			ref: "registers",
			required: true,
		},
		device_name: {
			type: String,
			required: true,
		},
	},
	{ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

receiptsSchema.plugin(softDelete);

const Receipts = mongoose.model("last_device", receiptsSchema);

module.exports = Receipts;
