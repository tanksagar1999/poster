const { commonResponse } = require("../../helper");
const Model = require("./last_device.model");
const mongoose = require("mongoose");

/*
 *  Save New Registers
 */
exports.save = async (reqBody) => {
	const newLastDevice = new Model(reqBody);
	return await newLastDevice.save();
};

/*
 *  Update
 */
exports.update = async (id, reqBody) => {
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
};

/*
 * Get by registered ID
 */
exports.getByRegisteredId = async (id) => {
	try {
		return await Model.findOne({ register_id: id });
	} catch (error) {
		return error;
	}
};

exports.getByLastReceipt = async (receiptNumber) => {
	try {
		return await Model.findOne({ last_receipt_number: receiptNumber });
	} catch (error) {
		return error;
	}
};

/*
 *  find last receipt with mainRegisterId
 */
exports.findLastReceiptByMainRegisterId = async (query, rid, cookie = "") => {
	let data = await Model.find({ main_register_id: query })
		.sort({ _id: -1 })
		.limit(1);
	console.log("data =>", data);
	return data[0];
};
