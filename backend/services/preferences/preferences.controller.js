const Service = require("./preferences.services");
const { commonResponse, commonFunctions } = require("../../helper");

module.exports = {
	/*
	 *  Add preferences
	 */
	add: async (req, res) => {
		try {
			req.body.register_id = req.user.main_register_id;
			let preferenceData = await Service.getByRegisterId(
				req.body.register_id
			);
			console.log("preferenceData[0]  =>", preferenceData[0]);
			if (preferenceData) {
				try {
					req.body.register_id = req.user.main_register_id;
					let updatePreferences = await Service.update(
						preferenceData[0]._id,
						req.body
					);
					if (updatePreferences) {
						return commonResponse.success(
							res,
							"PREFERENCES_UPDATE",
							200,
							updatePreferences,
							"Successfully updated"
						);
					} else {
						return commonResponse.CustomError(
							res,
							"DEFAULT_INTERNAL_SERVER_ERROR",
							400,
							{}
						);
					}
				} catch (error) {
					console.log("Update Preferences -> ", error);
					return commonResponse.CustomError(
						res,
						"DEFAULT_INTERNAL_SERVER_ERROR",
						500,
						{},
						error.message
					);
				}
			} else {
				let save = await Service.save(req.body);
				if (save) {
					return commonResponse.success(
						res,
						"PREFERENCES_ADD",
						200,
						save,
						"preferences added successfully"
					);
				} else {
					return commonResponse.error(
						res,
						"DEFAULT_INTERNAL_SERVER_ERROR",
						400
					);
				}
			}
		} catch (error) {
			console.log("Add preferences -> ", error);
			return commonResponse.CustomError(
				res,
				"DEFAULT_INTERNAL_SERVER_ERROR",
				500,
				{},
				error.message
			);
		}
	},

	/*
	 *  List preferences
	 */
	list: async (req, res) => {
		try {
			req.body.register_id = req.user.main_register_id;
			let list = await Service.list(req.query);
			if (list.length > 0) {
				return commonResponse.success(
					res,
					"PREFERENCES_LIST",
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
			console.log("List preferences -> ", error);
			return commonResponse.CustomError(
				res,
				"DEFAULT_INTERNAL_SERVER_ERROR",
				500,
				{},
				error.message
			);
		}
	},

	/*
	 *  Update preferences
	 */
	update: async (req, res) => {
		try {
			req.body.register_id = req.user.main_register_id;
			let updatePreferences = await Service.update(
				req.params.id,
				req.body
			);
			if (updatePreferences) {
				return commonResponse.success(
					res,
					"PREFERENCES_UPDATE",
					200,
					updatePreferences,
					"Successfully updated"
				);
			} else {
				return commonResponse.CustomError(
					res,
					"DEFAULT_INTERNAL_SERVER_ERROR",
					400,
					{}
				);
			}
		} catch (error) {
			console.log("Update Preferences -> ", error);
			return commonResponse.CustomError(
				res,
				"DEFAULT_INTERNAL_SERVER_ERROR",
				500,
				{},
				error.message
			);
		}
	},

	/*
	 *  Delete preferences
	 */
	delete: async (req, res) => {
		try {
			let data = await Service.delete(req.params.id);
			if (data) {
				return commonResponse.success(
					res,
					"PREFERENCES_DELETE",
					200,
					data,
					"Successfully deleted"
				);
			} else {
				return commonResponse.CustomError(
					res,
					"DEFAULT_INTERNAL_SERVER_ERROR",
					400,
					{}
				);
			}
		} catch (error) {
			console.log("Delete Preferences -> ", error);
			return commonResponse.CustomError(
				res,
				"DEFAULT_INTERNAL_SERVER_ERROR",
				500,
				{},
				error.message
			);
		}
	},
	/*
	 *  Delete Multiple
	 */
	deleteAll: async (req, res) => {
		try {
			let data = await Service.deleteAll(req.body);
			if (data) {
				return commonResponse.success(
					res,
					"PREFERENCES_DELETE",
					200,
					data,
					"Successfully deleted"
				);
			} else {
				return commonResponse.CustomError(
					res,
					"DEFAULT_INTERNAL_SERVER_ERROR",
					400,
					{}
				);
			}
		} catch (error) {
			console.log("Delete Product Category -> ", error);
			return commonResponse.CustomError(
				res,
				"DEFAULT_INTERNAL_SERVER_ERROR",
				500,
				{},
				error.message
			);
		}
	},
	/*
	 *  Get preferences Detail
	 */
	get: async (req, res) => {
		try {
			let data = await Service.getById(req.params.id);
			if (data) {
				return commonResponse.success(
					res,
					"PREFERENCES_DETAIL",
					200,
					data,
					"Success"
				);
			} else {
				return commonResponse.CustomError(
					res,
					"PREFERENCES_NOT_FOUND",
					400,
					{},
					"Preferences not found"
				);
			}
		} catch (error) {
			console.log("Get preferences Detail -> ", error);
			return commonResponse.CustomError(
				res,
				"DEFAULT_INTERNAL_SERVER_ERROR",
				500,
				{},
				error.message
			);
		}
	},
};
