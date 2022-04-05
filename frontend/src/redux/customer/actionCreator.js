const { DataService } = require("../../config/dataService/dataService");
const { API } = require("../../config/api/index");
import actions from "./actions";
const {
  CustomerAdd,
  customerList,
  customerListErr,
  CustomerAddErr,
  customerDetailErr,
  CustomerImportPreview,
  CustomerImportPreviewErr,
  CustomerImportData,
  CustomerImportDataErr,
} = actions;

export const filterListData = (text) => {
  return async (dispatch) => {
    try {
      const getcustomerList = await DataService.get(
        `${API.customer.searchList}?mobile=${text}`
      );

      if (!getcustomerList.data.error) {
        return dispatch(
          customerList(
            getcustomerList.data.data,
            getcustomerList.data.pagination.total_counts,
            getcustomerList.data.pagination.current_page,
            getcustomerList.data.pagination.total_pages
          )
        );
      } else {
        return dispatch(customerListErr(getcustomerList.data));
      }
    } catch (err) {
      dispatch(customerListErr(err));
    }
  };
};

export const getCustomerList = (currentPage, limit) => {
  return async (dispatch) => {
    try {
      const getcustomerList = await DataService.get(
        `${API.customer.list}?page=${currentPage}&limit=${limit}`
      );

      if (!getcustomerList.data.error) {
        return dispatch(
          customerList(
            getcustomerList.data.data,
            getcustomerList.data.pagination.total_counts,
            getcustomerList.data.pagination.current_page,
            getcustomerList.data.pagination.total_pages
          )
        );
      } else {
        return dispatch(customerListErr(getcustomerList.data));
      }
    } catch (err) {
      dispatch(customerListErr(err));
    }
  };
};
export const ExportCustomer = (payloads) => {
  return async (dispatch) => {
    const resp = await DataService.post(API.customer.exportCustomer, payloads);
  };
};

export const UpdateCustomer = (payloads, id) => {
  return async (dispatch) => {
    const getCustomer = await DataService.put(
      API.customer.Customerupdate + "/" + id,
      payloads
    );
    if (!getCustomer.data.error) {
      return dispatch(CustomerAdd(getCustomer.data));
    } else {
      return dispatch(CustomerAddErr(getCustomer.data));
    }
  };
};

export const AddSingleCustomer = (payloads) => {
  return async (dispatch) => {
    try {
      const getCustomer = await DataService.post(
        API.customer.Customeradd,
        payloads
      );
      if (!getCustomer.data.error) {
        return dispatch(CustomerAdd(getCustomer.data));
      } else {
        return dispatch(CustomerAddErr(getCustomer.data));
      }
    } catch (err) {
      dispatch(CustomerAddErr(err));
    }
  };
};

export const getCustomerDetail = (id) => {
  return async (dispatch) => {
    try {
      const Detail = await DataService.get(API.customer.detail + "/" + id);
      if (!Detail.data.error) {
        return Detail.data.data;
      } else {
        return dispatch(customerDetailErr(Detail.data));
      }
    } catch (err) {
      dispatch(customerDetailErr(err));
    }
  };
};

export const ImportCustomerInBulk = (payloads) => {
  return async (dispatch) => {
    try {
      let getPreview = {};
      getPreview = await DataService.post(
        API.customer.importCustomer,
        payloads
      );
      if (!getPreview.data.error) {
        console;
        return dispatch(CustomerImportPreview(getPreview.data));
      } else {
        return dispatch(CustomerImportPreviewErr(getPreview.data));
      }
    } catch (err) {
      dispatch(CustomerImportPreviewErr(err));
    }
  };
};

export const ConfirmImport = (payloads) => {
  return async (dispatch) => {
    try {
      let getPreview = {};
      getPreview = await DataService.post(API.customer.importPreview, payloads);
      if (!getPreview.data.error) {
        return dispatch(CustomerImportData(getPreview.data));
      } else {
        return dispatch(CustomerImportDataErr(getPreview.data));
      }
    } catch (err) {
      dispatch(CustomerImportDataErr(err));
    }
  };
};
