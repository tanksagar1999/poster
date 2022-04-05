const Service = require("./printers.services");
const { commonResponse } = require("../../helper");

module.exports = {
    
    /*
    *  Add New 
    */
     add: async (req, res) => {
        try {
            let save = await Service.save(req.body);
            if (save) {
                return commonResponse.success(res, "PRINTERS_ADD", 200, save, 'Printer added successfully');
            } else {
                return commonResponse.error(res, "DEFAULT_INTERNAL_SERVER_ERROR", 400);
            }
        } catch (error) {
            console.log("Add PRINTERS -> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },

    /*
    *  List 
    */
    list: async (req, res) => {
        try {
            let list = await Service.list(req.query);
            if ( list.length > 0 ) {
                return commonResponse.success(res, "PRINTERS_LIST", 200, list, 'Success');
            } else {
                return commonResponse.success(res, "NO_DATA_FOUND", 200, [], 'No Data Found');
            }
        } catch (error) {
            console.log("List PRINTERS -> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },

    /*
    *  Update 
    */
    update: async (req, res) => {
        try {
            let updateProduct = await Service.update(req.params.id, req.body);
            if (updateProduct) {
                return commonResponse.success(res, "PRINTERS_UPDATE", 200, updateProduct, 'Successfully updated Printer');
            } else {
                return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 400, {});
            }
        } catch (error) {
            console.log("Update PRINTERS -> ", error);
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
                return commonResponse.success(res, "PRINTERS_DELETE", 200, data, 'Successfully deleted Printer');
            }else{
                return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 400, {});
            }
        } catch (error) {
            console.log("Delete PRINTERS -> ", error);
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
                return commonResponse.success(res, "PRINTERS_DELETE", 200, data, 'Successfully deleted Printer');
            }else{
                return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 400, {});
            }
        } catch (error) {
            console.log("Delete PRINTERS -> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },
    /*
    *  Get Detail
    */
    getPrinters: async (req, res) => {
        try {
            let data = await Service.getById(req.params.id);
            if(data){
                return commonResponse.success(res, "PRINTERS_DETAIL", 200, data, 'Success');
            }else{
                return commonResponse.CustomError(res, "PRINTERS_FOUND", 400, {}, 'PRINTERS not found');
            }
        } catch (error) {
            console.log("Get PRINTERS Detail -> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },
}