const Service = require("./shops.services");
const userService = require("../users/users.services");
const RestaurantUsersService = require("../restaurant_users/restaurant_users.services");
const { commonResponse, commonFunctions } = require("../../helper");
const registerService = require("../registers/registers.services");

module.exports = {
  /*
   *  Add New
   */
  add: async (req, res) => {
    try {
      if (req.files != undefined && req.files.shop_logo != undefined) {
        req.body.shop_logo =
          process.env.DOMAIN_URL + "/shops/" + req.files.shop_logo[0].filename;
      }

      let save = await Service.save(req.body);

      if (save) {
        return commonResponse.success(
          res,
          "SHOPS_ADD",
          200,
          save,
          "Shop added successfully"
        );
      } else {
        return commonResponse.error(res, "DEFAULT_INTERNAL_SERVER_ERROR", 400);
      }
    } catch (error) {
      console.log("Add Shop -> ", error);
      return commonResponse.CustomError(
        res,
        "DEFAULT_INTERNAL_SERVER_ERROR",
        500,
        {},
        error.message
      );
    }
  },

  /*
   *  List
   */
  list: async (req, res) => {
    try {
      let list = await Service.list(req.query);
      if (list.length > 0) {
        return commonResponse.success(res, "SHOPS_LIST", 200, list, "Success");
      } else {
        return commonResponse.success(
          res,
          "NO_DATA_FOUND",
          200,
          [],
          "No Data Found"
        );
      }
    } catch (error) {
      console.log("List Shops -> ", error);
      return commonResponse.CustomError(
        res,
        "DEFAULT_INTERNAL_SERVER_ERROR",
        500,
        {},
        error.message
      );
    }
  },

  /*
   *  Update
   */
  update: async (req, res) => {
    try {
      //remove old image
      let dataimage = await Service.getById({
        user_id: req.params.id,
      });

      let updateShops;

      //checking owner pin
      let ownerpindetail = {
        role: "owner",
        register_assigned_to: req.user.main_register_id,
        restaurant_admin_id: req.user.main_register_id,
      };
      let checkowner = await RestaurantUsersService.unlock(ownerpindetail);
      if (checkowner.length > 0) {
        if (req.body.shop_owner_pin) {
          let filter = {
            restaurant_admin_id: req.user.main_register_id,
            $or: [
              {
                username: req.body.username,
              },
              {
                pin: req.body.shop_owner_pin,
              },
            ],
            role: { $nin: ["owner"] },
          };
          let list = await RestaurantUsersService.CheckPinExist(filter);
          if (list.length > 0) {
            message =
              "Make sure PIN / name does not already exist for another user";
            return commonResponse.CustomError(
              res,
              "INVALID_PIN",
              400,
              {},
              message
            );
          }
          ownerpindetail.pin = req.body.shop_owner_pin;
        }
        await RestaurantUsersService.update(checkowner[0]._id, ownerpindetail);
      } else {
        if (req.body.shop_owner_pin) {
          ownerpindetail.pin = req.body.shop_owner_pin;
        }
        ownerpindetail.username = "Main Owner";
        await RestaurantUsersService.save(ownerpindetail);
      }

      if (dataimage) {
        if (req.files != undefined && req.files.shop_logo != undefined) {
          await commonFunctions.removeFile(dataimage.shop_logo);
          req.body.shop_logo =
            process.env.DOMAIN_URL +
            "/shops/" +
            req.files.shop_logo[0].filename;
        }
        updateShops = await Service.update(req.params.id, req.body);
        await userService.update(req.params.id, { is_shop: true });
      } else {
        req.body.user_id = req.params.id;
        updateShops = await Service.save(req.body);
        await userService.update(req.params.id, { is_shop: true });
      }

      if (updateShops) {
        return commonResponse.success(
          res,
          "SHOPS_UPDATE",
          200,
          updateShops,
          "Successfully updated shop"
        );
      } else {
        return commonResponse.CustomError(
          res,
          "DEFAULT_INTERNAL_SERVER_ERROR",
          400,
          {}
        );
      }
    } catch (error) {
      console.log("Update Shops -> ", error);
      return commonResponse.CustomError(
        res,
        "DEFAULT_INTERNAL_SERVER_ERROR",
        500,
        {},
        error.message
      );
    }
  },

  /*
   *  Delete
   */
  delete: async (req, res) => {
    try {
      //remove old image
      let dataimage = await Service.getById(req.params.id);
      if (dataimage) {
        await commonFunctions.removeFile(dataimage.shop_logo);
      }

      let data = await Service.delete(req.params.id);
      if (data) {
        return commonResponse.success(
          res,
          "SHOPS_DELETE",
          200,
          data,
          "Successfully deleted shops"
        );
      } else {
        return commonResponse.CustomError(
          res,
          "DEFAULT_INTERNAL_SERVER_ERROR",
          400,
          {}
        );
      }
    } catch (error) {
      console.log("Delete Shops -> ", error);
      return commonResponse.CustomError(
        res,
        "DEFAULT_INTERNAL_SERVER_ERROR",
        500,
        {},
        error.message
      );
    }
  },
  /*
   *  Delete Multiple
   */
  deleteAll: async (req, res) => {
    try {
      let data = await Service.deleteAll(req.body);
      if (data) {
        return commonResponse.success(
          res,
          "SHOPS_DELETE",
          200,
          data,
          "Successfully deleted"
        );
      } else {
        return commonResponse.CustomError(
          res,
          "DEFAULT_INTERNAL_SERVER_ERROR",
          400,
          {}
        );
      }
    } catch (error) {
      console.log("Delete Product Category -> ", error);
      return commonResponse.CustomError(
        res,
        "DEFAULT_INTERNAL_SERVER_ERROR",
        500,
        {},
        error.message
      );
    }
  },

  /*
   *  Get Detail
   */
  getShops: async (req, res, checkLocalapicall) => {
    try {
      console.log("req =>", req.user);
      let reg = await registerService.getById(req.user.main_register_id);
      let data = await Service.getById({
        user_id: reg.user_id,
      });
      let ownerpindetail = {
        role: "owner",
        username: "Main Owner",
        register_assigned_to: req.query.register_id,
        restaurant_admin_id: req.query.register_id,
      };
      let checkowner = await RestaurantUsersService.unlock(ownerpindetail);
      if (data && data._id) {
        data.shop_owner_pin =
          checkowner.length > 0 ? checkowner[0].pin : data.shop_owner_pin;
        if (checkLocalapicall == "local") {
          console.log("data562", data);
          return data;
        } else {
          return commonResponse.success(
            res,
            "SHOPS_DETAIL",
            200,
            data,
            "Success"
          );
        }
      } else {
        return commonResponse.CustomError(
          res,
          "SHOPS_NOT_FOUND",
          400,
          {},
          "Shop not found"
        );
      }
    } catch (error) {
      console.log("Get Shops Detail -> ", error);
      return commonResponse.CustomError(
        res,
        "DEFAULT_INTERNAL_SERVER_ERROR",
        500,
        {},
        error.message
      );
    }
  },
};
