const Service = require("./product_category.services");
const { commonResponse,commonFunctions } = require("../../helper");

module.exports = {
    
    /*
    *  Add New Product Category
    */
     add: async (req, res) => {
        try {
            req.body.color = await commonFunctions.generateRandomColor();
            req.body.register_id = req.user.main_register_id;
            let checkExist =  await Service.checkExist({category_name:{$regex: new RegExp("^" + req.body.category_name + "$", "i")},register_id:req.body.register_id});
            if(checkExist){
                return commonResponse.CustomError(res, "ALREADY_EXIST", 400, {}, "Unable to create product category. Make sure the category name does not already exist");
            }
            
            let save = await Service.save(req.body);
            if (save) {
                return commonResponse.success(res, "PRODUCT_CATEGORY_ADD", 200, save, 'Product Category added successfully');
            } else {
                return commonResponse.error(res, "DEFAULT_INTERNAL_SERVER_ERROR", 400);
            }
        } catch (error) {
           
           return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);

        }
    },

    /*
    *  List Product Category
    */
    list: async (req, res) => {
        try {
            req.query.register_id = req.user.main_register_id;
            let list = await Service.list(req.query);
            if ( list.length > 0 ) {
                return commonResponse.success(res, "PRODUCT_CATEGORY_LIST", 200, list, 'Success');
            } else {
                return commonResponse.success(res, "NO_DATA_FOUND", 200, [], 'No Data Found');
            }
        } catch (error) {
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },

    /*
    *  Update Product Category
    */
    update: async (req, res) => {
        try {
            req.body.register_id = req.user.main_register_id;
            let checkExist =  await Service.checkExist({category_name:{$regex: new RegExp("^" + req.body.category_name + "$", "i")},register_id:req.body.register_id,_id:{ $ne: req.params.id } });
            if(checkExist){
                return commonResponse.CustomError(res, "ALREADY_EXIST", 400, {}, "Unable to update product category. Make sure the category name does not already exist");
            }
            let updateProductCategory = await Service.update(req.params.id, req.body);
            if (updateProductCategory) {
                return commonResponse.success(res, "PRODUCT_CATEGORY_UPDATE", 200, updateProductCategory, 'Successfully updated service');
            } else {
                return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 400, {});
            }
        } catch (error) {
            console.log("Update Product Category -> ", error);
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
                return commonResponse.success(res, "PRODUCT_CATEGORY_DELETE", 200, data, 'Successfully deleted service');
            }else{
                return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 400, {});
            }
        } catch (error) {
            console.log("Delete Product Category -> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },

    /*
    *  Delete Multiple
    */
    deleteAll: async (req, res) => {
        try {
            let check = await commonFunctions.checkDependecyOnDelete("products",req.body,'product_category',false);
            if(check){
                return commonResponse.success(res, "ALREADY_IN_USE", 200, {}, "Could't process to delete data because items are associated with another module.please delete them first");
            }
            let data = await Service.deleteAll(req.body);
            if(data){
                return commonResponse.success(res, "PRODUCT_CATEGORY_DELETE", 200, data, 'Successfully deleted service');
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
    getProductCategory: async (req, res) => {
        try {
            let data = await Service.getById(req.params.id);
            if(data){
                return commonResponse.success(res, "PRODUCT_CATEGORY_DETAIL", 200, data, 'Success');
            }else{
                return commonResponse.CustomError(res, "PRODUCT_CATEGORY_NOT_FOUND", 400, {}, 'Product Category not found');
            }
        } catch (error) {
            console.log("Get Product Category Detail -> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },
}