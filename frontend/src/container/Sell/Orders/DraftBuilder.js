import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Card, Row, Col, Table, Button } from "antd";
import { SellModuleNav } from "../Style";
import { NavLink } from "react-router-dom";
import { TakeAway } from "../Orders/TakeAway";
import { CustomTable } from "../Orders/customTable";
import { Delivery } from "../Orders/Delivery";
import { All } from "../Tables/All";
import { Free } from "../Tables/Free";
import { Occupied } from "../Tables/Occupied";
import { getCartInfoLocalListsData } from "../../../utility/localStorageControl";
import { getRegisterById } from "../../../redux/register/actionCreator";
import { useDispatch, useSelector } from "react-redux";
import { Cards } from "../../../components/cards/frame/cards-frame";
import { EditTableNameModal } from "./../../Sell/Current/EditTableNameModal";
import commonFunction from "../../../utility/commonFunctions";
import { EditOutlined } from "@ant-design/icons";
import moment from "moment";
import { DECREMENT } from "../../../redux/draft/actionCreator";

const DraftBuilder = (props) => {
  let isMounted = useRef(true);
  const currentRegisterData = useSelector((state) =>
    state.register.RegisterList.find((val) => val.active)
  );
  const {
    editCartProductDetails,
    setLocalCartCount,
    tabChangeToCurrent,
    setlocalCartInfo,
    setTableName,
  } = props;
  const [cartInfoLocalListsData, setCartInfoLocalListsData] = useState([]);
  setLocalCartCount(cartInfoLocalListsData ? cartInfoLocalListsData.length : 0);
  const [cartToEdit, setCartToEdit] = useState({});

  const editTableNameModalRef = useRef();

  const editTableNameFunction = (data) => {
    setCartToEdit(data);
    editTableNameModalRef.current.showModal();
  };

  useEffect(() => {
    if (currentRegisterData) {
      setCartInfoLocalListsData(
        getCartInfoLocalListsData()
          .filter(
            (d) =>
              d.type == "DRAFT_CART" && d.register_id == currentRegisterData._id
          )
          .sort(function(left, right) {
            return moment
              .utc(left.created_at)
              .diff(moment.utc(right.created_at));
          })
          .reverse()
      );
    }
  }, []);

  const editTableName = (data) => {
    editCartProductDetails(data);
  };

  const updateInfoLocalListsDataFunction = () => {
    if (currentRegisterData) {
      setCartInfoLocalListsData(
        getCartInfoLocalListsData()
          .filter(
            (d) =>
              d.type == "DRAFT_CART" && d.register_id == currentRegisterData._id
          )
          .sort(function(left, right) {
            return moment
              .utc(left.created_at)
              .diff(moment.utc(right.created_at));
          })
          .reverse()
      );
    }
  };

  const columns = [
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (created_at, item) => (
        <div
          onClick={(e) => {
            editTableName(item);
          }}
        >
          {item.cartKey == localStorage.getItem("active_cart") ? (
            <span className="active-dots" />
          ) : (
            ""
          )}
          {commonFunction.convertToDate(created_at, "MMM DD, Y h:mm A")}
        </div>
      ),
    },
    {
      title: "Name",
      dataIndex: "tableName",
      key: "tableName",
      render: (value, item) => (
        <div
          onClick={(e) => {
            editTableName(item);
          }}
        >
          {value}
        </div>
      ),
    },
    {
      title: "Amount",
      dataIndex: "otherDetails",

      key: "otherDetails",
      render: (record, item) => {
        return (
          <div
            onClick={(e) => {
              editTableName(item);
            }}
          >
            <a>{`₹${record?.finalCharge}
          `}</a>
          </div>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "id",

      key: "id",
      render: (tableName, item) => (
        <EditOutlined
          onClick={(e) => {
            editTableNameFunction(item);
          }}
        />
      ),
    },
  ];

  return (
    <>
      <Row gutter={15}>
        <Col md={24}>
          <Cards headless>
            <Table dataSource={cartInfoLocalListsData} columns={columns} />
          </Cards>
        </Col>
        <EditTableNameModal
          ref={editTableNameModalRef}
          cartDetails={cartToEdit}
          tabChangeToCurrent={tabChangeToCurrent}
          updateInfoLocalListsData={updateInfoLocalListsDataFunction}
          redirectToCurrent="no"
          setCartInfoLocalListsData={setCartInfoLocalListsData}
          setlocalCartInfo={setlocalCartInfo}
          setTableName={setTableName}
          activeTab="draftBuilder"
        />
      </Row>
    </>
  );
};
export { DraftBuilder };
