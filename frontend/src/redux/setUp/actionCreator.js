import axios from "axios";

const { DataService } = require("../../config/dataService/dataService");
const { API } = require("../../config/api/index");

import {
  setItem,
  removeItem,
  getItem,
} from "../../utility/localStorageControl";

const userDetail = getItem("userDetails");

const getAllSetUpList = (checkSell) => {
  return async (dispatch) => {
    try {
      if (getItem("role") === "restaurant" || getItem("role") === "cashier") {
        const res = await axios({
          method: "GET",
          url: `http://172.105.35.50:7000/api/localStorage/setup/${userDetail._id}`,
          headers: {
            Authorization: `Bearer ${getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        });

        let totalUserlist = res.data.data.userList;
        let app_userList = [];
        let waiterList = [];
        let kitchen_user = [];
        let cashierList = [];
        if (totalUserlist && totalUserlist.length > 0) {
          app_userList = totalUserlist.filter((val) => val.role == "app_user");
          waiterList = totalUserlist.filter((val) => val.role == "waiter");
          kitchen_user = totalUserlist.filter(
            (val) => val.role == "kitchen_user"
          );
          cashierList = totalUserlist.filter((val) => val.role == "cashier");
        }

        let customFieldList = res.data.data.customFields;
        let pattycashCustomFiled = [];
        let addtionCustomFiled = [];
        let paymentTypeCustomFiled = [];
        let tagCustomeFiled = [];
        if (customFieldList && customFieldList.length > 0) {
          pattycashCustomFiled = customFieldList.filter(
            (val) => val.type == "petty_cash_category"
          );
          addtionCustomFiled = customFieldList.filter(
            (val) => val.type == "additional_detail"
          );
          tagCustomeFiled = customFieldList.filter((val) => val.type == "tag");
          paymentTypeCustomFiled = customFieldList.filter(
            (val) => val.type == "payment_type"
          );
        }
        res.data.data.userList = {
          appUserList: app_userList,
          kitchenUserList: kitchen_user,
          waiterUserList: waiterList,
          cashierUserList: cashierList,
        };
        res.data.data.customFields = {
          patty_cash: pattycashCustomFiled,
          addtional: addtionCustomFiled,
          tag: tagCustomeFiled,
          paymnetType: paymentTypeCustomFiled,
        };
        if (res.data.data.recent_activity.length > 0) {
          setItem("shfitOpenedTS", res.data.data.recent_activity[0].action);
        }

        res.data.data.register = getItem("setupCache").register;
        setItem("setupCache", res.data.data);
        if (
          res.data.data.preferences[0].hasOwnProperty("selling_preferences")
        ) {
          let preferences = res.data.data.preferences[0].selling_preferences;
          if (
            preferences.hasOwnProperty(
              "enforce_sequential_local_receipt_numbers"
            )
          ) {
            setItem(
              "localReceipt",
              preferences.enforce_sequential_local_receipt_numbers
            );
            if (preferences.enforce_sequential_local_receipt_numbers) {
              setItem("isStartSellingFromThisDevice", true);
            }
          }
          if (preferences.hasOwnProperty("do_not_round_off_sale_total")) {
            setItem("doNotRoundOff", preferences.do_not_round_off_sale_total);
          }
          if (
            preferences.hasOwnProperty(
              "display_items_in_sell_screen_as_a_list_instead_of_grid"
            )
          ) {
            setItem(
              "listView",
              preferences.display_items_in_sell_screen_as_a_list_instead_of_grid
            );
          }
          if (preferences.hasOwnProperty("enable_order_ticket_kot_genration")) {
            setItem(
              "orderTicketButton",
              preferences.enable_order_ticket_kot_genration
            );
          }
          if (preferences.hasOwnProperty("enable_quick_billing")) {
            setItem("enable_quick_billing", preferences.enable_quick_billing);
          }
          if (
            preferences.hasOwnProperty(
              "hide_quantity_increase_decrease_buttons"
            )
          ) {
            setItem(
              "hide_quantity_increase_decrease_buttons",
              preferences.hide_quantity_increase_decrease_buttons
            );
          }
          if (preferences.hasOwnProperty("hide_all_and_top_categories")) {
            setItem("hideAllAndTop", preferences.hide_all_and_top_categories);
          }
          if (preferences.hasOwnProperty("enforce_customer_mobile_number")) {
            setItem(
              "enforce_customer_mobile_number",
              preferences.enforce_customer_mobile_number
            );
          }
          if (
            preferences.hasOwnProperty(
              "enable_billing_only_when_shift_is_opened"
            )
          ) {
            setItem("enable_billing_only_when_shift_is_opened", true);
          }
          if (
            preferences.hasOwnProperty(
              "create_receipt_while_fullfilling_booking"
            )
          ) {
            setItem(
              "create_receipt_while_fullfilling_booking",
              preferences.create_receipt_while_fullfilling_booking
            );
          }
        }
      }
    } catch (err) {
      // return dispatch(RegisterListErr(AllRegisterListData.data));
    }
  };
};

export { getAllSetUpList };
