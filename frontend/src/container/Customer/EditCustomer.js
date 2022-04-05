import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  Upload,
  Tabs,
  Tag,
  Table,
  Button,
} from "antd";
import { NavLink, useHistory, useLocation } from "react-router-dom";
import { PageHeader } from "../../components/page-headers/page-headers";
import { Cards } from "../../components/cards/frame/cards-frame";
import { Main } from "../styled";
import Heading from "../../components/heading/heading";
import {
  getCustomerDetail,
  UpdateCustomer,
} from "../../redux/customer/actionCreator";
import commonFunction from "../../utility/commonFunctions";
import { object, objectOf } from "prop-types";
import "./customer.css";

const { Option } = Select;
const { Dragger } = Upload;
const { TabPane } = Tabs;
const { CheckableTag } = Tag;
let count = 0;

const EditCustomer = (props) => {
  const [activeTab, changeTab] = useState("DETAIL");
  const [selectedTags, setselectedTags] = useState([]);
  const [form] = Form.useForm();
  const location = useLocation();
  const dispatch = useDispatch();
  let isMounted = useRef(true);
  const history = useHistory();
  const [state, setState] = useState({
    file: null,
    list: null,
    submitValues: {},
  });

  const [CustomerDetail, setCustomer] = useState("");
  const [isTag, setIsTag] = useState(false);
  useEffect(() => {
    async function fetchCustomerDetail() {
      const detail = await dispatch(getCustomerDetail(props.match.params.id));
      setCustomer(detail);

      //if (isMounted.current) setCategoryListData(getCategoryList.categoryList);
    }
    if (isMounted.current) {
      fetchCustomerDetail();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (CustomerDetail) {
      const array = [];
      CustomerDetail.custom_fields.map((field, index) => {
        if (field.type === "tag") {
          setIsTag(true);
          return field.value === true
            ? array.push(field.name)
            : selectedTags.filter((t) => t !== field.name);
        }
      });
      setselectedTags(array);
    }
  }, [CustomerDetail]);

  const OperationsSlot = {};
  const [position, setPosition] = React.useState(["left", "right"]);

  const slot = React.useMemo(() => {
    if (position.length === 0) return null;

    return position.reduce(
      (acc, direction) => ({ ...acc, [direction]: OperationsSlot[direction] }),
      {}
    );
  }, [position]);

  const handleSubmit = async (values) => {
    const edit = await dispatch(UpdateCustomer(values, props.match.params.id));
    if (edit && location.state) {
      history.push("/customers", {
        currentPage_data: location.state.current_page,
        sizeOf_data: location.state.size_data,
      });
    }
  };

  const handleSubmitAdditional = async (value) => {
    var keyCount = Object.keys(value).length;
    var arr = [];

    for (const c in value) {
      let object = {};
      object.name = c;
      object.type = "additional_detail";
      object.value = value[c];
      arr.push(object);
    }

    if (selectedTags.length > 0) {
      selectedTags.map((value) => {
        let object1 = {};
        object1.name = value;
        object1.value = true;
        object1.type = "tag";
        arr.push(object1);
      });
    }
    let obj = {
      custom_fields: arr,
    };
    const edit = await dispatch(UpdateCustomer(obj, props.match.params.id));
    if (edit) {
      history.push("/customers");
    }
  };

  const handleChange = (tag, checked) => {
    const nextSelectedTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter((t) => t !== tag);
    setselectedTags(nextSelectedTags);
  };

  const dataSource = [];
  if (Object.keys(CustomerDetail).length !== 0)
    CustomerDetail.recent_receipts.map((value) => {
      const { _id, receipt_number, created_at } = value;
      return dataSource.push({
        created_at: created_at,
        receipt_number: (
          <NavLink target="_blank" to={"receipts/" + _id}>
            <span className="receipt-color">{receipt_number}</span>
          </NavLink>
        ),
      });
    });

  const columns = [
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (created_at, record) => (
        <span>
          {commonFunction.convertToDate(record.created_at, "MMM DD, Y, h:mm A")}
        </span>
      ),
    },
    {
      title: "Receipts",
      dataIndex: "receipt_number",
      key: "receipt_number",
    },
  ];

  return (
    <>
      <Main>
        <PageHeader
          ghost
          className="comman-custom-pageheader"
          title={
            <Tabs
              type="card"
              activeKey={activeTab}
              size="small"
              onChange={changeTab}
            >
              <TabPane
                tab="Customer Details"
                key="DETAIL"
                className="ant-tabs-tab-active"
              ></TabPane>
              <TabPane tab="Customer Orders" key="ORDER_DETAIL"></TabPane>
              {console.log("CustomerDetailCustomerDetail", CustomerDetail)}
              {Object.keys(CustomerDetail).length !== 0 &&
              CustomerDetail.custom_fields.length !== 0 ? (
                <TabPane
                  tab="Additional Detail"
                  key="ADDITIONAL_DETAIL"
                ></TabPane>
              ) : (
                ""
              )}
            </Tabs>
          }
        />
        {activeTab === "DETAIL" ? (
          <Cards
            title={
              <div className="setting-card-title">
                <Heading as="h4">Customer Details</Heading>
                {Object.keys(CustomerDetail).length !== 0 ? (
                  <span>
                    Created At{" "}
                    {commonFunction.convertToDate(
                      CustomerDetail.created_at,
                      "MMM DD, Y h:mm A"
                    )}
                  </span>
                ) : (
                  ""
                )}
              </div>
            }
          >
            <Row gutter={25} justify="center">
              <Col xxl={12} md={14} sm={18} xs={24}>
                {Object.keys(CustomerDetail).length !== 0 ? (
                  <Form
                    autoComplete="off"
                    style={{ width: "100%" }}
                    form={form}
                    name="editProduct"
                    onFinish={handleSubmit}
                    className="comman-input"
                  >
                    <Form.Item
                      name="name"
                      label="Cutomer Name"
                      initialValue={CustomerDetail.name}
                      rules={[
                        {
                          max: 50,
                          message:
                            "Customer Name cannot be more than 50 characters long.",
                        },
                      ]}
                    >
                      <Input
                        style={{ marginBottom: 6 }}
                        placeholder="Customer Name"
                      />
                    </Form.Item>
                    <Form.Item
                      name="mobile"
                      label="Customer Mobile"
                      initialValue={CustomerDetail.mobile}
                      rules={[
                        {
                          message: "Please enter customer mobile number",
                          required: true,
                        },
                      ]}
                    >
                      <Input
                        style={{ marginBottom: 6 }}
                        disabled={true}
                        style={{ color: "black" }}
                        placeholder="Customer Number"
                      />
                    </Form.Item>

                    <Form.Item
                      name="email"
                      label="Customer Email"
                      initialValue={CustomerDetail.email}
                      rules={[
                        {
                          message: "Please enter valid email",
                          type: "email",
                        },
                      ]}
                    >
                      <Input
                        style={{ marginBottom: 6 }}
                        placeholder="Customer Email"
                      />
                    </Form.Item>
                    <Form.Item
                      name="shipping_address"
                      label="Shipping Address"
                      initialValue={CustomerDetail.shipping_address}
                    >
                      <Input
                        style={{ marginBottom: 6 }}
                        placeholder="Street Address"
                      />
                    </Form.Item>

                    <Form.Item
                      name="city"
                      style={{
                        display: "inline-block",
                        width: "calc(50% - 12px)",
                      }}
                      label="City"
                      initialValue={CustomerDetail.city}
                    >
                      <Input style={{ marginBottom: 6 }} placeholder="City" />
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
                      initialValue={CustomerDetail.zipcode}
                    >
                      <Input
                        type="number"
                        style={{ marginBottom: 6 }}
                        placeholder="Zipcode"
                        onKeyPress={(event) => {
                          if (event.key.match("[0-9]+")) {
                            return true;
                          } else {
                            return event.preventDefault();
                          }
                        }}
                      />
                    </Form.Item>
                    <div
                      className="add-form-action"
                      style={{ float: "right", marginTop: 15 }}
                    >
                      <Button
                        className="btn-cancel btn-custom"
                        size="medium"
                        style={{ marginRight: 10 }}
                        onClick={() =>
                          history.push("/customers", {
                            currentPage_data: location.state.current_page,
                            sizeOf_data: location.state.size_data,
                          })
                        }
                      >
                        Go Back
                      </Button>
                      <Button
                        size="medium"
                        className="btn-custom"
                        htmlType="submit"
                        type="primary"
                        raised
                      >
                        Save
                      </Button>
                    </div>
                  </Form>
                ) : (
                  ""
                )}
              </Col>
            </Row>
          </Cards>
        ) : (
          ""
        )}

        {activeTab === "ORDER_DETAIL" ? (
          <Cards
            title={
              <div className="setting-card-title">
                <Heading as="h4"> Order Details</Heading>
                <span>Last Seen At Mar 26, 2021,2:45 PM </span>
              </div>
            }
          >
            <Row>
              <Col xxl={12} md={12} sm={12} xs={24}>
                {Object.keys(CustomerDetail).length !== 0 ? (
                  <Form
                    style={{ width: "100%" }}
                    form={form}
                    name="editProduct"
                    onFinish={handleSubmit}
                    className="comman-input"
                  >
                    <Form.Item
                      name="name"
                      className="custome-label"
                      style={{
                        display: "inline-block",
                        width: "calc(50% - 12px)",
                      }}
                      label="Order Count"
                    >
                      <Tag className="custome-tag">
                        {" "}
                        {CustomerDetail.order_value}
                      </Tag>
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
                      name="name"
                      className="custome-label"
                      label="Order Value"
                      style={{
                        display: "inline-block",
                        width: "calc(50% - 12px)",
                      }}
                    >
                      <Tag className="custome-tag">
                        {" "}
                        ₹{Number(CustomerDetail.order_count).toFixed(2)}
                      </Tag>
                    </Form.Item>

                    <Form.Item
                      name="associated_name"
                      className="custome-label"
                      label="Associated Registers"
                    >
                      {CustomerDetail.associated_name != "" ? (
                        <Tag className="custome-tag">
                          {CustomerDetail.associated_name}
                        </Tag>
                      ) : (
                        "-"
                      )}
                    </Form.Item>

                    <Form.Item
                      name="last_purchase"
                      label="Last Purchase"
                      className="custome-label"
                    >
                      {CustomerDetail.last_purchase
                        ? CustomerDetail.last_purchase.map((val) => (
                            <Tag
                              className="custome-tag"
                              style={{ marginBottom: "10px" }}
                            >
                              {val.item}
                            </Tag>
                          ))
                        : "-"}
                    </Form.Item>
                    <label></label>
                  </Form>
                ) : (
                  ""
                )}
              </Col>
              <Col xxl={12} md={12} sm={12} xs={24}>
                <Form.Item
                  name="name"
                  className="custome-table"
                  label="Recent Receipts"
                >
                  <Table
                    dataSource={dataSource}
                    columns={columns}
                    size="small"
                    style={{ marginTop: "8px" }}
                    pagination={{
                      pageSize: 5,
                      total: dataSource.length,
                    }}
                    rowClassName="invoice-table"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Cards>
        ) : (
          ""
        )}

        {activeTab === "ADDITIONAL_DETAIL" ? (
          <Cards
            title={
              <div className="setting-card-title">
                <Heading as="h4">Addional Details</Heading>
                <span>Update addditional details and custom tags.</span>
              </div>
            }
          >
            <Row gutter={25} justify="center">
              <Col xxl={12} md={14} sm={18} xs={24}>
                {Object.keys(CustomerDetail).length !== 0 ? (
                  <Form
                    style={{ width: "100%" }}
                    form={form}
                    name="editProduct"
                    onFinish={handleSubmitAdditional}
                  >
                    {CustomerDetail.custom_fields.map((field, index, i) =>
                      field.type === "additional_detail" ? (
                        <Form.Item
                          name={field.name}
                          label={field.name}
                          initialValue={field.value}
                          className="comman-input"
                        >
                          <Input
                            style={{ marginBottom: 6 }}
                            placeholder={field.name}
                          />
                        </Form.Item>
                      ) : (
                        ""
                      )
                    )}

                    {isTag && (
                      <>
                        <h3 style={{ marginTop: 20 }}>Customer Tags</h3>
                      </>
                    )}
                    <div style={{ display: "flex" }}>
                      {CustomerDetail.custom_fields.map((field, index, i) =>
                        field.type === "tag" ? (
                          <>
                            <Form.Item>
                              {console.log("field=>", field)}
                              <CheckableTag
                                className={field.tag_color}
                                style={{
                                  border: "1px solid " + field.tag_color,
                                  color: field.tag_color,
                                }}
                                key={field.name}
                                checked={selectedTags.indexOf(field.name) > -1}
                                onChange={(checked) =>
                                  handleChange(field.name, checked)
                                }
                              >
                                {field.name}
                              </CheckableTag>
                            </Form.Item>
                          </>
                        ) : (
                          ""
                        )
                      )}
                    </div>
                    <div
                      className="add-form-action"
                      style={{ float: "right", marginTop: "10px" }}
                    >
                      <Button
                        className="btn-cancel btn-custom"
                        size="medium"
                        style={{ marginRight: 10 }}
                        onClick={() =>
                          history.push("/customers", {
                            currentPage_data: location.state.current_page,
                            sizeOf_data: location.state.size_data,
                          })
                        }
                      >
                        Go Back
                      </Button>
                      <Button
                        size="medium"
                        className="btn-custom"
                        htmlType="submit"
                        type="primary"
                        raised
                      >
                        Save
                      </Button>
                    </div>
                  </Form>
                ) : (
                  ""
                )}
              </Col>
            </Row>
          </Cards>
        ) : (
          ""
        )}
      </Main>
    </>
  );
};

export default EditCustomer;
