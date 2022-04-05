import React, { useState, useEffect } from "react";
import { Row, Col, Tabs } from "antd";
import { AccountWrapper } from "./style";
import { PageHeader } from "../../../../components/page-headers/page-headers";
import PaymentTypes from "./Customfield/PaymentTypes";
import AdditionalDetails from "./Customfield/AdditionalDetails";
import PattyCashCategories from "./Customfield/PattyCashCategories";
import Tags from "./Customfield/Tags";
import { UserTableStyleWrapper } from "../../../pages/style";
import { TableWrapper } from "../../../styled";

const { TabPane } = Tabs;
const CustomFieldBuilder = (props) => {
  const [activeTab, changeTab] = useState("PAYMENT_TYPES");
  useEffect(() => {
    const getResult = async () => {
      const search = await new URLSearchParams(props.location.search);
      let type = search.get("type");

      switch (type) {
        case "payment_type":
          return changeTab("PAYMENT_TYPES");
        case "petty_cash_category":
          return changeTab("PETTYCASH");
        case "additional_detail":
          return changeTab("ADDITIONAL");
        case "tag":
          return changeTab("TAG");
        default:
          return "PAYMENT_TYPES";
      }
    };
    getResult();
  }, []);

  return (
    <AccountWrapper>
      <PageHeader
        title={
          <Tabs
            type="card"
            activeKey={activeTab}
            size="small"
            onChange={changeTab}
          >
            <TabPane
              tab="Payment Types"
              key="PAYMENT_TYPES"
              className="ant-tabs-tab-active"
            ></TabPane>
            <TabPane tab="Petty Cash Categories" key="PETTYCASH"></TabPane>
            <TabPane tab="Additional Details" key="ADDITIONAL"></TabPane>
            <TabPane tab="Tags" key="TAG"></TabPane>
          </Tabs>
        }
      />

      <Row>
        <Col xs={24}>
          <UserTableStyleWrapper>
            <div className="contact-table">
              <TableWrapper className="table-responsive">
                {activeTab === "PAYMENT_TYPES" ? <PaymentTypes /> : ""}
                {activeTab === "PETTYCASH" ? <PattyCashCategories /> : ""}
                {activeTab === "ADDITIONAL" ? <AdditionalDetails /> : ""}
                {activeTab === "TAG" ? <Tags /> : ""}
              </TableWrapper>
            </div>
          </UserTableStyleWrapper>
        </Col>
      </Row>
    </AccountWrapper>
  );
};

export default CustomFieldBuilder;
