const { commonResponse } = require("../../helper");
const Model = require("./product_variants.model");

/*
*  Save New Product Variant
*/
exports.save = async (reqBody) => {
     
        const newProductVariants = new Model(reqBody);
        return await newProductVariants.save();
   
};

exports.saveMany = async (reqBody) => {
  
        return await Model.insertMany(reqBody);
     
};

/*
*  List Product Variant
*/
exports.list = async (req) => {
     
        let query = req;
        return await Model.find(query).sort({sort_order:1}).lean();
   
};

/*
*  Update Product Variant
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
*  Delete Product Variant
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