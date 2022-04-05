const { commonResponse } = require("../../helper");
const Model = require("./taxes.model");

/*
*  Save New Product Category
*/
exports.save = async (reqBody) => {
     
        const newTaxes = new Model(reqBody);
        return await newTaxes.save();
   
};

/*
*  List Product Category
*/
exports.list = async (req) => {
     
        let query = req;
        return await Model.find(query).sort( { created_at: -1 } ).lean();
    
};

/*
*  Update
*/
exports.update = async (id, reqBody) => {
    
        let update = await Model.findOneAndUpdate({ _id: id }, {$set:reqBody}, {new: true,}).lean();
        return update;
    
};

/*
*  Delete
*/
exports.delete = async (id) => {
     
        return await Model.removeOne({_id:id}); 
    
};

/*
*  Get By Id
*/
exports.getById = async (id) => {
    
        return await Model.findById(id); 
     
};

/*
*  Delete multiple
*/
exports.deleteAll = async (reqBody) => {
     
        return await Model.removeMany({_id: { $in: reqBody.ids}}); 
   
};