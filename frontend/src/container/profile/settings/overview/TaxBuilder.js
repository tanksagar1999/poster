import React, { useState, useEffect } from "react";
import { Row, Col, Tabs } from "antd";
import { AccountWrapper } from "./style";
import { PageHeader } from "../../../../components/page-headers/page-headers";
import Taxes from "./Taxpage/Taxes";
import Taxesgroup from "./Taxpage/Taxesgroup";
import { UserTableStyleWrapper } from "../../../pages/style";
import { TableWrapper } from "../../../styled";

const { TabPane } = Tabs;
const TaxBuilder = (props) => {
  const [activeTab, changeTab] = useState("TAX");

  useEffect(() => {
    const getResult = async () => {
      const search = await new URLSearchParams(props.location.search);
      let type = search.get("type");
      switch (type) {
        case "tax":
          return changeTab("TAX");
        case "taxes_group":
          return changeTab("TAX_GROUP");
        default:
          return "TAX";
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
              tab="Taxes"
              key="TAX"
              className="ant-tabs-tab-active"
            ></TabPane>
            <TabPane
              tab="Tax Groups"
              key="TAX_GROUP"
              className="ant-tabs-tab-active"
            ></TabPane>
          </Tabs>
        }
      />
      <Row>
        <Col xs={24}>
          <UserTableStyleWrapper>
            <div className="contact-table">
              <TableWrapper className="table-responsive">
                {activeTab === "TAX" ? <Taxes /> : ""}
                {activeTab === "TAX_GROUP" ? <Taxesgroup /> : ""}
              </TableWrapper>
            </div>
          </UserTableStyleWrapper>
        </Col>
      </Row>
    </AccountWrapper>
  );
};

export default TaxBuilder;
