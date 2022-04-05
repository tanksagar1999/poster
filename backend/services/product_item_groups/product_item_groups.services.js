const { commonResponse } = require("../../helper");
const Model = require("./product_item_groups.model");

/*
*  Save New Product Item Groups
*/
exports.save = async (reqBody) => {
  
        const newProductItemGroups = new Model(reqBody);
        return await newProductItemGroups.save();
    
};

/*
*  List Product Item Groups
*/
exports.list = async (req,select="") => {
     
        let query = req;
        return await Model.find(query).select(select).sort( { created_at: -1 } ).lean();
     
};

/*
*  Update Product  Item Groups
*/
exports.update = async (id, reqBody) => {
     
        let update = await Model.findOneAndUpdate({ _id: id }, {$set:reqBody}, {new: true,}).lean();
        return update;
   
};

/*
*  Delete Product  Item Groups
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