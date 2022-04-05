const Service = require("./order_ticket_groups.services");
const { commonResponse,commonFunctions } = require("../../helper");

module.exports = {
    
    /*
    *  Add New  
    */
     add: async (req, res) => {
        try {
            req.body.register_id = req.user.main_register_id;
            let checkExist =  await Service.checkExist({order_ticket_group_name:{$regex: new RegExp("^" + req.body.order_ticket_group_name + "$", "i")},register_id:req.body.register_id});
            if(checkExist){
                return commonResponse.CustomError(res, "ALREADY_EXIST", 400, {}, "Unable to create order ticket group. Make sure the category name does not already exist");
            }
            let save = await Service.save(req.body);
            if (save) {
                return commonResponse.success(res, "ORDER_TICKET_GROUPS_ADD", 200, save, 'Order Ticket Groups added successfully');
            } else {
                return commonResponse.error(res, "DEFAULT_INTERNAL_SERVER_ERROR", 400);
            }
        } catch (error) {
            console.log("Add Order Ticket Groups-> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },

    /*
    *  List  
    */
    list: async (req, res) => {
        try {
            req.query.register_id = req.user.main_register_id;
            let list = await Service.list(req.query);
            if ( list.length > 0 ) {
                return commonResponse.success(res, "ORDER_TICKET_GROUPS_LIST", 200, list, 'Success');
            } else {
                return commonResponse.success(res, "NO_DATA_FOUND", 200, [], 'No Data Found');
            }
        } catch (error) {
            console.log("List Order Ticket Groups-> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },

    /*
    *  Update  
    */
    update: async (req, res) => {
        try {
            req.body.register_id = req.user.main_register_id;
            let checkExist =  await Service.checkExist({order_ticket_group_name:{$regex: new RegExp("^" + req.body.order_ticket_group_name + "$", "i")},register_id:req.body.register_id,_id:{ $ne: req.params.id } });
            if(checkExist){
                return commonResponse.CustomError(res, "ALREADY_EXIST", 400, {}, "Unable to update order ticket group. Make sure the category name does not already exist");
            }
            let updateOrderTicketGroups= await Service.update(req.params.id, req.body);
            if (updateOrderTicketGroups) {
                return commonResponse.success(res, "ORDER_TICKET_GROUPS_UPDATE", 200, updateOrderTicketGroups, 'Successfully updated service');
            } else {
                return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 400, {});
            }
        } catch (error) {
            console.log("Update Order Ticket Groups-> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },

    /*
    *  Delete  
    */
    delete: async (req, res) => {
        try {
            let data = await Service.delete(req.params.id);
            if(data){
                return commonResponse.success(res, "ORDER_TICKET_GROUPS_DELETE", 200, data, 'Successfully deleted service');
            }else{
                return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 400, {});
            }
        } catch (error) {
            console.log("Delete Order Ticket Groups-> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },

    /*
    *  Delete Multiple
    */
    deleteAll: async (req, res) => {
        try {
            let check = await commonFunctions.checkDependecyOnDelete("product_category",req.body,'order_ticket_group',false);
            if(check){
                return commonResponse.success(res, "ALREADY_IN_USE", 200, {}, "Could't process to delete data because items are associated with another module.please delete them first");
            }
            let list = await Service.checkIsMain(req.body);
            if(list.length>0){
                return commonResponse.success(res, "CANT_DELETE_MAIN", 200, {}, "Could't process to delete Main Kitchen");
            }
            let data = await Service.deleteAll(req.body);
            if(data){
                return commonResponse.success(res, "ORDER_TICKET_GROUPS_DELETE", 200, data, 'Successfully deleted');
            }else{
                return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 400, {});
            }
        } catch (error) {
            console.log("Delete Product Category -> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },
    
    /*
    *  Get  
    */
    get: async (req, res) => {
        try {
            let data = await Service.getById(req.params.id);
            if(data){
                return commonResponse.success(res, "ORDER_TICKET_GROUPS_DETAIL", 200, data, 'Success');
            }else{
                return commonResponse.CustomError(res, "ORDER_TICKET_GROUPS_NOT_FOUND", 400, {}, 'Order Ticket Groupsnot found');
            }
        } catch (error) {
            console.log("Get TAXES Detail -> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },
}