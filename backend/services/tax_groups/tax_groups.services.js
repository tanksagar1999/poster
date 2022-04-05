const { commonResponse } = require("../../helper");
const Model = require("./tax_groups.model");

/*
*  Save New tax groups
*/
exports.save = async (reqBody) => {
     
        const newTaxGroups = new Model(reqBody);
        return await newTaxGroups.save();
     
};

/*
*  List tax groups
*/
exports.list = async (req) => {
     
        let query = req;
        return await Model.find(query).populate({
                path:"taxes"
        }).sort( { created_at: -1 } ).lean();
     
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

exports.checkIsMain = async (reqBody) => {
     
        return await Model.find({_id: { $in: reqBody.ids},tax_group_name:"Zero Tax Group"}).lean(); 
     
};