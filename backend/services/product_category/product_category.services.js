const { commonResponse } = require("../../helper");
const product_category = require("./product_category.model");

/*
*  Save New Product Category
*/
exports.save = async (reqBody) => {
    const newProductCategory = new product_category(reqBody);
    return await newProductCategory.save();
};

/*
*  List Product Category
*/
exports.list = async (req) => {
	let query = req;
	return await product_category.find(query).sort({sort_order:1}).lean();

};

/*
*  Update
*/
exports.update = async (id, reqBody) => {
	let update = await product_category.findOneAndUpdate({ _id: id }, {$set:reqBody}, {new: true,}).lean();
	return update;

};

/*
*   Delete
*/
exports.delete = async (id) => {
    return await product_category.removeOne({_id:id}); 

};

/*
*  Delete
*/
exports.deleteAll = async (reqBody) => { 
    return await product_category.removeMany({_id: { $in: reqBody.ids}}); 

};

/*
*  Get By Id
*/
exports.getById = async (id) => {
	return await product_category.findById(id).populate([
		{
			path: "order_ticket_group",
			select: "_id order_ticket_group_name"
		}
	]).lean(); 
        
};

exports.checkExist = async (req) => {
	let query = req;
	return await product_category.findOne(query).lean();

};