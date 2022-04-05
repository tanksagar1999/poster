import React, { useState, useRef, useEffect } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { Row, Col, Form, Input, Select, Space, Button } from "antd";
import { useDispatch } from "react-redux";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Cards } from "../../components/cards/frame/cards-frame";
import { Main } from "../styled";
import "./product.css";

import {
  getAllCategoriesList,
  addProduct,
  getAllProductList,
} from "../../redux/products/actionCreator";
import { getTaxGroupList } from "../../redux/taxGroup/actionCreator";

const AddProduct = () => {
  const history = useHistory();
  let isMounted = useRef(true);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  let [productCategoryList, setProductCategoryList] = useState([]);
  let [isDisabled, setDisabled] = useState(true);
  let [category, setcategory] = useState();
  let [taxGroup, setTaxGroup] = useState();
  let [name, setname] = useState(false);
  let [taxGroupList, setTaxGroupList] = useState([]);

  useEffect(() => {
    async function fetchProductCategoryList() {
      const getProductCategoryList = await dispatch(getAllCategoriesList());
      if (isMounted.current) {
        setProductCategoryList(getProductCategoryList.categoryList);
      }
    }
    async function fetchTaxGroupList() {
      const taxGroupList = await dispatch(getTaxGroupList());
      if (isMounted.current) {
        setTaxGroupList(taxGroupList.taxGroupList);
      }
      77;
    }
    if (isMounted.current) {
      fetchProductCategoryList();
      fetchTaxGroupList();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleSubmit = async (formData) => {
    const Obj = {};
    Obj.product_name = formData.product_name;
    Obj.product_category = formData.product_category;
    Obj.tax_group = formData.tax_group;
    Obj.price = formData.price;
    Obj.sort_order = formData.sort_order;
    const dataSource = [Obj];
    if (formData.products && formData.products.length > 0) {
      dataSource.push(...formData.products);
    }

    const getAddedProduct = await dispatch(addProduct(dataSource));
    if (getAddedProduct) {
      const getProductList = await dispatch(getAllProductList());
      if (getProductList && getProductList.productList) {
        history.goBack();
      }
    }
  };

  const changeStatus = (e) => {
    if (e.target.value !== "") {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  };

  const handleDelete = () => {
    if (name) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  };

  const handleInputCheck = async () => {
    try {
      const values = await form.validateFields();
    } catch (errorInfo) {}
  };
  const handleFormChange = (item, allFileds) => {
    allFileds.splice(-1);
    if (
      allFileds.find((val, index) => val.value == undefined || val.value == "")
    ) {
      setDisabled(true);
      return true;
    } else {
      setDisabled(false);
      return true;
    }
  };
  return (
    <>
      <Main className="padding-top-form" style={{ paddingTop: 30 }}>
        <Cards headless>
          <Form
            autoComplete="off"
            size="large"
            onFinish={handleSubmit}
            onFinishFailed={(errorInfo) => console.log("errorInfo", errorInfo)}
            onFieldsChange={(val, allFileds) =>
              handleFormChange(val, allFileds)
            }
          >
            <Row>
              <Col xs={24} xl={6} className="gutter-box">
                <Form.Item
                  label="Product Name"
                  name="product_name"
                  rules={[
                    {
                      min: 3,
                      message:
                        "Product name must be at least 3 characters long",
                    },
                    {
                      max: 50,
                      message:
                        "Product name cannot be more than 50 characters long.",
                    },
                    { required: true, message: "Product name is required" },
                  ]}
                >
                  <Input
                    onBlur={(e) => {
                      e.target.value !== "" ? setname(true) : setname(false);
                    }}
                    className="input-text"
                    placeholder="Product Name"
                    onChange={changeStatus}
                  />
                </Form.Item>
              </Col>
              <Space></Space>
              <Col xs={24} xl={6} className="gutter-box">
                <Form.Item
                  className="custom-input-text"
                  name="product_category"
                  label="Select Category"
                  rules={[
                    {
                      required: true,
                      message: "Product Category is Required",
                    },
                  ]}
                >
                  <Select
                    className="high_addpd"
                    showSearch
                    onChange={(val) => setcategory(val)}
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    placeholder="Select Category"
                    dropdownRender={(menu) => (
                      <div>
                        {menu}
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "nowrap",
                            padding: 8,
                          }}
                        >
                          <NavLink
                            to="product-categories/add"
                            style={{
                              flex: "none",
                              padding: "8px",
                              display: "block",
                              cursor: "pointer",
                            }}
                          >
                            <PlusOutlined /> Add New Category
                          </NavLink>
                        </div>
                      </div>
                    )}
                  >
                    {productCategoryList.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.category_name}
                      </option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} xl={6} className="gutter-box">
                <Form.Item
                  label="Select Tax Group"
                  name="tax_group"
                  rules={[
                    {
                      required: true,
                      message: "Tax Group is Required.",
                    },
                  ]}
                >
                  <Select
                    className="high_addpd"
                    showSearch
                    onChange={(val) => setTaxGroup(val)}
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    dropdownRender={(menu) => (
                      <div>
                        {menu}
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "nowrap",
                            padding: 8,
                          }}
                        >
                          <NavLink
                            to="/settings/taxgroup/add/taxes_group"
                            style={{
                              flex: "none",
                              padding: "8px",
                              display: "block",
                              cursor: "pointer",
                            }}
                          >
                            <PlusOutlined /> Add New tax group
                          </NavLink>
                        </div>
                      </div>
                    )}
                    placeholder="Select Tax Group"
                  >
                    {taxGroupList.map((taxGrp) => (
                      <option key={taxGrp._id} value={taxGrp._id}>
                        {taxGrp.tax_group_name}
                      </option>
                    ))}
                  </Select>
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
                      message: "Product price should be a positive number.",
                    },
                    {
                      required: true,
                      message: "Product price should be a positive number.",
                    },
                  ]}
                >
                  <Input
                    type="number"
                    min={0}
                    step="any"
                    onChange={(e) => changeStatus(e)}
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
              <Col xs={24} xl={2} className="gutter-box">
                <Form.Item label="Action" className="action-class"></Form.Item>
              </Col>
            </Row>
            <Form.List name="products">
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
                                name={[field.name, "product_name"]}
                                fieldKey={[field.fieldKey, "product_name"]}
                                rules={[
                                  {
                                    min: 3,
                                    message:
                                      "Product name must be at least 3 characters long",
                                  },
                                  {
                                    max: 50,
                                    message:
                                      "Product name cannot be more than 50 characters long.",
                                  },
                                  {
                                    required: true,
                                    message: "Product name is required.",
                                  },
                                ]}
                              >
                                <Input
                                  placeholder="Product Name"
                                  className="input-text"
                                  onChange={(e) => changeStatus(e)}
                                />
                              </Form.Item>
                            </Col>
                            <Col xs={24} xl={6} className="gutter-box">
                              <Form.Item
                                {...field}
                                fieldKey={[field.fieldKey, "product_category"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Please select product category",
                                  },
                                ]}
                                name={[field.name, "product_category"]}
                              >
                                <Select
                                  placeholder="Select Category"
                                  showSearch
                                  filterOption={(input, option) =>
                                    option.children
                                      .toLowerCase()
                                      .indexOf(input.toLowerCase()) >= 0
                                  }
                                  dropdownRender={(menu) => (
                                    <div>
                                      {menu}
                                      <div
                                        style={{
                                          display: "flex",
                                          flexWrap: "nowrap",
                                          padding: 8,
                                        }}
                                      >
                                        <NavLink
                                          to="product-categories/add"
                                          style={{
                                            flex: "none",
                                            padding: "8px",
                                            display: "block",
                                            cursor: "pointer",
                                          }}
                                        >
                                          <PlusOutlined /> Add New Category
                                        </NavLink>
                                      </div>
                                    </div>
                                  )}
                                >
                                  {productCategoryList.map((category) => (
                                    <option
                                      key={category._id}
                                      value={category._id}
                                    >
                                      {category.category_name}
                                    </option>
                                  ))}
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col xs={24} xl={6} className="gutter-box">
                              <Form.Item
                                {...field}
                                fieldKey={[field.fieldKey, "tax_group"]}
                                name={[field.name, "tax_group"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Please select tax group",
                                  },
                                ]}
                              >
                                <Select
                                  placeholder="Select Tax Group"
                                  showSearch
                                  filterOption={(input, option) =>
                                    option.children
                                      .toLowerCase()
                                      .indexOf(input.toLowerCase()) >= 0
                                  }
                                  dropdownRender={(menu) => (
                                    <div>
                                      {menu}
                                      <div
                                        style={{
                                          display: "flex",
                                          flexWrap: "nowrap",
                                          padding: 8,
                                        }}
                                      >
                                        <NavLink
                                          to="/settings/taxgroup/add/taxes_group"
                                          style={{
                                            flex: "none",
                                            padding: "8px",
                                            display: "block",
                                            cursor: "pointer",
                                          }}
                                        >
                                          <PlusOutlined /> Add New Tax Group
                                        </NavLink>
                                      </div>
                                    </div>
                                  )}
                                >
                                  {taxGroupList.map((taxGrp) => (
                                    <option key={taxGrp._id} value={taxGrp._id}>
                                      {taxGrp.tax_group_name}
                                    </option>
                                  ))}
                                </Select>
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
                                    message: "Please enter product price",
                                  },
                                ]}
                              >
                                <Input
                                  type="number"
                                  min={0}
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
                            <Col xs={24} xl={2} className="gutter-box">
                              <Form.Item {...field} className="action-class">
                                <DeleteOutlined
                                  onClick={() => {
                                    remove(field.name), handleDelete();
                                  }}
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
                        onClick={() => {
                          add(), setDisabled(true), handleInputCheck();
                        }}
                        icon={<PlusOutlined />}
                      >
                        Add Product
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
          </Form>
        </Cards>
      </Main>
    </>
  );
};

export default AddProduct;
