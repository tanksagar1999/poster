import React, { useState, useEffect } from "react";
import { getItem } from "../../../../../utility/localStorageControl";
import { Row, Col, Input, Form, Select, Tooltip, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { Cards } from "../../../../../components/cards/frame/cards-frame";
import Heading from "../../../../../components/heading/heading";
import { Button } from "../../../../../components/buttons/buttons";
import FontAwesome from "react-fontawesome";
import { SocialProfileForm } from "../style";
import "../../setting.css";
import { BasicFormWrapper } from "../../../../styled";
import { InfoCircleFilled } from "@ant-design/icons";
import {
  SaveBasicDetail,
  getShopDetail,
} from "../../../../../redux/shop/actionCreator";
import { logOut } from "../../../../../redux/authentication/actionCreator";
import usePlacesAutocomplete from "use-places-autocomplete";
import _ from "lodash";

const AddBasic = () => {
  const offLineMode = useSelector((state) => state.auth.offlineMode);
  const userDetail = getItem("userDetails");
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [state, setState] = useState({
    submitValues: {},
    basicDetail: {},
  });
  const [basicDetailData, setbasicDetailData] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [saveButtonDisbaled, setSaveButtonDisabled] = useState(false);
  const [apiData, setApiData] = useState();
  const [disabledSave, setDisabledSave] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchShopDetail() {
      const data = await dispatch(getShopDetail("sell", userDetail._id));
      if (data) {
        const basicDetail = data.payload;
        if (basicDetail) {
          setDisabledSave(true);
          setbasicDetailData(basicDetail);
          setSelectedCity(basicDetail.city);
          setSaveButtonDisabled(true);
          setApiData({
            shop_name: basicDetail.shop_name,
            business_type: basicDetail.business_type,
            shop_owner_pin: basicDetail.shop_owner_pin,
            website_link: basicDetail.website_link,
            facebook_link: basicDetail.facebook_link,
            instagram_link: basicDetail.instagram_link,
            city: basicDetail.city,
          });
          form.setFieldsValue({
            shop_name: basicDetail.shop_name,
            business_type: basicDetail.business_type,
            shop_owner_pin: basicDetail.shop_owner_pin,
            website_link: basicDetail.website_link,
            facebook_link: basicDetail.facebook_link,
            instagram_link: basicDetail.instagram_link,
          });
          setState({ basicDetail });
        }
      }
    }
    if (isMounted) {
      fetchShopDetail();
    }
    return () => {
      isMounted = false;
    };
  }, []);

  const [offLineModeCheck, setOfflineModeCheck] = useState(false);
  const handleSubmit = async (values) => {
    if (offLineMode) {
      setOfflineModeCheck(true);
    } else {
      values.city = selectedCity;
      const savedBasicDetails = await dispatch(
        SaveBasicDetail(values, userDetail._id)
      );
      if (!savedBasicDetails.error) {
        const data = await dispatch(getShopDetail(userDetail._id));
        const basicDetail = data.payload;
        setState({ basicDetail });
        await dispatch(logOut());
      }
    }
  };

  const {
    value,
    ready,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    debounce: 300,
  });

  const handleInput = (e) => {
    setSelectedCity(e.target.value);
    setValue(e.target.value);
  };

  const handleSelect = ({ description }) => () => {
    setSelectedCity(description);
    // When user selects a setValueplace, we can replace the keyword without request data from API
    // by setting the second parameter to "false"
    setValue(description, false);
    clearSuggestions();
  };

  const renderSuggestions = () =>
    data.map((suggestion, i) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion;
      return (
        <li
          key={place_id}
          role="menuitem"
          tabindex={i}
          onClick={handleSelect(suggestion)}
          style={{ cursor: "pointer" }}
        >
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </li>
      );
    });

  const handleFormChange = (item, allFileds) => {
    if (apiData) {
      let currentFormData = {};
      allFileds.map((val) => {
        if (val.name[0] == "city") {
          val.value = item[0].name[0] == "city" ? item[0].value : selectedCity;
        }
      });
      _.each(apiData, (val, key) => {
        let findData = allFileds.find((k) => k.name[0] == key);
        if (findData) {
          currentFormData[findData.name[0]] = findData.value;
        }
      });

      if (_.isEqual(apiData, currentFormData)) {
        setDisabledSave(true);
      } else {
        setDisabledSave(false);
      }
      return true;
    }
  };

  return (
    <>
      <Cards
        title={
          <div className="setting-card-title">
            <Heading as="h4"> Your Shop Setup</Heading>
            <span>Your shop details and settings.</span>
          </div>
        }
      >
        <SocialProfileForm>
          <Row gutter={25} justify="center">
            <Col xxl={12} md={14} sm={18} xs={24}>
              <div className="social-form">
                <Form
                  autoComplete="off"
                  form={form}
                  name="editAccount"
                  onFinish={handleSubmit}
                  onFieldsChange={(val, allFileds) =>
                    handleFormChange(val, allFileds)
                  }
                >
                  <BasicFormWrapper>
                    <Form.Item
                      name="shop_name"
                      label="Shop Name"
                      rules={[
                        {
                          message:
                            "Shop name must be at least 3 characters long",
                          min: 3,
                        },
                        {
                          max: 40,
                          message:
                            "Shop name cannot be more than 40 characters long.",
                        },
                        { message: "Shop Name is required", required: true },
                      ]}
                    >
                      <Input
                        placeholder="Shop name"
                        className="website"
                        style={{
                          marginBottom: 20,
                          paddingLeft: "12px !important",
                        }}
                      />
                    </Form.Item>
                    <Form.Item
                      name="business_type"
                      label="Industry Type"
                      rules={[
                        {
                          message: "Industry type is required",
                          required: true,
                        },
                      ]}
                    >
                      <Select style={{ width: "100%", marginBottom: 20 }}>
                        <Option value="food_and_drink">Food And Drink</Option>
                        <Option value="home_and_lifestyle">
                          Home and Lifestyle
                        </Option>
                        <Option value="fashion_boutique">
                          Fashion Boutique
                        </Option>
                        <Option value="saloon_and_spa">Saloon and Spa</Option>
                        <Option value="small_retail">Small Retail</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="city"
                      label="City"
                      rules={
                        selectedCity === ""
                          ? [{ message: "City is required", required: true }]
                          : ""
                      }
                    >
                      <div>
                        <Input
                          className="website"
                          style={{
                            marginBottom: 20,
                            paddingLeft: "12px !important",
                          }}
                          aria-required="true"
                          value={selectedCity}
                          onChange={handleInput}
                          placeholder="Where are you going?"
                        />
                        {status === "OK" && (
                          <ul role="menu" aria-label="menu">
                            {renderSuggestions()}
                          </ul>
                        )}
                      </div>
                    </Form.Item>
                    <span
                      style={{
                        display: "inline-block",
                        width: "24px",
                        lineHeight: "32px",
                        textAlign: "center",
                      }}
                    ></span>
                    <Form.Item
                      name="shop_owner_pin"
                      label={
                        <span>
                          Shop Owner PIN&nbsp;&nbsp;
                          <Tooltip
                            title="Setting shop owner PIN allows you to add cashiers and enable locking and unlockig registers with a numeric PIN"
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
                      rules={[
                        {
                          pattern: new RegExp("^[0-9]{4,6}$"),
                          message: "Pin number must be minimum 4 digit number.",
                        },
                        {
                          required: true,
                          message:
                            "Owner PIN is required when you have active cashiers.",
                        },
                      ]}
                    >
                      <Input
                        className="website"
                        type="number"
                        style={{ marginBottom: 20 }}
                        placeholder="4 to 6 digit cashiers PIN Eg:1234"
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
                      name="website_link"
                      label={
                        <span>
                          Website Link&nbsp;&nbsp;
                          <Tooltip
                            title="This link will be shown in receipt footer of digital receipts"
                            color="#FFFF"
                          >
                            <InfoCircleFilled style={{ color: "#AD005A" }} />
                          </Tooltip>
                        </span>
                      }
                    >
                      <Input
                        className="website-data"
                        prefix={
                          <FontAwesome
                            className="super-crazy-colors"
                            size="2x"
                            style={{ textShadow: "0 1px 0 rgba(0, 0, 0, 0.1)" }}
                            name="globe"
                          />
                        }
                        placeholder="https://<your domain> (Optional)"
                        style={{
                          marginBottom: 20,
                          paddingLeft: "12px !important",
                        }}
                      />
                    </Form.Item>
                    <Form.Item
                      name="facebook_link"
                      label={
                        <span>
                          Facebook&nbsp;&nbsp;
                          <Tooltip
                            title="This link will be shown in receipt footer of digital receipts"
                            color="#FFFF"
                          >
                            <InfoCircleFilled style={{ color: "#AD005A" }} />
                          </Tooltip>
                        </span>
                      }
                    >
                      <Input
                        style={{ marginBottom: 20 }}
                        className="facebook"
                        prefix={
                          <FontAwesome
                            className="super-crazy-colors"
                            size="2x"
                            style={{ textShadow: "0 1px 0 rgba(0, 0, 0, 0.1)" }}
                            name="facebook"
                          />
                        }
                        placeholder="https://www.facebook.com/<your profile> (Optional)"
                      />
                    </Form.Item>
                    <Form.Item
                      name="instagram_link"
                      label={
                        <span>
                          Instagram&nbsp;&nbsp;
                          <Tooltip
                            title="This link will be shown in receipt footer of digital receipts"
                            color="#FFFF"
                          >
                            <InfoCircleFilled style={{ color: "#AD005A" }} />
                          </Tooltip>
                        </span>
                      }
                    >
                      <Input
                        style={{ marginBottom: 20 }}
                        className="instagram"
                        prefix={
                          <FontAwesome
                            className="super-crazy-colors"
                            size="2x"
                            style={{ textShadow: "0 1px 0 rgba(0, 0, 0, 0.1)" }}
                            name="instagram"
                          />
                        }
                        placeholder="https://www.instagram.com/<your profile> (Optional)"
                      />
                    </Form.Item>
                  </BasicFormWrapper>

                  <Form.Item style={{ float: "right" }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="small"
                      disabled={disabledSave}
                    >
                      Save
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </Col>
          </Row>
          <Modal
            title="You are Offline"
            visible={offLineModeCheck}
            onOk={() => setOfflineModeCheck(false)}
            onCancel={() => setOfflineModeCheck(false)}
            width={600}
          >
            <p>You are offline not add and update </p>
          </Modal>
        </SocialProfileForm>
      </Cards>
    </>
  );
};

export default AddBasic;
