const { commonResponse } = require("../../helper");
const Model = require("./product_addon_groups.model");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
/*
*  Save New Product Category
*/
exports.save = async (reqBody) => {
    
        const newProductAddonGroups = new Model(reqBody);
        return await newProductAddonGroups.save();
  
};

exports.saveMany = async (reqBody) => {
  
        return await Model.insertMany(reqBody);
     
};

/*
*  List Product Category
*/
exports.list = async (req) => {
    
        let query = req;
        //return await Model.find(query).sort( { created_at: -1 } ).lean();
        return Model.find(query)
                .populate([
                    {
                        path: "product_addons",
                        select: "_id addon_name"
                    }
                ]).sort({sort_order:1}).lean();
    
};


exports.normalList = async (req) => {
    
        let query = req;
         return Model.find(query).lean();
    
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

exports.customlist = async (req,select="") => {
    
        let query = req;
         return Model.find(query).select(select).lean();
    
};


exports.export = async (req) => {
    
         
        let query = req;
        return await Model.aggregate([
            {
                "$lookup": {
                    "from": "product_addons",
                    "localField": "product_addons",
                    "foreignField": "_id",
                    "as": "addons"
                }
            },
            { "$unwind": "$addons" },             
            {
                "$project": {
                    "addon_group_name": "$addon_group_name",
                    "addon_name": "$addons.addon_name",
                    "sort_order": "$sort_order",
                    "register_id":"$register_id"
                }
            },
            { $sort : { created_at : -1 } },
            { $match : {register_id:ObjectId(query.register_id)}}

        ]);


 
};