import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Card } from "antd";
import "../sell.css";
const { Meta } = Card;

import { getAllTableList } from "../../../redux/sell/actionCreator";
import {
  checkIfTableIsSelectedByCartkey,
  getTableStatusFromId,
  getTotalOfUnpaid,
} from "../../../utility/localStorageControl";

const Delivery = (props) => {
  let [allTableList, setAllTableList] = useState([]);
  let {
    createNewDeliveryInLocalStorageHandler,
    searchText,
    getAllDeliveryDataInLocalFn,
    getDeliveryInLocalStorageHandler,
  } = props;
  let isMounted = useRef(true);
  const dispatch = useDispatch();
  let [deliveryData, setDeliveryData] = useState([]);
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
      setDeliveryData(getAllDeliveryDataInLocalFn(currentRegisterData));
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  let filterArray = allTableList.filter((value) => {
    return value.table_type.toLowerCase().indexOf("delivery") !== -1;
  });

  function createNewDeliveryInLocalStorage() {
    createNewDeliveryInLocalStorageHandler(deliveryData.length + 1);
  }

  function getDeliveryInLocalStorage(key) {
    getDeliveryInLocalStorageHandler(key);
  }

  deliveryData = deliveryData.filter(
    (value) =>
      value.tableName.toLowerCase().includes(searchText.toLowerCase()) &&
      value.Status != "Delete"
  );

  const handleSplitClick = () => {};

  return (
    <div className="sell-table-parent delivery-parent list-boxmain">
      <Row gutter={[12, 12]} className="delivery-row list-box-row">
        {filterArray.length > 0
          ? filterArray.map((value, index) => (
              <Col
                xxl={4}
                lg={4}
                xl={4}
                xs={12}
                key={index}
                className="sell-table-col"
              >
                <div
                  className="sell-empty"
                  onClick={() => createNewDeliveryInLocalStorage()}
                >
                  <div className="sell-table-counter">
                    <div className="counter_served">{value.table_prefix}</div>
                    <div className="postion"></div>
                  </div>
                </div>
              </Col>
            ))
          : ""}
        {deliveryData.length > 0
          ? deliveryData.map((values, index) => {
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
                  >
                    <div
                      onClick={() => getDeliveryInLocalStorage(values.cartKey)}
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
                              <span>{` ₹${Number(finalValue).toFixed(
                                2
                              )}`}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {getTableStatusFromId(values.tablekey, currentRegisterData) ==
                    "In Progress" && (
                    <div
                      style={{ marginLeft: "79px" }}
                      onClick={handleSplitClick}
                    >
                      split
                    </div>
                  )}
                </Col>
              );
            })
          : ""}
      </Row>
    </div>
  );
};

export { Delivery };
