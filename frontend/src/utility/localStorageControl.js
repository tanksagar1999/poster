import React, { useState } from "react";
import { CheckOutlined } from "@ant-design/icons";

const getItem = (key) => {
  const data = typeof window !== "undefined" ? localStorage.getItem(key) : "";

  try {
    return JSON.parse(data);
  } catch (err) {
    return data;
  }
};

const setItem = (key, value) => {
  const stringify = typeof value !== "string" ? JSON.stringify(value) : value;
  return localStorage.setItem(key, stringify);
};

const removeItem = (key) => {
  localStorage.removeItem(key);
};

const localStorageCartKeyName = "LOCAL_STORAGE_CART_KEY_NAME";

const getLocalCartDataByType = (type, registerId) => {
  let local_cart_data = localStorage.getItem(localStorageCartKeyName);
  if (local_cart_data == null) {
    return [];
  } else {
    return JSON.parse(local_cart_data).filter(
      (data) =>
        data.type == type && registerId && data.register_id == registerId
    );
  }
};

const getLocalCartCount = (registerDetails) => {
  let local_cart_data = localStorage.getItem(localStorageCartKeyName);
  if (local_cart_data == null) {
    return [].length;
  } else {
    return JSON.parse(local_cart_data).filter(
      (data) =>
        data.Status == "In Progress" &&
        registerDetails &&
        data.register_id == registerDetails._id
    ).length;
  }
};

const getAllTakeAwayDataInLocal = (registerDetails) => {
  if (registerDetails) {
    let local_cart_data = getLocalCartDataByType(
      "take-away-local",
      registerDetails._id
    );
    return local_cart_data;
  }
};
const getallCustomSwapList = (registerDetails) => {
  let local_cart_data = localStorage.getItem(localStorageCartKeyName);
  if (local_cart_data == null) {
    return [];
  } else {
    return JSON.parse(local_cart_data).filter(
      (data) =>
        data.type == "custom-table-local" &&
        registerDetails &&
        data.register_id == registerDetails._id &&
        data.swapTableCustum
    );
  }
};
const getallCustomSplitList = (registerDetails) => {
  let local_cart_data = localStorage.getItem(localStorageCartKeyName);
  if (local_cart_data == null) {
    return [];
  } else {
    return JSON.parse(local_cart_data).filter(
      (data) =>
        (data.type == "custom-table-local" &&
          registerDetails &&
          data.register_id == registerDetails._id &&
          data.customSplit) ||
        data.swapTableCustum
    );
  }
};

const getAllDeliveryDataInLocal = (registerId) => {
  let local_cart_data = getLocalCartDataByType(
    "delivery-local",
    registerId?._id
  );
  return local_cart_data;
};

// const tableStatus = {
//   Empty: "Empty",
//   Serving: "Serving",
//   Unpaid: "Unpaid",
//   Paid: "Paid",
//   Occupied: "Occupied",
// };

const createNewCartwithKeyandPush = (
  type,
  data,
  registerDetails,
  formData,
  splitName,
  indexOfSplit
) => {
  let local_cart_data = localStorage.getItem(localStorageCartKeyName);
  let isCartAlreadyExists = true;
  if (local_cart_data == null) {
    local_cart_data = [];
  } else {
    local_cart_data = JSON.parse(local_cart_data);
  }

  let cartKey =
    Math.floor(Math.random() * 1000000000) + "_time_" + new Date().getTime();
  let RegisterId = registerDetails?._id;

  let default_cart_object = {
    type: type,
    data: [],
    Status: "In Progress",
    created_at: new Date(),
    cartKey: cartKey,
    register_id: RegisterId,
  };

  splitName ? (default_cart_object.customSplit = true) : null;
  indexOfSplit ? (default_cart_object.index = indexOfSplit) : null;
  if (type == "DRAFT_CART") {
    default_cart_object.data = data;
    formData?.tableName
      ? (default_cart_object.tableName = formData?.tableName)
      : null;
    default_cart_object = { ...default_cart_object };
  } else {
    default_cart_object = { ...default_cart_object, ...data };
  }

  if (type == "custom-table-local") {
    let cartData = local_cart_data.filter(function(itm) {
      return (
        itm.tablekey == data.tablekey && itm.register_id == registerDetails?._id
      );
    });

    if (cartData.length > 0) {
      isCartAlreadyExists = false;
      return cartData[0];
    }
  }
  console.log("createNewCartwithKeyandPush");
  localStorage.setItem("active_cart", cartKey);
  local_cart_data.push(default_cart_object);
  localStorage.setItem(
    localStorageCartKeyName,
    JSON.stringify(local_cart_data)
  );
  return default_cart_object;
};

const getCartInfoFromLocalKey = (key, registerDetails) => {
  let local_cart_data = localStorage.getItem(localStorageCartKeyName);
  local_cart_data = JSON.parse(local_cart_data);
  if (local_cart_data) {
    let cartData = local_cart_data.filter(function(itm) {
      return itm.cartKey == key && itm.register_id === registerDetails?._id;
    })[0];
    if (cartData != null && Object.keys(cartData).length > 0) {
      console.log("getCartInfoFromLocalKey");
      // localStorage.setItem("active_cart", key);
    }

    return cartData;
  }
};

