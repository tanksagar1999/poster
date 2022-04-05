const Service = require("./discount_rules.services");
const { commonResponse,commonFunctions } = require("../../helper");

module.exports = {

    /*
    *  Add  
    */
    add: async (req, res) => {
        try {
            req.body.register_id = req.user.main_register_id;
            let checkexist = await Service.list({coupon_code:{$regex: new RegExp("^" + req.body.coupon_code + "$", "i")},register_id:req.body.register_id});
            if(checkexist.length>0){
               return commonResponse.CustomError(res, "ALREADY_EXIST", 400, {},req.body.coupon_code+" already exist");
            }
            let save = await Service.save(req.body);
            if (save) {
                return commonResponse.success(res, "DISCOUNT_RULES_ADD", 200, save, 'Discount rules added successfully');
            } else {
                return commonResponse.error(res, "DEFAULT_INTERNAL_SERVER_ERROR", 400);
            }
        } catch (error) {
            console.log("Add Discount rules -> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },

    /*
    *  List Discount rules
    */
    list: async (req, res) => {
        try {
            req.body.register_id = req.user.main_register_id;
            let list = await Service.list(req.query);
            if ( list.length > 0 ) {
                return commonResponse.success(res, "DISCOUNT_RULES_LIST", 200, list, 'Success');
            } else {
                return commonResponse.success(res, "NO_DATA_FOUND", 200, [], 'No Data Found');
            }
        } catch (error) {
            console.log("List Discount rules -> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },

    /*
    *  Update Discount rules
    */
    update: async (req, res) => {
        try {
            req.body.register_id = req.user.main_register_id;
            let checkexist = await Service.list({coupon_code:{$regex: new RegExp("^" + req.body.coupon_code + "$", "i")},register_id:req.body.register_id,_id: { $ne: req.params.id }});
            if(checkexist.length>0){
               return commonResponse.CustomError(res, "ALREADY_EXIST", 400, {},req.body.coupon_code+" already exist");
            }
            let discountRules = await Service.update(req.params.id, req.body);
            if (discountRules) {
                return commonResponse.success(res, "DISCOUNT_RULES_UPDATE", 200, discountRules, 'Successfully updated');
            } else {
                return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 400, {});
            }
        } catch (error) {
            console.log("Update Discount rules -> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },

    /*
    *  Delete Discount rules
    */
    delete: async (req, res) => {
        try {
            let data = await Service.delete(req.params.id);
            if(data){
                return commonResponse.success(res, "DISCOUNT_RULES_DELETE", 200, data, 'Successfully deleted');
            }else{
                return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 400, {});
            }
        } catch (error) {
            console.log("Delete Discount rules -> ", error);
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
                return commonResponse.success(res, "DISCOUNT_RULES_DELETE", 200, data, 'Successfully deleted');
            }else{
                return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 400, {});
            }
        } catch (error) {
            console.log("Delete Discount rules -> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },
    
    /*
    *  Get Discount rules Detail
    */
    get: async (req, res) => {
        try {
            req.body.register_id = req.user.main_register_id;
            let data = await Service.getById(req.params.id);
            if(data){
                return commonResponse.success(res, "DISCOUNT_RULES_DETAIL", 200, data, 'Success');
            }else{
                return commonResponse.CustomError(res, "DISCOUNT_RULES_NOT_FOUND", 400, {}, 'Discount rules not found');
            }
        } catch (error) {
            console.log("Get Discount rules Detail -> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },


}