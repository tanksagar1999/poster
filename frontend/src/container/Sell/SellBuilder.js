import React, { useState, useRef, useEffect } from "react";
import {
  Row,
  Col,
  Tabs,
  Input,
  Form,
  Card,
  Button,
  Modal,
  Tooltip,
  InputNumber,
} from "antd";
import { PageHeaderCurrent } from "../../components/page-headers-current/page-headers-current";
import { Main } from "../styled";
import { OrderBuilder } from "./Orders/OrderBuilder";
import { DraftBuilder } from "./Orders/DraftBuilder";
import CurrentBuilder from "./Current/CurrentBuilder";
import { AutoCompleteStyled } from "../../components/autoComplete/style";
import { TopToolBox } from "./Style";
import { SearchOutlined, CloseCircleFilled } from "@ant-design/icons";
import { BookingList } from "./Booking/BookingList";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
  createNewCartwithKeyandPush,
  getLocalCartCount,
  getCartInfoFromLocalKey,
  getItem,
  setItem,
  removeItem,
  getTableStatusFromId,
  setCartInfoFromLocalKey,
} from "../../utility/localStorageControl";

import { getAllDiscountRulesList } from "../../redux/discountRules/actionCreator";
import {
  getLastDevice,
  getLastReceipt,
  saveCurrentDevice,
} from "../../redux/sell/actionCreator";
import { InfoCircleFilled } from "@ant-design/icons";

import moment from "moment";
import DemoPrint from "./Print/DemoPrint";
import sellmsg from "../../static/img/sell/sellmsg.svg";
import Lock from "./Lock";

