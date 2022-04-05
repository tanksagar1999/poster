import React from "react";
import { Form, Input, Select } from "antd";

const Exportform = () => {
  return (
    <div>
      <Form style={{ width: "100%" }} name="addProduct">
        <div className="add-product-block">
          <div className="add-product-content">
            <Form.Item label="Choose Report Type">
              <Select
                name="category"
                initialValue="Select Report Type "
                style={{ width: "100%" }}
              >
                <Option value="">Select Report Type </Option>
                <Option value="sales">Sales report</Option>
                <Option value="payment">Payment report</Option>
                <Option value="daily">Daily sales and payment report</Option>
                <Option value="product">Product wise sales report</Option>
                <Option value="shift">Shift open / close report</Option>
              </Select>
            </Form.Item>

            <Form.Item initialValue="" label="Date Range">
              <Select name="report" style={{ width: "100%" }}>
                <Option value="">Today </Option>
                <Option value="sales">Yesterday</Option>
                <Option value="payment">This Month</Option>
                <Option value="daily">Last Month</Option>
                <Option value="custom selection">Custom Selection</Option>
                <Option value="product">Product wise sales report</Option>
                <Option value="shift">Shift open / close report</Option>
              </Select>
            </Form.Item>

            <Form.Item name="Email Address" label="Send to Email Address">
              <Input />
            </Form.Item>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default Exportform;
