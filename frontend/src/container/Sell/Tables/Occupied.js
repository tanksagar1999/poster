import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Table, Input, Tag, Card, List } from "antd";
import {
  FileSearchOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";

import "../sell.css";
const { Meta } = Card;
import { ShoppingCartOutlined } from "@ant-design/icons";
import { Main } from "../../styled";
import {
  getAllTableList,
  updateTableSelected,
} from "../../../redux/sell/actionCreator";
import {
  getCartInfoLocalListsData,
  getTableStatusFromId,
  checkIfTableIsSelected,
  getTableNameTo,
  getTotalOfUnpaid,
} from "../../../utility/localStorageControl";

const { Search } = Input;

const Occupied = (props) => {
  let {
    CustomTableData,
    setCustomTableOrderInLocalStorageHandler,
    searchText,
    handleSplit,
  } = props;
  let [allTableList, setAllTableList] = useState([]);
  let isMounted = useRef(true);
  const dispatch = useDispatch();
  let [freeData, setFreeData] = useState([]);

  const currentRegisterData = useSelector((state) =>
    state.register.RegisterList.find((val) => val.active)
  );

  useEffect(() => {
    let localStoreData = getCartInfoLocalListsData();
    if (localStoreData != null && currentRegisterData) {
      let inProgressTables = localStoreData.filter(
        (data) =>
          (data.Status == "In Progress" || data.Status == "Unpaid") &&
          data.register_id == currentRegisterData._id
      );

      if (CustomTableData != null && CustomTableData.length > 0) {
        setFreeData(
          CustomTableData.map((table) => {
            let dataTable = { ...table };
            dataTable.rows = dataTable.rows.filter(
              (row) =>
                inProgressTables.filter((data) => data.tableName == row)
                  .length > 0
            );
            return dataTable;
          })
        );
      }
    }
  }, [props]);

  function setTableStatusOccupied(tableName) {
    let tableNameStr = tableName.replace(/\s+/g, "-").toLowerCase();

    setCustomTableOrderInLocalStorageHandler(tableName, tableNameStr);
  }

  let filterArray = allTableList.filter((value) => {
    return value.status == "Serving";
  });

  const goForCurrentOrder = async (tableDetails) => {
    await dispatch(updateTableSelected(tableDetails._id, "Serving"));
    props.sellProps.tabChangeToCurrent("CURRENT", tableDetails);
  };

  freeData = freeData.map((table) => {
    let dataTable = { ...table };
    dataTable.rows = dataTable.rows.filter((tableName) =>
      tableName.toLowerCase().includes(searchText.toLowerCase())
    );
    return dataTable;
  });

  return (
    <div className="sell-table-parent occupied-parent list-boxmain">
      <Row gutter={[2, 2]} className="occupied-row list-box-row">
        {freeData.length > 0
          ? freeData.map((table) =>
              table.rows.map((value, index) => (
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
                      getTableStatusFromId(
                        value.replace(/\s+/g, "-").toLowerCase(),
                        currentRegisterData
                      ) == "In Progress"
                        ? "sell-main-order"
                        : getTableStatusFromId(
                            value.replace(/\s+/g, "-").toLowerCase(),
                            currentRegisterData
                          ) == "Unpaid"
                        ? "sell-unpaid"
                        : "sell-empty"
                    }
                    onClick={() => setTableStatusOccupied(value)}
                  >
                    <div className="sell-table-counter">
                      <div className="counter_served">{value}</div>
                      <div className="postion">
                        <div className="product-price inlineDIv">
                          {checkIfTableIsSelected(
                            value.replace(/\s+/g, "-").toLowerCase(),
                            currentRegisterData
                          )}
                          {getTableStatusFromId(
                            value.replace(/\s+/g, "-").toLowerCase(),
                            currentRegisterData
                          )}
                          {getTableStatusFromId(
                            value.replace(/\s+/g, "-").toLowerCase(),
                            currentRegisterData
                          ) == "Unpaid" && (
                            <span>{` ₹${Number(
                              getTotalOfUnpaid(
                                value.replace(/\s+/g, "-").toLowerCase(),
                                currentRegisterData
                              )
                            ).toFixed(2)}`}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {getTableStatusFromId(
                    value.replace(/\s+/g, "-").toLowerCase(),
                    currentRegisterData
                  ) == "In Progress" &&
                    getTableNameTo(value, currentRegisterData).customSplit ==
                      undefined &&
                    getTableNameTo(value.table_name, currentRegisterData)
                      .swapTableCustum == undefined && (
                      <div
                        style={{
                          textAlign: "center",
                          cursor: "pointer",
                          color: "#008cba",
                        }}
                        onClick={() => handleSplit(value, index - 2)}
                      >
                        Split
                      </div>
                    )}
                </Col>
              ))
            )
          : ""}
      </Row>
    </div>
  );
};

export { Occupied };
