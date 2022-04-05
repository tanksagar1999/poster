const multer = require("multer");
const path = require("path");

/** code to configure user upload profile image starts */
const userUploadDirPath = path.join(
  __dirname,
  "..",
  "/public/user-profile"
);

const shopUploadDirPath = path.join(
  __dirname,
  "..",
  "/public/shops"
);

const importCsvPath = path.join(
  __dirname,
  "..",
  "/public/imports"
);


let userImageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, userUploadDirPath);
  },
  filename: function (req, file, cb) {
    let exploded_name = file.originalname.split(".");
    let ext = exploded_name[exploded_name.length - 1];
    cb(null, Date.now() + "." + ext);
  },
});


let shopImageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, shopUploadDirPath);
  },
  filename: function (req, file, cb) {
    let exploded_name = file.originalname.split(".");
    let ext = exploded_name[exploded_name.length - 1];
    cb(null, Date.now() + "." + ext);
  },
});

let importcsvStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, importCsvPath);
  },
  filename: function (req, file, cb) {
    let exploded_name = file.originalname.split(".");
    let ext = exploded_name[exploded_name.length - 1];
    cb(null, Date.now() + "." + ext);
  },
});



let userImageUpload = multer({
  storage: userImageStorage,
  limits: {
    fileSize: 15000000, // 5MB
  },
  fileFilter: function (req, file, cb) {
    return cb(null, true);
  },
}).fields([{ name: "image", maxCount: 1 }]);


let shopImageUpload = multer({
  storage: shopImageStorage,
  limits: {
    fileSize: 15000000, // 5MB
  },
  fileFilter: function (req, file, cb) {
    return cb(null, true);
  },
}).fields([{ name: "shop_logo", maxCount: 1 }]);

let importCsvUpload = multer({
  storage: importcsvStorage,
  limits: {
    fileSize: 15000000, // 5MB
  },
  fileFilter: function (req, file, cb) {
    return cb(null, true);
  },
}).fields([{ name: "csvfile", maxCount: 1 }]);


/** END */

module.exports = {
  userImageUpload,
  shopImageUpload,
  importCsvUpload
};
