import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useRef,
} from "react";
import ReactDOM from "react-dom";
import _ from "lodash";
import "./productEditModal.css";
import {
  Modal,
  Button,
  Form,
  Input,
  Radio,
  Select,
  Tooltip,
  Badge,
  Row,
  Col,
} from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

import {
  setCartInfoFromLocalKey,
  removeCartFromLocalStorage,
  getCartInfoFromLocalKey,
  setOrderTickets,
  setItem,
  getItem,
} from "../../../utility/localStorageControl";
import commonFunction from "../../../utility/commonFunctions";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import { OrderTicketPrint } from "./OrderTicketPrint";
import ReactDOMServer from "react-dom/server";

const OrderTicketModal = React.memo(
  forwardRef((props, ref) => {
    let {
      table_name,
      swapTableNameList,
      selectedProduct,
      setlocalCartInfo,
      setTableName,
      localCartInfo,
      customeTableList,
      registerData,
      orderTicketProduct,
      setOrderTicketProduct,
      setModelOpened,
      setCheckCurrent,
      createOrderTikits,
    } = props;

    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    let [listOfUpdatedproducts, setListOfUpdatedProduts] = useState([]);

    const [categoryData, setCategoryData] = useState();

    const [dataLoaded, setDataLoaded] = useState(false);
    const onBeforeGetContentResolve = useRef();
    const componentRef = useRef();
    const onClickButton = useRef();

    const [status, setStatus] = useState(false);
    const [print, setPrint] = useState(false);

    const handleOnBeforeGetContent = () => {
      return new Promise((resolve) => {
        onBeforeGetContentResolve.current = resolve;
        return setDataLoaded(true); // When data is done loading
      });
    };

    useEffect(() => {
      setPrint(false);
      if (dataLoaded) {
        setCategoryData(categoryData);
        onBeforeGetContentResolve.current();
      }
      setDataLoaded(false);
    }, [dataLoaded, onBeforeGetContentResolve, selectedProduct]);

    useEffect(() => {
      let finalData = [];
      if (localCartInfo && localCartInfo.orderTicketsData) {
        let totalOrderTikets = [];
        localCartInfo.orderTicketsData.map((val) => {
          val.itemList.map((i) => {
            totalOrderTikets.push(i);
          });
        });

        var holder = {};
        totalOrderTikets.forEach(function (d) {
          d.newqty = d.newqty ? d.newqty : d.quantity;
          if (d.add_or_remove == "Added Items") {
            if (holder.hasOwnProperty(d.key)) {
              holder[d.key] = holder[d.key] + d.newqty;
            } else {
              holder[d.key] = d.newqty;
            }
          } else if (d.add_or_remove == "Removed Items") {
            if (holder.hasOwnProperty(d.key)) {
              holder[d.key] = holder[d.key] - d.newqty;
            } else {
              holder[d.key] = d.newqty;
            }
          }
        });

        var obj2 = [];
        for (var prop in holder) {
          obj2.push({ key: prop, newqty: holder[prop] });
        }

        obj2.map((i) => {
          selectedProduct.map((data) => {
            if (i.key === data.key) {
              if (data.quantity > i.newqty) {
                (data.add_or_remove = "Added Items"),
                  (data.newqty = data.quantity - i.newqty);
                finalData.push(data);
              } else if (data.quantity < i.newqty) {
                data.add_or_remove = "Removed Items";
                data.newqty = i.newqty - data.quantity;
                finalData.push(data);
              }
            }
          });
        });

        var result = selectedProduct.filter(function (o1) {
          return !obj2.some(function (o2) {
            return o1.key === o2.key;
          });
        });
        if (result.length > 0) {
          result.map((val) => {
            finalData.push(val);
          });
        }
        var result2 = obj2.filter(function (o1) {
          return !selectedProduct.some(function (o2) {
            return o1.key === o2.key;
          });
        });

        if (result2.length > 0) {
          result2.map((i) => {
            let findData = totalOrderTikets.find((j) => j.key === i.key);
            findData.newqty = i.newqty;
            findData.add_or_remove = "Removed Items";
            finalData.push(findData);
          });
        }
      } else {
        selectedProduct.map((val) => {
          val.newqty = val.quantity;
          finalData.push(val);
        });
      }

      let arrayData = Object.values(
        finalData.reduce(function (res, value) {
          if (!res[value?.order_ticket_group?._id]) {
            res[value?.order_ticket_group?._id] = {
              categoryName: value?.order_ticket_group?.order_ticket_group_name,
              data: [value],
            };
          } else {
            res[value?.order_ticket_group?._id].data.push(value);
          }

          return res;
        }, {})
      );

      let status = false;
      arrayData.map((i) => {
        if (i.data[0].newqty > 0) {
          status = true;
        }
      });
      console.log("arrayDataarrayData", arrayData);
      arrayData = arrayData.filter((val) => val.categoryName);

      setListOfUpdatedProduts([...arrayData]);
      setStatus(status);
    }, [selectedProduct]);

    const handlePrint = useReactToPrint({
      content: () => componentRef.current,
      onBeforeGetContent: handleOnBeforeGetContent,
    });

    let PreviousTikets = [];
    const [localOrdertiketsData, setLocalOrderTiketsData] = useState([]);

    // useEffect(() => {}, []);

    useEffect(() => {
      window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }, []);
    let OrderTicketsData = [];

    if (localCartInfo && localCartInfo.orderTicketsData) {
      OrderTicketsData = getCartInfoFromLocalKey(
        localCartInfo?.cartKey,
        registerData
      )?.orderTicketsData?.reverse();

      OrderTicketsData &&
        OrderTicketsData.length &&
        OrderTicketsData.map((val) => {
          PreviousTikets.push(val.tiketNumber);
        });
    }

    useImperativeHandle(ref, () => ({
      showModal() {
        setIsModalVisible(true);
        // setModelOpened(false)
      },
    }));

    const handleCancel = () => {
      setIsModalVisible(false);
      // setModelOpened(false)
    };

    function checkCategory(val) {
      let Add = [];
      let remove = [];
      val.data.map((j) => {
        if (j.add_or_remove == "Removed Items") {
          remove.push(j);
        } else {
          Add.push(j);
        }
      });
      return Add.length > 0 && remove.length > 0
        ? "both"
        : Add.length > 0 && remove.length == 0
          ? "Added Items"
          : "Removed Items";
    }

    const onSubmit = () => {
      form
        .validateFields()
        .then(async (values) => {
          listOfUpdatedproducts.map((val) => {
            let OrderTicketNumber;
            if (getItem("previousOrderTicketNumber") != null) {
              let Details = getItem("previousOrderTicketNumber");

              if (moment(Details.date).isSame(moment().format("L"))) {
                OrderTicketNumber = 1 + Details.number;
                setItem("previousOrderTicketNumber", {
                  date: moment().format("L"),
                  number: 1 + Details.number,
                });
              } else {
                OrderTicketNumber = 1;
                setItem("previousOrderTicketNumber", {
                  date: moment().format("L"),
                  number: 1,
                });
              }
            } else {
              OrderTicketNumber = 1;
              setItem("previousOrderTicketNumber", {
                date: moment().format("L"),
                number: 1,
              });
            }
            let object = {
              orderNotes: values?.order_tickets_notes,
              tiketNumber: OrderTicketNumber,
              categoryName: val.categoryName,
              add_remove: checkCategory(val),
              itemList: val.data,
              enterDate: new Date(),
              table_name: table_name,
            };
            setCategoryData(object);
            setIsModalVisible(false);
            window.frames[
              "print_frame"
            ].document.body.innerHTML = ReactDOMServer.renderToStaticMarkup(
              <OrderTicketPrint
                categoryDetails={object}
                PreviousTikets={PreviousTikets}
                ReceiptNumber={
                  getItem(`Bill-${registerData.receipt_number_prefix}`) &&
                  ` ${getItem(`Bill-${registerData.receipt_number_prefix}`)
                    .receipt
                  }-${getItem(`Bill-${registerData.receipt_number_prefix}`).sn}`
                }
              />
            );
            window.frames["print_frame"].window.focus();
            window.frames["print_frame"].window.print();
            if (
              getItem("print_server_copy") !== null &&
              getItem("print_server_copy") == true
            ) {
              window.frames[
                "print_frame"
              ].document.body.innerHTML = ReactDOMServer.renderToStaticMarkup(
                <OrderTicketPrint
                  title="SERVER COPY"
                  categoryDetails={object}
                  PreviousTikets={PreviousTikets}
                  ReceiptNumber={
                    getItem(`Bill-${registerData.receipt_number_prefix}`) &&
                    ` ${getItem(`Bill-${registerData.receipt_number_prefix}`)
                      .receipt
                    }-${getItem(`Bill-${registerData.receipt_number_prefix}`).sn
                    }`
                  }
                />
              );
              window.frames["print_frame"].window.focus();
              window.frames["print_frame"].window.print();
            }
            setListOfUpdatedProduts([]);

            if (getItem("active_cart") != null && getItem("active_cart")) {
              setOrderTickets(getItem("active_cart"), val.data, object);
            }
          });

          // const orderTicketgenarated = true

          // setItem("orderTicketgenarated",true)
          // setModelOpened(false)
          form.resetFields();
        })
        .catch((errorInfo) => console.log("err", errorInfo));
    };

    const multiFunctions = () => {
      onSubmit();
      setPrint(true);
    };

    const handlePrintCategory = (val) => {
      let priTickets = PreviousTikets.filter(
        (item) => item !== val.tiketNumber
      );

      window.frames[
        "print_frame"
      ].document.body.innerHTML = ReactDOMServer.renderToStaticMarkup(
        <OrderTicketPrint
          categoryDetails={val}
          PreviousTikets={priTickets}
          ReceiptNumber={
            getItem(`Bill-${registerData.receipt_number_prefix}`) &&
            ` ${getItem(`Bill-${registerData.receipt_number_prefix}`).receipt
            }-${getItem(`Bill-${registerData.receipt_number_prefix}`).sn}`
          }
        />
      );
      window.frames["print_frame"].window.focus();
      window.frames["print_frame"].window.print();

      if (
        getItem("print_server_copy") !== null &&
        getItem("print_server_copy") == true
      ) {
        window.frames[
          "print_frame"
        ].document.body.innerHTML = ReactDOMServer.renderToStaticMarkup(
          <OrderTicketPrint
            title="SERVER COPY"
            categoryDetails={val}
            PreviousTikets={priTickets}
            ReceiptNumber={
              getItem(`Bill-${registerData.receipt_number_prefix}`) &&
              ` ${getItem(`Bill-${registerData.receipt_number_prefix}`).receipt
              }-${getItem(`Bill-${registerData.receipt_number_prefix}`).sn}`
            }
          />
        );
        window.frames["print_frame"].window.focus();
        window.frames["print_frame"].window.print();
      }
    };

    const handleKeyDown = (event) => {
      if (event.keyCode == 120) {
        onClickButton?.current?.click();
        setIsModalVisible(false);
        setCheckCurrent(false);
        // window.removeEventListener("keydown", handleKeyDown);
      }
    };

    return (
      <>
        <Modal
          title="Order Ticket"
          visible={isModalVisible}
          bodyStyle={{ paddingTop: 0 }}
          onOk={form.submit}
          onCancel={handleCancel}
          width={700}
          footer={[
            <Button
              type="default"
              className="btn-cancel btn-custom go_back"
              onClick={() => {
                setIsModalVisible(false);
              }}
            >
              Go Back
            </Button>,
            <Button
              type="primary"
              disabled={
                listOfUpdatedproducts.length > 0 && status ? false : true
              }
              ref={onClickButton}
              onClick={() => {
                multiFunctions();
              }}
            >
              {listOfUpdatedproducts.length > 0 && status
                ? "Create Order Ticket(F9)"
                : "No New Updates"}
            </Button>,
          ]}
        >
          <h1></h1>
          <Form
            autoComplete="off"
            style={{ width: "100%" }}
            form={form}
            onFinish={onSubmit}
            name="editProduct"
          >
            <Form.Item
              name="darft_name"
              label={
                <>
                  Darft Name&nbsp;
                  <Tooltip title="Creating order ticket will also backup the sale to darfts. The draft name can help tp identify the order ticket for example,a restaurant can provide the table number as a draft name.">
                    <QuestionCircleOutlined style={{ cursor: "pointer" }} />
                  </Tooltip>
                </>
              }
            >
              <div style={{ display: "none" }}> {table_name}</div>
              <Input
                value={table_name}
                disabled={true}
                style={{
                  backgroundColor: "hsla(0,0%,93%,.27058823529411763)",
                  color: "black",
                }}
              />
            </Form.Item>
            {listOfUpdatedproducts.length > 0 && status && (
              <Form.Item name="order_tickets_notes" label="Order Ticket Notes">
                <Input
                  placeholder="
              Order ticket notes (optional)"
                />
              </Form.Item>
            )}
          </Form>

          <div style={{ overflowY: "scroll", maxHeight: "400px" }}>
            {listOfUpdatedproducts.length > 0 && (
              <>
                {listOfUpdatedproducts.map((categorydata) => {
                  if (checkCategory(categorydata) != "both") {
                    return (
                      <>
                        {status && (
                          <div style={{ marginTop: "20px" }}>
                            <label>
                              {categorydata.categoryName}-Updated Now
                            </label>
                            <div className="borderUpper-top"></div>
                            <label>
                              <Badge
                                status={
                                  checkCategory(categorydata) == "Removed Items"
                                    ? "error"
                                    : "success"
                                }
                              />
                              {checkCategory(categorydata)}
                            </label>
                            <div style={{ marginTop: "10px" }}>
                              {categorydata.data.map((i) => {
                                let text2 = i.display_name.toString();
                                let newSpilitArray = text2.split(/[+]/);
                                let newSpilitArray1 = text2.split(/[,]/);
                                let finalArray = [];
                                newSpilitArray.map((value) => {
                                  finalArray.push(value.replace(/,/gi, ""));
                                });
                                return (
                                  <>
                                    <div style={{ marginBottom: "7px" }}>
                                      <>
                                        {text2.includes("-") ? (
                                          newSpilitArray1.map((val, index) => (
                                            <div>
                                              {index == 0
                                                ? `${i.newqty
                                                  ? i.newqty
                                                  : i.quantity
                                                } x `
                                                : null}
                                              {val}
                                            </div>
                                          ))
                                        ) : (
                                          <div>
                                            {finalArray.length > 1 ? (
                                              <div>
                                                {finalArray.map(
                                                  (value, index) => {
                                                    return (
                                                      <div>
                                                        {index == 0
                                                          ? `${i.newqty
                                                            ? i.newqty
                                                            : i.quantity
                                                          } x `
                                                          : null}
                                                        {index > 0 ? "+" : null}
                                                        {value}
                                                      </div>
                                                    );
                                                  }
                                                )}
                                              </div>
                                            ) : (
                                              <div>
                                                {i.newqty
                                                  ? i.newqty
                                                  : i.quantity}{" "}
                                                x {i.display_name}
                                              </div>
                                            )}
                                          </div>
                                        )}
                                      </>
                                      {i.orderTiketsNotes && (
                                        <div style={{ fontSize: "12px" }}>
                                          Notes - {i.orderTiketsNotes}
                                        </div>
                                      )}
                                    </div>
                                  </>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </>
                    );
                  } else {
                    return (
                      <>
                        {status && (
                          <div style={{ marginTop: "20px" }}>
                            <label>
                              {categorydata.categoryName}-Updated Now
                            </label>
                            <div className="borderUpper-top"></div>
                            <Row xxl={24} md={24} sm={24} xs={24}>
                              <Col xxl={12} md={12} sm={24} xs={24}>
                                <label>
                                  <Badge status="success" />
                                  Added Items
                                </label>
                                <div style={{ marginTop: "10px" }}>
                                  {categorydata.data.map((i) => {
                                    let text2 = i.display_name.toString();
                                    let newSpilitArray = text2.split(/[+]/);
                                    let newSpilitArray1 = text2.split(/[,]/);
                                    let finalArray = [];
                                    newSpilitArray.map((value) => {
                                      finalArray.push(value.replace(/,/gi, ""));
                                    });
                                    if (i.add_or_remove == "Added Items") {
                                      return (
                                        <>
                                          <div style={{ marginBottom: "7px" }}>
                                            <>
                                              {text2.includes("-") ? (
                                                newSpilitArray1.map(
                                                  (val, index) => (
                                                    <div>
                                                      {index == 0
                                                        ? `${i.newqty
                                                          ? i.newqty
                                                          : i.quantity
                                                        } x `
                                                        : null}
                                                      {val}
                                                    </div>
                                                  )
                                                )
                                              ) : (
                                                <div>
                                                  {" "}
                                                  {finalArray.length > 1 ? (
                                                    <div>
                                                      {finalArray.map(
                                                        (value, index) => {
                                                          return (
                                                            <div>
                                                              {index == 0
                                                                ? `${i.newqty
                                                                  ? i.newqty
                                                                  : i.quantity
                                                                } x `
                                                                : null}
                                                              {index > 0
                                                                ? "+"
                                                                : null}
                                                              {value}
                                                            </div>
                                                          );
                                                        }
                                                      )}
                                                    </div>
                                                  ) : (
                                                    <div>
                                                      {i.newqty
                                                        ? i.newqty
                                                        : i.quantity}{" "}
                                                      x {i.display_name}
                                                    </div>
                                                  )}
                                                </div>
                                              )}
                                            </>
                                            {i.orderTiketsNotes && (
                                              <div style={{ fontSize: "12px" }}>
                                                Notes - {i.orderTiketsNotes}
                                              </div>
                                            )}
                                          </div>
                                        </>
                                      );
                                    }
                                  })}
                                </div>
                              </Col>
                              <Col xxl={12} md={12} sm={24} xs={24}>
                                <label>
                                  <Badge status="error" />
                                  Removed Items
                                </label>
                                <div style={{ marginTop: "10px" }}>
                                  {categorydata.data.map((i) => {
                                    let text2 = i.display_name.toString();
                                    let newSpilitArray = text2.split(/[+]/);
                                    let newSpilitArray1 = text2.split(/[,]/);
                                    let finalArray = [];
                                    newSpilitArray.map((value) => {
                                      finalArray.push(value.replace(/,/gi, ""));
                                    });
                                    if (i.add_or_remove == "Removed Items") {
                                      return (
                                        <>
                                          <div style={{ marginBottom: "7px" }}>
                                            <>
                                              {text2.includes("-") ? (
                                                newSpilitArray1.map(
                                                  (val, index) => (
                                                    <div>
                                                      {index == 0
                                                        ? `${i.newqty
                                                          ? i.newqty
                                                          : i.quantity
                                                        } x `
                                                        : null}
                                                      {val}
                                                    </div>
                                                  )
                                                )
                                              ) : (
                                                <div>
                                                  {" "}
                                                  {finalArray.length > 1 ? (
                                                    <div>
                                                      {finalArray.map(
                                                        (value, index) => {
                                                          return (
                                                            <div>
                                                              {index == 0
                                                                ? `${i.newqty
                                                                  ? i.newqty
                                                                  : i.quantity
                                                                } x `
                                                                : null}
                                                              {index > 0
                                                                ? "+"
                                                                : null}
                                                              {value}
                                                            </div>
                                                          );
                                                        }
                                                      )}
                                                    </div>
                                                  ) : (
                                                    <div>
                                                      {i.newqty
                                                        ? i.newqty
                                                        : i.quantity}{" "}
                                                      x {i.display_name}
                                                    </div>
                                                  )}
                                                </div>
                                              )}
                                            </>
                                            {i.orderTiketsNotes && (
                                              <div style={{ fontSize: "12px" }}>
                                                Notes - {i.orderTiketsNotes}
                                              </div>
                                            )}
                                          </div>
                                        </>
                                      );
                                    }
                                  })}
                                </div>
                              </Col>
                            </Row>
                          </div>
                        )}
                      </>
                    );
                  }
                })}
              </>
            )}

            {OrderTicketsData &&
              OrderTicketsData.length > 0 &&
              OrderTicketsData.map((val) => {
                if (val.add_remove != "both") {
                  return (
                    <>
                      <div style={{ marginTop: "20px" }}>
                        <label className="space-content">
                          <span>
                            {val.categoryName}
                            {` - Order Ticket #${val.tiketNumber} `}
                            <small>| Accepted </small>
                            <span
                              style={{ color: "#008cba", cursor: "pointer" }}
                              onClick={() => {
                                handlePrintCategory(val);
                                setCategoryData(val);
                                // handlePrint();
                              }}
                            >
                              Print
                            </span>
                          </span>
                          <span style={{ marginRight: "10px" }}>
                            {commonFunction.convertToDate(
                              val.enterDate,
                              "MMM DD, Y h:mm A"
                            )}{" "}
                            | {getItem("userDetails").username}
                          </span>
                        </label>
                        <div className="borderUpper-top"></div>
                        <label>
                          <Badge
                            status={
                              val.add_remove == "Added Items"
                                ? "success"
                                : "error"
                            }
                          />
                          {val.add_remove}
                        </label>
                        <div style={{ marginTop: "10px" }}>
                          {val.itemList.map((i) => {
                            let text2 = i.display_name.toString();
                            let newSpilitArray = text2.split(/[+]/);
                            let newSpilitArray1 = text2.split(/[,]/);
                            let finalArray = [];
                            newSpilitArray.map((value) => {
                              finalArray.push(value.replace(/,/gi, ""));
                            });
                            return (
                              <>
                                <div style={{ marginBottom: "7px" }}>
                                  <>
                                    {text2.includes("-") ? (
                                      newSpilitArray1.map((val, index) => (
                                        <div>
                                          {index == 0
                                            ? `${i.newqty ? i.newqty : i.quantity
                                            } x `
                                            : null}

                                          {val}
                                        </div>
                                      ))
                                    ) : (
                                      <div>
                                        {" "}
                                        {finalArray.length > 1 ? (
                                          <div>
                                            {finalArray.map((value, index) => {
                                              return (
                                                <div>
                                                  {index == 0
                                                    ? `${i.newqty
                                                      ? i.newqty
                                                      : i.quantity
                                                    } x `
                                                    : null}
                                                  {index > 0 ? "+" : null}
                                                  {value}
                                                </div>
                                              );
                                            })}
                                          </div>
                                        ) : (
                                          <div>
                                            {" "}
                                            {i.newqty
                                              ? i.newqty
                                              : i.quantity} x {i.display_name}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </>
                                  {i.orderTiketsNotes && (
                                    <div style={{ fontSize: "12px" }}>
                                      Notes - {i.orderTiketsNotes}
                                    </div>
                                  )}
                                </div>
                              </>
                            );
                          })}
                          {val.orderNotes &&
                            `Order ticket notes - ${val.orderNotes}`}
                        </div>
                      </div>
                    </>
                  );
                } else {
                  return (
                    <>
                      <div style={{ marginTop: "20px" }}>
                        <label className="space-content">
                          <span>
                            {val.categoryName}
                            {` - Order Ticket #${val.tiketNumber} `}
                            <small>| Accepted </small>
                            <span
                              style={{ color: "#008cba", cursor: "pointer" }}
                              onClick={() => {
                                handlePrintCategory(val);
                              }}
                            >
                              Print
                            </span>
                          </span>
                          <span style={{ marginRight: "10px" }}>
                            {commonFunction.convertToDate(
                              val.enterDate,
                              "MMM DD, Y h:mm A"
                            )}{" "}
                            | {getItem("userDetails").username}
                          </span>
                        </label>
                        <Row xxl={24} md={24} sm={24} xs={24}>
                          <Col xxl={12} md={12} sm={24} xs={24}>
                            <label>
                              <Badge status={"success"} />
                              Added Items
                            </label>
                            <div style={{ marginTop: "10px" }}>
                              {val.itemList.map((i) => {
                                let text2 = i.display_name.toString();
                                let newSpilitArray = text2.split(/[+]/);
                                let newSpilitArray1 = text2.split(/[,]/);
                                let finalArray = [];
                                newSpilitArray.map((value) => {
                                  finalArray.push(value.replace(/,/gi, ""));
                                });
                                if (i.add_or_remove == "Added Items") {
                                  return (
                                    <>
                                      <div style={{ marginBottom: "7px" }}>
                                        <>
                                          {text2.includes("-") ? (
                                            newSpilitArray1.map(
                                              (val, index) => (
                                                <div>
                                                  {index == 0
                                                    ? `${i.newqty
                                                      ? i.newqty
                                                      : i.quantity
                                                    } x `
                                                    : null}
                                                  {val}
                                                </div>
                                              )
                                            )
                                          ) : (
                                            <div>
                                              {" "}
                                              {finalArray.length > 1 ? (
                                                <div>
                                                  {finalArray.map(
                                                    (value, index) => {
                                                      return (
                                                        <div>
                                                          {index == 0
                                                            ? `${i.newqty
                                                              ? i.newqty
                                                              : i.quantity
                                                            } x `
                                                            : null}
                                                          {index > 0
                                                            ? "+"
                                                            : null}
                                                          {value}
                                                        </div>
                                                      );
                                                    }
                                                  )}
                                                </div>
                                              ) : (
                                                <div>
                                                  {" "}
                                                  {i.newqty
                                                    ? i.newqty
                                                    : i.quantity}{" "}
                                                  x {i.display_name}
                                                </div>
                                              )}
                                            </div>
                                          )}
                                        </>
                                        {i.orderTiketsNotes && (
                                          <div style={{ fontSize: "12px" }}>
                                            Notes - {i.orderTiketsNotes}
                                          </div>
                                        )}
                                      </div>
                                    </>
                                  );
                                }
                              })}
                              {val.orderNotes &&
                                `Order ticket notes - ${val.orderNotes}`}
                            </div>
                          </Col>
                          <Col xxl={12} md={12} sm={24} xs={24}>
                            <label>
                              <Badge status="error" />
                              Removed Items
                            </label>
                            <div style={{ marginTop: "10px" }}>
                              {val.itemList.map((i) => {
                                let text2 = i.display_name.toString();
                                let newSpilitArray = text2.split(/[+]/);
                                let newSpilitArray1 = text2.split(/[,]/);
                                let finalArray = [];
                                newSpilitArray.map((value) => {
                                  finalArray.push(value.replace(/,/gi, ""));
                                });
                                if (i.add_or_remove == "Removed Items") {
                                  return (
                                    <>
                                      <div style={{ marginBottom: "7px" }}>
                                        <>
                                          {text2.includes("-") ? (
                                            newSpilitArray1.map(
                                              (val, index) => (
                                                <div>
                                                  {index == 0
                                                    ? `${i.newqty
                                                      ? i.newqty
                                                      : i.quantity
                                                    } x `
                                                    : null}{" "}
                                                  {val}
                                                </div>
                                              )
                                            )
                                          ) : (
                                            <div>
                                              {" "}
                                              {finalArray.length > 1 ? (
                                                <div>
                                                  {finalArray.map(
                                                    (value, index) => {
                                                      return (
                                                        <div>
                                                          {index == 0
                                                            ? `${i.newqty
                                                              ? i.newqty
                                                              : i.quantity
                                                            } x `
                                                            : null}
                                                          {index > 0
                                                            ? "+"
                                                            : null}
                                                          {value}
                                                        </div>
                                                      );
                                                    }
                                                  )}
                                                </div>
                                              ) : (
                                                <div>
                                                  {" "}
                                                  {i.newqty
                                                    ? i.newqty
                                                    : i.quantity}{" "}
                                                  x {i.display_name}
                                                </div>
                                              )}
                                            </div>
                                          )}
                                        </>
                                        {i.orderTiketsNotes && (
                                          <div style={{ fontSize: "12px" }}>
                                            Notes - {i.orderTiketsNotes}
                                          </div>
                                        )}
                                      </div>
                                    </>
                                  );
                                }
                              })}
                              {val.orderNotes &&
                                `Order ticket notes - ${val.orderNotes}`}
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </>
                  );
                }
              })}
          </div>

          <OrderTicketPrint
            ref={componentRef}
            categoryDetails={categoryData}
            PreviousTikets={PreviousTikets}
          />
          {/* <p>{categoryData?.tiketNumber}</p> */}
        </Modal>
      </>
    );
  })
);

export { OrderTicketModal };
