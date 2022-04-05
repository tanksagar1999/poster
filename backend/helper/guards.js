const jwt = require("jsonwebtoken");
const commonResponse = require("./commonResponse");
const Users = require("../services/users/users.model");
const ResturentUsers = require("../services/restaurant_users/restaurant_users.model");
const createToken = (user, type = "user") => {
	let payload = {
		id: user._id.toString(),
		register_id: user.register_id.toString(),
		main_register_id: user.main_register_id
			? user.main_register_id.toString()
			: user.register_id.toString(),
		role: user.role,
	};
	console.log("tokendata", payload);
	const token = jwt.sign(payload, process.env.JWT_SECRET, {
		expiresIn: process.env.EXPIRE_JWT_SECRET || "30d",
	});
	payload.token = token;
	return payload;
};

const verifyJWT = (req, res) => {
	try {
		const token = req.headers.authorization.replace("Bearer", "").trim();
		const userInfo = jwt.verify(token, process.env.JWT_SECRET);
		req.user = userInfo;
		if (req.method == "GET" || req.query.register_id) {
			// console.log("req.query.register_id =>",req.query);
			if (req.query.register_id) {
				req.query.register_id = req.query.register_id;
				// req.query.id = userInfo.id;
			} else {
				req.query.register_id = userInfo.register_id;
			}
			req.query.register_id = req.query.register_id
				? req.query.register_id
				: userInfo.register_id;
		} else {
			req.body.register_id = req.body.register_id
				? req.body.register_id
				: userInfo.register_id;
		}
		console.log("vvv", req.body);
		return 1;
	} catch (error) {
		return 0;
	}
};

const isAuthorized = (users) => async (req, res, next) => {
	const isVerify = verifyJWT(req, res);
	console.log("Users : ", req.user);
	if (isVerify) {
		if (users.indexOf("admin") > -1 && req.user.role == "admin") {
			const user = await Users.findById({ _id: req.user.id });
			if (!user) {
				commonResponse.unAuthentication(res, {}, "USER_NOT_FOUND");
			} else {
				next();
			}
		} else if (
			users.indexOf("restaurant") > -1 &&
			req.user.role == "restaurant"
		) {
			const user = await Users.findById({ _id: req.user.id });
			if (!user) {
				commonResponse.unAuthentication(res, {}, "USER_NOT_FOUND");
			} else {
				next();
			}
		} else {
			const userss = await ResturentUsers.findById({
				_id: req.user.id,
			}).lean();
			if (!userss) {
				console.log("not allowed");
				commonResponse.unAuthentication(
					res,
					{},
					"REQUEST_NOT_ALLOWED",
					403
				);
			} else {
				next();
			}
		}
	} else {
		return commonResponse.unAuthentication(res, {}, "SESSION_EXPIRED");
	}
};

module.exports = {
	createToken,
	isAuthorized,
};
