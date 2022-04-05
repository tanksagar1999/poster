const Service = require("./localStorage.services");
const shopController = require("../shops/shops.controller");

const { commonResponse } = require("../../helper");
const fs = require("fs");
var csv = require("fast-csv");

/*
 *  Get Product Category Detail
 */
exports.getSetupData = async (req, res) => {
	try {
		console.log("Req.user =>", req.user);
		req.query.register_id = req.user.register_id;
		let list = await Service.getSetupData(req.query, req.params, req, res);
		if (list) {
			return commonResponse.success(
				res,
				"SETUP_DATA_LIST",
				200,
				list,
				"Success"
			);
		} else {
			return commonResponse.success(
				res,
				"NO_DATA_FOUND",
				200,
				[],
				"No Data Found"
			);
		}
	} catch (error) {
		return commonResponse.CustomError(
			res,
			"DEFAULT_INTERNAL_SERVER_ERROR",
			500,
			{},
			error.message
		);
	}
};
