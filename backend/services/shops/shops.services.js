const { commonResponse } = require("../../helper");
const Model = require("./shops.model");

/*
*  Save New  
*/
exports.save = async (reqBody) => {
    
        const newShops= new Model(reqBody);
        return await newShops.save();
   
};

/*
*  List  
*/
exports.list = async (req) => {
    
        let query = req;
        return await Model.find(query).sort( { created_at: -1 } ).lean();
     
};

/*
*  Update  
*/
exports.update = async (id, reqBody) => {
    
        let update = await Model.findOneAndUpdate({ user_id: id }, {$set:reqBody}, {new: true,}).lean();
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
     
        return await Model.findOne(id).lean(); 
   
};