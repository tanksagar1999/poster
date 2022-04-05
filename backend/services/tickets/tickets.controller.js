const Service = require("./tickets.services");
const { commonResponse,commonFunctions,nodemailer } = require("../../helper");
const invNum = require("invoice-number");

module.exports = {
    
    /*
    *  Add New 
    */
     add: async (req, res) => {
        try {
            let checklastticket  =  await Service.getLastTicketsofDay('2021-05-10');
            if(checklastticket.length>0){
                req.body.ticket_number= '#'+invNum.next(checklastticket[0].ticket_number);
            }else{
                req.body.ticket_number = "#1";
            }
            let save = await Service.save(req.body);
            if (save) {
                return commonResponse.success(res, "TICKETS_ADD", 200, save, 'Tickets added successfully');
            } else {
                return commonResponse.error(res, "DEFAULT_INTERNAL_SERVER_ERROR", 400);
            }
        } catch (error) {
            console.log("Add TICKETS -> ", error);
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
                return commonResponse.success(res, "TICKETS_LIST", 200, list, 'Success');
            } else {
                return commonResponse.success(res, "NO_DATA_FOUND", 200, [], 'No Data Found');
            }
        } catch (error) {
            console.log("List TICKETS -> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },

    /*
    *  Update 
    */
    update: async (req, res) => {
        try {
            let updateTickets = await Service.update(req.params.id, req.body);
            if (updateTickets) {
                return commonResponse.success(res, "TICKETS_UPDATE", 200, updateTickets, 'Successfully updated Tickets');
            } else {
                return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 400, {});
            }
        } catch (error) {
            console.log("Update TICKETS -> ", error);
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
                return commonResponse.success(res, "TICKETS_DELETE", 200, data, 'Successfully deleted product');
            }else{
                return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 400, {});
            }
        } catch (error) {
            console.log("Delete Tickets -> ", error);
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
                return commonResponse.success(res, "TICKETS_DELETE", 200, data, 'Successfully deleted');
            }else{
                return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 400, {});
            }
        } catch (error) {
            console.log("Delete Tickets -> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },
    
    /*
    *  Get Detail
    */
    getTickets: async (req, res) => {
        try {
            let data = await Service.getById(req.params.id);
            if(data){
                return commonResponse.success(res, "TICKETS_DETAIL", 200, data, 'Success');
            }else{
                return commonResponse.CustomError(res, "TICKETS_NOT_FOUND", 400, {}, 'Tickets not found');
            }
        } catch (error) {
            console.log("Get Tickets Detail -> ", error);
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
                    file = await commonFunctions.exportToCSV('Tickets',transformer,list);
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
                    file = await commonFunctions.exportToXLSX('Tickets',header,list);
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
                    file = await commonFunctions.exportToPDF('Tickets',header,list);
                }
                
                if(file){
                    file = process.env.DOMAIN_URL + "/exports/"+file;
                    let emailData = {
                        to:  req.body.email,
                        subject: "Poster || Export Tickets",
                        text: `Your Tickets report is ready for download`,
                        html: `<b>Tickets</b><br><a href="${file}" target="_blank">Click here to download </a>`,
                        
                    };
                    nodemailer.sendMail(emailData);
                }

                return commonResponse.success(res, "TICKETS_EXPORT", 200, [], 'Successfully send exported data to email');
            } else {
                return commonResponse.success(res, "NO_DATA_FOUND", 200, [], 'No Data Found');
            }
        } catch (error) {
            console.log("Export Tickets DETAIL -> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },
}