const getCartInfoLocalListsData = () => {
  let local_cart_data = localStorage.getItem(localStorageCartKeyName);
  let data = [];
  if (local_cart_data != null) {
    local_cart_data = JSON.parse(local_cart_data);
    return local_cart_data;
  } else {
    return [];
  }
  return local_cart_data;
  // let cartData = local_cart_data.filter(
  //   function(itm) {
  //     return itm.cartKey == key;
  //   }
  // )[0];
  // return cartData;
};
const setCartInfoFromLocalKey = (
  key,
  data,
  darftUpdate,
  formData,
  splitName
) => {
  let local_cart_data = localStorage.getItem(localStorageCartKeyName);
  if (local_cart_data == null) {
    return {};
  }
  local_cart_data = JSON.parse(local_cart_data);

  const findIndex = local_cart_data?.findIndex((item) => item.cartKey === key);
  if (findIndex !== -1) {
    local_cart_data[findIndex].Status = "In Progress";
    local_cart_data[findIndex].data = data;
    darftUpdate == "darftupdate"
      ? (local_cart_data[findIndex].created_at = new Date())
      : null;
    formData?.tableName
      ? (local_cart_data[findIndex].tableName = formData?.tableName)
      : null;
    darftUpdate == "darftupdate"
      ? (local_cart_data[findIndex].darftDetalisUpdate = true)
      : null;
  }
  console.log("setCartInfoFromLocalKey");
  localStorage.setItem("active_cart", key);

  localStorage.setItem(
    localStorageCartKeyName,
    JSON.stringify(local_cart_data)
  );
  return local_cart_data[findIndex];
};

const getTableStatusFromId = (id, registerdetails) => {
  let local_cart_data = localStorage.getItem(localStorageCartKeyName);
  if (local_cart_data != null) {
    local_cart_data = JSON.parse(local_cart_data);
    let cartData = local_cart_data.filter(function(itm) {
      return (
        itm.tablekey == id &&
        registerdetails &&
        itm.register_id === registerdetails._id
      );
    });

    if (cartData.length > 0) {
      return cartData[0].Status;
    } else {
      return "";
    }
  } else {
    return "";
  }
};
const getTotalOfUnpaid = (id, registerdetails) => {
  let local_cart_data = localStorage.getItem(localStorageCartKeyName);
  if (local_cart_data != null) {
    local_cart_data = JSON.parse(local_cart_data);
    let cartData = local_cart_data.filter(function(itm) {
      return (
        itm.tablekey == id &&
        registerdetails &&
        itm.register_id === registerdetails._id
      );
    });

    if (
      cartData.length > 0 &&
      cartData[0].otherDetails?.finalCharge &&
      cartData[0].otherDetails?.finalCharge
    ) {
      return cartData[0].otherDetails?.finalCharge;
    } else {
      return 0;
    }
  } else {
    return 0;
  }
};

const tableStatusChange = (key, status) => {
  let local_cart_data = localStorage.getItem(localStorageCartKeyName);
  if (local_cart_data == null) {
    return {};
  }
  local_cart_data = JSON.parse(local_cart_data);

  const findIndex = local_cart_data?.findIndex((item) => item.cartKey === key);
  if (findIndex !== -1 && status == "Delete") {
    local_cart_data[findIndex].Status = "Delete";
    local_cart_data[findIndex].data = [];
    localStorage.removeItem("active_cart");
  } else {
    console.log("tableStatusChange");
    // localStorage.setItem("active_cart", key);
    local_cart_data[findIndex].Status = status;
  }
  // localStorage.setItem("active_cart", key);

  localStorage.setItem(
    localStorageCartKeyName,
    JSON.stringify(local_cart_data)
  );
  return local_cart_data[findIndex];
};

const checkIfTableIsSelected = (id, registerDetails) => {
  let local_cart_data = localStorage.getItem(localStorageCartKeyName);
  if (local_cart_data != null) {
    local_cart_data = JSON.parse(local_cart_data);
    let cartData = local_cart_data.filter(function(itm) {
      return (
        itm.tablekey == id &&
        registerDetails &&
        itm.register_id == registerDetails._id
      );
    });
    if (cartData.length > 0) {
      if (cartData[0].cartKey == localStorage.getItem("active_cart")) {
        return <span className="active-dots" />;
      } else {
        return "";
      }
      //return cartData[0].Status;
    } else {
      return "";
    }
  } else {
    return "";
  }
};

const checkIfTableIsSelectedByCartkey = (id) => {
  if (id == localStorage.getItem("active_cart")) {
    return <span className="active-dots" />;
  } else {
    return "";
  }
};

const updateTableNameFromCartId = (tableName, cartKey) => {
  let local_cart_data = localStorage.getItem(localStorageCartKeyName);
  local_cart_data = JSON.parse(local_cart_data);

  const findIndex = local_cart_data.findIndex(
    (item) => item.cartKey === cartKey
  );
  local_cart_data[findIndex].tableName = tableName;
  localStorage.setItem(
    localStorageCartKeyName,
    JSON.stringify(local_cart_data)
  );
  return local_cart_data[findIndex];
};

