import React, { useState } from "react";
import { Row, Col, Form, Input, Select, Upload, Space, Button } from "antd";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Cards } from "../../../components/cards/frame/cards-frame";
import { Main } from "../../styled";
import { AddProductForm } from "../../Product/Style";
import "../option.css";
import {
  AddVariantBulk,
  getAllVariantList,
} from "../../../redux/variant/actionCreator";

const AddVariant = () => {
  const [form] = Form.useForm();
  const history = useHistory();
  const dispatch = useDispatch();
  let [isDisabled, setDisabled] = useState(true);

  const handleSubmit = async (formData) => {
    const Obj = {};
    Obj.variant_name = formData.variant_name;
    Obj.comment = formData.comment;
    Obj.sort_order = formData.sort_order;
    Obj.price = formData.price;

    const dataSource = [Obj];
    if (formData.variants && formData.variants.length > 0) {
      dataSource.push(...formData.variants);
    }
    const getVariants = await dispatch(AddVariantBulk(dataSource));
    if (getVariants) {
      const list = await dispatch(getAllVariantList());
      if (list) {
        history.goBack();
      }
    }
  };
  const changeStatus = (e) => {
    if (e !== "") {
      setDisabled(!isDisabled);
    } else {
      setDisabled(isDisabled);
    }
  };
  return (
    <>
      <Main className="padding-top-form" style={{ paddingTop: 30 }}>
        <Cards headless>
          <Form autoComplete="off" size="large" onFinish={handleSubmit}>
            <AddProductForm style={{ margin: 0 }}>
              <Row>
                <Col xs={24} xl={6} className="gutter-box">
                  <Form.Item
                    className="ant-form-item-no-colon"
                    label="Variant Name"
                    name="variant_name"
                    rules={[
                      {
                        min: 3,
                        message:
                          "Variant name must be at least 3 characters long.",
                      },
                      {
                        max: 60,
                        message:
                          "Variant name cannot be more than 60 characters long",
                      },
                      { required: true, message: "Variant name is required" },
                    ]}
                  >
                    <Input
                      onBlur={(e) => changeStatus(e.target.value)}
                      placeholder="Variant Name"
                      className="input-text"
                    />
                  </Form.Item>
                </Col>
                <Space></Space>
                <Col xs={24} xl={6} className="gutter-box">
                  <Form.Item label="Comment" name="comment">
                    <Input
                      placeholder="Comment (Optional)"
                      className="input-text"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} xl={4} className="gutter-box">
                  <Form.Item
                    label="Price"
                    name="price"
                    rules={[
                      {
                        pattern: new RegExp(
                          /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/
                        ),
                        message: "Price should be a positive number.",
                      },
                      { required: true, message: "Variant price is required" },
                    ]}
                  >
                    <Input
                      type="number"
                      step="any"
                      min={0}
                      initialValue={0}
                      placeholder="Price"
                      className="input-text"
                      onKeyPress={(event) => {
                        if (event.key.match("[0-9,.]+")) {
                          return true;
                        } else {
                          return event.preventDefault();
                        }
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} xl={5} className="gutter-box">
                  <Form.Item label="Sort order" name="sort_order">
                    <Input
                      type="number"
                      min={0}
                      initialValue={0}
                      placeholder="Sort Order (Optional)"
                      className="input-text"
                      onKeyPress={(event) => {
                        if (event.key.match("[0-9]+")) {
                          return true;
                        } else {
                          return event.preventDefault();
                        }
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} xl={2} className="gutter-box">
                  <Form.Item
                    label="Action"
                    className="action-class"
                  ></Form.Item>
                </Col>
              </Row>
              <Form.List name="variants">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map((field, index) => (
                      <Row key={field.key} style={{ marginBottom: 8 }}>
                        <Form.Item
                          noStyle
                          shouldUpdate={(prevValues, curValues) =>
                            prevValues.area !== curValues.area ||
                            prevValues.sights !== curValues.sights
                          }
                        >
                          {() => (
                            <>
                              <Col xs={24} xl={6} className="gutter-box">
                                <Form.Item
                                  {...field}
                                  name={[field.name, "variant_name"]}
                                  fieldKey={[field.fieldKey, "variant_name"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Variant Name Required",
                                    },
                                  ]}
                                >
                                  <Input
                                    placeholder="Variant Name"
                                    className="input-text"
                                  />
                                </Form.Item>
                              </Col>
                              <Col xs={24} xl={6} className="gutter-box">
                                <Form.Item
                                  {...field}
                                  name={[field.name, "comment"]}
                                  fieldKey={[field.fieldKey, "comment_name"]}
                                >
                                  <Input
                                    placeholder="Comment (Optional)"
                                    className="input-text"
                                  />
                                </Form.Item>
                              </Col>
                              <Col xs={24} xl={4} className="gutter-box">
                                <Form.Item
                                  {...field}
                                  name={[field.name, "price"]}
                                  fieldKey={[field.fieldKey, "price"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Price Required",
                                    },
                                  ]}
                                >
                                  <Input
                                    type="number"
                                    min={0}
                                    initialValue={0}
                                    placeholder="Price"
                                    className="input-text"
                                    onKeyPress={(event) => {
                                      if (event.key.match("[0-9,.]+")) {
                                        return true;
                                      } else {
                                        return event.preventDefault();
                                      }
                                    }}
                                  />
                                </Form.Item>
                              </Col>
                              <Col xs={24} xl={5} className="gutter-box">
                                <Form.Item
                                  {...field}
                                  name={[field.name, "sort_order"]}
                                  fieldKey={[field.fieldKey, "sort_order"]}
                                >
                                  <Input
                                    type="number"
                                    min={0}
                                    initialValue={0}
                                    placeholder="Sort Order (Optional)"
                                    className="input-text"
                                    style={{ width: "100%" }}
                                    onKeyPress={(event) => {
                                      if (event.key.match("[0-9]+")) {
                                        return true;
                                      } else {
                                        return event.preventDefault();
                                      }
                                    }}
                                  />
                                </Form.Item>
                              </Col>
                              <Col xs={24} xl={2} className="gutter-box">
                                <Form.Item {...field} className="action-class">
                                  <DeleteOutlined
                                    onClick={() => remove(field.name)}
                                  />
                                </Form.Item>
                              </Col>
                            </>
                          )}
                        </Form.Item>
                      </Row>
                    ))}
                    <div style={{ marginLeft: 9 }}>
                      <Form.Item>
                        <Button
                          type="primary"
                          info
                          disabled={isDisabled}
                          style={{ marginBottom: 10 }}
                          size="medium"
                          onClick={() => add()}
                          icon={<PlusOutlined />}
                        >
                          Add Variant
                        </Button>
                      </Form.Item>

                      <Form.Item>
                        <Button
                          size="medium"
                          onClick={history.goBack}
                          style={{ marginRight: 10 }}
                        >
                          Go Back
                        </Button>
                        <Button
                          type="primary"
                          info
                          htmlType="submit"
                          size="medium"
                        >
                          Submit
                        </Button>
                      </Form.Item>
                    </div>
                  </>
                )}
              </Form.List>
            </AddProductForm>
          </Form>
        </Cards>
      </Main>
    </>
  );
};

export default AddVariant;
