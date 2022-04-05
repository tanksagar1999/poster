const Service = require("./product_price_books.services");
const { commonResponse,commonFunctions,nodemailer } = require("../../helper");

module.exports = {
    
    /*
    *  Add New  
    */
     add: async (req, res) => {
        try {
            req.body.register_id = req.user.main_register_id;;
            let save = await Service.save(req.body);
            if (save) {
                return commonResponse.success(res, "PRODUCT_PRICE_BOOKS_ADD", 200, save, 'Product Price Books added successfully');
            } else {
                return commonResponse.error(res, "DEFAULT_INTERNAL_SERVER_ERROR", 400);
            }
        } catch (error) {
            console.log("Add Product Price Book-> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },

    /*
    *  List  
    */
    list: async (req, res) => {
        try {
            req.body.register_id = req.user.main_register_id;
            let list = await Service.list(req.query);
            if ( list.length > 0 ) {
                return commonResponse.success(res, "PRODUCT_PRICE_BOOKS_LIST", 200, list, 'Success');
            } else {
                return commonResponse.success(res, "NO_DATA_FOUND", 200, [], 'No Data Found');
            }
        } catch (error) {
            console.log("List Product Price Book -> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },

    /*
    *  Update  
    */
    update: async (req, res) => {
        try {
            req.body.register_id = req.user.main_register_id;
            let updateProductPriceBooks = await Service.update(req.params.id, req.body);
            if (updateProductPriceBooks) {
                return commonResponse.success(res, "PRODUCT_PRICE_BOOKS_UPDATE", 200, updateProductPriceBooks, 'Successfully updated product price book');
            } else {
                return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 400, {});
            }
        } catch (error) {
            console.log("Update Product Price Books -> ", error);
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
                return commonResponse.success(res, "PRODUCT_PRICE_BOOKS_DELETE", 200, data, 'Successfully deleted product price book');
            }else{
                return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 400, {});
            }
        } catch (error) {
            console.log("Delete Product Price Books -> ", error);
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
                return commonResponse.success(res, "PRODUCT_PRICE_BOOKS_DELETE", 200, data, 'Successfully deleted');
            }else{
                return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 400, {});
            }
        } catch (error) {
            console.log("Delete Product Category -> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },
    /*
    *  Get Product Category Detail
    */
    get: async (req, res) => {
        try {
            let data = await Service.getById(req.params.id);
            if(data){
                return commonResponse.success(res, "PRODUCT_PRICE_BOOKS_DETAIL", 200, data, 'Success');
            }else{
                return commonResponse.CustomError(res, "PRODUCT_PRICE_BOOKS_NOT_FOUND", 400, {}, 'Product price books not found');
            }
        } catch (error) {
            console.log("Get Product Variants Groups Detail -> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },
    /*
    *  Export
    */
    export: async (req, res) => {
        try {
            req.query.register_id= req.user.main_register_id;
            let list = await Service.list(req.query);
            if ( list.length > 0 ) {
                let file = "";
                list = await commonFunctions.changeDateFormat(list,'created_at');

                if(req.body.type=='CSV'){
                    const transformer = (doc)=> {
                        return {
                            Price_book_name: doc.price_book_name,
                            Order_type: doc.order_type,
                            Registers: doc.registers,
                            Created_at: doc.created_at
                        };
                      }
                    file = await commonFunctions.exportToCSV('Product_Price_Book',transformer,list);
                } 
                if(req.body.type=='XLSX'){
                    const header =  [
                        { header: 'Price_book_name', key: 'price_book_name', width: 10 },
                        { header: 'Order_type', key: 'order_type', width: 30 },
                        { header: 'Registers', key: 'registers', width: 30},
                        { header: 'Created_at', key: 'created_at', width: 30}
                    ];
                    file = await commonFunctions.exportToXLSX('Product_Price_Book',header,list);
                }
                if(req.body.type=='PDF'){
                    const header =  [
                        { header: 'Price_book_name', key: 'price_book_name'},
                        { header: 'Order_type', key: 'order_type'},
                        { header: 'Registers', key: 'registers'},
                        { header: 'Created_at', key: 'created_at'}
                    ];
                    file = await commonFunctions.exportToPDF('Product_Price_Book',header,list);
                }
                
                if(file){
                    file = process.env.DOMAIN_URL + "/exports/"+file;
                    let emailData = {
                        to:  req.body.email,
                        subject: "Poster || Export Product Price Book",
                        text: `Your Product Price Book report is ready for download`,
                        html: `<b>Product Price Book</b><br><a href="${file}" target="_blank">Click here to download </a>`,
                        
                    };
                    nodemailer.sendMail(emailData);
                }

                return commonResponse.success(res, "PRODUCT_PRICE_BOOKS_EXPORT", 200, [], 'Successfully send exported data to email');
            } else {
                return commonResponse.success(res, "NO_DATA_FOUND", 200, [], 'No Data Found');
            }
        } catch (error) {
            console.log("List PRODUCT PRICE BOOKS DETAIL -> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },
}