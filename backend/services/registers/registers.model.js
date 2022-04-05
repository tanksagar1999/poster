const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
let softDelete = require("mongoosejs-soft-delete");

const Schema = mongoose.Schema;

const registersSchema = new Schema(
	{
		register_name: {
			type: String,
			required: true,
		},
		register_id: {
			type: Schema.Types.ObjectId,
			ref: "registers",
			required: false,
		},
		user_id: {
			type: Schema.Types.ObjectId,
			ref: "users",
			required: false,
		},
		receipt_number_prefix: {
			type: String,
			required: true,
		},
		receipt_number_start_from: {
			type: Number,
			default: "1",
			required: false,
		},
		bill_header: {
			type: String,
			default: "",
			required: false,
		},
		bill_footer: {
			type: String,
			default: "",
			required: false,
		},
		printer_type: {
			type: String,
			enum: ["80mm", "58mm", "A4", "A5"],
			default: "A4",
			required: false,
		},
		print_receipts: {
			type: Boolean,
			default: false,
			required: false,
		},
		include_shop_logo: {
			type: Boolean,
			default: false,
			required: false,
		},
		table_numbers: {
			type: String,
			default: "",
			required: false,
		},
		server_ip_address: {
			type: String,
			default: "",
			required: false,
		},
		kds_stale_time: {
			type: Number,
			default: 0,
			required: false,
		},
		enable_accept_status: {
			type: Boolean,
			default: false,
			required: false,
		},
		enable_served_status: {
			type: Boolean,
			default: false,
			required: false,
		},
		allow_to_change_status: {
			type: Boolean,
			default: false,
			required: false,
		},
		active: {
			type: Boolean,
			default: false,
			required: true,
		},
		is_main: {
			type: Boolean,
			default: false,
			required: true,
		},
	},
	{ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

registersSchema.plugin(softDelete);

const Registers = mongoose.model("registers", registersSchema);

module.exports = Registers;
