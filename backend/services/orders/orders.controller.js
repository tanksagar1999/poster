const Service = require("./orders.services");
const {
    commonResponse,
    commonFunctions,
    nodemailer
} = require("../../helper");
const receiptsServices = require("../receipts/receipts.services");
const orderitemsServices = require("../order_items/order_items.services");
const ticketsServices = require("../tickets/tickets.services");
const registerServices = require("../registers/registers.services");
const productsServices = require("../products/products.services");

module.exports = {

    /*
     *  Add New 
     */
    add: async (req, res) => {
        try {
            let save = await Service.save(req.body);
            if (save) {
                return commonResponse.success(res, "ORDERS_ADD", 200, save, 'Order added successfully');
            } else {
                return commonResponse.error(res, "DEFAULT_INTERNAL_SERVER_ERROR", 400);
            }
        } catch (error) {
            console.log("Add ORDERS -> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },

    /*
     *  List 
     */
    list: async (req, res) => {
        try {

            let list = await Service.list(req.query);
            if (list.length > 0) {
                return commonResponse.success(res, "ORDERS_LIST", 200, list, 'Success');
            } else {
                return commonResponse.success(res, "NO_DATA_FOUND", 200, [], 'No Data Found');
            }
        } catch (error) {
            console.log("List ORDERS -> ", error);
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
                return commonResponse.success(res, "ORDERS_UPDATE", 200, updateOrder, 'Successfully updated Order');
            } else {
                return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 400, {});
            }
        } catch (error) {
            console.log("Update ORDERS -> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },

    /*
     *  Delete 
     */
    delete: async (req, res) => {
        try {
            let data = await Service.delete(req.params.id);
            if (data) {
                return commonResponse.success(res, "ORDERS_DELETE", 200, data, 'Successfully deleted product');
            } else {
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
            if (data) {
                return commonResponse.success(res, "ORDERS_DELETE", 200, data, 'Successfully deleted');
            } else {
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
            if (data) {
                return commonResponse.success(res, "ORDERS_DETAIL", 200, data, 'Success');
            } else {
                return commonResponse.CustomError(res, "ORDERS_NOT_FOUND", 400, {}, 'Orders not found');
            }
        } catch (error) {
            console.log("Get Orders Detail -> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },
    /*
     *  Export sale
     */
    salesReport: async (req, res) => {
        try {
          
            let list = await Service.export({
                startDate: req.body.startDate,
                endDate:  req.body.endDate
            });
            if (list.length > 0) {
                var tmplist = Object.assign({}, list);

                for (const key in tmplist) {
                    let receipt_data = await receiptsServices.list({
                        order_id: tmplist[key]._id
                    });
                    let items_data = await orderitemsServices.list({
                        order_id: tmplist[key]._id
                    });

                    list[key].receipt_number = receipt_data.length > 0 ? receipt_data[0].receipt_number : "";
                    if (items_data.length > 0) {
                        let k = 0;
                        for (let i of items_data[0].items) {
                            let tmp = Object.assign({}, list[key]);
                            tmp.product_name = i.name;
                            tmp.product_quantity = i.qty;
                            tmp.product_price = i.price;
                            tmp.product_subtotal = i.total;
                            list.splice(parseInt(key) + k, 0, tmp);
                            k++;
                        }
                        list.splice(parseInt(key) + k + 1, 1);
                    }
                }
                let file = "";

                const transformer = (doc) => {
                    return {
                        date: doc.date,
                        receipt_number: doc.receipt_number,
                        customer_mobile: doc.mobile,
                        customer_name: doc.name,
                        product_name: doc.product_name,
                        product_price: doc.price,
                        product_quantity: doc.product_quantity,
                        sub_total: doc.product_subtotal,
                        totals: doc.totals,
                        payment_status: doc.payment_status,
                        shipping_address: doc.shipping_address,
                        refund_amount: doc.refund_amount,
                        refund_paid_by: doc.refund_paid_by

                    };
                }

                file = await commonFunctions.exportToCSV('SalesReport', transformer, list);


                if (file) {
                    file = process.env.DOMAIN_URL + "/exports/" + file;
                    let emailData = {
                        to: req.body.email,
                        subject: "Poster || Sales report",
                        text: `Your Sales report is ready for download`,
                        html: `<b>Sales report from ${req.body.startDate} to ${req.body.endDate} </b><br><a href="${file}" target="_blank">Click here to download </a>`,

                    };
                    nodemailer.sendMail(emailData);
                }

                return commonResponse.success(res, "ORDERS_EXPORT", 200, [], 'Successfully send exported data to email');
            } else {
                return commonResponse.success(res, "NO_DATA_FOUND", 200, [], 'No Data Found');
            }
        } catch (error) {
            console.log("Export Orders DETAIL -> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },
    /*
     *  Export order tickets
     */
    orderTicketsReport: async (req, res) => {
        try {
            let list = await ticketsServices.export({
                startDate: req.body.startDate,
                endDate:  req.body.endDate
            });
            let file_name = req.body.startDate==req.body.endDate ? req.body.startDate : req.body.startDate+'_'+req.body.endDate;
            if (list.length > 0) {
                var tmplist = Object.assign({}, list);

                for (const key in tmplist) {
                    let receipt_data = await receiptsServices.list({
                        order_id: tmplist[key]._id
                    });

                    list[key].receipt_number = receipt_data.length > 0 ? receipt_data[0].receipt_number : "";
                    list[key].register_name = tmplist[key].order_id.register_id.register_name;
                    
                    let k = 0;
                    for (let i of tmplist[key].items) {
                       
                        let tmp = Object.assign({}, list[key]);
                        tmp.product_name = i.product_name;
                        tmp.product_quantity = i.qty;
                        list.splice(parseInt(key) + k, 0, tmp);
                        k++;
                    }
                    list.splice(parseInt(key) + k, 1);

                }
                let file = "";

                const transformer = (doc) => {
                    return {
                        order_ticket_created_date: doc.created_at,
                        register_name : doc.register_name,
                        receipt_number: doc.receipt_number,
                        order_ticket_number:doc.ticket_number,
                        product_name: doc.product_name,
                        product_quantity: doc.product_quantity,
                        action : doc.action,
                        order_ticket_created_by : doc.created_by.username
                    };
                }
                file_name = 'OrderTicketReport_'+file_name;
                 file = await commonFunctions.exportToCSV(file_name,transformer,list);


                if(file){
                    file = process.env.DOMAIN_URL + "/exports/"+file;
                    let emailData = {
                        to:  req.body.email,
                        subject: "Poster || Order ticket report",
                        text: `Your Order ticket report is ready for download`,
                        html: `<b>Order ticket report from ${req.body.startDate} to ${req.body.endDate} </b><br><a href="${file}" target="_blank">Click here to download </a>`,

                    };
                    nodemailer.sendMail(emailData);
                }

                return commonResponse.success(res, "ORDERS_EXPORT", 200, [], 'Successfully send exported data to email');
            } else {
                return commonResponse.success(res, "NO_DATA_FOUND", 200, [], 'No Data Found');
            }
        } catch (error) {
            console.log("Export Orders DETAIL -> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },
    /*
     *  Export productWiseReport
     */
    productWiseReport: async (req, res) => {
        try {
            // let list = await Service.getOrdersByDates({
            //     startDate: req.body.startDate,
            //     endDate:  req.body.endDate
            // });
             
            let list = await orderitemsServices.getTopSellingOfDay({
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                register_id:req.body.register_id

                 
            });
            let file_name = req.body.startDate==req.body.endDate ? req.body.startDate : req.body.startDate+'_'+req.body.endDate;
            if (list.length > 0) {
                
                for (const key in list) {
                    let regdata = await registerServices.getById(req.body.register_id); 
                    let pdata = await productsServices.list({product_name:list[key].product_name});   
                       
                    list[key].register_name =  regdata.register_name;
                    list[key].total_sales =  pdata[0].price * list[key].qty;
                    list[key].product_category = pdata[0].product_category!=null ? pdata[0].product_category.category_name : '';
                }
               
                let file = "";

                const transformer = (doc) => {
                    return {
                        product_name: doc.product_name,
                        register_name : doc.register_name,
                        product_category: doc.product_category,
                        quantity: doc.qty,
                        total_sales:doc.total_sales,
                       
                    };
                }
                file_name = 'ProductWiseReport'+file_name;
                 file = await commonFunctions.exportToCSV(file_name,transformer,list);


                if(file){
                    file = process.env.DOMAIN_URL + "/exports/"+file;
                    let emailData = {
                        to:  req.body.email,
                        subject: "Poster || Product Wise Report report",
                        text: `Your Product Wise Report is ready for download`,
                        html: `<b>Order ticket report from ${req.body.startDate} to ${req.body.endDate} </b><br><a href="${file}" target="_blank">Click here to download </a>`,

                    };
                    nodemailer.sendMail(emailData);
                }

                return commonResponse.success(res, "ORDERS_EXPORT", 200, [], 'Successfully send exported data to email');
            } else {
                return commonResponse.success(res, "NO_DATA_FOUND", 200, [], 'No Data Found');
            }
        } catch (error) {
            console.log("Export Orders DETAIL -> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },
    /*
     *  daily sale report
     */
    dailySalesReport: async (req, res) => {
        try {
             
             
            let list = await Service.getDaywiseSales({
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                register_id:req.body.register_id,
                paymentStatus:["paid","unpaid"],
                status: ["completed","cancelled","confirmed"],
                payment_type:["card","cash","other"]
                 
            });
            let file_name = req.body.startDate==req.body.endDate ? req.body.startDate : req.body.startDate+'_'+req.body.endDate;
            if (list.length > 0) {
                
                
                for (const key in list) {
                    
                    let paidbycard = await Service.getDaywiseSales({
                        startDate: list[key]._id,
                        endDate: list[key]._id,
                        register_id:req.body.register_id,
                        status: ["completed","cancelled","confirmed"],
                        paymentStatus:["paid"],
                        payment_type:["card"]
                    });
                    list[key].card_payments = paidbycard.length > 0 ? paidbycard[0].sales : 0;

                    let paidbycash = await Service.getDaywiseSales({
                        startDate: list[key]._id,
                        endDate: list[key]._id,
                        register_id:req.body.register_id,
                        status: ["completed","cancelled","confirmed"],
                        paymentStatus:["paid"],
                        payment_type:["cash"]
                    });
                    list[key].cash_payments = paidbycash.length > 0 ? paidbycash[0].sales : 0;

                    let paidbyother = await Service.getDaywiseSales({
                        startDate: list[key]._id,
                        endDate: list[key]._id,
                        register_id:req.body.register_id,
                        paymentStatus:["paid"],
                        status: ["completed","cancelled","confirmed"],
                        payment_type:["other"]
                    });
                    list[key].other_payments = paidbyother.length > 0 ? paidbyother[0].sales : 0;

                    let cancelled = await Service.getDaywiseSales({
                        startDate: list[key]._id,
                        endDate: list[key]._id,
                        register_id:req.body.register_id,
                        paymentStatus:["paid","unpaid"],
                        status: ["cancelled"],
                        payment_type:["card","cash","other"]
                    });
                    list[key].cancelled = cancelled.length > 0 ? cancelled[0].count : 0;

                }
               
                let file = "";

                const transformer = (doc) => {
                    return {
                        date: doc._id,
                        receipt_count : doc.count,
                        cancellation_count: doc.cancelled,
                        total_sales:doc.sales,
                        total_payments:doc.sales,
                        total_payments:doc.sales,
                        cash_payments:doc.cash_payments,
                        card_payments:doc.card_payments,
                        other_payments:doc.other_payments
                    };
                }
                file_name = 'DailySalesAndPayment'+file_name;
                 file = await commonFunctions.exportToCSV(file_name,transformer,list);


                if(file){
                    file = process.env.DOMAIN_URL + "/exports/"+file;
                    let emailData = {
                        to:  req.body.email,
                        subject: "Poster || Daily Sales and payment report",
                        text: `Your Daily Sales and payment is ready for download`,
                        html: `<b>Daily Sales and payment from ${req.body.startDate} to ${req.body.endDate} </b><br><a href="${file}" target="_blank">Click here to download </a>`,

                    };
                    nodemailer.sendMail(emailData);
                }

                return commonResponse.success(res, "ORDERS_EXPORT", 200, list, 'Successfully send exported data to email');
            } else {
                return commonResponse.success(res, "NO_DATA_FOUND", 200, [], 'No Data Found');
            }
        } catch (error) {
            console.log("Export Orders DETAIL -> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },
}