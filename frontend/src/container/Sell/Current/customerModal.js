/* eslint-disable no-unused-expressions */
import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useRef,
} from "react";
import { useDispatch } from "react-redux";

import { Modal, Button, Tabs, Form, Input, Tag, Row } from "antd";
import {
  AddSingleCustomer,
  UpdateCustomer,
} from "../../../redux/customer/actionCreator";
import commonFunction from "../../../utility/commonFunctions";

const { TabPane } = Tabs;
const CustomerModal = forwardRef((props, ref) => {
  let { localCartInfo, titleCheck } = props;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const dispatch = useDispatch();
  const [MoNumber, setNumber] = useState();
  const [form] = Form.useForm();
  let isMounted = useRef(true);
  const inputRef = useRef();
  const streetAddreddRef = useRef();
  const [Addcustomer, setAddcustomer] = useState(false);

  const [allFiledDisbled, setAllFiledDisabled] = useState(
    localCartInfo && localCartInfo.Status == "Unpaid" ? true : false
  );

  console.log("localcartInfolocalCartInfo", titleCheck);

  useEffect(() => {
    if (props.customer_Data) {
      props.customer_Data.mobile
        ? form.setFieldsValue({
            mobile:
              props.customer_Data.mobile == "Add Customer"
                ? MoNumber
                : props.customer_Data.mobile,
          })
        : titleCheck != "Add Customer"
        ? form.setFieldsValue({
            mobile: titleCheck,
          })
        : null;

      props.customer_Data.name &&
        form.setFieldsValue({
          name: props.customer_Data.name,
        });
      props.customer_Data.city &&
        form.setFieldsValue({
          city: props.customer_Data.city,
        });
      props.customer_Data.shipping_address &&
        form.setFieldsValue({
          shipping_address: props.customer_Data.shipping_address,
        });
      props.customer_Data.zipcode &&
        form.setFieldsValue({
          zipcode: props.customer_Data.zipcode,
        });
    }
  }, [props, isModalVisible, titleCheck]);

  function callback(key) {}

  useImperativeHandle(ref, () => ({
    showModal() {
      setIsModalVisible(true);
    },
  }));
  const onSubmit = async (formdata) => {
    if (props.customer_Data?._id) {
      setIsModalVisible(false);
      props.currentData({
        name: formdata.name,
        mobile: formdata.mobile,
        id: props.customer_Data._id,
        shipping_address: formdata.shipping_address,
        city: formdata.city,
        zipcode: formdata.zipcode,
      });
      form.resetFields();
      // }
    } else {
      props.currentData({
        name: formdata.name,
        mobile: formdata.mobile,
        shipping_address: formdata.shipping_address,
        city: formdata.city,
        zipcode: formdata.zipcode,
      });
      setIsModalVisible(false);
      form.resetFields();
      // }
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  });

  useEffect(() => {
    if (streetAddreddRef.current) {
      streetAddreddRef.current.focus();
    }
  });

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <Modal
        title={
          props.titleCheck === "Add Customer"
            ? "Add Customer"
            : "Update Customer"
        }
        visible={isModalVisible}
        onOk={form.submit}
        bodyStyle={{ paddingTop: 0 }}
        onCancel={handleCancel}
      >
        <Tabs defaultActiveKey="General" onChange={callback}>
          <TabPane tab="General" key="General">
            <Form
              autoComplete="off"
              style={{ width: "100%" }}
              form={form}
              onFinish={onSubmit}
              name="editProduct"
            >
              <Form.Item
                name="mobile"
                style={{ margin: "4px" }}
                label="Customer Phone"
                rules={[
                  {
                    message: "Please enter customer mobile number",
                    required: true,
                  },
                ]}
              >
                <Input
                  type="number"
                  ref={inputRef}
                  style={{ marginBottom: 6 }}
                  disabled={allFiledDisbled}
                  placeholder="Customer Number"
                  onKeyDown={(e) => props.onEnter(e)}
                  onChange={(e) => {
                    if (e.target.value === "" || e.target.value == null) {
                      props.setCustomerData("Add Customer");
                    } else {
                      // props.customer_Data.mobile = e.target.value;

                      props.setCustomerData(e.target.value);
                      setNumber(e.target.value);
                    }
                  }}
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
                name="name"
                label="Cutomer Name"
                style={{ margin: "4px" }}
              >
                <Input
                  style={{ marginBottom: 6 }}
                  placeholder="Customer Name"
                  disabled={allFiledDisbled}
                />
              </Form.Item>
            </Form>
          </TabPane>
          <TabPane tab="Delivery" key="Delivery">
            <Form
              autoComplete="off"
              style={{ width: "100%" }}
              form={form}
              name="editProduct"
              onFinish={onSubmit}
            >
              <Form.Item name="shipping_address" label="Shipping Address">
                <Input
                  ref={streetAddreddRef}
                  style={{ marginBottom: 6 }}
                  placeholder="Street Address"
                  disabled={allFiledDisbled}
                />
              </Form.Item>
              <Form.Item
                name="city"
                style={{
                  display: "inline-block",
                  width: "calc(50% - 12px)",
                }}
                label="City"
              >
                <Input
                  style={{ marginBottom: 6 }}
                  placeholder="City"
                  disabled={allFiledDisbled}
                />
              </Form.Item>
              <span
                style={{
                  display: "inline-block",
                  width: "24px",
                  lineHeight: "32px",
                  textAlign: "center",
                }}
              ></span>
              <Form.Item
                name="zipcode"
                style={{
                  display: "inline-block",
                  width: "calc(50% - 12px)",
                }}
                label="Zipcode"
              >
                <Input
                  type="number"
                  style={{ marginBottom: 6 }}
                  placeholder="Zipcode"
                  disabled={allFiledDisbled}
                  onKeyPress={(event) => {
                    if (event.key.match("[0-9]+")) {
                      return true;
                    } else {
                      return event.preventDefault();
                    }
                  }}
                />
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>

        {props.customer_Data?.order_value &&
        props.customer_Data?.order_value > 0 ? (
          <>
            <Row>
              <Form.Item
                className="tvisit-n l-h0"
                name="totalounts"
                label={"Total Visits " + props.customer_Data.order_value}
              ></Form.Item>
              <Form.Item
                className="l-h0"
                name="totalounts"
                label={`Last Purchase at ${commonFunction.convertToDate(
                  props.customer_Data.last_purchase_items.created_at,
                  "MMM DD, Y, h:mm A"
                )}`}
              ></Form.Item>

              <Form.Item
                name="last_purchase"
                label="Last Purchase"
                className="lh0"
              >
                {props.customer_Data.last_purchase_items.details.itemsSold.map(
                  (val) => (
                    <Tag className="custome-tag">{val.item}</Tag>
                  )
                )}
              </Form.Item>
              <Form.Item
                name="registerName"
                label={"Associated Registers"}
                className="lh0"
              >
                <Tag className="custome-tag">
                  {
                    props.customer_Data.last_purchase_items.register_id
                      .register_name
                  }
                </Tag>
              </Form.Item>
            </Row>
          </>
        ) : null}
      </Modal>
    </div>
  );
});

export { CustomerModal };
