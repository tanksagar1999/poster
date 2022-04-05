import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useHistory, NavLink } from "react-router-dom";
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  InputNumber,
  Tooltip,
  TreeSelect,
} from "antd";
import { Cards } from "../../../components/cards/frame/cards-frame";
import { Main } from "../../styled";
import Heading from "../../../components/heading/heading";
import {
  AddAddonGroupData,
  getAllAddonGroupList,
} from "../../../redux/AddonGroup/actionCreator";
import { getAllAddonList } from "../../../redux/addon/actionCreator";
import "../option.css";
import { InfoCircleFilled } from "@ant-design/icons";

const AddAddonGroup = () => {
  const [form] = Form.useForm();
  let isMounted = useRef(true);
  const history = useHistory();
  const dispatch = useDispatch();
  const [MinValue, setMinValue] = useState();
  const [MaxValue, setMaxValue] = useState();

  const [addons, setaddons] = useState([]);
  const [addondata, setAddonData] = useState([]);
  const [values, setValues] = useState([]);
  const [treeData, setTreeData] = useState([]);

  useEffect(() => {
    async function fetchAddon() {
      const getAddon = await dispatch(getAllAddonList("sell"));
      if (isMounted.current)
        if (getAddon.payload) {
          setAddonData(getAddon.payload);
        }
    }
    if (isMounted.current) {
      fetchAddon();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (addondata) {
      const data = [];
      if (addondata.length)
        addondata.map((value) => {
          let object = {};
          (object.title = value.addon_name),
            (object.value = value._id),
            (object.key = value._id),
            data.push(object);
        });
      setaddons(data);
      setTreeData(data);
    }
  }, [addondata]);

  const handleSubmit = async (submitvalues) => {
    const Obj = {};
    Obj.addon_group_name = submitvalues.addon_group_name;
    Obj.sort_order = submitvalues.sort_order;
    Obj.product_addons = values;
    Obj.minimum_selectable = submitvalues.minimum_selectable;
    Obj.maximum_selectable = submitvalues.maximum_selectable;
    const savedAddonGroupDetails = await dispatch(AddAddonGroupData(Obj));
    if (savedAddonGroupDetails) {
      let list = await dispatch(getAllAddonGroupList());
      if (list) {
        history.push("/product-options?type=addon_group");
      }
    }
  };

  return (
    <>
      <Main style={{ paddingTop: 30 }}>
        <Cards
          title={
            <div className="setting-card-title">
              <Heading as="h4">Addon Group</Heading>
              <span>
                Addon groups are used to bunch a set of addons and attach to a
                product. Multiple addons can be chosen from an addon group.{" "}
              </span>
            </div>
          }
        >
          <Row gutter={25} justify="center">
            <Col xxl={12} md={14} sm={18} xs={24}>
              <Form autoComplete="off" form={form} onFinish={handleSubmit}>
                <Form.Item
                  name="addon_group_name"
                  label="Addon group name"
                  rules={[
                    {
                      min: 3,
                      message:
                        "Addon group name must be at least 3 characters long",
                    },
                    {
                      required: true,
                      message: "Addon group name is required.",
                    },
                    {
                      max: 60,
                      message:
                        "Addon group name cannot be more than 60 characters long.",
                    },
                  ]}
                >
                  <Input
                    style={{ marginBottom: 10 }}
                    placeholder="Addon group name"
                  />
                </Form.Item>

                <Form.Item
                  name="product_addons"
                  label="Select Addons"
                  rules={[
                    {
                      message: "Select atleast one addon",
                      required: true,
                    },
                  ]}
                >
                  <TreeSelect
                    showSearch={true}
                    multiple
                    treeData={treeData}
                    value={values}
                    onChange={setValues}
                    treeCheckable={true}
                    placeholder="Select Addons"
                    filterTreeNode={(search, item) => {
                      return (
                        item.title
                          .toLowerCase()
                          .indexOf(search.toLowerCase()) >= 0
                      );
                    }}
                    style={{
                      width: "100%",
                      marginBottom: 5,
                    }}
                  />
                </Form.Item>
                <Form.Item
                  name="minimum_selectable"
                  rules={[
                    {
                      pattern: new RegExp("^[0-9]{1,10}$"),
                      message: "Please eneter the whole number",
                    },
                  ]}
                  label={
                    <span>
                      Min Selectable &nbsp;&nbsp;
                      <Tooltip
                        title="Minimum selectable item during billing from the addon group"
                        color="#FFFF"
                      >
                        <InfoCircleFilled
                          style={{
                            color: "#AD005A",
                            paddingLeft: "12px !important",
                          }}
                        />
                      </Tooltip>
                    </span>
                  }
                  style={{
                    display: "inline-block",
                    width: "calc(50% - 12px)",
                    marginRight: 10,
                  }}
                >
                  <Input
                    type="number"
                    min={0}
                    max={MaxValue}
                    style={{ marginBottom: 6 }}
                    onChange={(e) => setMinValue(e.target.value)}
                    placeholder="Min number of addons (Default 0)"
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
                  name="maximum_selectable"
                  rules={[
                    {
                      pattern: new RegExp("^[0-9]{1,10}$"),
                      message: "Please eneter the whole number",
                    },
                  ]}
                  label={
                    <span>
                      Max Selectable &nbsp;&nbsp;
                      <Tooltip
                        title="Maximum selectable items during billing from the addon group"
                        color="#FFFF"
                      >
                        <InfoCircleFilled
                          style={{
                            color: "#AD005A",
                            paddingLeft: "12px !important",
                          }}
                        />
                      </Tooltip>
                    </span>
                  }
                  style={{
                    display: "inline-block",
                    width: "calc(50% - 12px)",
                  }}
                >
                  <Input
                    min={MinValue}
                    type="number"
                    initialValue={0}
                    style={{ marginBottom: 6 }}
                    onChange={(e) => setMaxValue(e.target.value)}
                    placeholder="Max number of addons"
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
                  rules={[
                    {
                      pattern: new RegExp("^[0-9]{1,10}$"),
                      message: "Variant enter sort order in numeric value",
                    },
                  ]}
                >
                  <InputNumber
                    type="number"
                    min={0}
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
                  <NavLink to="/product-options?type=addon_group">
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

export default AddAddonGroup;
