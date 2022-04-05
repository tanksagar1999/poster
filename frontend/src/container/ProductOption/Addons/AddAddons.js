import React, { useState } from "react";
import { Row, Col, Form, Input, message, Space, Button } from "antd";
import { useDispatch } from "react-redux";
import { useHistory, NavLink } from "react-router-dom";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import FeatherIcon from "feather-icons-react";
import { Cards } from "../../../components/cards/frame/cards-frame";
import { Main } from "../../styled";
import { AddProductForm } from "../../Product/Style";
import "../option.css";
import {
  AddAddonBulk,
  getAllAddonList,
} from "../../../redux/addon/actionCreator";

const AddAddon = () => {
  const [form] = Form.useForm();
  const history = useHistory();
  const dispatch = useDispatch();
  const [state, setState] = useState({
    file: null,
    list: null,
    submitValues: {},
  });
  let [isDisabled, setDisabled] = useState(true);

  const handleSubmit = async (formData) => {
    const Obj = {};
    Obj.addon_name = formData.addon_name;
    Obj.sort_order = formData.sort_order;
    Obj.price = formData.price;

    const dataSource = [Obj];
    if (formData.addon && formData.addon.length > 0) {
      dataSource.push(...formData.addon);
    }
    const getAddons = await dispatch(AddAddonBulk(dataSource));
    if (getAddons) {
      let list = await dispatch(getAllAddonList());
      if (list) {
        history.push("/product-options?type=addon");
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

  const fileList = [
    {
      uid: "1",
      name: "1.png",
      status: "done",
      url: "",
      thumbUrl: "",
    },
  ];

  const fileUploadProps = {
    name: "file",
    multiple: true,
    action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        setState({ ...state, file: info.file, list: info.fileList });
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    listType: "picture",
    defaultFileList: fileList,
    showUploadList: {
      showRemoveIcon: true,
      removeIcon: (
        <FeatherIcon
          icon="trash-2"
          onClick={(e) => console.log(e, "custom removeIcon event")}
        />
      ),
    },
  };

  return (
    <>
      <Main className="padding-top-form" style={{ paddingTop: 30 }}>
        <Cards headless>
          <Form autoComplete="off" size="large" onFinish={handleSubmit}>
            <AddProductForm style={{ margin: 0 }}>
              <Row>
                <Col xs={24} xl={8} className="gutter-box">
                  <Form.Item
                    label="Addon Name"
                    name="addon_name"
                    rules={[
                      {
                        min: 3,
                        message:
                          "Addon name must be at least 3 characters long.",
                      },
                      {
                        max: 60,
                        message:
                          "Addon name cannot be more than 60 characters long.",
                      },
                      { required: true, message: "Addon Name Required" },
                    ]}
                  >
                    <Input
                      onBlur={(e) => changeStatus(e.target.value)}
                      placeholder="Addon Name"
                      className="input-text"
                    />
                  </Form.Item>
                </Col>
                <Space></Space>

                <Col xs={24} xl={7} className="gutter-box">
                  <Form.Item
                    label="Price"
                    name="price"
                    rules={[
                      {
                        pattern: new RegExp(
                          /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/
                        ),
                        message: "Addon price should be a positive number.",
                      },
                      {
                        required: true,
                        message: "Addon price should be a positive number.",
                      },
                    ]}
                  >
                    <Input
                      type="number"
                      min={0}
                      step="any"
                      onChange={(e) => changeStatus()}
                      initialValue={0}
                      className="input-text"
                      placeholder="Price"
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
                <Col xs={24} xl={7} className="gutter-box">
                  <Form.Item label="Sort order" name="sort_order">
                    <Input
                      placeholder="Sort Order (Optional)"
                      type="number"
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
                <Col xs={24} xl={2} className="gutter-box"></Col>
              </Row>
              <Form.List name="addon">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map((field, index) => (
                      <Row key={field.key} style={{ marginBottom: 8 }}>
                        <Col xs={24} xl={8} className="gutter-box">
                          <Form.Item
                            {...field}
                            name={[field.name, "addon_name"]}
                            fieldKey={[field.fieldKey, "addon_name"]}
                            rules={[
                              {
                                min: 3,
                                message:
                                  "Addon name must be at least 3 characters long.",
                              },
                              {
                                required: true,
                                message: "Addon Name Required",
                              },
                            ]}
                          >
                            <Input
                              placeholder="Addon Name"
                              className="input-text"
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} xl={7} className="gutter-box">
                          <Form.Item
                            {...field}
                            name={[field.name, "price"]}
                            fieldKey={[field.fieldKey, "price"]}
                            rules={[
                              {
                                pattern: new RegExp(
                                  /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/
                                ),
                                message:
                                  "Addon price should be a positive number.",
                              },
                              { required: true, message: "Price Required" },
                            ]}
                          >
                            <Input
                              min={0}
                              step="any"
                              type="number"
                              initialValue={0}
                              placeholder="Price"
                              className="input-text"
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} xl={7} className="gutter-box">
                          <Form.Item
                            {...field}
                            name={[field.name, "sort_order"]}
                            fieldKey={[field.fieldKey, "sort_order"]}
                          >
                            <Input
                              placeholder="Sort Order (Optional)"
                              min={0}
                              initialValue={0}
                              type="number"
                              className="input-text"
                              // style={{ width: "90px" }}
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
                          Add Addon
                        </Button>
                      </Form.Item>
                      <Form.Item>
                        <NavLink to="/product-options?type=addon">
                          <Button
                            size="medium"
                            onClick={history.goBack}
                            style={{ marginRight: 10 }}
                          >
                            Go Back
                          </Button>
                        </NavLink>

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

export default AddAddon;
