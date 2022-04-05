const { commonResponse } = require("../../helper");
const Model = require("./tables.model");

/*
*  Save  
*/
exports.save = async (reqBody) => {
   
        const newTaxes = new Model(reqBody);
        return await newTaxes.save();
    
};

/*
*  List  
*/
exports.list = async (req) => {
        
        let query = req;
        if(!query.status){
            query.status =  {$nin:["paid"] };
        }
        return await Model.find(query).sort( { _id: 1 } ).lean();
    
};

exports.checkExist = async (req) => {
        
        let query = req;
         
        return await Model.findOne(query).lean();
    
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
     
        return await Model.deleteMany({register_id: { $in: id}}); 
    
};

/*
*  Get By Id
*/
exports.getById = async (id) => {
   
        return await Model.findById(id); 
    
};

exports.checkLastSplitedTable = async (parentId) => {
    
        let query = {parent_table:parentId,table_type : "splited"};

        return await Model.findOne(query).sort( { created_at: -1 } ).lean(); 
     
};
