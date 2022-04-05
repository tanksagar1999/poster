const { commonResponse } = require("../../helper");
const Model = require("./registers.model");

/*
*  Save New Registers
*/
exports.save = async (reqBody) => {
     
        const newRegisters = new Model(reqBody);
        return await newRegisters.save();
    
};

/*
*  List Registers
*/
exports.list = async (req) => {
    
        let query = req;
        return await Model.find(query).sort( { created_at: -1 } ).lean();
    
};

/*
*  Update Registers
*/
exports.update = async (id, reqBody) => {
     
        let update = await Model.findOneAndUpdate({ _id: id }, {$set:reqBody}, {new: true,}).lean();
        return update;
      
};

/*
*  Delete Registers
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

exports.deleteAllByRegister = async (query) => {
   
        return await Model.removeMany(query); 
     
};