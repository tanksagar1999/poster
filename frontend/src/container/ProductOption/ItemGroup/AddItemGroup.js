import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useHistory, NavLink } from "react-router-dom";
import {
  Row,
  Col,
  Form,
  Input,
  Checkbox,
  TreeSelect,
  Popover,
  Button,
} from "antd";
import { FilterOutlined } from "@ant-design/icons";
import { Cards } from "../../../components/cards/frame/cards-frame";
import { Main } from "../../styled";
import Heading from "../../../components/heading/heading";
import "../option.css";
import {
  getAllProductList,
  getAllCategoriesList,
} from "../../../redux/products/actionCreator";
import _ from "lodash";

import {
  SingleAddItemGroup,
  getAllItemGroupList,
} from "../../../redux/ItemGroup/actionCreator";

const AddItemGroup = (props) => {
  const [form] = Form.useForm();
  const history = useHistory();
  let isMounted = useRef(true);
  const dispatch = useDispatch();

  let [productListData, setProductListData] = useState([]);
  const [values, setValues] = useState([]);
  const [interimValues, setInterimValues] = useState([]);
  const [ProductCategoriesList, setProductCategoriesList] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const [checkedValues, setcheckValue] = useState([]);

  const [treeDataAndValue, setTreeDataAndValue] = useState({
    treeData: [],
    value: [],
  });

  let { productList } = useSelector(
    (state) => ({
      productList: state.products.productData,
    }),
    shallowEqual
  );

  useEffect(() => {
    dispatch(getAllProductList());
  }, []);

  useEffect(() => {
    setProductListData(productList);
  }, [productList]);

  useEffect(() => {
    async function fetchProducCategories() {
      const getProductCategories = await dispatch(getAllCategoriesList());
      if (
        isMounted.current &&
        getProductCategories &&
        getProductCategories.categoryList
      )
        setProductCategoriesList(getProductCategories.categoryList);
      let Array = [];
      ProductCategoriesList.map((val) => {
        Array.push({ value: val._id });
      });
      setcheckValue(Array);
    }

    if (isMounted.current) {
      fetchProducCategories();
    }
  }, []);

  const categoryId = [];
  const onChange = (checkedValues) => {
    setcheckValue(checkedValues);
  };
  useEffect(() => {}, []);
  const handleAll = (e) => {
    let Arr = [];
    if (e.target.checked) {
      ProductCategoriesList.map((val) => {
        Arr.push(val._id);
      });
      setcheckValue(Arr);
    } else {
      setcheckValue([]);
      setTreeDataAndValue({ treeData: [], value: [] });
    }
  };
  useEffect(() => {
    const data = [];
    if (checkedValues.length > 0) {
      productList.map((product) => {
        if (product.product_category !== null) {
          if (checkedValues.includes(product.product_category._id)) {
            data.push(product);
          }
        }
      });
      setProductListData(data);
    } else {
      setProductListData(productList);
    }
  }, [checkedValues]);

  useEffect(() => {
    if (productListData) {
      const data = [];
      if (productListData.length)
        productListData.map((value) => {
          value.option_variant_group.length > 0
            ? value.option_variant_group.map((groupname) => {
                groupname.product_variants.map((variant) => {
                  let object = {};
                  (object.title =
                    value.option_variant_group.length > 0
                      ? `${value.product_name} / ${variant.variant_name}`
                      : value.product_name),
                    (object.value = value._id + "_" + variant._id),
                    (object.key = value._id + "_" + variant._id),
                    data.push(object);
                });
              })
            : data.push({
                title: value.product_name,
                value: value._id,
                key: value._id,
              });
        });
      //setTreeData(data);
      let c = [];
      if (values.length > 0) {
        c = _.map(
          _.filter(data, (t) => _.includes(values, t.value)),
          (d) => d.value
        );
        //setInterimValues(c);
      }

      setTreeDataAndValue({ treeData: data, value: c });
    }
  }, [productListData, values]);

  const handleSubmit = async (postvalues) => {
    let products = [];
    let product_variants = [];
    if (postvalues && postvalues.products && postvalues.products.length > 0) {
      postvalues.products.map((value) => {
        if (value.includes("_")) {
          let ids = value.split("_");
          let obj = {
            product_id: ids[0],
            variant_id: ids[1],
          };
          product_variants.push(obj);
          if (!products.includes(ids[0])) {
            products.push(ids[0]);
          }
        } else if (!products.includes(value)) {
          products.push(value);
        }
      });
    }
    let formdata = {
      item_group_name: postvalues.item_group_name,
      products: products,
      product_variants: product_variants,
    };
    const getAddonGroupdata = await dispatch(SingleAddItemGroup(formdata));
    if (getAddonGroupdata) {
      let list = await dispatch(getAllItemGroupList());
      if (list) {
        history.push("/product-options?type=item_group");
      }
    }
  };

  const text = <span>Categories Filter</span>;
  const content = (
    <div className="addfilter">
      <Checkbox onChange={(e) => handleAll(e)}>Select All</Checkbox>
      <Checkbox.Group
        className="checkboxgroup"
        style={{ display: "grid", marginBottom: 10, marginTop: 10 }}
        value={checkedValues}
        options={ProductCategoriesList.map((value) => {
          return {
            label: value.category_name,
            value: value._id,
          };
        })}
        onChange={onChange}
      ></Checkbox.Group>
    </div>
  );

  return (
    <>
      <Main className="padding-top-form">
        <Cards
          title={
            <div className="setting-card-title">
              <Heading as="h4">Item Group</Heading>
              <span>
                Create an item group that can be attached to a combo..{" "}
              </span>
            </div>
          }
        >
          <Row gutter={25} justify="center">
            <Col xxl={12} md={14} sm={18} xs={24}>
              <Form autoComplete="off" size="large" onFinish={handleSubmit}>
                <Form.Item
                  name="item_group_name"
                  label="Item Group Name"
                  rules={[
                    {
                      min: 3,
                      message:
                        "Item group name must be at least 3 characters long.",
                    },
                    { required: true, message: "Item Group Name" },
                    {
                      max: 60,
                      message:
                        "Item group name cannot be more than 60 characters long.",
                    },
                  ]}
                >
                  <Input style={{ marginBottom: 10 }} placeholder="Name" />
                </Form.Item>
                <Form.Item
                  name="products"
                  label="Select the products"
                  rules={[
                    {
                      message: "Select atleast one product",
                      required: true,
                    },
                  ]}
                >
                  <TreeSelect
                    showSearch={true}
                    multiple
                    treeData={treeDataAndValue.treeData}
                    value={treeDataAndValue.value}
                    onChange={setValues}
                    suffixIcon={
                      <Popover
                        placement="bottom"
                        title={text}
                        content={content}
                        trigger="click"
                      >
                        <FilterOutlined />
                      </Popover>
                    }
                    showArrow
                    treeCheckable={true}
                    placeholder="Select the products"
                    filterTreeNode={(search, item) => {
                      return (
                        item.title
                          .toLowerCase()
                          .indexOf(search.toLowerCase()) >= 0
                      );
                    }}
                    style={{
                      width: "100%",
                    }}
                  />
                </Form.Item>
                <Form.Item style={{ float: "right" }}>
                  <NavLink to="/product-options?type=item_group">
                    <Button size="medium" style={{ marginRight: 10 }}>
                      Go Back
                    </Button>
                  </NavLink>
                  <Button size="medium" type="primary" htmlType="submit">
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

export default AddItemGroup;
