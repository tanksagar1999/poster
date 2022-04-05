import React, { useState } from "react";
import {
  Checkbox,
  Row,
  Col,
  Input,
  Form,
  Select,
  Tabs,
  Tooltip,
  message,
} from "antd";
import { Cards } from "../../../../../components/cards/frame/cards-frame";
import Heading from "../../../../../components/heading/heading";
import { Button } from "../../../../../components/buttons/buttons";
import { PageHeader } from "../../../../../components/page-headers/page-headers";
import { AccountWrapper } from "../style";
import "../../setting.css";
import TextArea from "antd/lib/input/TextArea";
import { InfoCircleFilled } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { getItem, setItem } from "../../../../../utility/localStorageControl";

import {
  addOrUpdateRegister,
  getAllRegisterList,
} from "../../../../../redux/register/actionCreator";
const { TabPane } = Tabs;

const AddRegister = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [form] = Form.useForm();
  const { Option } = Select;
  const [activeTab, changeTab] = useState("BASIC");
  const [checkedprint, setprint] = useState(false);
  const [checkedlogo, setlogo] = useState(false);
  const [checkedaccept, setaccept] = useState(false);
  const [checkedserved, setserved] = useState(false);
  const [checkedchange, setchange] = useState(false);
  const [registerId, setregisterId] = useState(null);

  const handleSubmit = async (formData) => {
    formData.print_receipts = checkedprint;
    formData.include_shop_logo = checkedlogo;
    setItem("print_receipts", checkedprint);
    setItem("Include_shop_logo", checkedlogo);
    const getAddRegisters = await dispatch(addOrUpdateRegister(formData, ""));
    if (
      getAddRegisters &&
      getAddRegisters.registerData &&
      !getAddRegisters.registerData.error
    ) {
      setregisterId(getAddRegisters.registerData._id);
      const registerList = await dispatch(getAllRegisterList());
      if (registerList && registerList.RegisterList) {
        history.push("/settings/registers");
      }
    }
  };

  const handleSubmitSetting = async (formData) => {
    if (registerId === null) {
      message.success({
        content: "Register name is required",
        style: {
          float: "right",
          marginTop: "2vh",
        },
      });
    } else {
      formData.enable_accept_status = checkedaccept;
      formData.allow_to_change_status = checkedchange;
      formData.enable_served_status = checkedserved;
      const getAddRegisters = await dispatch(
        addOrUpdateRegister(formData, registerId)
      );
      if (
        getAddRegisters &&
        getAddRegisters.registerData &&
        !getAddRegisters.registerData.error
      ) {
        setregisterId(getAddRegisters.registerData._id);
        history.push("/settings/registers");
      }
    }
  };

  const onChangeprint = (e) => {
    setprint(e.target.checked);
  };

  const onChangelogo = (e) => {
    setlogo(e.target.checked);
  };

  const onChangeaccept = (e) => {
    setaccept(e.target.checked);
  };

  const onChangeserved = (e) => {
    setserved(e.target.checked);
  };

  const onChangechange = (e) => {
    setchange(e.target.checked);
  };

  return (
    <>
      <Cards
        title={
          <div className="setting-card-title">
            <Heading as="h4">Your Register Details</Heading>
            <span>
              Enable receipt printing to print receipts while billing with this
              register.
            </span>
            <span>
              By default, The shop name will be printed on the receipt.
            </span>
          </div>
        }
      >
        <Row gutter={25} justify="center">
          <Col xxl={12} md={14} sm={18} xs={24}>
            <Form
              autoComplete="off"
              style={{ width: "100%" }}
              form={form}
              name="add Register"
              onFinish={handleSubmit}
            >
              <Form.Item
                name="register_name"
                label="Register Name"
                rules={[
                  {
                    min: 3,
                    message: "Register name must be at least 3 characters long",
                  },
                  {
                    max: 40,
                    message:
                      "Register name cannot be more than 40 characters long.",
                  },
                  {
                    required: true,
                    message: "Register name is required",
                  },
                ]}
              >
                <Input
                  style={{ marginBottom: 10 }}
                  placeholder="Register Name"
                />
              </Form.Item>
              <Form.Item
                name="receipt_number_prefix"
                label={
                  <span>
                    Receipt Number Prefix &nbsp;&nbsp;
                    <Tooltip
                      title="Two letter prefix code for recepit number E.G Prefix AB Will generate receipt numbers like AB1,AB2 etc"
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
                    message: "Register prefix is required",
                    required: true,
                  },
                  {
                    max: 2,
                    message:
                      "Register prefix cannot be more than 2 characters long.",
                  },
                ]}
              >
                <Input
                  style={{ marginBottom: 10 }}
                  placeholder="Receipt Number Prefix"
                />
              </Form.Item>
              <Form.Item
                name="bill_header"
                label={
                  <span>
                    Bill Header &nbsp;&nbsp;
                    <Tooltip
                      title="The bill header will be printed at the top of the receipt and can be used to add your shop detail like address phone & tax numbers"
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
              >
                <TextArea
                  style={{ marginBottom: 10 }}
                  placeholder="Bill header content (optional)"
                />
              </Form.Item>
              <Form.Item
                name="bill_footer"
                label={
                  <span>
                    Bill Footer &nbsp;&nbsp;
                    <Tooltip
                      title="The bill footer will be printed at the bottom of the receipt and can be used to add details like terms and condition"
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
              >
                <TextArea
                  style={{ marginBottom: 10 }}
                  placeholder="Bill footer content (optional)"
                />
              </Form.Item>
              <Form.Item
                name="register_type"
                label="Printer Type (for PosEase Web)"
              >
                <Select style={{ width: "100%", marginBottom: 10 }}>
                  <Option value="80mm">3 inch recepit (80mm)</Option>
                  <Option value="58mm">2 inch receipt (58mm)</Option>
                  <Option value="A4">A4 size</Option>
                  <Option value="A5">A5 size</Option>
                </Select>
              </Form.Item>
              <Form.Item name="print_receipts">
                <Checkbox
                  onChange={onChangeprint}
                  className="add-form-check"
                  style={{ marginTop: 10 }}
                >
                  Print receipts and order tickets (for PosEase Web){" "}
                </Checkbox>
              </Form.Item>
              <Form.Item name="include_shop_logo">
                <Checkbox
                  onChange={onChangelogo}
                  className="add-form-check"
                  style={{ marginBottom: 10 }}
                >
                  Include shop logo in printed receipts (for PosEase Web){" "}
                </Checkbox>
              </Form.Item>
              <Form.Item
                name="table_numbers"
                label={
                  <span>
                    Table Numbers &nbsp;&nbsp;
                    <Tooltip
                      title="Provide table numbers either as a range eg:1-6,or as comman seprated values e.g G1,G2,G3,U1,U2,U3 if this field is set you will be able to manage table orders ,take aways and deliveries from the Sell page"
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
              >
                <TextArea
                  style={{ marginBottom: 10 }}
                  placeholder="Eg:1-6 or 1,2,3,4,5,6 (optional)"
                />
              </Form.Item>
              <Form.Item style={{ float: "right" }}>
                <Button
                  onClick={() => history.push("/settings/registers")}
                  className="go-back-button"
                  size="small"
                  type="white"
                  style={{ marginRight: "10px" }}
                >
                  Go Back
                </Button>
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Cards>
    </>
  );
  // return (
  //   <>
  //     <AccountWrapper>
  //       <PageHeader
  //         ghost
  //         title={
  //           <Tabs
  //             type="card"
  //             activeKey={activeTab}
  //             size="small"
  //             onChange={changeTab}
  //           >
  //             <TabPane
  //               tab="Basic Details"
  //               key="BASIC"
  //               className="ant-tabs-tab-active"
  //             ></TabPane>
  //             {/* <TabPane
  //               tab="Kitchne Display System Settings"
  //               key="SETTING"
  //             ></TabPane> */}
  //           </Tabs>
  //         }
  //       />
  //       {activeTab == "BASIC" ? (

  //       ) : (
  //         ""
  //       )}

  //       {activeTab == "SETTING" ? (
  //         <Cards
  //           title={
  //             <div className="setting-card-title">
  //               <Heading as="h4">
  //                 Your Waiter App / Kitchen Display System (KDS) Settings.
  //               </Heading>
  //               <span>
  //                 To enable Waiter app / KDS, configure the IP address of the
  //                 Poster
  //               </span>
  //               <span>
  //                 Desktop. The Waiter app and KDS should be on the same network.
  //               </span>
  //             </div>
  //           }
  //         >
  //           <Row gutter={25} justify="center">
  //             <Col xxl={12} md={14} sm={18} xs={24}>
  //               <Form
  //                 autoComplete="off"
  //                 style={{ width: "100%" }}
  //                 form={form}
  //                 name="Add_setting"
  //                 onFinish={handleSubmitSetting}
  //               >
  //                 <Form.Item
  //                   name="server_ip_address"
  //                   label={
  //                     <span>
  //                       Server IP Address For Waiter / KDS App &nbsp;&nbsp;
  //                       <Tooltip
  //                         title="Server IP addressis required to connect Waiter/KDS app to PosEase desktop"
  //                         color="#FFFF"
  //                       >
  //                         <InfoCircleFilled
  //                           style={{
  //                             color: "#AD005A",
  //                             paddingLeft: "12px !important",
  //                           }}
  //                         />
  //                       </Tooltip>
  //                     </span>
  //                   }
  //                 >
  //                   <Input
  //                     style={{ marginBottom: 10 }}
  //                     placeholder="Server IP address for waiter / KDS app (optional)"
  //                   />
  //                 </Form.Item>
  //                 <Form.Item
  //                   name="kds_stale_time"
  //                   label={
  //                     <span>
  //                       KDS Stale Time &nbsp;&nbsp;
  //                       <Tooltip
  //                         title="THis is used to highlight ageing orders in PosEase Kitchen Display System"
  //                         color="#FFFF"
  //                       >
  //                         <InfoCircleFilled
  //                           style={{
  //                             color: "#AD005A",
  //                             paddingLeft: "12px !important",
  //                           }}
  //                         />
  //                       </Tooltip>
  //                     </span>
  //                   }
  //                 >
  //                   <Input
  //                     type="number"
  //                     min={0}
  //                     initialValue={0}
  //                     style={{ marginBottom: 10 }}
  //                     placeholder="Stale time in minutes (optional)"
  //                     onKeyPress={(event) => {
  //                       if (event.key.match("[0-9,.]+")) {
  //                         return true;
  //                       } else {
  //                         return event.preventDefault();
  //                       }
  //                     }}
  //                   />
  //                 </Form.Item>
  //                 <Form.Item name="enable_accept_status">
  //                   <Checkbox
  //                     className="add-form-check"
  //                     onChange={onChangeaccept}
  //                   >
  //                     Enable accept status for orders in KDS{" "}
  //                   </Checkbox>
  //                 </Form.Item>
  //                 <Form.Item name="enable_served_status">
  //                   <Checkbox
  //                     className="add-form-check"
  //                     onChange={onChangeserved}
  //                   >
  //                     Enable served status for orders in KDS{" "}
  //                   </Checkbox>
  //                 </Form.Item>
  //                 <Form.Item name="allow_to_change_status">
  //                   <Checkbox
  //                     className="add-form-check"
  //                     onChange={onChangechange}
  //                   >
  //                     Allow to change status at item level in KDS{" "}
  //                   </Checkbox>
  //                 </Form.Item>
  //                 <Form.Item style={{ float: "right" }}>
  //                   <Button
  //                     onClick={() =>
  //                       history.push("/settings/registers")
  //                     }
  //                     className="go-back-button"
  //                     size="small"
  //                     type="white"
  //                     style={{ marginRight: "10px" }}
  //                   >
  //                     Go Back
  //                   </Button>
  //                   <Button type="primary" htmlType="submit">
  //                     Save
  //                   </Button>
  //                 </Form.Item>
  //               </Form>
  //             </Col>
  //           </Row>
  //         </Cards>
  //       ) : (
  //         ""
  //       )}
  //     </AccountWrapper>
  //   </>
  // );
};

export default AddRegister;
