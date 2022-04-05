import React, { useState, useEffect, useRef } from "react";
import { Row, Col } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import "../sell.css";
import {
  getAllTableList,
  updateTableSelected,
} from "../../../redux/sell/actionCreator";
import {
  getTableStatusFromId,
  checkIfTableIsSelected,
  getTableNameTo,
  getTotalOfUnpaid,
} from "../../../utility/localStorageControl";
import {
  getItem,
  setItem,
  setCartInfoFromLocalKey,
  removeCartFromLocalStorage,
  checkIfTableIsSelectedByCartkey,
  AddLastSplitName,
} from "../../../utility/localStorageControl";

const All = (props) => {
  let {
    CustomTableData,
    setCustomTableOrderInLocalStorageHandler,
    handleSplit,
  } = props;
  const dispatch = useDispatch();

  ///Take away
  //let [allTableList, setAllTableList] = useState([]);

  let {
    createNewTakeawayInLocalStorageHandler,
    getAllTakeAwayDataInLocalFn,
    getTakeawayInLocalStorageHandler,
    searchText,
    localCartInfo,
  } = props;
  let [takeAwayData, settakeAwayData] = useState([]);
  // const currentRegisterData = useSelector((state) =>
  //   state.register.RegisterList.find((val) => val.active)
  // );
  //

  //Delivery
  const [deliveryData, setDeliveryData] = useState([]);
  //let [allTableList, setAllTableList] = useState([]);
  let {
    createNewDeliveryInLocalStorageHandler,
    getAllDeliveryDataInLocalFn,
    getDeliveryInLocalStorageHandler,
  } = props;
  //

  const tableStatus = {
    Empty: "Empty",
    Serving: "In Progress",
    Unpaid: "Unpaid",
    Paid: "Paid",
    Occupied: "Occupied",
  };

  let [allTableList, setAllTableList] = useState([]);
  let isMounted = useRef(true);
  const currentRegisterData = useSelector((state) =>
    state.register.RegisterList.find((val) => val.active)
  );

  useEffect(() => {
    async function fetchAllTableList() {
      const allTableList = await dispatch(getAllTableList());

      if (isMounted.current && allTableList && allTableList.tableList)
        setAllTableList(allTableList.tableList);
    }
    if (isMounted.current && currentRegisterData) {
      fetchAllTableList();
      settakeAwayData(getAllTakeAwayDataInLocalFn(currentRegisterData));
      setDeliveryData(getAllDeliveryDataInLocalFn(currentRegisterData));
    }
    return () => {
      isMounted.current = false;
    };
  }, []);
  const goForCurrentOrder = async (tableDetails) => {
    await dispatch(updateTableSelected(tableDetails._id, "Serving"));
    props.sellProps.tabChangeToCurrent("CURRENT", tableDetails);
  };

  function setTableStatusOccupied(tableName, table) {
    setItem("bookingDetails", false);
    let tableNameStr = tableName.replace(/\s+/g, "-").toLowerCase();
    setCustomTableOrderInLocalStorageHandler(tableName, tableNameStr, table);
  }

  //Take Away
  function createNewTakeawayInLocalStorage() {
    createNewTakeawayInLocalStorageHandler(takeAwayData.length + 1);
  }

  function getakeawayInLocalStorage(key) {
    getTakeawayInLocalStorageHandler(key);
  }

  let filterArray = allTableList.filter((value) => {
    return value.table_type.toLowerCase().indexOf("take-away") !== -1;
  });

  //
  //Delivery
  let filterDeliveryArray = allTableList.filter((value) => {
    return value.table_type.toLowerCase().indexOf("delivery") !== -1;
  });

  function createNewDeliveryInLocalStorage() {
    createNewDeliveryInLocalStorageHandler(deliveryData.length + 1);
  }

  function getDeliveryInLocalStorage(key) {
    getDeliveryInLocalStorageHandler(key);
  }

  //
  let AllTableList = [];
  filterArray.map((value) => {
    AllTableList.push({
      prefix: "take-away",
      table_name: value.table_prefix,
    });
  });
  takeAwayData.map((values) => {
    if (values.Status != "Delete") {
      AllTableList.push({
        tablekey: values.tablekey,
        table_name: values.tableName,
        cartKey: values.cartKey,
      });
    }
  });

  filterDeliveryArray.map((value) => {
    AllTableList.push({
      prefix: "Delivery",
      table_name: value.table_prefix,
    });
  });
  deliveryData.map((values) => {
    if (values.Status != "Delete") {
      AllTableList.push({
        tablekey: values.tablekey,
        table_name: values.tableName,
        cartKey: values.cartKey,
      });
    }
  });
  CustomTableData.map((table) => {
    table.rows.map((value) => {
      AllTableList.push({
        table_name: value,
      });
    });
  });
  AllTableList = AllTableList.filter((value) =>
    value.table_name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="sell-table-parent all-parent list-boxmain">
      <Row gutter={[2, 2]} className="all-row list-box-row">
        {AllTableList.length > 0 &&
          AllTableList.map((values, index) => {
            if (values.prefix) {
              return (
                <Col
                  xxl={4}
                  lg={4}
                  xl={4}
                  xs={12}
                  className="sell-table-col"
                  key={index}
                >
                  <div
                    className="sell-empty"
                    onClick={() => {
                      if (values.prefix == "take-away") {
                        createNewTakeawayInLocalStorage();
                      } else {
                        createNewDeliveryInLocalStorage();
                      }
                    }}
                  >
                    <div className="sell-table-counter">
                      <div className="counter_served">{values.table_name}</div>
                      <div className="postion"></div>
                    </div>
                  </div>
                </Col>
              );
            } else if (values.tablekey) {
              const status = getTableStatusFromId(
                values.tablekey,
                currentRegisterData
              );
              let finalValue = getTotalOfUnpaid(
                values.tablekey,
                currentRegisterData
              );
              return (
                <Col xxl={4} lg={4} xl={4} xs={12} className="sell-table-col">
                  <div
                    className={
                      status == "In Progress"
                        ? "sell-main-order"
                        : status == "Unpaid"
                        ? "sell-unpaid"
                        : "sell-empty"
                    }
                    onClick={() => getDeliveryInLocalStorage(values.cartKey)}
                  >
                    <div className="sell-table-counter">
                      <div className="counter_served">{values.table_name}</div>
                      <div className="postion">
                        <div className="product-price inlineDIv">
                          {checkIfTableIsSelectedByCartkey(
                            values.cartKey,
                            currentRegisterData
                          )}
                          {getTableStatusFromId(
                            values.tablekey,
                            currentRegisterData
                          )}
                          {status == "Unpaid" && (
                            <span>{` ₹${Number(finalValue).toFixed(2)}`}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              );
            } else {
              const status = getTableStatusFromId(
                values.table_name.replace(/\s+/g, "-").toLowerCase(),
                currentRegisterData
              );
              let finalValue = getTotalOfUnpaid(
                values.table_name.replace(/\s+/g, "-").toLowerCase(),
                currentRegisterData
              );

              return (
                <>
                  <Col
                    xxl={4}
                    lg={4}
                    xl={4}
                    xs={12}
                    className="sell-table-col"
                    key={index}
                  >
                    <div
                      className={
                        status == "In Progress"
                          ? "sell-main-order"
                          : status == "Unpaid"
                          ? "sell-unpaid"
                          : "sell-empty"
                      }
                      onClick={() => setTableStatusOccupied(values.table_name)}
                    >
                      <div>
                        <div></div>
                        <div className="sell-table-counter">
                          <div className="counter_served">
                            {values.table_name}
                          </div>
                          <div className="postion">
                            <div className="product-price inlineDIv">
                              {checkIfTableIsSelected(
                                values.table_name
                                  .replace(/\s+/g, "-")
                                  .toLowerCase(),
                                currentRegisterData
                              )}
                              {getTableStatusFromId(
                                values.table_name
                                  .replace(/\s+/g, "-")
                                  .toLowerCase(),
                                currentRegisterData
                              )}
                              {status == "Unpaid" && (
                                <span>{` ₹${Number(finalValue).toFixed(
                                  2
                                )}`}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {getTableStatusFromId(
                      values.table_name.replace(/\s+/g, "-").toLowerCase(),
                      currentRegisterData
                    ) == "In Progress" &&
                      getTableNameTo(values.table_name, currentRegisterData)
                        .customSplit == undefined &&
                      getTableNameTo(values.table_name, currentRegisterData)
                        .swapTableCustum == undefined && (
                        <div
                          style={{
                            textAlign: "center",
                            cursor: "pointer",
                            color: "#008cba",
                          }}
                          onClick={() =>
                            handleSplit(values.table_name, index - 2)
                          }
                        >
                          Split
                        </div>
                      )}
                  </Col>
                </>
              );
            }
          })}
      </Row>
    </div>
  );
};

export { All };
