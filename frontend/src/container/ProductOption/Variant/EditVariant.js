import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Form, Input, Select, Button } from "antd";
import { useHistory, NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Cards } from "../../../components/cards/frame/cards-frame";
import { Main } from "../../styled";
import Heading from "../../../components/heading/heading";
import "../option.css";
import {
  getVariantById,
  UpdateVariant,
  getAllVariantList,
} from "../../../redux/variant/actionCreator";

const EditVariant = (props) => {
  const [form] = Form.useForm();
  const history = useHistory();
  let isMounted = useRef(true);
  const dispatch = useDispatch();

  let [variantdetail, setVariantData] = useState([]);

  useEffect(() => {
    async function fetchVariant() {
      const getVariant = await dispatch(getVariantById(props.match.params.id));
      if (isMounted.current) setVariantData(getVariant);
    }
    if (isMounted.current) {
      fetchVariant();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (variantdetail) {
      form.setFieldsValue({
        variant_name: variantdetail.variant_name,
        price: variantdetail.price,
        comment: variantdetail.comment,
        sort_order: variantdetail.sort_order,
      });
    }
  }, [variantdetail]);

  const handleSubmit = async (values) => {
    const savedVariantDetails = await dispatch(
      UpdateVariant(values, props.match.params.id)
    );

    if (savedVariantDetails) {
      let list = await dispatch(getAllVariantList());
      if (list) {
        history.push("/product-options?type=variant");
      }
    }
  };

  return (
    <>
      <Main className="padding-top-form" style={{ paddingTop: 30 }}>
        <Cards
          title={
            <div className="setting-card-title">
              <Heading as="h4">Setup Variant</Heading>
              <span>Create product variants for sizes, flavours etc.</span>
              <span>
                For example, create variants Small, Medium & Large and group
                them under a variant group called Size.
              </span>
            </div>
          }
        >
          <Row gutter={25} justify="center">
            <Col xxl={12} md={14} sm={18} xs={24}>
              <Form autoComplete="off" form={form} onFinish={handleSubmit}>
                <Form.Item
                  name="variant_name"
                  label="Variant Name"
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
                  <Input style={{ marginBottom: 10 }} placeholder="Name" />
                </Form.Item>
                <Form.Item label="Comment" name="comment">
                  <Input placeholder="Comment" style={{ marginBottom: 10 }} />
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
                    { required: true, message: "Variant  price is required" },
                  ]}
                >
                  <Input
                    type="number"
                    min={0}
                    step="any"
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
                  <NavLink to="/product-options">
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

export default EditVariant;
