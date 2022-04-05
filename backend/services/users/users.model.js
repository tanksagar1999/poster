const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
let softDelete = require("mongoosejs-soft-delete");

const Schema = mongoose.Schema;

const usersSchema = new Schema(
	{
		email: {
			type: String,
			unique: true,
			required: true,
		},
		username: {
			type: String,
			required: false,
		},
		number: {
			type: String,
			required: true,
			unique: true,
			default: "",
		},
		password: {
			type: String,
			required: true,
		},
		image: {
			type: String,
			required: false,
			default: "",
		},
		role: {
			type: String,
			enum: ["admin", "restaurant"],
			default: "restaurant",
			required: false,
		},
		otp: {
			type: String,
			required: false,
			default: 0,
		},
		fcm_token: {
			type: String,
			required: false,
			default: "",
		},
		device_type: {
			type: String,
			enum: ["android", "ios"],
			default: "android",
			required: false,
		},
		device_id: {
			type: String,
			required: false,
			default: "",
		},
		is_notification_on: {
			type: Boolean,
			default: true,
		},
		status: {
			type: String,
			enum: ["pending", "deactivated", "activated", "blocked"],
			default: "pending",
			required: false,
		},
		is_shop: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

usersSchema.plugin(softDelete);

const Users = mongoose.model("Users", usersSchema);

module.exports = Users;
