import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Form, Switch, Tooltip } from "antd";
import { Cards } from "../../../../../components/cards/frame/cards-frame";
import Heading from "../../../../../components/heading/heading";
import { Button } from "../../../../../components/buttons/buttons";
import { NotificationWrapper } from "../style";
import "../../setting.css";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { useHistory, NavLink } from "react-router-dom";
import {
  addOrUpdatePrefernce,
  getPrefernceById,
} from "../../../../../redux/preference/actionCreator";
import { useDispatch } from "react-redux";
import { getItem, setItem } from "../../../../../utility/localStorageControl";
const listStyle = {
  display: "flex",
  justifyContent: "space-between",
  margin: 0,
  padding: 0,
};

const Printing = () => {
  const [form] = Form.useForm();
  const history = useHistory();
  let isMounted = useRef(true);
  let [PrefrenceData, setPrefrenceData] = useState(false);
  const [printingPreference, setPrintingPreference] = useState({});
  const dispatch = useDispatch();

  const [printFirst, setPrintFirst] = useState(
    getItem("print_receipt_first") != null &&
      getItem("print_receipt_first") == true
      ? true
      : false
  );

  useEffect(() => {
    async function fetchPrefernceData() {
      if (getItem("prefernce_id")) {
        const getPrefernceData = await dispatch(
          getPrefernceById(getItem("prefernce_id"))
        );
        if (isMounted.current && getPrefernceData)
          setPrefrenceData(
            getPrefernceData.PreferenceIdData.printing_preferences
          );
      }
    }
    if (isMounted.current) {
      fetchPrefernceData();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (PrefrenceData) {
      if (PrefrenceData.print_receipt_first_then_accept_payment) {
        setItem("print_receipt_first", true);
      }
      if (PrefrenceData.print_product_notes_in_the_receipt) {
        setItem("print_receipt_product_notes", true);
      }
      if (PrefrenceData.do_not_print_tax_rates_against_each_product) {
        setItem("do_not_each_tax", true);
      }
      if (PrefrenceData.do_not_print_copy_of_receipt_and_order_tickets) {
        setItem("print_copy_of_receipt_order_ticket", true);
      }
      if (PrefrenceData.print_register_name_on_receipt) {
        setItem("print_register_name", true);
      }
      if (PrefrenceData.print_order_ticket_KOT_number_in_the_receipt) {
        setItem("print_order_tiket_number", true);
      }
      if (PrefrenceData.print_server_copy_of_order_ticket_KOT) {
        setItem("print_server_copy", true);
      }
      if (PrefrenceData.print_settlement_bill_after_accepting_payment) {
        setItem("print_settlement_paymnet", true);
      }
    }
  }, [PrefrenceData]);

  const handleSubmit = async () => {
    let formData = {
      printing_preferences: printingPreference,
    };
    const getAddedPrefernce = await dispatch(
      addOrUpdatePrefernce(formData, getItem("prefernce_id"))
    );
    if (getAddedPrefernce.PreferenceData) {
      setItem("prefernce_id", getAddedPrefernce.PreferenceData._id);
    }
  };

  return (
    <>
      <Cards
        title={
          <div className="setting-card-title">
            <Heading as="h4">Printing Preferences</Heading>
            <span>Customize how you print receipts and order tickets. </span>
            <span>Make sure the register is setup to allow printing.</span>
          </div>
        }
      >
        <Row gutter={25} justify="center">
          <Col xxl={12} md={14} sm={18} xs={24}>
            <NotificationWrapper>
              <Form form={form} onFinish={handleSubmit}>
                <div className="notification-body">
                  <nav>
                    <ul
                      style={{
                        margin: 0,
                        padding: 0,
                      }}
                    >
                      <li style={listStyle}>
                        <div
                          className="notification-list-single"
                          style={{ margin: 5 + "!important" }}
                        >
                          <p>
                            Print receipt first, then accept payment{" "}
                            <Tooltip title="When this option is enabled, you will be able to print and handover the receipt to your customer first, and then close the payments based on the mode of payment.">
                              <QuestionCircleOutlined
                                style={{ cursor: "pointer" }}
                              />
                            </Tooltip>
                          </p>
                        </div>
                        <Switch
                          defaultChecked={getItem("print_receipt_first")}
                          onChange={(value) => {
                            setPrintFirst(value);
                            setItem("print_receipt_first", value);
                            setPrintingPreference({
                              ...printingPreference,
                              print_receipt_first_then_accept_payment: value,
                            });
                          }}
                        />
                      </li>
                      {printFirst && (
                        <li style={listStyle}>
                          <div
                            className="notification-list-single"
                            style={{ margin: 5 + "!important" }}
                          >
                            <p>
                              Print settlement bill after accepting payment{" "}
                              <Tooltip title="When this option is enabled,payment acknowledgement receipt will be printed after accepting paymenr.">
                                <QuestionCircleOutlined
                                  style={{ cursor: "pointer" }}
                                />
                              </Tooltip>
                            </p>
                          </div>
                          <Switch
                            defaultChecked={getItem("print_settlement_payment")}
                            onChange={(value) => {
                              setItem("print_settlement_payment", value);
                              setPrintingPreference({
                                ...printingPreference,
                                print_settlement_bill_after_accepting_payment: value,
                              });
                            }}
                          />
                        </li>
                      )}

                      <li style={listStyle}>
                        <div
                          className="notification-list-single"
                          style={{ margin: 5 + "!important" }}
                        >
                          <p>
                            Print product notes in the receipt{" "}
                            <Tooltip title="This option allows to print a custom product detail in the receipt by adding it as product notes.">
                              <QuestionCircleOutlined
                                style={{ cursor: "pointer" }}
                              />
                            </Tooltip>
                          </p>
                        </div>
                        <Switch
                          defaultChecked={getItem(
                            "print_receipt_product_notes"
                          )}
                          onChange={(value) => {
                            setItem("print_receipt_product_notes", value);
                            setPrintingPreference({
                              ...printingPreference,
                              print_product_notes_in_the_receipt: value,
                            });
                          }}
                        />
                      </li>
                      <li style={listStyle}>
                        <div
                          className="notification-list-single"
                          style={{ margin: 5 + "!important" }}
                        >
                          <p>
                            Do not print tax rates against each product{" "}
                            <Tooltip title="It is useful to disable printing tax rate against each product if your receipt width is small or if you don't charge taxes.">
                              <QuestionCircleOutlined
                                style={{ cursor: "pointer" }}
                              />
                            </Tooltip>
                          </p>
                        </div>
                        <Switch
                          defaultChecked={getItem("do_not_each_tax")}
                          onChange={(value) => {
                            setItem("do_not_each_tax", value);
                            setPrintingPreference({
                              ...printingPreference,
                              do_not_print_tax_rates_against_each_product: value,
                            });
                          }}
                        />
                      </li>
                      <li style={listStyle}>
                        <div
                          className="notification-list-single"
                          style={{ margin: 5 + "!important" }}
                        >
                          <p>
                            Do not print copy of receipt and order tickets{" "}
                            <Tooltip title="This option will hide the Print Copy button that appears after printing a receipt or order ticket">
                              <QuestionCircleOutlined
                                style={{ cursor: "pointer" }}
                              />
                            </Tooltip>
                          </p>
                        </div>
                        <Switch
                          defaultChecked={getItem(
                            "print_copy_of_receipt_order_ticket"
                          )}
                          onChange={(value) => {
                            setItem(
                              "print_copy_of_receipt_order_ticket",
                              value
                            );
                            setPrintingPreference({
                              ...printingPreference,
                              do_not_print_copy_of_receipt_and_order_tickets: value,
                            });
                          }}
                        />
                      </li>
                      <li style={listStyle}>
                        <div
                          className="notification-list-single"
                          style={{ margin: 5 + "!important" }}
                        >
                          <p>
                            Print order ticket / KOT number in the receipt{" "}
                            <Tooltip title="This option allows to print the order ticket / KOT number in the receipt.">
                              <QuestionCircleOutlined
                                style={{ cursor: "pointer" }}
                              />
                            </Tooltip>
                          </p>
                        </div>
                        <Switch
                          defaultChecked={getItem("print_order_tiket_number")}
                          onChange={(value) => {
                            setItem("print_order_tiket_number", value);
                            setPrintingPreference({
                              ...printingPreference,
                              print_order_ticket_KOT_number_in_the_receipt: value,
                            });
                          }}
                        />
                      </li>
                      <li style={listStyle}>
                        <div
                          className="notification-list-single"
                          style={{ margin: 5 + "!important" }}
                        >
                          <p>
                            Print server copy of order ticket / KOT{" "}
                            <Tooltip title="Prints a copy of the KOT for the Server to deliver preoared dishes.">
                              <QuestionCircleOutlined
                                style={{ cursor: "pointer" }}
                              />
                            </Tooltip>
                          </p>
                        </div>
                        <Switch
                          defaultChecked={getItem("print_server_copy")}
                          onChange={(value) => {
                            setItem("print_server_copy", value);
                            setPrintingPreference({
                              ...printingPreference,
                              print_server_copy_of_order_ticket_KOT: value,
                            });
                          }}
                        />
                      </li>
                      <li style={listStyle}>
                        <div
                          className="notification-list-single"
                          style={{ margin: 5 + "!important" }}
                        >
                          <p>
                            Print register name on receipt{" "}
                            <Tooltip title="Print register name on receipt instead of shop name">
                              <QuestionCircleOutlined
                                style={{ cursor: "pointer" }}
                              />
                            </Tooltip>
                          </p>
                        </div>
                        <Switch
                          defaultChecked={getItem("print_register_name")}
                          onChange={(value) => {
                            setItem("print_register_name", value);
                            setPrintingPreference({
                              ...printingPreference,
                              print_register_name_on_receipt: value,
                            });
                          }}
                        />
                      </li>
                    </ul>
                  </nav>
                </div>
                <Form.Item style={{ float: "right" }}>
                  <Button
                    className="go-back-button"
                    size="small"
                    type="white"
                    style={{ marginRight: "10px" }}
                    onClick={() => history.push("/settings/shop")}
                  >
                    Go Back
                  </Button>
                  <Button type="primary" htmlType="submit">
                    Save
                  </Button>
                </Form.Item>
              </Form>
            </NotificationWrapper>
          </Col>
        </Row>
      </Cards>
    </>
  );
};

export default Printing;
