import React, { useState, useEffect, useRef } from "react";
import {
  Row,
  Col,
  Form,
  Input,
  InputNumber,
  Select,
  Tooltip,
  Button,
} from "antd";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { InfoCircleFilled } from "@ant-design/icons";
import { Cards } from "../../../components/cards/frame/cards-frame";
import { Main } from "../../styled";
import Heading from "../../../components/heading/heading";
import { getItem } from "../../../utility/localStorageControl";

import "../category.css";

import {
  addOrUpdateProductCategory,
  getProductCategoryById,
  getAllOrderTicketGroupedList,
  getAllCategoriesList,
  getAllProductList,
} from "../../../redux/products/actionCreator";

const { Option } = Select;

const AddProductCategory = () => {
  const history = useHistory();
  const location = useLocation();
  let isMounted = useRef(true);
  const [form] = Form.useForm();
  const [state, setState] = useState({
    submitValues: {},
  });
  let [orderTicketGroupListData, setOrderTicketGroupListData] = useState([]);
  const dispatch = useDispatch();
  let [productCategoryData, setProductCategoryData] = useState({});

  useEffect(() => {
    async function fetchProductCategory() {
      if (location.state) {
        const getProductCategory = await dispatch(
          getProductCategoryById(location.state.product_category_id)
        );

        if (isMounted.current) {
          setProductCategoryData(getProductCategory.categoryData);
        }
      }
    }
    async function fetchGroupedTicketOrder() {
      const getOrderedTicketGroupList = await dispatch(
        getAllOrderTicketGroupedList("sell")
      );
      if (isMounted.current)
        setOrderTicketGroupListData(
          getOrderedTicketGroupList.orderTicketGroupList
        );
      getOrderedTicketGroupList.orderTicketGroupList.map((value) => {
        if (value.order_ticket_group_name === "Main Kitchen") {
          form.setFieldsValue({
            order_ticket_group: value._id,
          });
        }
      });
    }

    if (isMounted.current) {
      fetchGroupedTicketOrder();
      fetchProductCategory();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (Object.keys(productCategoryData).length) {
      setState({
        ...state,
        productCategoryData,
      });
      console.log("productCategoryData", productCategoryData);
      form.setFieldsValue({
        category_name: productCategoryData.category_name,
        order_ticket_group:
          productCategoryData.order_ticket_group == null
            ? "noOrdertiket"
            : productCategoryData.order_ticket_group,
        sort_order: productCategoryData.sort_order,
      });
    }
  }, [productCategoryData]);

  const handleSubmit = async (formData) => {
    setState({
      ...state,
      submitValues: formData,
    });
    let submitData = {};
    // if (formData.order_ticket_group !== "undefine") {
    //   submitData = formData;
    // } else {
    submitData.category_name = formData.category_name;
    submitData.sort_order = formData.sort_order;
    // }
    let product_category_id =
      location && location.state && location.state.product_category_id
        ? location && location.state && location.state.product_category_id
        : null;
    console.log("submitData=>", submitData);
    const getAddedProductCategory = await dispatch(
      addOrUpdateProductCategory(formData, product_category_id)
    );
    if (
      getAddedProductCategory &&
      getAddedProductCategory.categoryData &&
      !getAddedProductCategory.categoryData.error
    ) {
      const getCategoryList = await dispatch(getAllCategoriesList());
      const getAllProductListDetails = await dispatch(getAllProductList());
      if (
        getCategoryList.categoryList &&
        getAllProductListDetails.productList
      ) {
        history.push("/product-categories?type=category");
      }
    }
  };
  return (
    <>
      <Main className="padding-top-form">
        <Cards
          title={
            <div className="setting-card-title">
              <Heading as="h4">Your Product Category Details</Heading>
              <Heading as="h5">
                <span>
                  Products will be grouped under these categories in the sales
                  register.{" "}
                </span>
              </Heading>
            </div>
          }
        >
          <Row gutter={25} justify="center">
            <Col xxl={12} md={14} sm={18} xs={24}>
              <Form
                name="addProductCategory"
                form={form}
                onFinish={handleSubmit}
              >
                <Form.Item
                  name="category_name"
                  label="Product Category Name"
                  rules={[
                    {
                      min: 3,
                      message:
                        "Product Category name must be at least 3 characters long.",
                    },
                    {
                      max: 40,
                      message:
                        "Product Category name cannot be more than 40 characters long.",
                    },
                    {
                      required: true,
                      message: "Product Category name is required",
                    },
                  ]}
                >
                  <Input
                    style={{ marginBottom: 10 }}
                    placeholder="Product Category Name"
                    autoComplete="off"
                  />
                </Form.Item>
                {getItem("orderTicketButton") != null &&
                  getItem("orderTicketButton") && (
                    <Form.Item
                      name="order_ticket_group"
                      label="Order Ticket Group"
                    >
                      <Select placeholder="Select ticket group">
                        {orderTicketGroupListData.map((groupedData) => (
                          <option key={groupedData._id} value={groupedData._id}>
                            {groupedData.order_ticket_group_name}
                          </option>
                        ))}
                        <option value="noOrdertiket">No Order ticket</option>
                      </Select>
                    </Form.Item>
                  )}

                <Form.Item
                  name="sort_order"
                  label={
                    <span>
                      Sort Order&nbsp;&nbsp;
                      <Tooltip
                        title="Enter an optional numeric value that allow sort the postion"
                        color="#FFFF"
                      >
                        <InfoCircleFilled style={{ color: "#AD005A" }} />
                      </Tooltip>
                    </span>
                  }
                >
                  <InputNumber
                    min={0}
                    type="number"
                    initialValue={0}
                    style={{ marginBottom: 10, width: "100%" }}
                    placeholder="Sort order"
                    onKeyPress={(event) => {
                      if (event.key.match("[0-9]+")) {
                        return true;
                      } else {
                        return event.preventDefault();
                      }
                    }}
                  />
                </Form.Item>
                <Form.Item style={{ float: "right" }}>
                  <Button
                    className="go-back-button"
                    size="medium"
                    type="white"
                    style={{ marginRight: "10px" }}
                    onClick={() => {
                      history.push("/product-categories");
                    }}
                  >
                    Go Back
                  </Button>
                  <Button type="primary" size="medium" htmlType="submit">
                    Save
                  </Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </Cards>
      </Main>
    </>
  );
};

export default AddProductCategory;
