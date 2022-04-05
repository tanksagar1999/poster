import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Form, Input, Tooltip, Button } from "antd";
import { InfoCircleFilled } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Cards } from "../../../components/cards/frame/cards-frame";
import { Main } from "../../styled";
import Heading from "../../../components/heading/heading";
import {
  addOrUpdateOrderTicketGroup,
  getOrderTicketGroupedById,
  getAllOrderTicketGroupedList,
} from "../../../redux/products/actionCreator";
import "../category.css";

const AddOrderTicketGroup = () => {
  const history = useHistory();
  const location = useLocation();
  let isMounted = useRef(true);
  const [form] = Form.useForm();
  const [state, setState] = useState({
    submitValues: {},
  });
  const dispatch = useDispatch();
  let [orderTicketGroupData, setOrderTicketGroupData] = useState([]);

  useEffect(() => {
    async function fetchOrderTicketGroup() {
      if (location.state) {
        const getOrderedTicketGroupList = await dispatch(
          getOrderTicketGroupedById(location.state.order_ticket_grouped_id)
        );
        if (isMounted.current)
          setOrderTicketGroupData(
            getOrderedTicketGroupList.orderTicketGroupedData
          );
      }
    }
    if (isMounted.current) {
      fetchOrderTicketGroup();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (orderTicketGroupData) {
      setState({
        ...state,
        orderTicketGroupData,
      });
      form.setFieldsValue({
        order_ticket_group_name:
          orderTicketGroupData && orderTicketGroupData.order_ticket_group_name
            ? orderTicketGroupData.order_ticket_group_name
            : "",
      });
    }
  }, [orderTicketGroupData]);

  const handleSubmit = async (formData) => {
    setState({ ...state, submitValues: formData });
    let order_ticket_grouped_id =
      location && location.state
        ? location.state.order_ticket_grouped_id
        : null;
    const getAddedOrderTicketGroup = await dispatch(
      addOrUpdateOrderTicketGroup(formData, order_ticket_grouped_id)
    );
    if (
      getAddedOrderTicketGroup &&
      getAddedOrderTicketGroup.orderTicketGroupedData &&
      !getAddedOrderTicketGroup.orderTicketGroupedData.error
    ) {
      let list = await dispatch(getAllOrderTicketGroupedList());
      if (list && list.orderTicketGroupList) {
        history.push("/product-categories?type=order_group");
      }
    }
  };

  return (
    <>
      <Main className="padding-top-form">
        <Cards
          title={
            <div className="setting-card-title">
              <Heading as="h4">Your Order Ticket Group Details</Heading>
              <span>
                You can use Order Ticket Group to split and print KOTs across
                kitchens. For example, you can create a group called Sandwich
                Counter and assign Sandwich category products to use a separate
                KOT print.
              </span>
            </div>
          }
        >
          <Row gutter={25} justify="center">
            <Col xxl={12} md={14} sm={18} xs={24}>
              <Form
                name="addOrderTicketGroup"
                form={form}
                onFinish={handleSubmit}
                layout="vertical"
              >
                <Form.Item
                  name="order_ticket_group_name"
                  label={
                    <span>
                      Order Ticket Group Name&nbsp;&nbsp;
                      <Tooltip
                        title="Eg. Sandwich counter, Juice counter etc. "
                        color="#FFFF"
                      >
                        <InfoCircleFilled style={{ color: "#AD005A" }} />
                      </Tooltip>
                    </span>
                  }
                  label="Order Ticket Group Name"
                  rules={[
                    {
                      min: 3,
                      message:
                        "Order ticket group name must be at least 3 characters long",
                    },
                    {
                      max: 40,
                      message:
                        "Order ticket group name cannot be more than 40 characters long.",
                    },
                    {
                      required: true,
                      message: "Order ticket group name is required",
                    },
                  ]}
                >
                  <Input
                    style={{ marginBottom: 10 }}
                    placeholder="Order Ticket Group Name"
                    autoComplete="off"
                  />
                </Form.Item>
                <Form.Item style={{ float: "right" }}>
                  <Button
                    className="go-back-button"
                    size="medium"
                    type="white"
                    style={{ marginRight: "10px" }}
                    onClick={() => {
                      history.push("/product-categories?type=order_group");
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

export default AddOrderTicketGroup;
