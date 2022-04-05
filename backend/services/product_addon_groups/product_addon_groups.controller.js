const Service = require("./product_addon_groups.services");
const addonService = require("../product_addons/product_addons.services");

const { commonResponse,commonFunctions,nodemailer } = require("../../helper");

module.exports = {
    
    /*
    *  Add New Product Addon Groups
    */
     add: async (req, res) => {
        try {
            req.body.register_id= req.user.main_register_id;
            let save = await Service.save(req.body);
            if (save) {
                return commonResponse.success(res, "PRODUCT_ADDON_GROUPS_ADD", 200, save, 'Product Addon Group added successfully');
            } else {
                return commonResponse.error(res, "DEFAULT_INTERNAL_SERVER_ERROR", 400);
            }
        } catch (error) {
            console.log("Add Product Addon Groups -> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },

    /*
    *  List  Product Addon Groups
    */
    list: async (req, res) => {
        try {
            req.query.register_id= req.user.main_register_id;
            let list = await Service.list(req.query);
            if ( list.length > 0 ) {
                return commonResponse.success(res, "PRODUCT_ADDON_GROUPS_LIST", 200, list, 'Success');
            } else {
                return commonResponse.success(res, "NO_DATA_FOUND", 200, [], 'No Data Found');
            }
        } catch (error) {
            console.log("List ProductAddonGroups -> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },

    /*
    *  Update  Product Addon Groups
    */
    update: async (req, res) => {
        try {
            req.body.register_id= req.user.main_register_id;
            let updateProductCategory = await Service.update(req.params.id, req.body);
            if (updateProductCategory) {
                return commonResponse.success(res, "PRODUCT_ADDON_GROUPS_UPDATE", 200, updateProductCategory, 'Successfully updated Product Addon Groups');
            } else {
                return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 400, {});
            }
        } catch (error) {
            console.log("Update Product Addon Groups -> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },

    /*
    *  Delete  Product Addon Groups
    */
    delete: async (req, res) => {
        try {
            let data = await Service.delete(req.params.id);
            if(data){
                return commonResponse.success(res, "PRODUCT_ADDON_GROUPS_DELETE", 200, data, 'Successfully deleted Product Addon Groups');
            }else{
                return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 400, {});
            }
        } catch (error) {
            console.log("Delete Product Addon Groups -> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },
    /*
    *  Delete Multiple
    */
    deleteAll: async (req, res) => {
        try {
            let check = await commonFunctions.checkDependecyOnDelete("products",req.body,'option_addon_group',false);
            if(check){
                return commonResponse.success(res, "ALREADY_IN_USE", 200, {}, "Could't process to delete data because items are associated with another module.please delete them first");
            }
            let data = await Service.deleteAll(req.body);
            if(data){
                return commonResponse.success(res, "PRODUCT_ADDON_GROUPS_DELETE", 200, data, 'Successfully deleted');
            }else{
                return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 400, {});
            }
        } catch (error) {
            console.log("Delete Product Category -> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },
    /*
    *  Get  Product Addon Groups Detail
    */
    getProductAddonGroups: async (req, res) => {
        try {
            let data = await Service.getById(req.params.id);
            if(data){
                return commonResponse.success(res, "PRODUCT_ADDON_GROUPS_DETAIL", 200, data, 'Success');
            }else{
                return commonResponse.CustomError(res, "PRODUCT_ADDON_GROUPS_NOT_FOUND", 400, {}, 'Product Addon Groups not found');
            }
        } catch (error) {
            console.log("Get Product Addon Groups Detail -> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },

    /*
    *  Export
    */
    export: async (req, res) => {
        try {
            req.query.register_id= req.user.main_register_id;
            let list = await Service.export(req.query);
            if ( list.length > 0 ) {
                let file = "";
                if(req.body.type=='CSV'){
                    const transformer = (doc)=> {
                        return {
                            Addon_Group_Name: doc.addon_group_name,
                            Addon_Name: doc.addon_name,
                            Sort_Order: doc.sort_order
                        };
                      }
                    file = await commonFunctions.exportToCSV('Product_Addon_Groups',transformer,list);
                } 
                if(req.body.type=='XLSX'){
                    const header =  [
                        { header: 'Addon_Group_Name', key: 'addon_group_name', width: 10 },
                        { header: 'Addon_Name', key: 'addon_name', width: 30 },
                        { header: 'Sort_Order', key: 'sort_order', width: 30}
                    ];
                    file = await commonFunctions.exportToXLSX('Product_Addon_Groups',header,list);
                }
                if(req.body.type=='PDF'){
                    const header =  [
                        { header: 'Addon_Group_Name', key: 'addon_group_name' },
                        { header: 'Addon_Name', key: 'addon_name'},
                        { header: 'Sort_Order', key: 'sort_order'}
                    ];
                    file = await commonFunctions.exportToPDF('Product_Addon_Groups',header,list);
                }
                
                if(file){
                    file = process.env.DOMAIN_URL + "/exports/"+file;
                    let emailData = {
                        to:  req.body.email,
                        subject: "Poster || Export Product addons Groups",
                        text: `Your addons groups report is ready for download`,
                        html: `<b>Product addons groups</b><br><a href="${file}" target="_blank">Click here to download </a>`,
                        
                    };
                    nodemailer.sendMail(emailData);
                }

                return commonResponse.success(res, "PRODUCT_ADDON_GROUPS_EXPORT", 200, [], 'Successfully send exported data to email');
            } else {
                return commonResponse.success(res, "NO_DATA_FOUND", 200, [], 'No Data Found');
            }
        } catch (error) {
            console.log("List ProductAddons -> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },
    /*
    *  Import preview
    */
    preview: async (req, res) => {
        try {
            var save = false;
            if(req.files.csvfile){
                if(req.files.csvfile[0].mimetype!='text/csv' && req.files.csvfile[0].mimetype!='application/vnd.ms-excel'){
                    await commonFunctions.removeFile('imports/'+req.files.csvfile[0].filename);
                    return commonResponse.customResponse(res, "INVALID_FILE", 400, [], "Please Upload CSV file only");
                }
            }else{
                return commonResponse.customResponse(res, "INVALID_FILE", 400, [], "Please Upload CSV file");
            }
            let csvfile = req.files.csvfile[0].path;
            const data = await commonFunctions.readCsv(
                csvfile,
                { skipRows: 0 },
                (clm) => ({ addon_group_name: clm[0], addon_name: clm[1],sort_order:clm[2]}),
            );
            let response = {},preview =[];
            let total_create = total_update = total_errors = 0;

            response.headers = ["Addon Group Name","Addon Name","Sort Order"];
            let csvheader = Object.values(data[0]);
            data.shift(); 
            let checkheader = response.headers.filter(x => csvheader.indexOf(x) === -1);

             
            let alladdon =  await addonService.list({register_id:req.user.main_register_id});
            let alladdongroups =  await Service.list({register_id:req.user.main_register_id});


            for (const i in data){
                preview[i]={'record':data[i]};
                preview[i].isValid = true;
                preview[i].errors = [];
                preview[i].isExisting = false;
                preview[i].isShow = true;

                if(checkheader.length>0){
                    for (const e of checkheader){
                        preview[i].errors.push(e +" is not specified");
                    }
                    preview[i].isShow = false;
                }
                if(!data[i].addon_group_name){
                    preview[i].errors.push("Addon Group Name is required");
                }   
                if(!data[i].addon_name){
                    preview[i].errors.push("Addon Name is required");
                }   
 
                if(data[i].addon_name){
                    let checkaddon = alladdon.find(x => x.addon_name == data[i].addon_name);
                    if(!checkaddon){
                        preview[i].errors.push("Addon does not exists");
                    }
                }
              
                if(!parseInt(data[i].sort_order) && data[i].sort_order && data[i].sort_order!=0){
                    preview[i].errors.push("Sort order should be a number");
                }
                if(data[i].sort_order && Math.sign(data[i].sort_order)==-1){
                    preview[i].errors.push("Sort order not valid");
                }

                if(data[i].addon_group_name){
                    let checkexist = alladdongroups.find(x => x.addon_group_name == data[i].addon_group_name);
                    if(checkexist){
                        preview[i].isExisting = true;
                    } 
                }
                
                preview[i].isValid= preview[i].errors.length>0 ? false : true;
                
                if(preview[i].isValid && preview[i].errors.length==0 && !preview[i].isExisting)
                {
                    total_create++;
                }
                if(preview[i].isValid && preview[i].errors.length==0 && preview[i].isExisting)
                {
                    total_update++;
                }
                if(preview[i].errors.length>0)
                {
                    total_errors = total_errors + preview[i].errors.length;
                }
            }
            response.preview = preview;
            response.total_create = total_create;
            response.total_update = total_update;
            response.total_errors = total_errors;

            if(response){
                await commonFunctions.removeFile('imports/'+req.files.csvfile[0].filename);
                return commonResponse.success(res, "ADDON_GROUP_PREIVEW", 200, response, 'Success');
            }else{
                return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 400, {});
            }
        } catch (error) {
           
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },
    /*
     *  Import product addon data
     */
    import: async (req, res) => {
        try {
            let data = req.body.previewData;
            let insertData=[],updateData = [];
            

            let alladdons =  await addonService.list({register_id:req.user.main_register_id});
            let alladdongroups =  await Service.normalList({register_id:req.user.main_register_id});

            for (const row of data){
                row.record.register_id = req.user.main_register_id;
                row.record.sort_order =  row.record.sort_order ? row.record.sort_order : 0;
              
                //make add new array
                if(row.isValid && !row.isExisting){
                    let getaddonid = alladdons.find(x => x.addon_name == row.record.addon_name);
                    row.record.product_addons = getaddonid._id;
                    insertData.push(row.record);
                }
                //make update existing array
                if(row.isValid && row.isExisting){
                    let checkexist = alladdongroups.find(x => x.addon_group_name == row.record.addon_group_name);
                    if(checkexist){
                        let getaddonid= alladdons.find(x => x.addon_name == row.record.addon_name);
                        let alreadyhaveaddon = checkexist.product_addons.find(x =>x.toString() == getaddonid._id.toString());
                        if(!alreadyhaveaddon){
                            row.record.product_addons = checkexist.product_addons;
                            row.record.product_addons.push(getaddonid._id);
                        }
                        updateData.push(row.record);
                    } 
                }
                
            }

            //update
            if(updateData.length>0){
                for (const row of updateData){
                   await Service.updateByCondition({addon_group_name:row.addon_group_name,register_id:row.register_id},row);
                }
            }

            //add new
            if(insertData.length>0){
                var seen = {};

                //merge muliple variant for single group
                insertData = insertData.filter(function(entry) {
                    var previous; 
                    if (seen.hasOwnProperty(entry.addon_group_name)) {
                        previous = seen[entry.addon_group_name];
                        
                        previous.product_addons.push(entry.product_addons);
                        previous.product_addons =previous.product_addons.filter(function(item, i, ar){ return ar.indexOf(item) === i; })
                        return false;
                    }
                    if (!Array.isArray(entry.product_addons)) {
                        entry.product_addons = [entry.product_addons];
                    }
                    seen[entry.addon_group_name] = entry;
                    return true;
                });
                await Service.saveMany(insertData);
            }
            if(data){
                let emailData = {
                    to: req.body.email,
                    subject: "Poster || Import Product addon group",
                    text: `Your Product addon group are imported`,
                    html: `<b>Product addon group imported successfully</b><br>`,
                };
                nodemailer.sendMail(emailData);
                return commonResponse.success(res, "ADDON_GROUP_IMPORT", 200, {}, 'Successfully Imported');
            }else{
                return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 400, {});
            }
        } catch (error) {
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },
}