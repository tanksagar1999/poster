import React, { useState, useEffect, useRef } from "react";
import { NavLink, useRouteMatch, withRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Table, Input, Tag, Card, List } from "antd";
import { SearchOutlined, UserOutlined } from "@ant-design/icons";
import "../sell.css";
const { Meta } = Card;
import { ShoppingCartOutlined } from "@ant-design/icons";
import { Main } from "../../styled";

const { Search } = Input;
import {
  getTableStatusFromId,
  checkIfTableIsSelected,
  getTableNameTo,
  getTotalOfUnpaid,
} from "../../../utility/localStorageControl";

const CustomTable = (props) => {
  const currentRegisterData = useSelector((state) =>
    state.register.RegisterList.find((val) => val.active)
  );
  let {
    CustomTableData,
    setCustomTableOrderInLocalStorageHandler,
    searchText,
    handleSplit,
  } = props;
  const [updateStatus, setStatus] = useState();

  function setTableStatusOccupied(tableName) {
    let tableNameStr = tableName.replace(/\s+/g, "-").toLowerCase();

    setCustomTableOrderInLocalStorageHandler(tableName, tableNameStr);
  }

  CustomTableData = CustomTableData.filter((value) =>
    value.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="sell-table-parent customTable-parent list-boxmain">
      <Row gutter={[2, 2]} className="takeway-row list-box-row">
        {CustomTableData.length > 0
          ? CustomTableData.map((value, index) => {
              const status = getTableStatusFromId(
                value.replace(/\s+/g, "-").toLowerCase(),
                currentRegisterData
              );
              let finalValue = getTotalOfUnpaid(
                value.replace(/\s+/g, "-").toLowerCase(),
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
                      onClick={() => setTableStatusOccupied(value)}
                    >
                      <div class="sell-table-counter">
                        <div class="counter_served">{value}</div>
                        <div class="postion">
                          <div className="product-price inlineDIv">
                            {checkIfTableIsSelected(
                              value.replace(/\s+/g, "-").toLowerCase(),
                              currentRegisterData
                            )}
                            {getTableStatusFromId(
                              value.replace(/\s+/g, "-").toLowerCase(),
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
                </>
              );
            })
          : ""}
      </Row>
    </div>
  );
};

export { CustomTable };
