const Service = require("./custom_fields.services");
const { commonResponse,commonFunctions } = require("../../helper");

module.exports = {

    /*
    *  Add Custom Fields
    */
    add: async (req, res) => {
        try {
            req.body.register_id = req.user.main_register_id;
            let checkexist = await Service.list({name:{$regex: new RegExp("^" + req.body.name + "$", "i")},type:req.body.type,register_id:req.body.register_id});
            if(checkexist.length>0){
               return commonResponse.CustomError(res, "ALREADY_EXIST", 400, {},req.body.name+" already exist");
            }
            let save = await Service.save(req.body);
            if (save) {
                return commonResponse.success(res, "CUSTOM_FIELDS_ADD", 200, save, 'Custom Fields added successfully');
            } else {
                return commonResponse.error(res, "DEFAULT_INTERNAL_SERVER_ERROR", 400);
            }
        } catch (error) {
            console.log("Add Custom Fields -> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },

    /*
    *  List Custom Fields
    */
    list: async (req, res) => {
        try {
            req.body.register_id = req.user.main_register_id;
            let list = await Service.list(req.query);
            if ( list.length > 0 ) {
                return commonResponse.success(res, "CUSTOM_FIELDS_LIST", 200, list, 'Success');
            } else {
                return commonResponse.success(res, "NO_DATA_FOUND", 200, [], 'No Data Found');
            }
        } catch (error) {
            console.log("List Custom Fields -> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },

    /*
    *  Update Custom Fields
    */
    update: async (req, res) => {
        try {
            req.body.register_id = req.user.main_register_id;
            let checkexist = await Service.list({name:{$regex: new RegExp("^" + req.body.name + "$", "i")},type:req.body.type,register_id:req.body.register_id,_id: { $ne: req.params.id }});
            if(checkexist.length>0){
               return commonResponse.CustomError(res, "ALREADY_EXIST", 400, {},req.body.name+" already exist");
            }
            let updateCustomField = await Service.update(req.params.id, req.body);
            if (updateCustomField) {
                return commonResponse.success(res, "CUSTOM_FIELDS_UPDATE", 200, updateCustomField, 'Successfully updated');
            } else {
                return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 400, {});
            }
        } catch (error) {
            console.log("Update Custom Fields -> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },

    /*
    *  Delete Custom Fields
    */
    delete: async (req, res) => {
        try {
            let data = await Service.delete(req.params.id);
            if(data){
                return commonResponse.success(res, "CUSTOM_FIELDS_DELETE", 200, data, 'Successfully deleted');
            }else{
                return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 400, {});
            }
        } catch (error) {
            console.log("Delete Custom Fields -> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },

   /*
    *  Delete Multiple
    */
   deleteAll: async (req, res) => {
        try {
            let data = await Service.deleteAll(req.body);
            if(data){
                return commonResponse.success(res, "CUSTOM_FIELDS_DELETE", 200, data, 'Successfully deleted');
            }else{
                return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 400, {});
            }
        } catch (error) {
            console.log("Delete Custom Fields -> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },
    
    /*
    *  Get Custom Fields Detail
    */
    get: async (req, res) => {
        try {
            let data = await Service.getById(req.params.id);
            if(data){
                return commonResponse.success(res, "CUSTOM_FIELDS_DETAIL", 200, data, 'Success');
            }else{
                return commonResponse.CustomError(res, "CUSTOM_FIELDS_NOT_FOUND", 400, {}, 'Custom Fields not found');
            }
        } catch (error) {
            console.log("Get Custom Fields Detail -> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },


}