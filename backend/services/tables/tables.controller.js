const Service = require("./tables.services");
const { commonResponse } = require("../../helper");
const invNum = require("invoice-number");
module.exports = {
    
    /*
    *  Add  
    */
     add: async (req, res) => {
        try {
            let save = await Service.save(req.body);
            if (save) {
                return commonResponse.success(res, "TABLES_ADD", 200, save, 'Tables added successfully');
            } else {
                return commonResponse.error(res, "DEFAULT_INTERNAL_SERVER_ERROR", 400);
            }
        } catch (error) {
            console.log("Add Tables -> ", error);
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
                return commonResponse.success(res, "TABLES_LIST", 200, list, 'Success');
            } else {
                return commonResponse.success(res, "NO_DATA_FOUND", 200, [], 'No Data Found');
            }
        } catch (error) {
            console.log("List Taxes -> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },

    /*
    *  Update  
    */
    update: async (req, res) => {
        try {
            let updateTables = await Service.update(req.params.id, req.body);
            if (updateTables) {
                return commonResponse.success(res, "TABLES_UPDATE", 200, updateTables, 'Successfully updated');
            } else {
                return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 400, {});
            }
        } catch (error) {
            console.log("Update Tables -> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },
    /*
    *  Swapte  
    */
    swapeTable: async (req, res) => {
        try {
            let updateTables = await Service.update(req.params.id, {status:"free"});
              updateTables = await Service.update(req.body.swap_to, {status:"inprocess"});
            if (updateTables) {
                return commonResponse.success(res, "TABLES_SWAP", 200, updateTables, 'Successfully swaped');
            } else {
                return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 400, {});
            }
        } catch (error) {
            console.log("Swap Tables -> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },
    /*
    *  Split tables
    */
    splitTable: async (req, res) => {
        try {
            let table = await Service.getById(req.params.id);
            let splitdata = {
                table_number : table.table_number + '-1',
                table_type : "splited",
                parent_table : table._id,
                status: table.status,
                register_id : table.register_id
            }
            let lastSplitedTable = await Service.checkLastSplitedTable(req.params.id);
            if(lastSplitedTable){
                splitdata.table_number = invNum.next(lastSplitedTable.table_number);
            }
            let save = await Service.save(splitdata);
             
            if (save) {
                return commonResponse.success(res, "TABLES_SPLIT", 200, save, 'Successfully splited');
            } else {
                return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 400, {});
            }
        } catch (error) {
            console.log("Split Tables -> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },
    /*
    *  Delete Product Category
    */
    delete: async (req, res) => {
        try {
            let data = await Service.delete(req.params.id);
            if(data){
                return commonResponse.success(res, "TABLES_DELETE", 200, data, 'Successfully deleted');
            }else{
                return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 400, {});
            }
        } catch (error) {
            console.log("Delete Tables -> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },
    
    /*
    *  Get  
    */
    getTables: async (req, res) => {
        try {
            let data = await Service.getById(req.params.id);
            if(data){
                return commonResponse.success(res, "TABLES_DETAIL", 200, data, 'Success');
            }else{
                return commonResponse.CustomError(res, "TABLES_NOT_FOUND", 400, {}, 'Taxes not found');
            }
        } catch (error) {
            console.log("Get TABLES Detail -> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },
}