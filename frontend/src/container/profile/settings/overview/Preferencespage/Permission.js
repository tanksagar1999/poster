import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Form, Switch, Tooltip } from "antd";
import { Cards } from "../../../../../components/cards/frame/cards-frame";
import Heading from "../../../../../components/heading/heading";
import { Button } from "../../../../../components/buttons/buttons";
import { NotificationWrapper } from "../style";
import "../../setting.css";
import { QuestionCircleOutlined } from "@ant-design/icons";
import {
  addOrUpdatePrefernce,
  getPrefernceById,
} from "../../../../../redux/preference/actionCreator";
import { useDispatch } from "react-redux";
import { useHistory, NavLink } from "react-router-dom";

import { getItem, setItem } from "../../../../../utility/localStorageControl";

const listStyle = {
  display: "flex",
  justifyContent: "space-between",
  margin: 0,
  padding: 0,
};

const Permission = () => {
  const [form] = Form.useForm();
  let isMounted = useRef(true);
  const history = useHistory();
  const dispatch = useDispatch();
  let [PrefrenceData, setPrefrenceData] = useState(false);
  const [permissionPreference, setPermissionPreference] = useState({});

  useEffect(() => {
    if (PrefrenceData) {
      if (PrefrenceData.allow_cashiers_to_offer_discounts) {
        setItem("allow_cashier_to_discount", true);
      }
      if (
        PrefrenceData.allow_managers_to_change_email_address_while_requesting_reports
      ) {
        setItem("allow_manager_to_change_email", true);
      }
      if (PrefrenceData.hide_the_shift_summary_link_in_lock_screen) {
        setItem("hide_the_shift_summary_link_in_lock_screen", true);
      }
    }
  }, [PrefrenceData]);

  useEffect(() => {
    async function fetchPrefernceData() {
      if (getItem("prefernce_id")) {
        const getPrefernceData = await dispatch(
          getPrefernceById(getItem("prefernce_id"))
        );
        if (isMounted.current && getPrefernceData)
          setPrefrenceData(
            getPrefernceData.PreferenceIdData.permission_preferences
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

  const handleSubmit = async (data) => {
    let formData = {
      permission_preferences: permissionPreference,
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
            <Heading as="h4">Permission Preferences</Heading>
            <span>Customize permissions for your Cahiers and Managers.</span>
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
                            Allow cashiers to offer discounts{" "}
                            <Tooltip title="Enables this option if you want to allow cashiers to offer discounts while selling.">
                              <QuestionCircleOutlined
                                style={{ cursor: "pointer" }}
                              />
                            </Tooltip>
                          </p>
                        </div>
                        <Switch
                          defaultChecked={getItem("allow_cashier_to_discount")}
                          onChange={(value) => {
                            setItem("allow_cashier_to_discount", value);
                            setPermissionPreference({
                              ...permissionPreference,
                              allow_cashiers_to_offer_discounts: value,
                            });
                          }}
                        />
                      </li>
                      <li style={listStyle}>
                        <div className="notification-list-single">
                          <p>
                            Allow managers to change email address while
                            requesting reports{" "}
                            <Tooltip title="Enable this option if you don't want your managers to change the notification email address when requesting reports.">
                              <QuestionCircleOutlined
                                style={{ cursor: "pointer" }}
                              />
                            </Tooltip>
                          </p>
                        </div>
                        <Switch
                          defaultChecked={getItem(
                            "allow_manager_to_change_email"
                          )}
                          onChange={(value) => {
                            setItem("allow_manager_to_change_email", value);
                            setPermissionPreference({
                              ...permissionPreference,
                              allow_managers_to_change_email_address_while_requesting_reports: value,
                            });
                          }}
                        />
                      </li>
                      <li style={listStyle}>
                        <div className="notification-list-single">
                          <p>
                            Hide the shift summary link in lock screen{" "}
                            <Tooltip title="The shift summary link is used to generate a report for the previously ended shift.Enable this option if you don't want your cashiers and managers to view the report. ">
                              <QuestionCircleOutlined
                                style={{ cursor: "pointer" }}
                              />
                            </Tooltip>
                          </p>
                        </div>
                        <Switch
                          defaultChecked={getItem(
                            "hide_the_shift_summary_link_in_lock_screen"
                          )}
                          onChange={(value) => {
                            setItem(
                              "hide_the_shift_summary_link_in_lock_screen",
                              value
                            );
                            setPermissionPreference({
                              ...permissionPreference,
                              hide_the_shift_summary_link_in_lock_screen: value,
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

export default Permission;
