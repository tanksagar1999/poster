import Cookies from "js-cookie";
import actions from "./actions";
import axios from "axios";

const { DataService } = require("../../config/dataService/dataService");
const { API } = require("../../config/api/index");
import {
  setItem,
  removeItem,
  getItem,
} from "../../utility/localStorageControl";

import { DarkModeAvailable } from "../preference/actionCreator";

const {
  loginBegin,
  loginSuccess,
  loginErr,
  logoutBegin,
  logoutSuccess,
  logoutErr,
  resetPasswordSuccess,
  registerBegin,
  registerErr,
  registerSuccess,
  ForgotpinAdd,
  ForgotpinAddErr,
  offlineModeValue,
} = actions;

const login = (payloads, history) => {
  return async (dispatch) => {
    try {
      dispatch(loginBegin());

      const loggedIn = await DataService.post(API.auth.login, payloads);
      console.log("loggedInloggedIn", loggedIn);
      if (!loggedIn.data.error) {
        if (loggedIn.data.data.role === "restaurant") {
          const res = await axios({
            method: "GET",
            url: `http://172.105.35.50:7000/api/localStorage/setup/${loggedIn.data.data._id}`,
            headers: {
              Authorization: `Bearer ${loggedIn.data.data.token}`,
              "Content-Type": "application/json",
            },
          });

          console.log("resresrersrersrers", res.data.data);
          let totalUserlist = res.data.data.userList;
          let app_userList = [];
          let waiterList = [];
          let kitchen_user = [];
          let cashierList = [];
          if (totalUserlist && totalUserlist.length > 0) {
            app_userList = totalUserlist.filter(
              (val) => val.role == "app_user"
            );
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
            tagCustomeFiled = customFieldList.filter(
              (val) => val.type == "tag"
            );
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
          res.data.data.register = res.data.data.register.reverse();
          console.log("dataUrldataUrl", res.data.data.shopDetails.shop_logo);
          if (
            res.data.data.shopDetails.shop_logo == "" ||
            res.data.data.shopDetails.shop_logo == "false"
          ) {
            if (!res.data.error) {
              setItem("setupCache", res.data.data);
              setItem("profile-imge", "");
              setItem("pendingShiftList", []);
              setItem("pendingPattyCashEntries", []);
              if (getItem("LOCAL_STORAGE_CART_KEY_NAME") != null) {
                setItem(
                  "LOCAL_STORAGE_CART_KEY_NAME",
                  getItem("LOCAL_STORAGE_CART_KEY_NAME")
                );
              } else {
                setItem("LOCAL_STORAGE_CART_KEY_NAME", []);
              }
            }

            if (
              loggedIn.data.data.role === "restaurant" &&
              loggedIn.data.data.is_shop
            ) {
              setItem("access_token", loggedIn.data.data.token);
              setItem("email_id", loggedIn.data.data.email);

              history.push("/pin-auth");
              dispatch(loginSuccess(false));
            } else {
              setItem("access_token", loggedIn.data.data.token);
              setItem("userDetails", loggedIn.data.data);
              setItem("username", loggedIn.data.data.username);
              setItem("role", loggedIn.data.data.role);
              Cookies.set("logedIn", true);
              dispatch(loginSuccess(true));
              window.location.reload();
            }
          } else {
            const toDataURL = (url) =>
              fetch(url)
                .then((response) => response.blob())
                .then(
                  (blob) =>
                    new Promise((resolve, reject) => {
                      const reader = new FileReader();
                      reader.onloadend = () => resolve(reader.result);
                      reader.onerror = reject;
                      reader.readAsDataURL(blob);
                    })
                );

            toDataURL(res.data.data.shopDetails.shop_logo).then((dataUrl) => {
              res.data.data.shopDetails.shop_logo = dataUrl;
              if (!res.data.error) {
                setItem("setupCache", res.data.data);
                setItem("profile-imge", "");
                setItem("pendingShiftList", []);
                setItem("pendingPattyCashEntries", []);
                if (getItem("LOCAL_STORAGE_CART_KEY_NAME") != null) {
                  setItem(
                    "LOCAL_STORAGE_CART_KEY_NAME",
                    getItem("LOCAL_STORAGE_CART_KEY_NAME")
                  );
                } else {
                  setItem("LOCAL_STORAGE_CART_KEY_NAME", []);
                }
              }

              if (
                loggedIn.data.data.role === "restaurant" &&
                loggedIn.data.data.is_shop
              ) {
                setItem("access_token", loggedIn.data.data.token);
                setItem("email_id", loggedIn.data.data.email);

                history.push("/pin-auth");
                dispatch(loginSuccess(false));
              } else {
                setItem("access_token", loggedIn.data.data.token);
                setItem("userDetails", loggedIn.data.data);
                setItem("username", loggedIn.data.data.username);
                setItem("role", loggedIn.data.data.role);
                Cookies.set("logedIn", true);
                dispatch(loginSuccess(true));
                window.location.reload();
              }
            });
          }
        } else if (loggedIn.data.data.role === "admin") {
          setItem("access_token", loggedIn.data.data.token);
          setItem("userDetails", loggedIn.data.data);
          setItem("username", loggedIn.data.data.username);
          setItem("role", loggedIn.data.data.role);
          Cookies.set("logedIn", true);
          dispatch(loginSuccess(true));
          window.location.reload();
        }
      } else {
        dispatch(loginErr(loggedIn));
      }
    } catch (err) {
      dispatch(loginErr(err));
    }
  };
};

const secretPinAuth = (payloads, openBalance) => {
  let openBalanceData;
  return async (dispatch) => {
    try {
      dispatch(loginBegin());
      const loggedInViaSecretPin = await DataService.post(
        API.auth.secretPinAuth,
        payloads
      );

      if (openBalance && loggedInViaSecretPin) {
        openBalanceData = await DataService.post(API.shift.UpdateShift, {
          action: "open",
          opening_balance: openBalance,
          userName: loggedInViaSecretPin.data.data.username,
          register_id: getItem("setupCache").register.find((val) => val.active)
            ._id,
          actual_time: new Date(),
        });

        if (getItem("shfitOpenedTS") != null) {
          setItem("shfitOpenedTS", "open");
        }
      }

      if (!loggedInViaSecretPin.data.error) {
        removeItem("access_token");
        setItem("doNotRoundOff", false);

        setItem("access_token", loggedInViaSecretPin.data.data.token);

        setItem("username", loggedInViaSecretPin.data.data.username);
        setItem("role", loggedInViaSecretPin.data.data.role);
        setItem("userDetails", loggedInViaSecretPin.data.data);
        Cookies.set("logedIn", true);
        dispatch(loginSuccess(true));
        window.location.reload();
        await dispatch(DarkModeAvailable(getItem("dark_mode")));
      } else {
        dispatch(loginErr(loggedInViaSecretPin));
      }
    } catch (err) {
      let allSetupcache = getItem("setupCache");
      let data = allSetupcache.userList.cashierUserList.find(
        (val) => val.pin == payloads.pin
      );

      if (
        data == undefined &&
        allSetupcache.shopDetails.shop_owner_pin == payloads.pin
      ) {
        data = allSetupcache.account;
      }
      if (data) {
        if (openBalance) {
          let openShiftPending = getItem("pendingShiftList");

          setItem("pendingShiftList", [
            ...openShiftPending,
            {
              openbalance: openBalance,
              userName: data.username,
              register_id: getItem("setupCache").register.find(
                (val) => val.active
              )._id,
              actual_time: new Date(),
            },
          ]);
        }
        setItem("username", data.username);
        setItem("role", data.role);
        setItem("userDetails", data);

        Cookies.set("logedIn", true);
        window.location.reload();
        return dispatch(loginSuccess(true));
      } else {
        return dispatch(loginErr(err));
      }
    }
  };
};

const onlineToOpenSihft = async (openBalance, user_name) => {
  return await DataService.post(API.shift.UpdateShift, {
    action: "open",
    opening_balance: openBalance,
    userName: user_name,
    register_id: getItem("setupCache").register.find((val) => val.active)._id,
    actual_time: new Date(),
  });
};
const onlineToClosedShift = async (closedbalance, user_name) => {
  await DataService.post(API.auth.lockRegister, {});
  if (!(closedbalance == "notClose")) {
    return await DataService.post(API.shift.UpdateShift, {
      action: "close",
      closing_balance: closedbalance,
      userName: user_name,
      register_id: getItem("setupCache").register.find((val) => val.active)._id,
      actual_time: new Date(),
    });
  }
};
const logOut = (history) => {
  return async (dispatch) => {
    try {
      dispatch(logoutBegin());
      removeItem("access_token");
      removeItem("userDetails");
      removeItem("email_id");
      removeItem("setupCache");
      // removeItem("LOCAL_STORAGE_CART_KEY_NAME");
      removeItem("pendingShiftList");
      removeItem("pendingPattyCashEntries");
      Cookies.remove("logedIn");
      dispatch(logoutSuccess(null));
      window.location.reload();
    } catch (err) {
      dispatch(logoutErr(err));
    }
  };
};

const LockRegister = (history, finalTotal, user_name) => {
  return async (dispatch) => {
    try {
      const lockRegisterInViaRegister = await DataService.post(
        API.auth.lockRegister,
        {}
      );
      getItem("setUpca");
      if (!lockRegisterInViaRegister.data.error) {
        if (finalTotal !== "") {
          const CloseShift = await DataService.post(API.shift.UpdateShift, {
            action: "close",
            closing_balance: finalTotal,
            userName: user_name,
            register_id: getItem("setupCache").register.find(
              (val) => val.active
            )._id,
            actual_time: new Date(),
          });
        }
        if (getItem("shfitOpenedTS") != null) {
          setItem("shfitOpenedTS", "close");
        }
        Cookies.set("logedIn", false);
        history.push("/pin-auth");
        dispatch(loginSuccess(false));
      } else {
        // dispatch(loginErr(loggedInViaSecretPin));
      }
    } catch (err) {
      let getPendingLock = getItem("pendingShiftList");
      setItem("pendingShiftList", [
        ...getPendingLock,
        {
          closebalance: finalTotal != "" ? finalTotal : "notClose",
          userName: user_name,
        },
      ]);
      Cookies.set("logedIn", false);
      history.push("/pin-auth");
      return dispatch(loginSuccess(false));
    }
  };
};

const register = (payloads) => {
  return async (dispatch) => {
    try {
      dispatch(registerBegin());
      const registered = await DataService.post(API.auth.register, payloads);
      if (!registered.data.error) {
        return dispatch(registerSuccess(registered.data));
      } else {
        dispatch(registerErr(loggedIn));
      }
    } catch (err) {
      dispatch(registerErr(err));
    }
  };
};

const forgotPassword = (payloads) => {
  return async (dispatch) => {
    try {
      const resetLinkSent = await DataService.post(
        API.auth.forgotPassword,
        payloads
      );
      if (!resetLinkSent.data.error) {
        return dispatch(resetPasswordSuccess(resetLinkSent.data));
      }
    } catch (err) {}
  };
};
const forgotPin = (payloads, Forgotpin_id) => {
  return async (dispatch) => {
    try {
      let getAddedForgotpin = await DataService.post(
        `${API.auth.forgotPin}`,
        payloads
      );
      if (!getAddedForgotpin.data.error) {
        return dispatch(ForgotpinAdd(getAddedForgotpin.data.data));
      } else {
        return dispatch(ForgotpinAddErr(getAddedForgotpin.data.data));
      }
    } catch (err) {
      dispatch(ForgotpinAddErr(err));
    }
  };
};

const resetPassword = (payloads, token) => {
  return async (dispatch) => {
    try {
      const resetPassword = await DataService.post(
        `${API.auth.resetPassword}?token=${token}`,
        payloads
      );
      return resetPassword;
    } catch (err) {}
  };
};
const offLineMode = (value) => {
  return offlineModeValue(value);
};

export {
  login,
  logOut,
  forgotPassword,
  resetPassword,
  register,
  LockRegister,
  secretPinAuth,
  forgotPin,
  offLineMode,
  onlineToOpenSihft,
  onlineToClosedShift,
};
