import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Form, Input, Button } from "antd";
import { useDispatch } from "react-redux";
import { useHistory, NavLink } from "react-router-dom";
import { Cards } from "../../../components/cards/frame/cards-frame";
import { Main } from "../../styled";
import "../option.css";
import Heading from "../../../components/heading/heading";
import {
  geAddonById,
  UpdateAddon,
  getAllAddonList,
} from "../../../redux/addon/actionCreator";

const EditAddon = (props) => {
  const [form] = Form.useForm();
  const history = useHistory();
  let isMounted = useRef(true);
  const dispatch = useDispatch();
  const [state, setState] = useState({
    submitValues: {},
  });
  let [addondetail, setAddonData] = useState([]);

  useEffect(() => {
    async function fetchAddon() {
      const getAddon = await dispatch(geAddonById(props.match.params.id));
      if (isMounted.current) setAddonData(getAddon);
    }
    if (isMounted.current) {
      fetchAddon();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (addondetail) {
      form.setFieldsValue({
        addon_name: addondetail.addon_name,
        price: addondetail.price,
        sort_order: addondetail.sort_order,
      });
    }
  }, [addondetail]);

  const handleSubmit = async (values) => {
    const savedAddonDetails = await dispatch(
      UpdateAddon(values, props.match.params.id)
    );
    if (savedAddonDetails) {
      let list = await dispatch(getAllAddonList());
      if (list) {
        history.push("/product-options?type=addon");
      }
    }
  };

  return (
    <>
      <Main className="padding-top-form" style={{ paddingTop: 30 }}>
        <Cards
          title={
            <div className="setting-card-title">
              <Heading as="h4">Addon Details</Heading>
              <span>
                Create product addons like toppings, group using addon groups
                and attach to products.{" "}
              </span>
            </div>
          }
        >
          <Row gutter={25} justify="center">
            <Col xxl={12} md={14} sm={18} xs={24}>
              <Form autoComplete="off" form={form} onFinish={handleSubmit}>
                <Form.Item
                  name="addon_name"
                  label="Addon Name"
                  rules={[
                    {
                      min: 3,
                      message: "Addon name must be at least 3 characters long.",
                    },
                    { required: true, message: "Addon name required" },
                  ]}
                >
                  <Input style={{ marginBottom: 10 }} />
                </Form.Item>
                <Form.Item
                  name="price"
                  label="Price"
                  rules={[
                    {
                      pattern: new RegExp(
                        /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/
                      ),
                      message: "Price should be a positive number.",
                    },
                    { required: true, message: "Addon price required" },
                  ]}
                >
                  <Input
                    min={0}
                    step="any"
                    type="number"
                    initialValue={0}
                    style={{ marginBottom: 10, width: "670px" }}
                    onKeyPress={(event) => {
                      if (event.key.match("[0-9]+")) {
                        return true;
                      } else {
                        return event.preventDefault();
                      }
                    }}
                  />
                </Form.Item>

                <Form.Item name="sort_order" label="Sort Order">
                  <Input
                    type="number"
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
                  <NavLink to="/product-options?type=addon">
                    <Button
                      type="default"
                      info
                      size="medium"
                      onClick={history.goBack}
                      style={{ marginRight: 10 }}
                    >
                      Go Back
                    </Button>
                  </NavLink>
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

export default EditAddon;
