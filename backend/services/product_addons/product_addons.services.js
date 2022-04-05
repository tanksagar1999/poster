const { commonResponse } = require("../../helper");
const Model = require("./product_addons.model");

/*
*  Save New Product Category
*/
exports.save = async (reqBody) => {
     
        const newProductAddons = new Model(reqBody);
        return await newProductAddons.save();
     
};
exports.saveMany = async (reqBody) => {
  
        return await Model.insertMany(reqBody);
     
};


/*
*  List Product Category
*/
exports.list = async (req) => {
     
        let query = req;
        return await Model.find(query).sort({sort_order:1}).lean();
     
};

/*
*  List Product Category
*/
exports.export = async (req) => {
     
        let query = req;
        return await Model.find(query).sort({sort_order:1}).lean();
     
};

/*
*  Update
*/
exports.update = async (id, reqBody) => {
     
        let update = await Model.findOneAndUpdate({ _id: id }, {$set:reqBody}, {new: true,}).lean();
        return update;
     
};
exports.updateByCondition = async (condition, reqBody) => {
     
        let update = await Model.findOneAndUpdate(condition, {$set:reqBody}, {new: true,}).lean();
        return update;
    
};
/*
*  Delete
*/
exports.delete = async (id) => {
     
        return await Model.removeOne({_id:id}); 
    
};
/*
*  Delete multiple
*/
exports.deleteAll = async (reqBody) => {
     
        return await Model.removeMany({_id: { $in: reqBody.ids}}); 
    
};
/*
*  Get By Id
*/
exports.getById = async (id) => {
     
        return await Model.findById(id); 
    
};
exports.checkExist = async (req) => {

        let query = req;
        return await Model.findOne(query).lean();

};