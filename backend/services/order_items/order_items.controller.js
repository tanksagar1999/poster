const Service = require("./order_items.services");
const { commonResponse,commonFunctions,nodemailer } = require("../../helper");

module.exports = {
    
    /*
    *  Add New 
    */
     add: async (req, res) => {
        try {
            let save = await Service.save(req.body);
            if (save) {
                return commonResponse.success(res, "ORDER_ITEMS_ADD", 200, save, 'Order added successfully');
            } else {
                return commonResponse.error(res, "DEFAULT_INTERNAL_SERVER_ERROR", 400);
            }
        } catch (error) {
            console.log("Add ORDER ITEMS -> ", error);
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
                return commonResponse.success(res, "ORDER_ITEMS_LIST", 200, list, 'Success');
            } else {
                return commonResponse.success(res, "NO_DATA_FOUND", 200, [], 'No Data Found');
            }
        } catch (error) {
            console.log("List ORDER ITEMS -> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },

    /*
    *  Update 
    */
    update: async (req, res) => {
        try {
            let updateOrder = await Service.update(req.params.id, req.body);
            if (updateOrder) {
                return commonResponse.success(res, "ORDER_ITEMS_UPDATE", 200, updateOrder, 'Successfully updated Order');
            } else {
                return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 400, {});
            }
        } catch (error) {
            console.log("Update ORDER ITEMS -> ", error);
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
                return commonResponse.success(res, "ORDER_ITEMS_DELETE", 200, data, 'Successfully deleted product');
            }else{
                return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 400, {});
            }
        } catch (error) {
            console.log("Delete Order -> ", error);
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
                return commonResponse.success(res, "ORDER_ITEMS_DELETE", 200, data, 'Successfully deleted');
            }else{
                return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 400, {});
            }
        } catch (error) {
            console.log("Delete Order -> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },
    
    /*
    *  Get Detail
    */
    getOrders: async (req, res) => {
        try {
            let data = await Service.getById(req.params.id);
            if(data){
                return commonResponse.success(res, "ORDER_ITEMS_DETAIL", 200, data, 'Success');
            }else{
                return commonResponse.CustomError(res, "ORDER_ITEMS_NOT_FOUND", 400, {}, 'Orders not found');
            }
        } catch (error) {
            console.log("Get Orders Detail -> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },
    /*
    *  Export
    */
    export: async (req, res) => {
        try {
            let list = await Service.export({});
            if ( list.length > 0 ) {
                let file = "";
                list = await commonFunctions.changeDateFormat(list,'created_at');

                if(req.body.type=='CSV'){
                    const transformer = (doc)=> {
                        return {
                            mobile: doc.mobile,
                            name: doc.name,
                            email: email,
                            street_address: doc.street_address,
                            city: doc.city,
                            zipcode:zipcode,
                            associated_registers:register_id,
                            created_at:created_at
                        };
                      }
                    file = await commonFunctions.exportToCSV('Orders',transformer,list);
                } 
                if(req.body.type=='XLSX'){
                    const header =  [
                        { header: 'mobile', key: 'mobile'},
                        { header: 'name', key: 'name'},
                        { header: 'email', key: 'email'},
                        { header: 'street_address', key: 'street_address'},
                        { header: 'city', key: 'city'},
                        { header: 'zipcode', key: 'zipcode'},
                        { header: 'associated_registers', key: 'register_id'},
                        { header: 'created_at', key: 'created_at'}
                    ];
                    file = await commonFunctions.exportToXLSX('Orders',header,list);
                }
                if(req.body.type=='PDF'){
                    const header =  [
                        { header: 'mobile', key: 'mobile'},
                        { header: 'name', key: 'name'},
                        { header: 'email', key: 'email'},
                        { header: 'street_address', key: 'street_address'},
                        { header: 'city', key: 'city'},
                        { header: 'zipcode', key: 'zipcode'},
                        { header: 'associated_registers', key: 'register_id'},
                        { header: 'created_at', key: 'created_at'}
                    ];
                    file = await commonFunctions.exportToPDF('Orders',header,list);
                }
                
                if(file){
                    file = process.env.DOMAIN_URL + "/exports/"+file;
                    let emailData = {
                        to:  req.body.email,
                        subject: "Poster || Export Orders",
                        text: `Your Orders report is ready for download`,
                        html: `<b>Orders</b><br><a href="${file}" target="_blank">Click here to download </a>`,
                        
                    };
                    nodemailer.sendMail(emailData);
                }

                return commonResponse.success(res, "ORDER_ITEMS_EXPORT", 200, [], 'Successfully send exported data to email');
            } else {
                return commonResponse.success(res, "NO_DATA_FOUND", 200, [], 'No Data Found');
            }
        } catch (error) {
            console.log("Export Orders DETAIL -> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },
}