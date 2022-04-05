import React, { useState } from 'react';
import { Row, Col, Tabs, Breadcrumb } from "antd";
import { PageHeader } from '../../../components/page-headers/page-headers';
import { NavLink } from 'react-router-dom';
import { Main } from '../../styled';
import { Button } from '../../../components/buttons/buttons';
import { New } from '../Incoming/New';
import { Accepted } from '../Incoming/Accepted';
import { Ready } from '../Incoming/Ready';
import { Cards } from '../../../components/cards/frame/cards-frame';
import { SettingOutlined } from '@ant-design/icons';
import { TopToolBox } from '../Style';
import { AutoComplete } from '../../../components/autoComplete/autoComplete';

const IncomingOrderBuilder = props => {

  const { TabPane } = Tabs;
  const [activeTab, changeTab] = useState();
  const [modalVisible, setModelVisible] = useState(false);

  return (

    <>
      <Cards headless>
        <TopToolBox>
          <Row gutter={15} >
            <Col lg={9} xs={24}>
              <div className="table-search-box">
                <AutoComplete width="100%" patterns />
              </div>
            </Col>
            <Col xxl={1} lg={1} xs={1}></Col>
            <Col xxl={11} lg={14} xs={24}>
              <div className="table-toolbox-menu">
                <Tabs defaultActiveKey="1" activeKey={activeTab} onChange={changeTab} size="small" type="card" >
                  <TabPane tab="New Order" key="first" >
                  </TabPane>
                  <TabPane tab="Accepted" key="second" >
                  </TabPane>
                  <TabPane tab="Ready" key="third" >
                  </TabPane>
                </Tabs>
              </div>
            </Col>

          </Row>
        </TopToolBox>
        {activeTab != 'second' && activeTab !== 'third'
          ? <New /> : ''}
        {activeTab == 'second' && activeTab != 'one' && activeTab !== 'third'
          ? <Accepted /> : ''}
        {activeTab == 'third' && activeTab != 'two' && activeTab != 'one'
          ? <Ready /> : ''}
      </Cards>
    </>
  );
};

export { IncomingOrderBuilder };

