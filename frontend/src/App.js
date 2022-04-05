import React, { useEffect, useState } from "react";
import { hot } from "react-hot-loader/root";
import { Provider, useSelector } from "react-redux";
import { ThemeProvider } from "styled-components";
import { BrowserRouter as Router, Redirect, Route } from "react-router-dom";
import { ConfigProvider } from "antd";
import store from "./redux/store";
import Admin from "./routes/admin";
import Restaurant from "./routes/restaurant";
import Cashier from "./routes/cashier";
import AppRoute from "./routes/app";
import Auth from "./routes/auth";
import "./static/css/style.css";
import config from "./config/config";
import ProtectedRoute from "./components/utilities/protectedRoute";
import { getItem, setItem, removeItem } from "./utility/localStorageControl";
import { useDispatch } from "react-redux";
import { offLineMode } from "./redux/authentication/actionCreator";
import {
  onlineToOpenSihft,
  onlineToClosedShift,
} from "./redux/authentication/actionCreator";
import { CreateOrder, AddAndUpdateBooking } from "./redux/sell/actionCreator";
import { getAllSetUpList } from "./redux/setUp/actionCreator";
import { addOrUpdatePatty } from "./redux/pattyCash/actionCreator";

const { theme } = config;

const ProviderConfig = () => {
  const dispatch = useDispatch();
  const {
    rtl,
    isLoggedIn,
    topMenu,
    darkMode,
    userRole,
    isShopSetUp,
  } = useSelector((state) => {
    const userDetails = getItem("userDetails");
    return {
      darkMode: state.ChangeLayoutMode.data,
      rtl: state.ChangeLayoutMode.rtlData,
      topMenu: state.ChangeLayoutMode.topMenu,
      isLoggedIn: state.auth.login,
      userRole: userDetails ? userDetails.role : "",
      isShopSetUp: userDetails ? userDetails.is_shop : "",
    };
  });

  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    window.onload = function() {
      dispatch(getAllSetUpList());
    };
    let unmounted = false;
    if (!unmounted) {
      setPath(window.location.pathname);
    }
    return () => (unmounted = true);
  }, [setPath]);

  const [online, setOnline] = useState(window.navigator.onLine);
  function useOnlineStatus() {
    useEffect(() => {
      function handleOnline() {
        setOnline(true);
      }

      function handleOffline() {
        setOnline(false);
      }

      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }, []);

    return online;
  }
  let status = useOnlineStatus();
  useEffect(() => {
    if (status) {
      let pendingReceiptsList = getItem("pendingReceipts");
      if (
        pendingReceiptsList != null &&
        pendingReceiptsList &&
        pendingReceiptsList.length > 0
      ) {
        let pendinglist = [];
        let totalCount = pendingReceiptsList.length;
        let pending = [];
        pendingReceiptsList.map(async (val, index) => {
          if (val.draftList) {
            let data = await dispatch(AddAndUpdateBooking(val));
            if (data) {
              pending.push(index);
              pendingReceiptsList.shift();
              pendinglist = pendingReceiptsList;
            } else {
              pendinglist = pendingReceiptsList;
            }
          } else {
            let data = await dispatch(CreateOrder(val));
            if (data) {
              pending.push(index);
              pendingReceiptsList.shift();
              pendinglist = pendingReceiptsList;
            } else {
              pendinglist = pendingReceiptsList;
            }
          }
        });
        setItem("pendingReceipts", pendinglist);
      }
      let pendingshiftsList = getItem("pendingShiftList");

      if (pendingshiftsList != null && pendingshiftsList.length > 0) {
        pendingshiftsList.map(async (val) => {
          if (val["openbalance"] !== undefined) {
            let data = await onlineToOpenSihft(val.openbalance, val.userName);
          } else {
            let data = await onlineToClosedShift(
              val.closebalance,
              val.userName
            );
          }
        });
        setItem("pendingShiftList", []);
      }

      let pendingPaattycashList = getItem("pendingPattyCashEntries");
      if (pendingPaattycashList != null && pendingPaattycashList.length > 0) {
        let pending = [];
        let pendinglist = [];
        pendingPaattycashList.map(async (val, index) => {
          let data = await dispatch(addOrUpdatePatty(val));
          if (data) {
            pending.push(index);
            pendingPaattycashList.shift();
            pendinglist = pendingPaattycashList;
          } else {
            pendinglist = pendingPaattycashList;
          }
        });
        setItem("pendingPattyCashEntries", []);
      }
      dispatch(offLineMode(false));
    } else {
      dispatch(offLineMode(true));
    }
  }, [status]);

  return (
    <ConfigProvider direction={rtl ? "rtl" : "ltr"}>
      <ThemeProvider theme={{ ...theme, rtl, topMenu, darkMode }}>
        <Router basename={process.env.PUBLIC_URL}>
          {!isLoggedIn ? (
            <Route path="/" component={Auth} />
          ) : userRole === "admin" ? (
            <ProtectedRoute path="/admin" component={Admin} />
          ) : userRole === "cashier" ? (
            <ProtectedRoute path="" component={Cashier} />
          ) : userRole === "app_user" ? (
            <ProtectedRoute path="/app" component={AppRoute} />
          ) : (
            <ProtectedRoute path="" component={Restaurant} />
          )}

          {isLoggedIn &&
            (path === process.env.PUBLIC_URL ||
              path === `${process.env.PUBLIC_URL}/` ||
              path === `${process.env.PUBLIC_URL}/login` ||
              path === `${process.env.PUBLIC_URL}/pin-auth`) &&
            (userRole === "admin" ? (
              <Redirect to="/admin" />
            ) : userRole === "app_user" ? (
              <Redirect to="/app/app/all" />
            ) : userRole === "cashier" ? (
              <Redirect to="/sell" />
            ) : userRole === "restaurant" && !isShopSetUp ? (
              <Redirect to="/settings/shop" />
            ) : (
              <Redirect to="/sell" />
            ))}
          {/* <p>{online ? "online" : "offline"}</p> */}
        </Router>
      </ThemeProvider>
    </ConfigProvider>
  );
};

function App() {
  return (
    <Provider store={store}>
      <ProviderConfig />
    </Provider>
  );
}

export default hot(App);