const removeCartFromLocalStorage = (cartKey) => {
  let local_cart_data = localStorage.getItem(localStorageCartKeyName)
    ? localStorage.getItem(localStorageCartKeyName)
    : [];
  local_cart_data = JSON.parse(local_cart_data);

  const findIndex = local_cart_data.findIndex(
    (item) => item.cartKey === cartKey
  );

  local_cart_data.splice(findIndex, 1);

  localStorage.removeItem("product_Details");
  localStorage.removeItem("active_cart");
  console.log("removedone");
  return localStorage.setItem(
    localStorageCartKeyName,
    JSON.stringify(local_cart_data)
  );
};

const storeOtherData = (key, data) => {
  let local_cart_data = localStorage.getItem(localStorageCartKeyName);
  if (local_cart_data == null) {
    return {};
  }
  local_cart_data = JSON.parse(local_cart_data);

  const findIndex = local_cart_data?.findIndex((item) => item.cartKey === key);
  if (findIndex !== -1) {
    local_cart_data[findIndex].otherDetails = data;
    local_cart_data[findIndex].details = data.details;
  }
  console.log("storeOtherData");
  // localStorage.setItem("active_cart", key);

  localStorage.setItem(
    localStorageCartKeyName,
    JSON.stringify(local_cart_data)
  );
  return local_cart_data[findIndex];
};

const setOrderTickets = (key, data, object) => {
  let local_cart_data = localStorage.getItem(localStorageCartKeyName);
  if (local_cart_data == null) {
    return {};
  }
  local_cart_data = JSON.parse(local_cart_data);

  const findIndex = local_cart_data?.findIndex((item) => item.cartKey === key);

  if (local_cart_data[findIndex]?.orderTicketsData) {
    if (findIndex !== -1) {
      local_cart_data[findIndex].orderTicketsData = [
        ...local_cart_data[findIndex].orderTicketsData,
        {
          enterDate: new Date(),
          itemList: data,
          orderNotes: object.orderNotes,
          tiketNumber: object.tiketNumber,
          categoryName: object.categoryName,
          add_remove: object.add_remove,

          table_name: object.table_name,
        },
      ];
    }
  } else {
    if (findIndex !== -1) {
      local_cart_data[findIndex].orderTicketsData = [
        {
          enterDate: new Date(),
          itemList: data,
          orderNotes: object.orderNotes,
          tiketNumber: object.tiketNumber,
          categoryName: object.categoryName,
          add_remove: object.add_remove,
          table_name: object.table_name,
        },
      ];
    }
  }
  console.log("setOrderTickets");
  // localStorage.setItem("active_cart", key);

  localStorage.setItem(
    localStorageCartKeyName,
    JSON.stringify(local_cart_data)
  );
  return local_cart_data[findIndex];
};
const darftCount = (currentRegisterData) => {
  return getCartInfoLocalListsData().filter(
    (d) => d.type == "DRAFT_CART" && d.register_id == currentRegisterData._id
  ).length;
};
const getTableNameTo = (id, registerdetails) => {
  let local_cart_data = localStorage.getItem(localStorageCartKeyName);
  if (local_cart_data != null) {
    local_cart_data = JSON.parse(local_cart_data);
    let cartData = local_cart_data.filter(function(itm) {
      return (
        itm.tableName == id &&
        registerdetails &&
        itm.register_id === registerdetails._id
      );
    });

    if (cartData.length > 0) {
      return cartData[0];
    } else {
      return "";
    }
  } else {
    return "";
  }
};

const AddLastSplitName = (key, alldata, splitName, registerDetails, index) => {
  let local_cart_data = localStorage.getItem(localStorageCartKeyName);
  if (local_cart_data == null) {
    return {};
  }
  local_cart_data = JSON.parse(local_cart_data);

  const findIndex = local_cart_data?.findIndex(
    (item) => item.cartKey === key && item.register_id === registerDetails._id
  );
  if (findIndex !== -1) {
    local_cart_data[findIndex] = {
      ...alldata,
      lastSplitName: splitName,
      splitIndex: index,
    };
  }

  localStorage.setItem(
    localStorageCartKeyName,
    JSON.stringify(local_cart_data)
  );
  return local_cart_data[findIndex];
};

export {
  getItem,
  setItem,
  removeItem,
  createNewCartwithKeyandPush,
  getAllTakeAwayDataInLocal,
  getLocalCartCount,
  getCartInfoFromLocalKey,
  setCartInfoFromLocalKey,
  getTableStatusFromId,
  getCartInfoLocalListsData,
  updateTableNameFromCartId,
  removeCartFromLocalStorage,
  checkIfTableIsSelected,
  checkIfTableIsSelectedByCartkey,
  getAllDeliveryDataInLocal,
  storeOtherData,
  setOrderTickets,
  tableStatusChange,
  getallCustomSwapList,
  darftCount,
  getTableNameTo,
  AddLastSplitName,
  getallCustomSplitList,
  getTotalOfUnpaid,
};
