const { commonResponse } = require("../../helper");
const Model = require("./product_price_books.model");

/*
 *  Save New
 */
exports.save = async (reqBody) => {
  const newProductPriceBooks = new Model(reqBody);
  return await newProductPriceBooks.save();
};

/*
 *  List
 */
exports.list = async (req) => {
  let query = {};
  return await Model.find(query)
    .populate({
      path: "register_assigned_to",
      select: "register_name -_id",
    })
    .sort({ created_at: -1 })
    .lean();
};

/*
 *  Update
 */
exports.update = async (id, reqBody) => {
  let update = await Model.findOneAndUpdate(
    { _id: id },
    { $set: reqBody },
    { new: true }
  ).lean();
  return update;
};

/*
 *  Delete
 */
exports.delete = async (id) => {
  return await Model.removeOne({ _id: id });
};
/*
 *  Delete multiple
 */
exports.deleteAll = async (reqBody) => {
  return await Model.removeMany({ _id: { $in: reqBody.ids } });
};
/*
 *  Get By Id
 */
exports.getById = async (id) => {
  return await Model.findById(id).lean();
};
