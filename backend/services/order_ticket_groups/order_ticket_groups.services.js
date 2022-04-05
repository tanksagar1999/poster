const { commonResponse } = require("../../helper");
const Model = require("./order_ticket_groups.model");

/*
*  Save New  
*/
exports.save = async (reqBody) => {
    
        const newOrderTicketGroups = new Model(reqBody);
        return await newOrderTicketGroups.save();
    
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
     
        return await Model.find({_id: { $in: reqBody.ids},order_ticket_group_name:"Main Kitchen"}).lean(); 
     
};

exports.checkExist = async (req) => {

        let query = req;
        return await Model.findOne(query).lean();

};