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
import { getAllTableList } from "../../../redux/sell/actionCreator";
import {
  checkIfTableIsSelectedByCartkey,
  getTableStatusFromId,
  checkIfTableIsSelected,
  removeItem,
  getTotalOfUnpaid,
} from "../../../utility/localStorageControl";

const data = [
  {
    title: "Table 1",
  },
  {
    title: "Table 2",
  },
  {
    title: "Table 3",
  },
  {
    title: "Table 4",
  },
];

const TakeAway = (props) => {
  let [allTableList, setAllTableList] = useState([]);
  let {
    createNewTakeawayInLocalStorageHandler,
    searchText,
    getAllTakeAwayDataInLocalFn,
    getTakeawayInLocalStorageHandler,
  } = props;
  let [takeAwayData, settakeAwayData] = useState([]);

  const currentRegisterData = useSelector((state) =>
    state.register.RegisterList.find((val) => val.active)
  );
  let isMounted = useRef(true);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchAllTableList() {
      const allTableList = await dispatch(getAllTableList());
      if (isMounted.current && allTableList && allTableList.tableList)
        setAllTableList(allTableList.tableList);
    }
    if (isMounted.current && currentRegisterData) {
      fetchAllTableList();
      settakeAwayData(getAllTakeAwayDataInLocalFn(currentRegisterData));
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  function createNewTakeawayInLocalStorage() {
    createNewTakeawayInLocalStorageHandler(takeAwayData.length + 1);
  }

  function getakeawayInLocalStorage(key) {
    getTakeawayInLocalStorageHandler(key);
  }

  //console.log("takeaway=>", allTableList);
  let filterArray = allTableList.filter((value) => {
    return value.table_type.toLowerCase().indexOf("take-away") !== -1;
  });

  takeAwayData = takeAwayData.filter(
    (value) =>
      value.tableName.toLowerCase().includes(searchText.toLowerCase()) &&
      value.Status != "Delete"
  );
  return (
    <div className="sell-table-parent takeaway-parent list-boxmain">
      <Row gutter={[2, 2]} className="takeway-row list-box-row">
        {filterArray.length > 0
          ? filterArray.map((value, index) => (
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
                  onClick={() => createNewTakeawayInLocalStorage()}
                >
                  <div className="sell-table-counter">
                    <div className="counter_served">{value.table_prefix}</div>
                    <div className="postion"></div>
                  </div>
                </div>
              </Col>
            ))
          : ""}
        {takeAwayData.length > 0
          ? takeAwayData.map((values, index) => {
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
                    onClick={() => getakeawayInLocalStorage(values.cartKey)}
                  >
                    <div className="sell-table-counter">
                      <div className="counter_served">{values.tableName}</div>
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
            })
          : ""}
      </Row>
    </div>
  );
};

export { TakeAway };
