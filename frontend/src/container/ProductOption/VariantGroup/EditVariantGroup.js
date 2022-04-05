import React, { useState, useEffect, useRef } from "react";
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  InputNumber,
  Tooltip,
  TreeSelect,
  Button,
} from "antd";
import { useHistory, NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Cards } from "../../../components/cards/frame/cards-frame";
import { Main } from "../../styled";
import Heading from "../../../components/heading/heading";
import "../option.css";
import { getAllVariantList } from "../../../redux/variant/actionCreator";
import {
  getVariantGroupById,
  UpdateVariantGroup,
  getAllVariantGroupList,
} from "../../../redux/variantGroup/actionCreator";
import { InfoCircleFilled } from "@ant-design/icons";

const EditVariantGroup = (props) => {
  let isMounted = useRef(true);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const history = useHistory();
  const [variantGroupdetail, setVariantGroupData] = useState([]);
  const [variants, setvariants] = useState([]);
  const [variantdata, setVariantData] = useState([]);
  const [values, setValues] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const [showMessage, setMessage] = React.useState(false);

  useEffect(() => {
    /*----- Get all variants -----*/
    async function fetchVariantList() {
      const getVariantList = await dispatch(getAllVariantList("sell"));
      if (isMounted.current)
        if (getVariantList.payload) {
          setVariantData(getVariantList.payload);
        }
    }
    /*----- Get by variant group Id -----*/

    async function fetchVariant() {
      const getVariantGroup = await dispatch(
        getVariantGroupById(props.match.params.id)
      );
      if (isMounted.current) setVariantGroupData(getVariantGroup);
    }

    if (isMounted.current) {
      fetchVariantList();
      fetchVariant();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (variantGroupdetail) {
      setValues(variantGroupdetail.product_variants);
      form.setFieldsValue({
        variant_group_name: variantGroupdetail.variant_group_name,
        sort_order: variantGroupdetail.sort_order,
      });
    }
  }, [variantGroupdetail]);

  useEffect(() => {
    if (variantdata) {
      const data = [];
      if (variantdata.length && values.length) {
        let selectField = [];
        values.map((object) => {
          let variantInfo = _.find(variantdata, { _id: object });
          if (variantInfo && !selectField.includes(variantInfo.variant_name)) {
            selectField.push(variantInfo.variant_name);
          }
        });
        variantdata.map((value) => {
          let object = {};
          (object.title = value.variant_name + " (" + value.comment + ")"),
            (object.value = value._id),
            (object.key = value._id);

          if (
            selectField.length !== 0 &&
            selectField.includes(value.variant_name)
          ) {
            if (!values.includes(value._id)) {
              object.disabled = true;
            }
          }
          data.push(object);
        });
        setvariants(data);
        setTreeData(data);
      }
    }
  }, [variantdata, values]);

  useEffect(() => {
    if (values) {
      setValues(values);
    }
  }, [values]);

  const onChange = (value, title, key) => {
    const data = [];
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
  const handleSubmit = async (submitvalues) => {
    const Obj = {};
    if (values.length > 0) {
      Obj.variant_group_name = submitvalues.variant_group_name;
      Obj.sort_order = submitvalues.sort_order;
      Obj.product_variants = values;
      const getVariantGroupdata = await dispatch(
        UpdateVariantGroup(Obj, props.match.params.id)
      );
      if (getVariantGroupdata) {
        let list = await dispatch(getAllVariantGroupList());
        if (list) {
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
              <Form form={form} onFinish={handleSubmit}>
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
                    { required: true, message: "Variant Group Name" },
                  ]}
                >
                  <Input style={{ marginBottom: 10 }} />
                </Form.Item>
                <Form.Item label="Select Variants"></Form.Item>
                <TreeSelect
                  treeData={treeData}
                  value={values}
                  onChange={onChange}
                  treeCheckable={true}
                  placeholder="Please select"
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
                    type="number"
                    min={0}
                    initialValue={0}
                    style={{ marginBottom: 10 }}
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
                  <NavLink to="/product-options?type=variant_group">
                    <Button size="medium" style={{ marginRight: 10 }}>
                      Go Back
                    </Button>
                  </NavLink>
                  <Button type="primary" htmlType="submit">
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

export default EditVariantGroup;
