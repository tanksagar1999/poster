const Cryptr = require("cryptr");
const cryptr = new Cryptr("myTotalySecretKey");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const fastcsv = require("fast-csv");
const excel = require("exceljs");

const ejs = require("ejs");
const pdf = require("html-pdf");
const moment = require("moment");
const csv = require("@fast-csv/parse");

exports.createToken = (user, type = "user") => {
	let payload = {
		id: user._id.toString(),
	};

	const token = jwt.sign(payload, process.env.JWT_SECRET, {
		expiresIn: process.env.EXPIRE_JWT_SECRET || 7200,
	});
	payload.token = token;
	return payload;
};

exports.verifyToken = (req, res) => {
	try {
		const token = req;
		const userInfo = jwt.verify(token, process.env.JWT_SECRET);
		return userInfo;
	} catch (error) {
		return 0;
	}
};

exports.randomSixDigit = () => {
	return Math.floor(100000 + Math.random() * 900000);
};

exports.replaceNullToBlankString = async (obj) => {
	await Object.keys(obj).forEach((key) => {
		if (obj[key] == null) {
			obj[key] = "";
		}
	});
	return obj;
};

exports.encryptStringCrypt = async (string_value) => {
	let encryptedString = cryptr.encrypt(string_value);
	return encryptedString;
};

exports.CryptrdecryptStringCrypt = async (string_value) => {
	let decryptedString = cryptr.decrypt(string_value);
	return decryptedString;
};

exports.matchPassword = async (password, encryptedPassword) => {
	let decryptedString = cryptr.decrypt(encryptedPassword);
	return decryptedString === password;
};

exports.removeFile = async (file_path) => {
	let str = file_path.split("/");
	file_path = "./public/" + str[str.length - 2] + "/" + str[str.length - 1];
	try {
		fs.unlinkSync(file_path);
		console.log("File removed = ", file_path);
	} catch (err) {
		console.error(err);
	}
};

exports.exportToCSV = async (filename, header, data) => {
	console.log("header : ", header);
	console.log("data : ", data);

	let timstamp = new Date().getTime();
	const file = filename + "_" + timstamp + ".csv";
	const ws = fs.createWriteStream("./public/exports/" + file);
	fastcsv
		.write(data, {
			headers: true,
		})
		.on("finish", function () {
			console.log("Write to " + file + " successfully!");
		})
		.transform(header)
		.pipe(ws);
	return file;
};

exports.exportToXLSX = async (filename, header, data) => {
	let timstamp = new Date().getTime();
	const file = filename + "_" + timstamp + ".xlsx";

	let workbook = new excel.Workbook(); //creating workbook
	let worksheet = workbook.addWorksheet(filename); //creating worksheet
	worksheet.columns = header;
	worksheet.addRows(data);
	workbook.xlsx.writeFile("./public/exports/" + file).then(function () {
		console.log("file saved!");
	});
	return file;
};

exports.exportToPDF = async (filename, header, data) => {
	let timstamp = new Date().getTime();
	const file = filename + "_" + timstamp + ".pdf";

	ejs.renderFile(
		"./public/views/report-template.ejs",
		{
			header: header,
			data: data,
			title: filename.replace("_", " "),
		},
		(err, data) => {
			if (err) {
				console.log(err);
				// res.send(err);
			} else {
				let options = {
					height: "11.25in",
					width: "8.5in",
					header: {
						height: "20mm",
					},
					footer: {
						height: "20mm",
					},
				};
				pdf.create(data, options).toFile(
					"./public/exports/" + file,
					function (err, data) {
						if (err) {
							console.log(err);
							//res.send(err);
						} else {
							console.log("PDF created successfully");
						}
					}
				);
			}
		}
	);
	return file;
};

exports.padLeadingZeros = async (num, size) => {
	let s = num + "";
	while (s.length < size) s = "0" + s;
	return s;
};

exports.genrateReceiptNumber = async (prefix, size) => {
	let result = "";
	let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";
	let charactersLength = characters.length;
	for (var i = 0; i < size; i++) {
		result += characters.charAt(
			Math.floor(Math.random() * charactersLength)
		);
	}
	let date = new Date();
	let dd = date.getDate().toString();
	let yy = date.getFullYear().toString().substr(2, 2);
	return prefix + "1/" + prefix + "-" + result + "-" + yy + dd + "-1";
};

exports.changeDateFormat = async (list, datefield) => {
	let t = list.map((data) => {
		data[datefield] = moment(data[datefield]).format(
			"MMMM D,YYYY, hh:mm A"
		);
		return data;
	});
	return t;
};

exports.checkDependecyOnDelete = async (
	module,
	body,
	foreign_key,
	inarray = false
) => {
	let Model = require("../services/" + module + "/" + module + ".model.js");
	let q = {};
	q[foreign_key] = { $in: body.ids };
	if (foreign_key != "register_id") {
		q["register_id"] = body.register_id;
	}
	let result = await Model.find(q).lean();
	return result.length > 0 ? true : false;
};

exports.setMainRegister = async (req) => {
	let Model = require("../services/registers/registers.model.js");

	let result = await Model.findById(req.register_id).lean();
	if (!result.is_main) {
		result = await Model.findOne({
			register_id: result.register_id,
		}).lean();
	}
	return result._id;
};

exports.generateRandomColor = async () => {
	var randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
	return randomColor;
};

exports.readCsv = async (path, options, rowProcessor) => {
	return new Promise((resolve, reject) => {
		const data = [];
		csv.parseFile(path, options)
			.on("error", reject)
			.on("data", (row) => {
				const obj = rowProcessor(row);
				if (obj) data.push(obj);
			})
			.on("end", () => {
				resolve(data);
			});
	});
};

exports.getAllRegistersIds = async (req) => {
	let Model = require("../services/registers/registers.model.js");
	let result = await Model.find({
		$or: [
			{ register_id: req.user.main_register_id },
			{ _id: req.user.main_register_id },
		],
	})
		.select("_id")
		.lean();
	console.log("result", result);
	let allids = [];
	for (const i in result) {
		allids.push(result[i]._id.toString());
	}

	return allids;
};

exports.validateEmail = async (email) => {
	const re =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
};
