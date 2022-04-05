import React, { useState } from "react";
import { Tabs } from "antd";
import { Cards } from "../../../components/cards/frame/cards-frame";
import { All } from "../Tables/All";
import { Free } from "../Tables/Free";
import { Occupied } from "../Tables/Occupied";

const TableBuilder = (props) => {
  const { TabPane } = Tabs;

  return (
    <>
      <Cards headless>
        <Tabs type="card" centered="true">
          <TabPane tab="All" key="1">
            <All />
          </TabPane>
          <TabPane tab="Free" key="2">
            <Free />
          </TabPane>
          <TabPane tab="Occupied" key="3">
            <Occupied />
          </TabPane>
          <TabPane tab="Unpaid" key="4">
            <h1>Under Construction</h1>
          </TabPane>
        </Tabs>
      </Cards>
    </>
  );
};

export { TableBuilder };
