const { commonResponse } = require("../../helper");
const Model = require("./additional_charges.model");

/*
*  Add New
*/
exports.save = async (reqBody) => {
     
        const newAdditionalCharges = new Model(reqBody);
        return await newAdditionalCharges.save();
     
};

/*
*  List
*/
exports.list = async (req) => {
     
        let query = req;
        return await Model.find(query).populate([
                {
                    path: "tax_group",
                   // select: "tax_group_name -_id"
                    populate: { 
                        path: 'taxes',
                      //  select:"variant_name"
                    }
                }]).sort( { created_at: -1 } ).lean();
     
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
*  Delete
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