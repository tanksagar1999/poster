import React, { useState, useEffect, useRef } from "react";
import _ from "lodash";
import {
  Row,
  Col,
  Form,
  Input,
  InputNumber,
  Tooltip,
  TreeSelect,
  Button,
} from "antd";
import { useDispatch } from "react-redux";
import { useHistory, NavLink } from "react-router-dom";
import { Cards } from "../../../components/cards/frame/cards-frame";
import { Main } from "../../styled";
import Heading from "../../../components/heading/heading";
import {
  AddVariantGroupData,
  getAllVariantGroupList,
} from "../../../redux/variantGroup/actionCreator";
import { getAllVariantList } from "../../../redux/variant/actionCreator";
import "../option.css";
import { InfoCircleFilled } from "@ant-design/icons";

const AddVariantGroup = () => {
  let isMounted = useRef(true);
  const history = useHistory();
  const dispatch = useDispatch();
  const [variantdata, setVariantData] = useState([]);
  const [values, setValues] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const [showMessage, setMessage] = React.useState(false);

  useEffect(() => {
    async function fetchVariant() {
      const getVariant = await dispatch(getAllVariantList("sell"));
      if (isMounted.current)
        if (getVariant.payload) {
          setVariantData(getVariant.payload);
        }
    }
    if (isMounted.current) {
      fetchVariant();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  const onChange = (value, title, key) => {
    let maindata = [];
    if (key.checked) {
      let selectField = [];
      value.map((object) => {
        let variantInfo = _.find(variantdata, { _id: object });
        if (variantInfo && !selectField.includes(variantInfo.variant_name)) {
          selectField.push(variantInfo.variant_name);
        }
      });
      setValues(value);
      variantdata.map((obj) => {
        let object = {};
        (object.title = obj.variant_name + " (" + obj.comment + ")"),
          (object.value = obj._id),
          (object.key = obj._id);

        if (
          selectField.length !== 0 &&
          selectField.includes(obj.variant_name)
        ) {
          if (!value.includes(obj._id)) {
            object.disabled = true;
          }
        }
        maindata.push(object);
      });
      setTreeData(maindata);
    } else {
      let variant_name = "";
      let variantInfo = _.find(variantdata, { _id: key.triggerValue });

      if (variantInfo) {
        variant_name = variantInfo.variant_name;
      }
      setValues(value);
      let data = [];
      treeData.map((value) => {
        if (value.title.includes(variant_name)) {
          value.disabled = false;
        }
        data.push(value);
      });
      setTreeData(data);
    }
  };

  useEffect(() => {
    if (values) {
      setValues(values);
    }
  }, [values]);

  useEffect(() => {
    if (variantdata) {
      const data = [];
      if (variantdata.length)
        variantdata.map((value) => {
          let object = {};
          (object.title = value.variant_name + " (" + value.comment + ")"),
            (object.value = value._id),
            (object.key = value._id),
            data.push(object);
        });
      setTreeData(data);
    }
  }, [variantdata]);

  const handleSubmit = async (submitvalues) => {
    const Obj = {};

    if (values.length > 0) {
      Obj.variant_group_name = submitvalues.variant_group_name;
      Obj.sort_order = submitvalues.sort_order;
      Obj.product_variants = values;
      const getVariantGroup = await dispatch(AddVariantGroupData(Obj));
      if (getVariantGroup) {
        const getList = await dispatch(getAllVariantGroupList());
        if (getList) {
          history.push("/product-options?type=variant_group");
        }
      }
    } else {
      setMessage(true);
    }
  };

  return (
    <>
      <Main style={{ paddingTop: 30 }}>
        <Cards
          title={
            <div className="setting-card-title">
              <Heading as="h4">Variant Group</Heading>
              <span>
                Variant groups are used to bunch a set of variants and attach it
                to a product. Only one variant can be chosen from a variant
                group.{" "}
              </span>
            </div>
          }
        >
          <Row gutter={25} justify="center">
            <Col xxl={12} md={14} sm={18} xs={24}>
              <Form onFinish={handleSubmit}>
                <Form.Item
                  name="variant_group_name"
                  label="Variant Group Name"
                  rules={[
                    {
                      min: 3,
                      message:
                        "Variant group name must be at least 3 characters long",
                    },
                    {
                      max: 60,
                      message:
                        "Variant group name cannot be more than 60 characters long",
                    },
                    {
                      required: true,
                      message: "Variant group name is required",
                    },
                  ]}
                >
                  <Input style={{ marginBottom: 10 }} placeholder="Name" />
                </Form.Item>
                <Form.Item
                  label="Select Variant"
                  className="custom-label mb-h0"
                  rules={[
                    {
                      min: 3,
                      message:
                        "Variant name must be at least 3 characters long.",
                    },
                    { required: true, message: "Variant name is required" },
                  ]}
                ></Form.Item>
                <TreeSelect
                  multiple
                  treeData={treeData}
                  value={values}
                  placeholder="Select the variants"
                  onChange={onChange}
                  className="vari_h"
                  treeCheckable={true}
                  filterTreeNode={(search, item) => {
                    return (
                      item.title.toLowerCase().indexOf(search.toLowerCase()) >=
                      0
                    );
                  }}
                  style={{
                    width: "100%",
                    marginBottom: 5,
                  }}
                />
                {showMessage ? (
                  <div className="ant-form-item-explain ant-form-item-explain-error">
                    <div role="alert">Select atleast one variants</div>
                  </div>
                ) : (
                  ""
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
                    initialValue={0}
                    style={{ marginBottom: 10, width: "100%" }}
                    placeholder="Sort order(optional)"
                  />
                </Form.Item>
                <Form.Item style={{ float: "right" }}>
                  <NavLink to="/product-options?type=variant_group">
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

export default AddVariantGroup;
