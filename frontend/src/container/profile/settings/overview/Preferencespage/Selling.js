import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Form, Switch, Tooltip } from "antd";
import { Cards } from "../../../../../components/cards/frame/cards-frame";
import Heading from "../../../../../components/heading/heading";
import { Button } from "../../../../../components/buttons/buttons";
import { NotificationWrapper } from "../style";
import propTypes from "prop-types";
import { useHistory, NavLink } from "react-router-dom";
import "../../setting.css";
import { QuestionCircleOutlined } from "@ant-design/icons";
import {
  addOrUpdatePrefernce,
  getPrefernceById,
  DarkModeAvailable,
} from "../../../../../redux/preference/actionCreator";
import { changeLayoutMode } from "../../../../../redux/themeLayout/actionCreator";
import { createDispatchHook, useDispatch } from "react-redux";
import {
  getItem,
  removeItem,
  setItem,
} from "../../../../../utility/localStorageControl";

const listStyle = {
  display: "flex",
  justifyContent: "space-between",
  margin: 0,
  padding: 0,
};

const Selling = ({ darkMode, events }) => {
  const dispatch = useDispatch();
  const [sellingPreference, setSellingPreference] = useState({});
  let [PrefrenceData, setPrefrenceData] = useState(false);
  const [form] = Form.useForm();
  const history = useHistory();

  let isMounted = useRef(true);
  useEffect(() => {
    async function fetchPrefernceData() {
      if (getItem("prefernce_id")) {
        const getPrefernceData = await dispatch(
          getPrefernceById(getItem("prefernce_id"))
        );
        if (isMounted.current && getPrefernceData)
          setPrefrenceData(
            getPrefernceData.PreferenceIdData.selling_preferences
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

  const handleSubmit = async () => {
    if (
      sellingPreference.hasOwnProperty(
        "enforce_sequential_local_receipt_numbers"
      )
    ) {
      if (sellingPreference.enforce_sequential_local_receipt_numbers) {
        setItem("isStartSellingFromThisDevice", true);
      } else {
        setItem("isStartSellingFromThisDevice", false);
      }
    }
    let formData = {
      selling_preferences: sellingPreference,
    };
    const getAddedPrefernce = await dispatch(addOrUpdatePrefernce(formData));
  };

  useEffect(() => {
    if (PrefrenceData) {
      if (PrefrenceData.do_not_round_off_sale_total) {
        setItem("doNotRoundOff", true);
      }
      if (
        PrefrenceData.display_items_in_sell_screen_as_a_list_instead_of_grid
      ) {
        setItem("listView", true);
      }
      if (PrefrenceData.enforce_sequential_local_receipt_numbers) {
        setItem("localReceipt", true);
      }
      if (PrefrenceData.enable_order_ticket_kot_genration) {
        setItem("orderTicketButton", true);
      }
      if (PrefrenceData.enable_quick_billing) {
        setItem("enable_quick_billing", true);
      }
      if (PrefrenceData.hide_quantity_increase_decrease_buttons) {
        setItem("hide_quantity_increase_decrease_buttons", true);
      }
      if (PrefrenceData.hide_all_and_top_categories) {
        setItem("hideAllAndTop", true);
      }
      if (PrefrenceData.enforce_customer_mobile_number) {
        setItem("enforce_customer_mobile_number", true);
      }
      if (PrefrenceData.enable_billing_only_when_shift_is_opened) {
        setItem("enable_billing_only_when_shift_is_opened", true);
      }
      if (PrefrenceData.create_receipt_while_fullfilling_booking) {
        setItem("create_receipt_while_fullfilling_booking", true);
      }
      if (PrefrenceData.dark_mode) {
        setItem("dark_mode", true);
      }
    }
  }, [PrefrenceData]);

  if (PrefrenceData.do_not_round_off_sale_total != undefined) {
    console.log("pre", PrefrenceData.do_not_round_off_sale_total);
  }

  return (
    <>
      <Cards
        title={
          <div className="setting-card-title">
            <Heading as="h4">Selling Preferences</Heading>
            <span>Customize how you sell, enable order tickets / KOTs.</span>
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
                        <div className="notification-list-single">
                          <p>
                            Do not roundoff sale total{" "}
                            <Tooltip title="When this option is disabled, the sale total will be rounded off. Eg:100.50 bill will be rounded off to 100.">
                              <QuestionCircleOutlined
                                style={{ cursor: "pointer" }}
                              />
                            </Tooltip>
                          </p>
                        </div>
                        <Switch
                          defaultChecked={getItem("doNotRoundOff")}
                          onChange={(value) => {
                            setItem("doNotRoundOff", value);
                            setSellingPreference({
                              ...sellingPreference,
                              do_not_round_off_sale_total: value,
                            });
                          }}
                        />
                      </li>
                      <li style={listStyle}>
                        <div className="notification-list-single">
                          <p>
                            Display items in sell screen as a list instead of
                            grid{" "}
                            <Tooltip title="Enabling this option displays item in sell screen as a list insted of grid, useful for faster keyboard inputs.This prefernce is applicable only for the web portal.">
                              <QuestionCircleOutlined
                                style={{ cursor: "pointer" }}
                              />
                            </Tooltip>
                          </p>
                        </div>
                        <Switch
                          defaultChecked={getItem("listView")}
                          onChange={(value) => {
                            setItem("listView", value);
                            setSellingPreference({
                              ...sellingPreference,
                              display_items_in_sell_screen_as_a_list_instead_of_grid: value,
                            });
                          }}
                        />
                      </li>
                      <li style={listStyle}>
                        <div className="notification-list-single">
                          <p>
                            Enforce sequential local receipt numbers{" "}
                            <Tooltip title="When you enable this option, your local receipt numbers will be sequential Also, you will be able to sell from only one device per register.">
                              <QuestionCircleOutlined
                                style={{ cursor: "pointer" }}
                              />
                            </Tooltip>
                          </p>
                        </div>
                        <Switch
                          defaultChecked={getItem("localReceipt")}
                          onChange={(value) => {
                            setItem("localReceipt", value);
                            setSellingPreference({
                              ...sellingPreference,
                              enforce_sequential_local_receipt_numbers: value,
                            });
                          }}
                        />
                      </li>
                      <li style={listStyle}>
                        <div className="notification-list-single">
                          <p>
                            Enable order ticket / KOT generation{" "}
                            <Tooltip title="An order ticket / KOT(kichen order ticket) will be generated along with the sale.To print order tickets, make sure the register is setup to allow printing.">
                              <QuestionCircleOutlined
                                style={{ cursor: "pointer" }}
                              />
                            </Tooltip>
                          </p>
                        </div>
                        <Switch
                          defaultChecked={getItem("orderTicketButton")}
                          onChange={(value) => {
                            setItem("orderTicketButton", value);
                            setSellingPreference({
                              ...sellingPreference,
                              enable_order_ticket_kot_genration: value,
                            });
                          }}
                        />
                      </li>
                      <li style={listStyle}>
                        <div className="notification-list-single">
                          <p>
                            Enable quick billing{" "}
                            <Tooltip title="This enables faster billing by using default payment mode as cash and limiting only to do immediate sales.">
                              <QuestionCircleOutlined
                                style={{ cursor: "pointer" }}
                              />
                            </Tooltip>
                          </p>
                        </div>
                        <Switch
                          defaultChecked={getItem("enable_quick_billing")}
                          onChange={(value) => {
                            setItem("enable_quick_billing", value);
                            setSellingPreference({
                              ...sellingPreference,
                              enable_quick_billing: value,
                            });
                          }}
                        />
                      </li>
                      <li style={listStyle}>
                        <div className="notification-list-single">
                          <p>
                            Hide quantity increase / decrease buttons{" "}
                            <Tooltip title="Enables this option to hide the quantity increase / decrease buttons and show an input box instead.">
                              <QuestionCircleOutlined
                                style={{ cursor: "pointer" }}
                              />
                            </Tooltip>
                          </p>
                        </div>

                        <Switch
                          defaultChecked={getItem(
                            "hide_quantity_increase_decrease_buttons"
                          )}
                          onChange={(value) => {
                            setItem(
                              "hide_quantity_increase_decrease_buttons",
                              value
                            );
                            setSellingPreference({
                              ...sellingPreference,
                              hide_quantity_increase_decrease_buttons: value,
                            });
                          }}
                        />
                      </li>
                      <li style={listStyle}>
                        <div className="notification-list-single">
                          <p>
                            Hide All and Top categories{" "}
                            <Tooltip title="Enables this option to hide all and Top categories in sell screen. improves performance when you have large number of products.">
                              <QuestionCircleOutlined
                                style={{ cursor: "pointer" }}
                              />
                            </Tooltip>
                          </p>
                        </div>
                        <Switch
                          defaultChecked={getItem("hideAllAndTop")}
                          onChange={(value) => {
                            setItem("hideAllAndTop", value);
                            setSellingPreference({
                              ...sellingPreference,
                              hide_all_and_top_categories: value,
                            });
                          }}
                        />
                      </li>
                      <li style={listStyle}>
                        <div className="notification-list-single">
                          <p>
                            Enforce customer mobile number{" "}
                            <Tooltip title="Enables this option to enforce customer mobial number.">
                              <QuestionCircleOutlined
                                style={{ cursor: "pointer" }}
                              />
                            </Tooltip>
                          </p>
                        </div>
                        <Switch
                          defaultChecked={getItem(
                            "enforce_customer_mobile_number"
                          )}
                          onChange={(value) => {
                            setItem("enforce_customer_mobile_number", value);
                            setSellingPreference({
                              ...sellingPreference,
                              enforce_customer_mobile_number: value,
                            });
                          }}
                        />
                      </li>
                      <li style={listStyle}>
                        <div className="notification-list-single">
                          <p>
                            Enable billing only when shift is opened{" "}
                            <Tooltip title="Enable this option to enable billing only when shift is opened">
                              <QuestionCircleOutlined
                                style={{ cursor: "pointer" }}
                              />
                            </Tooltip>
                          </p>
                        </div>
                        <Switch
                          defaultChecked={getItem(
                            "enable_billing_only_when_shift_is_opened"
                          )}
                          onChange={(value) => {
                            setItem(
                              "enable_billing_only_when_shift_is_opened",
                              value
                            );
                            setSellingPreference({
                              ...sellingPreference,
                              enable_billing_only_when_shift_is_opened: value,
                            });
                          }}
                        />
                      </li>
                      <li style={listStyle}>
                        <div className="notification-list-single  ">
                          <p>
                            Create receipt while fulfilling booking{" "}
                            <Tooltip title="When you enble this option, booking orders will be saved as draft and receipt will be created only while fulfilling.">
                              <QuestionCircleOutlined
                                style={{ cursor: "pointer" }}
                              />
                            </Tooltip>
                          </p>
                        </div>
                        <Switch
                          defaultChecked={getItem(
                            "create_receipt_while_fullfilling_booking"
                          )}
                          onChange={(value) => {
                            setItem(
                              "create_receipt_while_fullfilling_booking",
                              value
                            );
                            setSellingPreference({
                              ...sellingPreference,
                              create_receipt_while_fullfilling_booking: value,
                            });
                          }}
                        />
                      </li>
                      <li style={listStyle}>
                        <div className="notification-list-single  ">
                          <p>
                            Dark Mode{" "}
                            <Tooltip title="">
                              {" "}
                              <QuestionCircleOutlined
                                style={{ cursor: "pointer" }}
                              />
                            </Tooltip>
                          </p>
                        </div>
                        <Switch
                          defaultChecked={getItem("dark_mode")}
                          onChange={(value) => {
                            setItem("dark_mode", value);
                            setSellingPreference({
                              ...sellingPreference,
                              dark_mode: value,
                            });
                            dispatch(DarkModeAvailable(value));
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

Selling.propTypes = {
  darkMode: propTypes.bool,
  events: propTypes.object,
};

export default Selling;