const SellBuilder = () => {
  const currentRegisterData = useSelector((state) =>
    state.register.RegisterList.find((val) => val.active)
  );

  const offLineMode = useSelector((state) => state.auth.offlineMode);
  const draft_count = useSelector((state) => state.Draftcounter.counter);

  const { TabPane } = Tabs;
  const [tableStatus, settableStatus] = useState("");
  let [activeTab, changeTab] = useState("");
  const [searchItems, setSeacrhItems] = useState("");
  const [searchtables, setSearhTables] = useState("");
  const [orderCartData, setOrderCartData] = useState({});
  const [localCartInfo, setlocalCartInfo] = useState({});
  const [LocalCartCount, setLocalCartCount] = useState(0);
  const [cusrrentTabDisbled, setCurrentTabDisbled] = useState();
  const [tableIsCustome, setTableIsCustome] = useState(false);
  const [swapTableNameList, setSwapTableNameList] = useState([]);
  const [customeTableList, setCustomeTableList] = useState([]);
  const [chargePageIs, setChargePageIs] = useState(false);
  const [tableName, setTableName] = useState();
  const [lastReceiptData, setLastReceiptData] = useState({});
  const [lastDeviceData, setLastDeviceData] = useState({});
  const [deviceName, setDeviceName] = useState();

  const dispatch = useDispatch();
  let isMounted = useRef(true);
  const [progress, setProgress] = useState(0);

  let suffix =
    searchItems != "" ? (
      <CloseCircleFilled onClick={() => setSeacrhItems("")} />
    ) : (
      <SearchOutlined />
    );
  let suffixTables =
    searchtables != "" ? (
      <CloseCircleFilled onClick={() => setSearhTables("")} />
    ) : (
      <SearchOutlined />
    );

  const [isRregister, setIsRregister] = useState(false);
  const showModal = () => {
    setIsRregister(true);
    async function fetchLastReceipt() {
      const lastReceipt = await dispatch(getLastReceipt());
      setLastReceiptData(lastReceipt.receiptData);
    }
    async function fetchLastDevice() {
      const lastDevice = await dispatch(getLastDevice());
      setLastDeviceData(lastDevice.deviceData);
    }

    if (isMounted.current) {
      fetchLastReceipt();
      fetchLastDevice();
    }
  };

  const handleOkregister = () => {
    setIsRregister(false);
  };
  const registerCancel = () => {
    setIsRregister(false);
  };

  useEffect(() => {
    if (getItem("active_cart") && currentRegisterData) {
      let localCartInFoData = getCartInfoFromLocalKey(
        getItem("active_cart"),
        currentRegisterData
      );

      if (localCartInFoData) {
        setlocalCartInfo(localCartInFoData);
        setTableName(localCartInFoData?.tableName);
        changeTab("CURRENT");
      }
    }
  }, []);
  const escKeyDown = (event, current) => {
    if (event.key == "Escape") {
      setSeacrhItems("");
      setSearhTables("");
      return;
    }
  };
  useEffect(() => {
    window.addEventListener("keydown", escKeyDown);
    return () => {
      window.removeEventListener("keydown", escKeyDown);
    };
  }, []);

  useEffect(() => {
    async function fetchDiscountRulesList() {
      const getDiscountRulesList = await dispatch(
        getAllDiscountRulesList("sell")
      );

      if (
        isMounted.current &&
        getDiscountRulesList &&
        getDiscountRulesList.DiscountRulesList
      )
        setItem(
          "CouponCodeList",
          getDiscountRulesList.DiscountRulesList
            ? getDiscountRulesList.DiscountRulesList
            : []
        );
      let ApplyAutomaticArrayTyepePercentage = [];
      let ApplyAutomaticArrayFixedAmount = [];
      let ApplyAutomaticArrayBuyOneGetOne = [];
      let ToDay = new Date();
      var format = "h:mmA";

      getDiscountRulesList?.DiscountRulesList.map((val) => {
        let startDate = new Date(val.start_date);
        let endDate = val.end_date ? new Date(val.end_date) : 0;
        let happyHours = [];
        happyHours = val.happy_hours_time?.split("-");
        var time = moment(moment().format("h:mmA"), format),
          beforeTime = moment(val.happy_hours_time?.split("-")[0], format),
          afterTime = moment(val.happy_hours_time?.split("-")[1], format);

        if (
          endDate != 0 &&
          startDate.setHours(0, 0, 0, 0) == endDate.setHours(0, 0, 0, 0) &&
          startDate.setHours(0, 0, 0, 0) == ToDay.setHours(0, 0, 0, 0) &&
          val.apply_automatically &&
          val.status == "enable" &&
          val.days_of_week.includes(moment().format("dddd"))
        ) {
          if (happyHours.length > 0 && time.isBetween(beforeTime, afterTime)) {
            if (val.discount_type == "percentage") {
              ApplyAutomaticArrayTyepePercentage.push(val);
            } else if (val.discount_type == "fixed_amount") {
              ApplyAutomaticArrayFixedAmount.push(val);
            } else if (val.discount_type == "buy_x_get_y") {
              ApplyAutomaticArrayBuyOneGetOne.push(val);
            }
          } else if (happyHours === undefined) {
            if (val.discount_type == "percentage") {
              ApplyAutomaticArrayTyepePercentage.push(val);
            } else if (val.discount_type == "fixed_amount") {
              ApplyAutomaticArrayFixedAmount.push(val);
            } else if (val.discount_type == "buy_x_get_y") {
              ApplyAutomaticArrayBuyOneGetOne.push(val);
            }
          }
        } else if (
          val.apply_automatically &&
          val.status == "enable" &&
          startDate <= ToDay &&
          val.days_of_week.includes(moment().format("dddd"))
        ) {
          if (
            endDate != 0 &&
            endDate >= ToDay &&
            happyHours.length > 0 &&
            time.isBetween(beforeTime, afterTime)
          ) {
            if (val.discount_type == "percentage") {
              ApplyAutomaticArrayTyepePercentage.push(val);
            } else if (val.discount_type == "fixed_amount") {
              ApplyAutomaticArrayFixedAmount.push(val);
            } else if (val.discount_type == "buy_x_get_y") {
              ApplyAutomaticArrayBuyOneGetOne.push(val);
            }
          } else if (endDate === 0 && happyHours === undefined) {
            if (val.discount_type == "percentage") {
              ApplyAutomaticArrayTyepePercentage.push(val);
            } else if (val.discount_type == "fixed_amount") {
              ApplyAutomaticArrayFixedAmount.push(val);
            } else if (val.discount_type == "buy_x_get_y") {
              ApplyAutomaticArrayBuyOneGetOne.push(val);
            }
          } else if (
            endDate === 0 &&
            happyHours.length > 0 &&
            time.isBetween(beforeTime, afterTime)
          ) {
            if (val.discount_type == "percentage") {
              ApplyAutomaticArrayTyepePercentage.push(val);
            } else if (val.discount_type == "fixed_amount") {
              ApplyAutomaticArrayFixedAmount.push(val);
            } else if (val.discount_type == "buy_x_get_y") {
              ApplyAutomaticArrayBuyOneGetOne.push(val);
            }
          } else if (
            happyHours === undefined &&
            endDate != 0 &&
            endDate >= ToDay
          ) {
            if (val.discount_type == "percentage") {
              ApplyAutomaticArrayTyepePercentage.push(val);
            } else if (val.discount_type == "fixed_amount") {
              ApplyAutomaticArrayFixedAmount.push(val);
            } else if (val.discount_type == "buy_x_get_y") {
              ApplyAutomaticArrayBuyOneGetOne.push(val);
            }
          }
        }
      });
      if (ApplyAutomaticArrayFixedAmount.length > 0) {
        const MaxValueOfFixedAmount = ApplyAutomaticArrayFixedAmount.reduce(
          function(prev, current) {
            return prev.discount > current.discount ? prev : current;
          }
        );
        setItem("MaxValueOfFixedAmount", MaxValueOfFixedAmount);
      } else {
        setItem("MaxValueOfFixedAmount", {
          discount: 0,
        });
      }
      if (ApplyAutomaticArrayTyepePercentage.length > 0) {
        const MaxValueOfPercenatge = ApplyAutomaticArrayTyepePercentage.reduce(
          function(prev, current) {
            return prev.discount > current.discount ? prev : current;
          }
        );
        setItem("MaxValueOfPercenatge", MaxValueOfPercenatge);
      } else {
        setItem("MaxValueOfPercenatge", {
          discount: 0,
        });
      }
      if (ApplyAutomaticArrayBuyOneGetOne.length > 0) {
        setItem("ApplyBuyOneGetOne", ApplyAutomaticArrayBuyOneGetOne);
      } else {
        setItem("ApplyBuyOneGetOne", []);
      }
    }

    function fetchCustomTableData() {
      let customTablesInfo = [];
      if (currentRegisterData && currentRegisterData.table_numbers != "") {
        let tableNosArray = currentRegisterData.table_numbers.split("),");
        let finalTableArray = [];
        let tableNosName;
        let tableNosRange;
        let splitedTbs;
        let roomArray = [];
        let i;
        tableNosArray.forEach((items) => {
          let inputNumberItem = items[0];
          if (items[0] == 1) {
            if (items.indexOf("-") > -1) {
              tableNosRange = items.split("-");
              tableNosRange[0] = parseInt(tableNosRange[0]);
              tableNosRange[1] = parseInt(tableNosRange[1]);

              if (tableNosRange[0] > tableNosRange[1]) {
                for (i = tableNosRange[1]; i <= tableNosRange[0]; i++) {
                  roomArray.push("Table" + " " + i);
                }
              } else {
                for (i = tableNosRange[0]; i <= tableNosRange[1]; i++) {
                  roomArray.push("Table" + " " + i);
                }
              }
            } else {
              tableNosRange = items.split(",");
              tableNosRange.forEach((items) => {
                roomArray.push("Table" + " " + items);
              });
            }

            i = 1;
            finalTableArray.forEach((item) => {
              if (item.name == "Table") {
                i = 2;
                item.rows = roomArray;
              }
            });
            if (i == 1) {
              finalTableArray.push({
                name: "Table",
                status: "Empty",
                rows: roomArray,
              });
            }
          } else if (
            isNaN(inputNumberItem) &&
            items &&
            items.indexOf("-") > -1
          ) {
            splitedTbs = items.split("(");

            tableNosName = splitedTbs[0];
            tableNosRange = splitedTbs[1];
            let roomCharArray = [];

            tableNosRange = tableNosRange.replace(")", "");

            tableNosRange = tableNosRange.split("-");
            tableNosRange[0] = parseInt(tableNosRange[0]);
            tableNosRange[1] = parseInt(tableNosRange[1]);

            if (tableNosRange[0] > tableNosRange[1]) {
              for (i = tableNosRange[1]; i <= tableNosRange[0]; i++) {
                roomCharArray.push("Table" + " " + i);
              }
            } else {
              for (i = tableNosRange[0]; i <= tableNosRange[1]; i++) {
                roomCharArray.push(tableNosName + " " + i);
              }
            }

            finalTableArray.push({
              name: tableNosName,
              status: "Empty",
              rows: roomCharArray,
            });
          } else if (items && items.indexOf(",") > -1) {
            let tempTables = items.split("(");
            tableNosName = tempTables[0];
            tableNosRange = tempTables[1];
            tableNosRange = tableNosRange.replace(")", "");
            tableNosRange = tableNosRange.split(",");
            let roomCharArray = [];
            tableNosRange.forEach((items) => {
              roomCharArray.push(tableNosName + " " + items);
            });
            finalTableArray.push({
              name: tableNosName,
              status: "Empty",
              rows: roomCharArray,
            });
          } else {
            if (items.indexOf("-") > -1) {
              tableNosRange = items.split("-");
              tableNosRange[0] = parseInt(tableNosRange[0]);
              tableNosRange[1] = parseInt(tableNosRange[1]);

              if (tableNosRange[0] > tableNosRange[1]) {
                for (i = tableNosRange[1]; i <= tableNosRange[0]; i++) {
                  roomArray.push("Table" + " " + i);
                }
              } else {
                for (i = tableNosRange[0]; i <= tableNosRange[1]; i++) {
                  roomArray.push("Table" + " " + i);
                }
              }
            } else {
              let tempTables = items.split("(");
              tableNosName = tempTables[0];
              tableNosRange = items.split(",");

              tableNosRange.forEach((items) => {
                tempTables[1].indexOf(")") > -1
                  ? finalTableArray.push({
                      name: tableNosName,
                      status: "Empty",
                      rows: [tableNosName + tempTables[1].slice(0, -1)],
                    })
                  : finalTableArray.push({
                      name: tableNosName,
                      status: "Empty",
                      rows: [tableNosName + tempTables[1]],
                    });
              });
            }

            i = 1;
            finalTableArray.forEach((item) => {
              if (item.name == "Table") {
                i = 2;
                item.rows = roomArray;
              }
            });
          }
        });

        customTablesInfo = finalTableArray;
      }
      let SwipList = [];
      customTablesInfo.map((table) => {
        table.rows.map((value, index) => {
          const status = getTableStatusFromId(
            value.replace(/\s+/g, "-").toLowerCase(),
            currentRegisterData
          );

          if (status == "In Progress" && tableName != value) {
            let table_Name_Arr = value.split("-");
            let val;

            if (table_Name_Arr.length > 1) {
              val = `${table_Name_Arr[0]}-${Number(table_Name_Arr[1]) + 1}`;
            } else if (table_Name_Arr.length == 1) {
              val = value.concat("-1");
            }

            SwipList.push({
              swapTableName: val,
              this_index: index,
              swapCustum: true,
            });
          } else if (status != "In Progress" && tableName != value) {
            SwipList.push({
              swapTableName: value,
              this_index: index,
              swapCustum: false,
            });
          }
        });
      });

      setSwapTableNameList(SwipList);
    }

    if (isMounted.current) {
      setLocalCartCount(getLocalCartCount(currentRegisterData));
      fetchDiscountRulesList();
      fetchCustomTableData();
    }

    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    setLocalCartCount(getLocalCartCount(currentRegisterData));
  }, []);

  const tabChangeToCurrentFunction = (tab, BookingDetils) => {
    changeTab(tab);
  };

  function searchNull(value) {
    setSeacrhItems(value);
  }
  const createNewTakeawayInLocalAndNavigateFunction = (
    type,
    navigateTo,
    data,
    SwapList,
    customTablesInfo,
    splitName,
    splitIndex
  ) => {
    type == "custom-table-local"
      ? setTableIsCustome(true)
      : setTableIsCustome(false);
    setSwapTableNameList(SwapList);
    setCustomeTableList(customTablesInfo);

    let localCartInFoData = createNewCartwithKeyandPush(
      type,
      data,
      currentRegisterData,
      {},
      splitName,
      splitIndex
    );
    setlocalCartInfo(localCartInFoData);
    setTableName(data.tableName);
    setLocalCartCount(getLocalCartCount(currentRegisterData));
    changeTab(navigateTo);
  };

  const getTakeawayInLocalAndNavigateFunction = (type, navigateTo, key) => {
    let localCartInFoData = getCartInfoFromLocalKey(key, currentRegisterData);
    setlocalCartInfo(localCartInFoData);
    setTableName(localCartInFoData.tableName);
    changeTab(navigateTo);
  };

  const editCartProductDetailsFunction = (data) => {
    setCartInfoFromLocalKey;
    let localCartInFoData = setCartInfoFromLocalKey(
      data.cartKey,
      data.data,
      "darftupdate"
    );
    localCartInFoData["update"] = true;
    setlocalCartInfo(localCartInFoData);

    setTableName(localCartInFoData.tableName);
    changeTab("CURRENT");
  };

  const setCustomerAndCartDataFunction = (data) => {
    setOrderCartData(data);
  };

  const updateCartCountFunction = () => {
    setLocalCartCount(getLocalCartCount(currentRegisterData));
  };

  const getTableStatusFunction = (tablevalue) => {
    settableStatus(tablevalue);
  };

  const chargePageIsShow = (value) => {
    setChargePageIs(value);
  };

  if (activeTab == "" && currentRegisterData) {
    currentRegisterData.table_numbers == "" || getItem("active_cart")
      ? (activeTab = "CURRENT")
      : (activeTab = "ORDER");
  }

  const [draftCount, setDarftCount] = useState(0);

  let registerData = getItem("setupCache").register.find((val) => val.active);
  let receiptModalTitle =
    registerData.register_name !== null
      ? "Activate " + registerData.register_name + " in this device"
      : "";
  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) {
      if (registerData.table_numbers == "") {
        changeTab("CURRENT");
        setlocalCartInfo({});
        setTableName();
      } else {
        setlocalCartInfo({});
        changeTab("ORDER");
        setTableName();
      }
    } else {
      didMount.current = true;
    }
  }, [registerData._id]);

  const handleLastDeviceSubmit = () => {
    const objData = {
      device_name: deviceName,
      last_receipt_number: lastReceiptData.receipt_number,
      register_id: registerData.register_id,
    };
    dispatch(saveCurrentDevice(objData));
    let ReceiptNumber = getItem(`Bill-${registerData.receipt_number_prefix}`);
    removeItem("isStartSellingFromThisDevice");
    registerCancel();

    /* removeItem(getItem(
       `Bill ${registerData.receipt_number_prefix}`
     ).includes("Bill")); */
    if (lastReceiptData && lastReceiptData.receipt_number !== null) {
      let receiptSlashPartRemove = lastReceiptData.receipt_number.split("/");
      let receiptpart = receiptSlashPartRemove[1].split("-");
      // console.log("receipt part", receiptpart[0]);
      if (getItem(`Bill-${receiptpart[0].trim()}`) !== null) {
        setItem(`Bill-${receiptpart[0].trim()}`, {
          receipt: `${receiptpart[0].trim() +
            "-" +
            receiptpart[1].trim()}-${receiptpart[2].trim()}`,
          sn: receiptpart[3].trim(),
        });
        /// console.log("latest bill", getItem(`Bill ${receiptpart[0]}`));
      } else {
        setItem(`Bill-${receiptpart[0].trim()}`, {
          receipt: `${receiptpart[0].trim() +
            "-" +
            receiptpart[1].trim()}-${receiptpart[2].trim()}`,
          sn: receiptpart[3].trim(),
        });
      }
    } else {
      setItem(`Bill-${registerData.receipt_number_prefix}`, {
        receipt: `${
          registerData.receipt_number_prefix
        }-${generate_random_string(3)}-${generate_random_number(4)}`,
        sn: 1,
      });
    }
  };

  return (
    <>
      {!currentRegisterData ? (
        " "
      ) : (
        <Main className="sellscroll">
          {getItem("enable_billing_only_when_shift_is_opened") != null &&
          getItem("enable_billing_only_when_shift_is_opened") == true &&
          getItem("shfitOpenedTS") != null &&
            getItem("shfitOpenedTS") == "close" ? (
            <Lock />
          ) : getItem("localReceipt") != null &&
            getItem("localReceipt") === true &&
            getItem("isStartSellingFromThisDevice") === true &&
            (getItem("enable_billing_only_when_shift_is_opened") == null ||
              getItem("enable_billing_only_when_shift_is_opened") == false) ? (
            <Card>
              <div className="start_selling">
                <img src={sellmsg} alt="" width={200} />
                <h3>Start selling from this device?</h3>
                <p>
                  To start selling here, you have to <span>sign out</span> of
                  other devices that use Beer Bar register<br></br> and ensure
                  that there are <span>no receipts pending sync.</span>
                </p>
                <Button
                  size="small"
                  className="btn-custom"
                  type="primary"
                  onClick={showModal}
                >
                  Start Selling here
                </Button>
                <em>
                  You are seeing this because you have enforced sequential local
                  receipt numbers in your preferences setup.
                </em>
                <Modal
                  title={receiptModalTitle}
                  visible={isRregister}
                  onOk={handleLastDeviceSubmit}
                  onCancel={registerCancel}
                >
                  <Form.Item
                    name="sort_order"
                    label={
                      <span>
                        Device Name&nbsp;&nbsp;
                        <Tooltip
                          title="Give a name like My Shop Desktop will help you to recollect this device when you switch device later."
                          color="#FFFF"
                        >
                          <InfoCircleFilled style={{ color: "#AD005A" }} />
                        </Tooltip>
                      </span>
                    }
                  >
                    <Input
                      type="txt"
                      style={{ width: "100%" }}
                      onBlur={(e) => setDeviceName(e.target.value)}
                    />
                  </Form.Item>
                  <div className="previous_pop">
                    {lastDeviceData && lastDeviceData.device_name !== null ? (
                      <p>
                        Your previous device was {lastDeviceData.device_name}.
                      </p>
                    ) : (
                      ""
                    )}
                    {lastReceiptData && lastReceiptData.receipt_number ? (
                      <p>
                        Your previous local receipt number was{" "}
                        {lastReceiptData.receipt_number}.{" "}
                        <Tooltip
                          title="Contact support in case you want to reset your local receipt number."
                          color="#FFFF"
                        >
                          <InfoCircleFilled style={{ color: "#AD005A" }} />
                        </Tooltip>
                      </p>
                    ) : (
                      ""
                    )}
                  </div>
                </Modal>
              </div>
            </Card>
          ) : (
            <>
              <PageHeaderCurrent
                style={{ width: "60%" }}
                className="sell-current-pageheader hidetabsrc"
                size="large"
                ghost
                title={
                  <>
                    <Tabs
                      className="sell-tabs"
                      type="card"
                      activeKey={activeTab}
                      size="small"
                      onChange={changeTab}
                    >
                      {currentRegisterData?.table_numbers != "" && (
                        <TabPane
                          tab={
                            <div className="drft_counno">
                              Orders
                              <span>{LocalCartCount}</span>
                            </div>
                          }
                          key="ORDER"
                          style={{ outline: "none" }}
                        ></TabPane>
                      )}
                      {console.log("getItembhaibhai", getItem("active_cart"))}
                      <TabPane
                        tab="Current"
                        key="CURRENT"
                        disabled={
                          getItem("active_cart") == null &&
                          currentRegisterData?.table_numbers != ""
                            ? true
                            : false
                        }
                        style={{ outline: "none" }}
                      ></TabPane>
                      {currentRegisterData?.table_numbers == "" && (
                        <TabPane
                          tab={
                            <div className="drft_counno">
                              Drafts <span>{draftCount}</span>
                            </div>
                          }
                          key="DRAFTS"
                          style={{ outline: "none" }}
                        ></TabPane>
                      )}
                      {getItem("booking_tab") && (
                        <TabPane
                          tab="Bookings"
                          key="BOOKING"
                          style={{ outline: "none" }}
                        ></TabPane>
                      )}
                    </Tabs>
                  </>
                }
                subTitle={
                  <TopToolBox>
                    <div
                      style={{ boxShadow: "none", marginLeft: "10px" }}
                      className="search_lrm"
                    >
                      {activeTab == "ORDER" ? (
                        <Input
                          suffix={suffixTables}
                          autoFocus
                          placeholder="Search Tables"
                          style={{
                            borderRadius: "30px",
                            width: "250px",
                          }}
                          onChange={(e) => setSearhTables(e.target.value)}
                          value={searchtables}
                          className={`cre_avf - ${activeTab}`}
                        />
                      ) : (activeTab == "CURRENT" &&
                          getItem("listView") == null) ||
                        getItem("listView") == false ? (
                        <Input
                          suffix={suffix}
                          autoFocus
                          placeholder="Search items"
                          style={{
                            borderRadius: "30px",
                            width: "250px",
                          }}
                          onChange={(e) => setSeacrhItems(e.target.value)}
                          value={searchItems}
                          className={`cre_avf - ${activeTab}`}
                        />
                      ) : null}

                      <span className="offlineMod-line">
                        {getItem("pendingReceipts") != null &&
                        getItem("pendingReceipts").length > 0
                          ? `You are offline, but can continue billing. ${
                              getItem("pendingReceipts").length
                            } receipts to async`
                          : offLineMode &&
                            "You are offline, but can continue billing"}
                      </span>
                    </div>
                  </TopToolBox>
                }
              />
              <Row gutter={25}>
                <Col md={24} xs={24}>
                  {activeTab === "ORDER" ? (
                    <OrderBuilder
                      search={searchtables}
                      tabChangeToCurrent={tabChangeToCurrentFunction}
                      createNewTakeawayInLocalAndNavigate={
                        createNewTakeawayInLocalAndNavigateFunction
                      }
                      getTakeawayInLocalAndNavigate={
                        getTakeawayInLocalAndNavigateFunction
                      }
                      getTableStatus={getTableStatusFunction}
                      setCurrentTabDisbled={setCurrentTabDisbled}
                      localCartInfo={localCartInfo}
                      currentRegisterData={currentRegisterData}
                    />
                  ) : (
                    ""
                  )}

                  {activeTab === "DRAFTS" ? (
                    <DraftBuilder
                      setLocalCartCount={setLocalCartCount}
                      tabChangeToCurrent={tabChangeToCurrentFunction}
                      createNewTakeawayInLocalAndNavigate={
                        createNewTakeawayInLocalAndNavigateFunction
                      }
                      getTakeawayInLocalAndNavigate={
                        getTakeawayInLocalAndNavigateFunction
                      }
                      getTableStatus={getTableStatusFunction}
                      editCartProductDetails={editCartProductDetailsFunction}
                      currentRegisterData={currentRegisterData}
                      setlocalCartInfo={setlocalCartInfo}
                      setTableName={setTableName}
                    />
                  ) : (
                    ""
                  )}
                  {activeTab === "BOOKING" && (
                    <BookingList
                      tabChangeToCurrent={tabChangeToCurrentFunction}
                    />
                  )}
                  {activeTab === "PRINT" && <DemoPrint />}
                  {activeTab === "CURRENT" ? (
                    <CurrentBuilder
                      search={searchItems}
                      nullSearch={searchNull}
                      tabChangeToCurrent={tabChangeToCurrentFunction}
                      setCustomerAndCartData={setCustomerAndCartDataFunction}
                      localCartInfo={localCartInfo}
                      tableName={tableName}
                      updateCartCount={updateCartCountFunction}
                      tableConfiguration={tableStatus}
                      tableIsCustome={tableIsCustome}
                      swapTableNameList={swapTableNameList}
                      setlocalCartInfo={setlocalCartInfo}
                      setTableName={setTableName}
                      customeTableList={customeTableList}
                      chargePageIsShow={chargePageIsShow}
                      registerData={currentRegisterData}
                      setDarftCount={setDarftCount}
                    />
                  ) : (
                    ""
                  )}
                </Col>
              </Row>
            </>
          )}
        </Main>
      )}
    </>
  );
};

export default SellBuilder;
