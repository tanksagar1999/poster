import React from "react";
import { Row, Col, Select } from "antd";
import { NavLink } from "react-router-dom";
import { Cards } from "../../../../../components/cards/frame/cards-frame";
import Heading from "../../../../../components/heading/heading";
import "../../setting.css";

const AddApi = () => {
  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
        style={{
          width: 70,
        }}
      >
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>
    </Form.Item>
  );

  return (
    <>
      <Cards
        title={
          <div className="setting-card-title">
            <Heading as="h4">API Access</Heading>
            <span>Your shop details and settings.</span>
            <span>
              You can also register a Webhook to listen to Poster transactions.
            </span>
          </div>
        }
      >
        <Row gutter={25} justify="center">
          <Col xxl={12} md={14} sm={18} xs={24}>
            <div style={{ textAlign: "center" }}>
              <NavLink to="/admin/shop/subscription">Show details </NavLink>
              <br></br>
              Keep API credentials confidential.
            </div>
          </Col>
        </Row>
      </Cards>
    </>
  );
};

export default AddApi;
