import Cookies from "js-cookie";
import actions from "./actions";
const { DataService } = require("../../config/dataService/dataService");
const { API } = require("../../config/api/index");
import { getItem, setItem } from "../../utility/localStorageControl";

const {
  tableList,
  tableListErr,
  getLastReceiptData,
  getLastDeviceData,
  tableUpdateStatus,
  tableUpdateStatusErr,
  orderAdd,
  orderAddErr,
  bookingAdd,
  bookingAddErr,
  bookingList,
  bookingListErr,
  bookingId,
  bookingIdErr,
  filterDateList,
} = actions;

const getLastReceipt = () => {
  return async (dispatch) => {
    try {
      let Data = getItem("setupCache").register.find((val) => val.active);
      if (Data && Data.register_id) {
        const getData = await DataService.get(
          `${API.sell.getLastRecepitNumber}/${Data.register_id}`
        );
        if (!getData.data.error) {
          return dispatch(getLastReceiptData(getData.data.data));
        }
      }
    } catch (err) {
      return dispatch(getLastReceiptData({}));
    }
  };
};

const getLastDevice = () => {
  return async (dispatch) => {
    try {
      let Data = getItem("setupCache").register.find((val) => val.active);
      if (Data && Data.register_id) {
        const getData = await DataService.get(
          `${API.sell.getLastDevice}/${Data.register_id}`
        );

        if (!getData.data.error) {
          return dispatch(getLastDeviceData(getData.data.data));
        }
      }
    } catch (err) {
      return dispatch(getLastDeviceData({}));
    }
  };
};

const getAllTableList = () => {
  return async (dispatch) => {
    let localStorageDataTable = [
      {
        status: "Empty",

        table_prefix: "New Take-away",
        table_type: "take-away",
      },
      {
        status: "Empty",

        table_prefix: "New Delivery",
        table_type: "delivery",
      },
    ];
    try {
      if (localStorageDataTable) {
        return dispatch(tableList(localStorageDataTable));
      }
    } catch (err) {
      if (localStorageDataTable) {
        return dispatch(tableList(localStorageDataTable));
      }
    }
  };
};

const updateTableSelected = (tableId, tableStatus) => {
  return async (dispatch) => {
    try {
      const updateTableStatus = await DataService.put(
        `${API.sell.getAllTables}/${tableId}`,
        { status: tableStatus }
      );
      if (!updateTableStatus.data.error) {
        return dispatch(tableUpdateStatus(updateTableStatus.data.data));
      } else {
        return dispatch(tableUpdateStatusErr(updateTableStatus.data));
      }
    } catch (err) {
      return dispatch(tableUpdateStatusErr(err));
    }
  };
};

const saveCurrentDevice = (postdata) => {
  return async (dispatch) => {
    try {
      let getData = {};
      getData = await DataService.post(API.sell.getLastDevice, postdata);
      if (!getData.data.error) {
        return getData.data.data;
      } else {
        return getData.data.data;
      }
    } catch (err) {
      return err;
    }
  };
};

const createPendingReceipt = (formData) => {
  let getPendingReceiptsList = getItem("pendingReceipts");

  if (getPendingReceiptsList == null) {
    let array = [
      {
        ...formData,
      },
    ];
    setItem("pendingReceipts", array);
    return true;
  } else if (getPendingReceiptsList?.length > -1) {
    getPendingReceiptsList.push(formData);
    setItem("pendingReceipts", getPendingReceiptsList);
    return true;
  }
};

const CreateOrder = (formData) => {
  formData.register_id = getItem("setupCache").register.find(
    (val) => val.active
  )._id;
  return async (dispatch) => {
    try {
      let getOrderData = await DataService.post(API.sell.createOrder, formData);

      if (!getOrderData.data.error) {
        Cookies.set("id", Number(123456));
        return dispatch(orderAdd(getOrderData.data.data));
      } else {
        return dispatch(orderAddErr(getOrderData.data.data));
      }
    } catch (err) {
      createPendingReceipt(formData);
      return dispatch(orderAdd(formData));
    }
  };
};

const AddAndUpdateBooking = (formData, booking_id) => {
  return async (dispatch) => {
    formData.register_id = getItem("setupCache").register.find(
      (val) => val.active
    )._id;
    try {
      let getAddedbooking = {};
      if (booking_id) {
        getAddedbooking = await DataService.put(
          `${API.sell.updateBooking}/${booking_id}`,
          formData
        );
      } else {
        getAddedbooking = await DataService.post(
          API.sell.createBooking,
          formData
        );
      }
      if (!getAddedbooking.data.error) {
        return dispatch(bookingAdd(getAddedbooking.data.data));
      } else {
        return dispatch(bookingAddErr(getAddedbooking.data.data));
      }
    } catch (err) {
      createPendingReceipt(formData);
      return dispatch(bookingAdd(formData));
    }
  };
};

const getAllBookingList = () => {
  return async (dispatch) => {
    try {
      const getBookingList = await DataService.get(API.sell.getAllBooking);
      if (!getBookingList.data.error) {
        return dispatch(bookingList(getBookingList.data.data));
      } else {
        return dispatch(bookingListErr(getBookingList.data));
      }
    } catch (err) {
      dispatch(bookingListErr(err));
    }
  };
};

const getBookingById = (id) => {
  return async (dispatch) => {
    try {
      const bookingByIdData = await DataService.get(
        `${API.sell.getBookingById}/${id}`
      );
      if (!bookingByIdData.data.error) {
        return dispatch(bookingId(bookingByIdData.data.data));
      } else {
        return dispatch(bookingIdErr(bookingByIdData.data));
      }
    } catch (err) {
      dispatch(bookingIdErr(err));
    }
  };
};
const getDateWiseBookingList = (start, end) => {
  return async (dispatch) => {
    dispatch(filterDateList(start, end));
  };
};
export {
  getAllTableList,
  updateTableSelected,
  CreateOrder,
  AddAndUpdateBooking,
  getAllBookingList,
  getBookingById,
  getDateWiseBookingList,
  getLastReceipt,
  getLastDevice,
  saveCurrentDevice,
};
