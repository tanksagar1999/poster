import React, { useState, useEffect, useRef } from "react";
import { Checkbox, Row, Col, Input, Form, Select, Tooltip } from "antd";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { Cards } from "../../../../../components/cards/frame/cards-frame";
import Heading from "../../../../../components/heading/heading";
import { Button } from "../../../../../components/buttons/buttons";

import "../../setting.css";
import { getTaxGroupList } from "../../../../../redux/taxGroup/actionCreator";
import {
  addOrUpdateAddtionalCharge,
  getAddtionalChargeById,
  getAllAddtionalChargeList,
} from "../../../../../redux/AddtionalCharge/actionCreator";
import { QuestionCircleOutlined } from "@ant-design/icons";

const AddAdditional = () => {
  const [taxGroup, setTaxGroup] = useState([]);
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  let isMounted = useRef(true);
  const [form] = Form.useForm();
  const [Automatically, setAutomatically] = useState(false);
  const [AddtionaChargeData, SetAddtionaChargeData] = useState();

  useEffect(() => {
    async function fetchAddtionalChargeData() {
      if (location.state) {
        const getAddtionaChargeData = await dispatch(
          getAddtionalChargeById(location.state.addtional_charge_id)
        );
        if (isMounted.current)
          SetAddtionaChargeData(getAddtionaChargeData.AddtionalChargeIdData);
      }
    }
    async function fetchTaxGroupList() {
      const getAllTaxGroupList = await dispatch(getTaxGroupList("sell "));
      if (
        isMounted.current &&
        getAllTaxGroupList &&
        getAllTaxGroupList.taxGroupList
      )
        setTaxGroup(getAllTaxGroupList.taxGroupList);
    }
    if (isMounted.current) {
      fetchTaxGroupList();
      fetchAddtionalChargeData();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (AddtionaChargeData) {
      form.setFieldsValue({
        charge_name: AddtionaChargeData.charge_name,
        charge_type: AddtionaChargeData.charge_type,
        charge_value: AddtionaChargeData.charge_value,
        tax_group: AddtionaChargeData.tax_group,
        order_type: AddtionaChargeData.order_type,
        is_automatically_added: AddtionaChargeData.is_automatically_added
          ? setAutomatically(true)
          : "",
      });
    }
  }, [AddtionaChargeData]);
  const handleSubmit = async (formData) => {
    formData.is_automatically_added = Automatically;
    let AddtionalCharge_id =
      location && location.state ? location.state.addtional_charge_id : null;
    const getAddedAddtionalCharge = await dispatch(
      addOrUpdateAddtionalCharge(formData, AddtionalCharge_id)
    );
    if (
      getAddedAddtionalCharge &&
      getAddedAddtionalCharge.AddtionalChargeData &&
      !getAddedAddtionalCharge.AddtionalChargeData.error
    ) {
      const getAddtionalChargeList = await dispatch(
        getAllAddtionalChargeList()
      );
      if (
        getAddtionalChargeList &&
        getAddtionalChargeList.AddtionalChargeList
      ) {
        history.push("/settings/additional-charges");
      }
    }
  };
  return (
    <>
      <Cards
        title={
          <div className="setting-card-title">
            <Heading as="h4">Additional Charge Details</Heading>
            <span>
              Delivery charges, parcel charges, service charges etc. can be
              setup as additional charges
            </span>
            <span>
              Additional charges are applied on top of the discounted subtotal.
              Also, additional charges can have taxes.
            </span>
          </div>
        }
      >
        <Row gutter={25} justify="center">
          <Col xxl={12} md={14} sm={18} xs={24}>
            <Form form={form} onFinish={handleSubmit}>
              <Form.Item
                name="charge_name"
                label="Additional Charge Name"
                rules={[
                  {
                    min: 3,
                    message:
                      "Additional charge name must be at least 3 characters long.",
                  },
                  {
                    max: 40,
                    message:
                      "Additional charge name cannot be more than 40 characters long.",
                  },
                  {
                    required: true,
                    message: "Additional charge name is required",
                  },
                ]}
              >
                <Input
                  style={{ marginBottom: 10 }}
                  placeholder="Addtional charge name"
                  autoComplete="off"
                />
              </Form.Item>

              <Form.Item
                name="charge_type"
                label="Additional Charge Type"
                rules={[
                  {
                    required: true,
                    message: "Additional charge type is required",
                  },
                ]}
              >
                <Select
                  style={{ width: "100%" }}
                  placeholder="Select addtional charge type"
                >
                  <Option value="cash">Cash</Option>
                  <Option value="percentage">Percentage</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="charge_value"
                label="Charge Value"
                rules={[
                  {
                    pattern: new RegExp(
                      /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/
                    ),
                    message: "Additional charge value cannot be negative",
                  },
                  {
                    required: true,
                    message: "Additional charge value is required",
                  },
                ]}
              >
                <Input
                  type="number"
                  step="any"
                  style={{ marginBottom: 10 }}
                  placeholder="Addtional charge value"
                  autoComplete="off"
                  min={0}
                  onKeyPress={(event) => {
                    if (event.key.match("[0-9]+")) {
                      return true;
                    } else {
                      return event.preventDefault();
                    }
                  }}
                />
              </Form.Item>
              <Form.Item
                name="tax_group"
                label="Tax Group"
                rules={[
                  {
                    required: true,
                    message:
                      "Tax group is required. If no tax, use a zero tax group",
                  },
                ]}
              >
                <Select
                  style={{ width: "100%" }}
                  placeholder="Select a Tax Group"
                >
                  {taxGroup.map((value, key) => (
                    <Option value={value._id} key={key}>
                      {value.tax_group_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="order_type"
                label="Order Type"
                rules={[{ required: true, message: "Order type is required" }]}
              >
                <Select style={{ width: "100%" }} placeholder="Select a type">
                  <Option value="all_orders">All Orders</Option>
                  <Option value="take_away">Take Away</Option>
                  <Option value="delivery">Delivery</Option>
                  <Option value="dine_in">Dine In</Option>
                </Select>
              </Form.Item>
              <Form.Item name="is_automatically_added">
                <Checkbox
                  className="add-form-check"
                  checked={Automatically}
                  onChange={(e) => {
                    setAutomatically(e.target.checked);
                  }}
                >
                  Is Automatically Added?{" "}
                  <Tooltip title="If you select this option, the addtional charge will be automatically addes each bill.">
                    <QuestionCircleOutlined style={{ cursor: "pointer" }} />
                  </Tooltip>
                </Checkbox>
              </Form.Item>
              <Form.Item style={{ float: "right" }}>
                <Button
                  className="go-back-button"
                  size="small"
                  type="white"
                  style={{ marginRight: "10px" }}
                  onClick={() => history.push("/settings/additional-charges")}
                >
                  Go Back
                </Button>
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Cards>
    </>
  );
};

export default AddAdditional;
