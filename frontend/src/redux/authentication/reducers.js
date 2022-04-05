import Cookies from "js-cookie";
import actions from "./actions";

const {
  LOGIN_BEGIN,
  LOGIN_SUCCESS,
  IS_ADMIN,
  LOGIN_ERR,
  LOGOUT_BEGIN,
  LOGOUT_SUCCESS,
  LOGOUT_ERR,
  RESET_PASSWORD_SUCCESS,
  REGISTER_BEGIN,
  REGISTER_ERR,
  REGISTER_SUCCESS,
  FORGOT_PIN_ADD,
  FORGOT_PIN_ADD_ERR,
  OFFLINE_MODE,
} = actions;

const initState = {
  login: Cookies.get("logedIn"),
  loading: false,
  isAdmin: null,
  error: null,
  isResetPasswordLinkSent: false,
  userRegistered: {},
  offlineMode: false,
};

const AuthReducer = (state = initState, action) => {
  const { type, data, err, ForgotPinData, offlineYaOnline } = action;
  switch (type) {
    case LOGIN_BEGIN:
      return {
        ...state,
        loading: true,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        login: data,
        loading: false,
      };
    case IS_ADMIN:
      return {
        ...state,
        isAdmin: data,
        loading: false,
      };
    case LOGIN_ERR:
      return {
        ...state,
        error: err,
        loading: false,
      };
    case LOGOUT_BEGIN:
      return {
        ...state,
        loading: true,
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        login: data,
        loading: false,
      };
    case LOGOUT_ERR:
      return {
        ...state,
        error: err,
        loading: false,
      };
    case RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        isResetPasswordLinkSent: data,
        loading: false,
      };
    case REGISTER_BEGIN:
      return {
        ...state,
        loading: true,
      };
    case REGISTER_ERR:
      return {
        ...state,
        error: err,
        loading: false,
      };
    case REGISTER_SUCCESS:
      return {
        ...state,
        userRegistered: data,
        loading: false,
      };
    case FORGOT_PIN_ADD:
      return {
        ...state,
        ForgotPinData,
      };
    case FORGOT_PIN_ADD_ERR:
      return {
        ...state,
        err,
      };
    case OFFLINE_MODE:
      return {
        ...state,
        offlineMode: offlineYaOnline,
      };
    default:
      return state;
  }
};
export default AuthReducer;
