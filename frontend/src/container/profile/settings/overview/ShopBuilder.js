import React, { useState, useEffect, useRef } from "react";
import {
  Checkbox,
  Row,
  Col,
  Input,
  Divider,
  Form,
  Select,
  Tabs,
  Upload,
  message,
} from "antd";
import { PageHeader } from "../../../../components/page-headers/page-headers";
import { AccountWrapper } from "./style";
import AddBasic from "./Shoppage/AddBasic";
import AddAccount from "./Shoppage/AddAccount";
import AddApi from "./Shoppage/AddApi";
import "../setting.css";

const { TabPane } = Tabs;

const ShopBuilder = () => {
  const [activeTab, changeTab] = useState("BASIC_DETAILS");

  return (
    <>
      <AccountWrapper>
        <PageHeader
          ghost
          title={
            <Tabs
              type="card"
              activeKey={activeTab}
              size="small"
              onChange={changeTab}
            >
              <TabPane
                tab="Basic Details"
                key="BASIC_DETAILS"
                className="ant-tabs-tab-active"
              ></TabPane>
              <TabPane tab="Account Details" key="ACCOUNT_DETAILS"></TabPane>
            </Tabs>
          }
        />
        <Row>
          <Col xs={24}>
            {activeTab === "BASIC_DETAILS" ? <AddBasic /> : ""}
            {activeTab === "ACCOUNT_DETAILS" ? <AddAccount /> : ""}
          </Col>
        </Row>
      </AccountWrapper>
    </>
  );
};

export default ShopBuilder;
