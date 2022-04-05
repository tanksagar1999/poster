const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
let softDelete = require("mongoosejs-soft-delete");

const Schema = mongoose.Schema;

const customersSchema = new Schema(
	{
		mobile: {
			type: String,
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
			required: false,
		},
		user_id: {
			type: Schema.Types.ObjectId,
			required: true,
		},
		name: {
			type: String,
			required: false,
		},
		email: {
			type: String,
			required: false,
		},
		shipping_address: {
			type: String,
			required: false,
		},
		city: {
			type: String,
			required: false,
		},
		zipcode: {
			type: Number,
			required: false,
		},
		custom_fields: {
			type: Array,
			default: [],
		},
	},
	{ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

customersSchema.plugin(softDelete);

const Customers = mongoose.model("customers", customersSchema);

module.exports = Customers;
