const { DataService } = require("../../config/dataService/dataService");
const { API } = require("../../config/api/index");
import actions from "./actions";
import moment from "moment";

const {
  dashboardData,
  dashboardDataErr,
  datewiseChangeData,
  datewiseChangeDataErr,
  saleSummarydatewiseChangeData,
  saleSummarydatewiseChangeDataErr,
} = actions;
//{{api_endpoints}}dashboard?startDate=2022-01-01&endDate=2022-01-01

export const getAlldashboradData = () => {
  return async (dispatch) => {
    try {
      const dashboradDetails = await DataService.get(
        `${API.dashboard.getAllData}?&register_id=${"allRegister"}`
      );

      if (!dashboradDetails.data.error) {
        return dispatch(dashboardData(dashboradDetails.data.data));
      } else {
        return dispatch(dashboardDataErr(dashboradDetails.data));
      }
    } catch (err) {
      dispatch(dashboardDataErr(err));
    }
  };
};

export const getAlldashboradDatwiseChangeData = (startDate, endDate) => {
  return async (dispatch) => {
    try {
      const dashboradDetails = await DataService.get(
        `${
          API.dashboard.getAllData
        }?startDate=${startDate}&endDate=${endDate}&register_id=${"allRegister"}`
      );
      if (!dashboradDetails.data.error) {
        return dispatch(datewiseChangeData(dashboradDetails.data.data));
      } else {
        return dispatch(datewiseChangeDataErr(dashboradDetails.data));
      }
    } catch (err) {
      dispatch(datewiseChangeDataErr(err));
    }
  };
};

export const getSaleSummaryDatwiseChangeData = (
  startDate,
  endDate,
  type,
  id
) => {
  return async (dispatch) => {
    try {
      const dashboradDetails = await DataService.get(
        `${API.dashboard.getAllData}?startDate=${startDate}&endDate=${endDate}&type=${type}&register_id=${id}`
      );

      if (!dashboradDetails.data.error) {
        return dispatch(
          saleSummarydatewiseChangeData(dashboradDetails.data.data)
        );
      } else {
        return dispatch(
          saleSummarydatewiseChangeDataErr(dashboradDetails.data)
        );
      }
    } catch (err) {
      dispatch(datewiseChangeDataErr(err));
    }
  };
};
