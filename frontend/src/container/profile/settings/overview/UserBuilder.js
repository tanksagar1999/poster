import React, { useState, useEffect } from "react";
import { getItem } from "../../../../utility/localStorageControl";
import { Row, Col, Tabs } from "antd";
import { AccountWrapper } from "./style";
import { useDispatch } from "react-redux";
import { PageHeader } from "../../../../components/page-headers/page-headers";
import Cashier from "./Userpage/Cashier";
import Appuser from "./Userpage/Appuser";
import Waiter from "./Userpage/Waiters";
import Kitchens from "./Userpage/Kitchen";
import { UserTableStyleWrapper } from "../../../pages/style";
import { TableWrapper } from "../../../styled";
import { getShopDetail } from "../../../../redux/shop/actionCreator";

const { TabPane } = Tabs;
const UserBuilder = (props) => {
  const userDetail = getItem("userDetails");
  const dispatch = useDispatch();
  const [activeTab, changeTab] = useState("CASHIER");

  useEffect(() => {
    const getResult = async () => {
      const search = await new URLSearchParams(props.location.search);
      let type = search.get("type");

      switch (type) {
        case "cashier":
          return changeTab("CASHIER");
        case "app_user":
          return changeTab("APP_USER");
        case "waiter":
          return changeTab("WAITER");
        case "kitchen":
          return changeTab("KITCHEN");
        default:
          return "CASHIER";
      }
    };
    getResult();
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function fetchShopDetail() {
      const data = await dispatch(getShopDetail(userDetail._id));
      if (data) {
      }
    }
    if (isMounted) {
      fetchShopDetail();
    }
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = (values) => {
    setState({ ...state, values });
  };

  const handleCancel = (e) => {
    e.preventDefault();
    form.resetFields();
  };

  const handleChange = (e) => {
    setState({
      name: e.target.value,
    });
  };

  return (
    <AccountWrapper>
      <PageHeader
        className="setup-custom-page-header"
        title={
          <Tabs
            type="card"
            activeKey={activeTab}
            size="small"
            onChange={changeTab}
          >
            <TabPane
              tab="Cashiers"
              key="CASHIER"
              className="ant-tabs-tab-active"
            ></TabPane>
            <TabPane tab="App users" key="APP_USER"></TabPane>
            <TabPane tab="Waiters" key="WAITER"></TabPane>
            <TabPane tab="Kitchen Users" key="KITCHEN"></TabPane>
          </Tabs>
        }
      />

      <Row>
        <Col xs={24}>
          <UserTableStyleWrapper>
            <div className="contact-table">
              <TableWrapper className="table-responsive">
                {activeTab === "CASHIER" ? <Cashier /> : ""}
                {activeTab === "APP_USER" ? <Appuser /> : ""}
                {activeTab === "WAITER" ? <Waiter /> : ""}
                {activeTab === "KITCHEN" ? <Kitchens /> : ""}
              </TableWrapper>
            </div>
          </UserTableStyleWrapper>
        </Col>
      </Row>
    </AccountWrapper>
  );
};

export default UserBuilder;
