import React, { useState, useRef, useEffect } from "react";
import { Checkbox, Row, Col, Input, Form, Select, Radio, Tag } from "antd";
import { Cards } from "../../../../../components/cards/frame/cards-frame";
import Heading from "../../../../../components/heading/heading";
import { Button } from "../../../../../components/buttons/buttons";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import "../../setting.css";
import {
  addOrUpdateCustomField,
  getCutomeFieldById,
  getAllPattyCashList,
  getAllPaymentTypeList,
  getAllAddtionalList,
  getAllTagList,
} from "../../../../../redux/customField/actionCreator";
const AddCustomField = ({ match }) => {
  const [form] = Form.useForm();
  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation();
  let isMounted = useRef(true);
  const [checked, setChecked] = useState(false);
  const [CustomFieldData, setCustomFieldData] = useState();
  const types = match.params.type;
  const [PattyCashCategorieList, setPattyCashCategorieList] = useState([]);

  useEffect(() => {
    async function fetchPattyCashList() {
      const getPattyCashList = await dispatch(getAllPattyCashList("sell"));
      if (
        isMounted.current &&
        getPattyCashList &&
        getPattyCashList.PattyCashList
      )
        setPattyCashCategorieList(getPattyCashList.PattyCashList);
    }
    if (isMounted.current) {
      fetchPattyCashList();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    async function fetchCustomFieldData() {
      if (location.state) {
        const getCustomFieldData = await dispatch(
          getCutomeFieldById(location.state.CutomeField_id, types)
        );
        if (isMounted.current)
          setCustomFieldData(getCustomFieldData.CustomFieldIdData);
      }
    }
    if (isMounted.current) {
      fetchCustomFieldData();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);
  useEffect(() => {
    if (CustomFieldData) {
      form.setFieldsValue({
        name: CustomFieldData.name,
        type: CustomFieldData.type,
        description: CustomFieldData.description,
        sub_type: CustomFieldData.sub_type,
        tag_color: CustomFieldData.tag_color,
        print_this_field_on_receipts: CustomFieldData.print_this_field_on_receipts
          ? setChecked(true)
          : "",
      });
    }
  }, [CustomFieldData]);

  const handleSubmit = async (formData) => {
    formData.type = match.params.type;
    formData.print_this_field_on_receipts = checked;
    let custom_field_id =
      location && location.state ? location.state.CutomeField_id : null;
    const getAddedCustomField = await dispatch(
      addOrUpdateCustomField(formData, custom_field_id)
    );
    if (
      getAddedCustomField &&
      getAddedCustomField.CustomFieldData &&
      !getAddedCustomField.CustomFieldData.error
    ) {
      if (match.params.type == "payment_type") {
        const getPaymentTypeList = await dispatch(getAllPaymentTypeList());
        if (getPaymentTypeList && getPaymentTypeList.PaymentTypeList) {
          history.push(`/settings/custom-fields?type=${match.params.type}`);
        }
      } else if (match.params.type == "petty_cash_category") {
        const getPattyCashList = await dispatch(getAllPattyCashList());
        if (getPattyCashList && getPattyCashList.PattyCashList) {
          history.push(`/settings/custom-fields?type=${match.params.type}`);
        }
      } else if (match.params.type == "additional_detail") {
        const getAddtionalList = await dispatch(getAllAddtionalList());
        if (getAddtionalList && getAddtionalList.AddtionalList) {
          history.push(`/settings/custom-fields?type=${match.params.type}`);
        }
      } else if (match.params.type == "tag") {
        const getTagList = await dispatch(getAllTagList());
        if (getTagList && getTagList.TagList) {
          history.push(`/settings/custom-fields?type=${match.params.type}`);
        }
      }
    }
  };

  return (
    <>
      <Cards
        title={
          <div className="setting-card-title">
            <Heading as="h4">Setup Custom Fields</Heading>
            <span>
              You can setup custom fields like Payment Types, Petty Cash
              Categories, Receipt Additional Details and Tags.
            </span>
          </div>
        }
      >
        <Row gutter={25} justify="center">
          <Col xxl={12} md={14} sm={18} xs={24}>
            <Form form={form} onFinish={handleSubmit}>
              {types == "payment_type" ? (
                <>
                  <Form.Item
                    name="name"
                    label="Payment Type"
                    rules={[
                      {
                        min: 2,
                        message:
                          "Payment name must be at least 2 characters long",
                      },
                      {
                        max: 40,
                        message:
                          "Payment name cannot be more than 40 characters long.",
                      },
                      {
                        required: true,
                        message: "Payment name is required.",
                      },
                    ]}
                  >
                    <Input
                      style={{ marginBottom: 10 }}
                      placeholder="Payment Type"
                      autoComplete="off"
                    />
                  </Form.Item>
                  <Form.Item name="description" label="Description">
                    <Input
                      style={{ marginBottom: 10 }}
                      placeholder="Description(Optional)"
                      autoComplete="off"
                    />
                  </Form.Item>
                </>
              ) : (
                ""
              )}
              {types == "petty_cash_category" ? (
                <>
                  <Form.Item
                    name="name"
                    label="Petty Cash Category Name"
                    rules={[
                      {
                        min: 2,
                        message:
                          "Custom field name must be at least 2 characters long",
                      },
                      {
                        max: 40,
                        message:
                          "Custom name cannot be more than 40 characters long.",
                      },
                      {
                        required: true,
                        message: "Custom field name is required",
                      },
                      {
                        validator: (_, value) => {
                          if (CustomFieldData) {
                            if (CustomFieldData.name == value) {
                              return Promise.resolve();
                            } else {
                              let val = PattyCashCategorieList.find(
                                (category) => category.name === value
                              );
                              if (val === undefined) {
                                return Promise.resolve();
                              } else {
                                return Promise.reject(
                                  "A petty cash category with this name already exists"
                                );
                              }
                            }
                          } else {
                            let val = PattyCashCategorieList.find(
                              (category) => category.name === value
                            );
                            if (val === undefined) {
                              return Promise.resolve();
                            } else {
                              return Promise.reject(
                                "A petty cash category with this name already exists"
                              );
                            }
                          }
                        },
                      },
                    ]}
                  >
                    <Input
                      style={{ marginBottom: 10 }}
                      placeholder="Petty Cash Category Name"
                      autoComplete="off"
                    />
                  </Form.Item>

                  <Form.Item name="description" label="Description">
                    <Input
                      style={{ marginBottom: 10 }}
                      placeholder="Description(Optional)"
                      autoComplete="off"
                    />
                  </Form.Item>
                </>
              ) : (
                ""
              )}

              {types == "additional_detail" ? (
                <>
                  <Form.Item
                    name="name"
                    label="Additional Detail Name"
                    rules={[
                      {
                        min: 2,
                        message:
                          "Custom field name must be at least 2 characters long",
                      },
                      {
                        max: 40,
                        message:
                          "Custom name cannot be more than 40 characters long.",
                      },
                      {
                        required: true,
                        message: "Custom field name is required",
                      },
                    ]}
                  >
                    <Input
                      style={{ marginBottom: 10 }}
                      placeholder="Additional Detail Name"
                      autoComplete="off"
                    />
                  </Form.Item>
                  <Form.Item
                    name="sub_type"
                    label="Additional Detail Type"
                    rules={[
                      {
                        required: true,
                        message: "Custom field type is required",
                      },
                    ]}
                  >
                    <Select
                      style={{ width: "100%", marginBottom: 10 }}
                      placeholder="Select Additional Detail"
                    >
                      <Option value="customer">Customer Data</Option>
                      <Option value="sale">Sale Data</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item name="print_this_field_on_receipts">
                    <Checkbox
                      className="add-form-check"
                      checked={checked}
                      onChange={(e) => setChecked(e.target.checked)}
                    >
                      Print this field on receipts
                    </Checkbox>
                  </Form.Item>
                </>
              ) : (
                ""
              )}
              {types == "tag" ? (
                <>
                  <Form.Item
                    name="name"
                    label="Tag Name"
                    rules={[
                      {
                        min: 2,
                        message:
                          "Custom field name must be at least 2 characters long",
                      },
                      {
                        max: 40,
                        message:
                          "Tag name cannot be more than 40 characters long.",
                      },

                      {
                        required: true,
                        message: "Custom field name is required",
                      },
                    ]}
                  >
                    <Input
                      style={{ marginBottom: 10 }}
                      placeholder="Tag Name"
                      autoComplete="off"
                    />
                  </Form.Item>
                  <Form.Item
                    name="sub_type"
                    label="Tag Type"
                    rules={[
                      {
                        required: true,
                        message: "Custom field type is required",
                      },
                    ]}
                  >
                    <Select
                      style={{ width: "100%" }}
                      placeholder="Select Tag Type"
                    >
                      <Option value="customer">Customer Data</Option>
                      <Option value="sale">Sale Data</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="tag_color"
                    label="Select a color to highlight this tag?"
                    initialValue="Red"
                  >
                    <Radio.Group className="cust_rabt">
                      <Radio value="Red">
                        <Tag
                          color="#f50"
                          style={{ cursor: "pointer" }}
                          type="medium"
                        >
                          Red
                        </Tag>
                      </Radio>
                      <Radio value="Blue">
                        <Tag color="#4169E1" style={{ cursor: "pointer" }}>
                          Blue
                        </Tag>
                      </Radio>
                      <Radio value="Green">
                        <Tag color="#2E8B57" style={{ cursor: "pointer" }}>
                          Green
                        </Tag>
                      </Radio>
                      <Radio value="Orange">
                        <Tag color="#FF8C00" style={{ cursor: "pointer" }}>
                          Orange
                        </Tag>
                      </Radio>
                      <Radio value="Purple">
                        <Tag color="#800080" style={{ cursor: "pointer" }}>
                          Purple
                        </Tag>
                      </Radio>
                    </Radio.Group>
                  </Form.Item>

                  <Form.Item name="print_this_field_on_receipts">
                    <Checkbox
                      className="add-form-check"
                      checked={checked}
                      onChange={(e) => setChecked(e.target.checked)}
                    >
                      Print this field on receipts
                    </Checkbox>
                  </Form.Item>
                </>
              ) : (
                ""
              )}
              <Form.Item style={{ float: "right" }}>
                <Button
                  className="go-back-button"
                  size="small"
                  type="white"
                  style={{ marginRight: "10px" }}
                  onClick={() => {
                    history.push(
                      `/settings/custom-fields?type=${match.params.type}`
                    );
                  }}
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

export default AddCustomField;
