import React, { useState, useRef, useEffect } from "react";
import {
  Row,
  Col,
  Table,
  Modal,
  Form,
  Input,
  Radio,
  message,
  Tag,
  Tooltip,
} from "antd";
import ReactDOMServer from "react-dom/server";
import { useHistory } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import { useSelector } from "react-redux";
import {
  InvoiceHeader,
  InvoiceLetterBox,
  ProductTable,
  OrderSummary,
} from "./Style";
import { OrderTicketPrint } from "../Sell/Current/OrderTicketPrint";
import { PageHeader } from "../../components/page-headers/page-headers";
import { Main } from "../styled";
import { Cards } from "../../components/cards/frame/cards-frame";
import Heading from "../../components/heading/heading";
import { Button } from "../../components/buttons/buttons";
import { useDispatch } from "react-redux";
import { ReceiptPrint } from "../Sell/Print/ReceiptPrint";
import {
  getReceiptsById,
  cancelOrder,
  deleteReceipt,
} from "../../redux/receipts/actionCreator";
import commonFunction from "../../utility/commonFunctions";
import {
  getItem,
  setItem,
  removeCartFromLocalStorage,
  storeOtherData,
} from "../../utility/localStorageControl";
import {
  getAllAddtionalList,
  getAllTagList,
} from "../../redux/customField/actionCreator";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { getAllPaymentTypeList } from "../../redux/customField/actionCreator";
import { UnPaidReceipts } from "./UnPaidReceipts";
import { UnpaidBookingReceipts } from "./UnpaidBookingReceipts";
import "./receipt.css";
import { EditOutlined } from "@ant-design/icons";
import { useReactToPrint } from "react-to-print";

import be from "date-fns/locale/be/index";
import { EditBookingReceipts } from "./EditBookingReceipts";
import { AddAndUpdateBooking } from "../../redux/sell/actionCreator";
import {
  addOrUpdateRegister,
  getRegisterById,
  getAllRegisterList,
} from "../../redux/register/actionCreator";
import { SaveBasicDetail, getShopDetail } from "../../redux/shop/actionCreator";
import tickSvg from "../../static/img/tick.svg";

const Invoice = ({ match }) => {
  let isMounted = useRef(true);
  const editRef = useRef();
  let [RecepitsData, setRecepitsData] = useState();
  const [ItemsList, setItemsList] = useState([]);
  const [modalVisibleOrderCancel, setModalVisibleOrderCancel] = useState(false);
  const [modalVisibleConfirmCancel, setModalVisibleConfirmCancel] = useState(
    false
  );
  const [deleteReceiptsModalVisible, setDeleteReceiptsModalVisible] = useState(
    false
  );
  const dispatch = useDispatch();
  const [categoryData, setCategoryData] = useState();
  const [form] = Form.useForm();
  const [PaymentType, setPaymentType] = useState();
  const [PaymentTypeList, setPaymentTypeList] = useState([]);
  const [deletebuttonShow, setDeleteButton] = useState(false);
  const history = useHistory();
  const [refundAmount, setRefundAmount] = useState(0);
  const [TagList, setTagList] = useState([]);

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const [printDetails, setPrintDetails] = useState();

  const [shopDetails, setShopDetails] = useState();
  const [registerdata, setRegisterData] = useState();
  const registerDetails = useSelector((state) =>
    state.register.RegisterList.find((val) => val.active)
  );
  useEffect(() => {
    async function fetchShopDetails() {
      const data = await dispatch(getShopDetail(getItem("userDetails")._id));
      if (isMounted.current && data && data.payload) {
        setShopDetails(data.payload);
      }
    }
    async function fetchRegisterData() {
      if (registerDetails) {
        setRegisterData(registerDetails);
      }
    }
    if (isMounted.current) {
      fetchShopDetails();
      fetchRegisterData();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  const componentRefOrderTikets = useRef();
  const handlePrintOrderTikets = useReactToPrint({
    content: () => componentRefOrderTikets.current,
  });

  async function fetchRecepitsData(id) {
    const getRecepitsData = await dispatch(getReceiptsById(id));
    if (isMounted.current && getRecepitsData) {
      getRecepitsData.ReceiptsIdData.order_id.details.receipt_number =
        getRecepitsData.ReceiptsIdData.receipt_number;
      setPrintDetails(getRecepitsData.ReceiptsIdData.order_id);
      let Taxesdata = [];
      let subTotalPrice = 0;
      let totalcustomItemDisocunt = 0;
      if (
        getRecepitsData.ReceiptsIdData.order_id.details?.AddtionChargeValue
          ?.length > 0
      ) {
        getRecepitsData.ReceiptsIdData.order_id.details?.AddtionChargeValue.map(
          (j) => {
            if (j.is_automatically_added) {
              j.tax_group?.taxes.map((data) => {
                let totalTaxPrice = data.totalTaxPrice;
                Taxesdata.push({
                  name: data.tax_name,
                  value: totalTaxPrice,
                });
              });
            }
          }
        );
      }
      getRecepitsData.ReceiptsIdData.order_id.details.itemsSold.map(
        (product) => {
          subTotalPrice += product.calculatedprice;
          product.customDiscountedValue
            ? (totalcustomItemDisocunt += product.customDiscountedValue)
            : null;

          product.taxGroup?.taxes.map((data) => {
            let totalTaxPrice = data.totalTaxPrice;
            Taxesdata.push({
              name: data.tax_name,
              value: totalTaxPrice,
            });
          });
        }
      );
      var holder = {};
      Taxesdata.forEach(function(d) {
        if (holder.hasOwnProperty(d.name)) {
          holder[d.name] = holder[d.name] + d.value;
        } else {
          holder[d.name] = d.value;
        }
      });
      var FinalTaxesArray = [];
      for (var prop in holder) {
        FinalTaxesArray.push({ name: prop, value: holder[prop] });
      }

      getRecepitsData.ReceiptsIdData.order_id.details.priceSummery = {
        ...getRecepitsData.ReceiptsIdData?.order_id.details.priceSummery,
        taxexArray: FinalTaxesArray,
        sub_total: Number(subTotalPrice).toFixed(2),
        totalItemDisocunts: Number(totalcustomItemDisocunt).toFixed(2),
      };

      setRecepitsData(getRecepitsData.ReceiptsIdData);
      setItemsList(getRecepitsData.ReceiptsIdData.order_id.details.itemsSold);

      if (
        getRecepitsData.ReceiptsIdData.order_id.details.saleType == "immediate"
      ) {
        let sum = getRecepitsData.ReceiptsIdData.order_id.details.immediate_sale.multiple_payments_type
          .filter(
            (val) =>
              val.name != "Credit Sales (Pending)" && val.name != "pending"
          )
          .reduce(function(acc, obj) {
            return acc + Number(obj.value);
          }, 0);
        setRefundAmount(sum);
        form.setFieldsValue({
          refund_amount: sum,
        });
      } else {
        let sums = getRecepitsData.ReceiptsIdData.order_id.details.bookingDetails.booking_advance_payment_type.reduce(
          function(acc, obj) {
            return acc + Number(obj.value);
          },
          0
        );
        setRefundAmount(sums);
        form.setFieldsValue({
          refund_amount: sums,
        });
      }

      if (getRecepitsData.ReceiptsIdData.order_id.cancellation) {
        setDeleteButton(true);
      }
    }
  }
  useEffect(() => {
    async function fetchPaymentType() {
      const getPaymentTypeList = await dispatch(getAllPaymentTypeList());
      if (
        isMounted.current &&
        getPaymentTypeList &&
        getPaymentTypeList.PaymentTypeList
      )
        setPaymentTypeList(getPaymentTypeList.PaymentTypeList.reverse());
    }
    async function fetchTagList() {
      const getTagList = await dispatch(getAllTagList());
      if (isMounted.current && getTagList && getTagList.TagList) {
        setTagList(getTagList.TagList);
      }
    }
    if (isMounted.current) {
      fetchRecepitsData(match.params.id);
      fetchPaymentType();
      fetchTagList();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  const onSubmit = () => {
    form
      .validateFields()
      .then(async (formData) => {
        formData.cancel_Date = new Date();
        let obj = {
          cancellation: { ...formData },
        };

        const getCancelOrder = await dispatch(
          cancelOrder(obj, RecepitsData.order_id._id)
        );

        if (getCancelOrder && getCancelOrder.cancelOrderData) {
          fetchRecepitsData(match.params.id);
          setModalVisibleOrderCancel(false);
          setModalVisibleConfirmCancel(true);
          setDeleteButton(true);
        }
      })
      .catch((errorInfo) => console.log("err", errorInfo));
  };

  const fullFillOrder = async () => {
    RecepitsData.order_id.details.fulfillmentStatus = "Fulfilled";
    let ordederUpdatedata = { details: RecepitsData.order_id.details };
    const getUpdateReceiptsData = await dispatch(
      AddAndUpdateBooking(ordederUpdatedata, RecepitsData.order_id._id)
    );
  };

  const deleteReceipts = async (e) => {
    const deleteReceiptData = await dispatch(deleteReceipt(match.params.id));
    if (!deleteReceiptData.receiptDeletedData.error) {
      history.push(`receipts`);
    }
  };

  const { rtl } = useSelector((state) => {
    return {
      rtl: state.ChangeLayoutMode.rtlData,
    };
  });

  const dataSource = [];
  let checkDiscount = false;
  let totalItemDiscount = 0;
  ItemsList.map((value) => {
    if (value.customDiscountedValue) {
      checkDiscount = true;
      totalItemDiscount += value.customDiscountedValue;
    }
    const {
      id,
      quantity,
      calculatedprice,
      display_name,
      productTaxes,
      customDiscountedValue,
    } = value;
    console.log("valuevalues=>", value);
    return dataSource.push({
      id: id,
      quantity: quantity,
      price: calculatedprice,
      display_name: display_name,
      taxes: productTaxes,
      customDiscountedValue: customDiscountedValue,
    });
  });

  const invoiceTableColumns = [
    {
      title: "Items",
      dataIndex: "display_name",
      key: "display_name",
      width: "60%",
      render(text, record) {
        let text2 = text.toString();

        let newSpilitArray = text2.split(/[+]/);
        let newSpilitArray1 = text2.split(/[,]/);

        let finalArray = [];
        newSpilitArray.map((value) => {
          finalArray.push(value.replace(/,/gi, ""));
        });

        return {
          children: (
            <>
              {text2.includes("-") ? (
                newSpilitArray1.map((val) => <div>{val}</div>)
              ) : (
                <div>
                  {" "}
                  {finalArray.length > 1 ? (
                    <div>
                      {finalArray.map((value, index) => {
                        return (
                          <div>
                            {index > 0 ? "+" : null}
                            {value}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div>{text}</div>
                  )}
                </div>
              )}
            </>
          ),
        };
      },
    },

    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render(text, record) {
        return {
          props: {
            style: { textAlign: "left" },
          },
          children: <span>{text}</span>,
        };
      },
    },
    {
      title: "Tax %",
      dataIndex: "taxes",
      key: "taxes",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      className: "pricetgt",
      render(text, record) {
        return {
          children: (
            <span className="product-unit">₹{Number(text).toFixed(2)}</span>
          ),
        };
      },
    },
    checkDiscount
      ? {
          title: "Discount",
          align: "left",
          render(text, record, index) {
            return {
              children: (
                <div>
                  {text.discountedValue ||
                  (text.customDiscountedValue && text.quantity > 0)
                    ? `₹${text.discountedValue || text.customDiscountedValue} `
                    : ""}
                </div>
              ),
            };
          },
        }
      : {},
  ];

  return (
    <>
      {RecepitsData &&
      RecepitsData.order_id.details.saleType === "immediate" ? (
        <div>
          {RecepitsData &&
          RecepitsData.order_id.details.immediate_sale.multiple_payments_type[0]
            .no ? (
            RecepitsData.order_id.details.immediate_sale.multiple_payments_type.map(
              (data, indx) => {
                if (data.customer_type == "equally") {
                  return (
                    <>
                      <Main className="receipts_inv">
                        <PageHeader
                          ghost
                          className="custome-status-header"
                          title={
                            <>
                              <span>
                                Status &nbsp;
                                {RecepitsData && (
                                  <>
                                    {RecepitsData.order_id.details
                                      .paymentStatus == "paid" ? (
                                      <Tag color="#43ac6a">Paid</Tag>
                                    ) : (
                                      <Tag color="#e99002">Unpaid</Tag>
                                    )}
                                    {RecepitsData.order_id.details
                                      .fulfillmentStatus == "Fulfilled" &&
                                    deletebuttonShow == false ? (
                                      <Tag color="#008cba">Fulfilled</Tag>
                                    ) : RecepitsData.order_id.details
                                        .fulfillmentStatus == "Unfulfilled" &&
                                      deletebuttonShow == false ? (
                                      <Tag color="#e7e7e7">Unfulfilled</Tag>
                                    ) : (
                                      <Tag color="#f04124">Cancelled</Tag>
                                    )}
                                  </>
                                )}
                              </span>
                              {RecepitsData.order_id.cancellation
                                ?.cancellation_reason && (
                                <p>
                                  Cancellation Notes -{" "}
                                  {
                                    RecepitsData.order_id.cancellation
                                      .cancellation_reason
                                  }
                                </p>
                              )}
                            </>
                          }
                          buttons={[
                            <div key="1" className="page-header-actions">
                              <Button
                                size="small"
                                shape="round"
                                type="default"
                                onClick={() => {
                                  window.frames[
                                    "print_frame"
                                  ].document.body.innerHTML = ReactDOMServer.renderToStaticMarkup(
                                    <ReceiptPrint
                                      receiptsDetails={RecepitsData.order_id}
                                      shopDetails={shopDetails}
                                      registerData={registerdata}
                                    />
                                  );
                                  window.frames["print_frame"].window.focus();
                                  window.frames["print_frame"].window.print();
                                }}
                              >
                                <FeatherIcon icon="printer" size={14} />
                                Print1
                              </Button>

                              {deletebuttonShow ? (
                                <Button
                                  size="small"
                                  shape="round"
                                  type="primary"
                                  onClick={() =>
                                    setDeleteReceiptsModalVisible(true)
                                  }
                                >
                                  Delete
                                </Button>
                              ) : (
                                <Button
                                  size="small"
                                  shape="round"
                                  type="primary"
                                  onClick={() =>
                                    setModalVisibleOrderCancel(true)
                                  }
                                >
                                  Cancel
                                </Button>
                              )}
                            </div>,
                          ]}
                        />
                        <Row gutter={15}>
                          <Col md={24}>
                            <Cards headless>
                              <InvoiceLetterBox>
                                <div className="invoice-letter-inner">
                                  <Row align="top">
                                    <Col lg={10} xs={24}>
                                      <article className="invoice-author">
                                        <Heading
                                          className="invoice-author__title"
                                          as="h3"
                                        >
                                          Invoice
                                        </Heading>
                                        <p>
                                          No : #{RecepitsData.receipt_number}
                                        </p>
                                        <p className="color-5">
                                          Prepared by{" "}
                                          {
                                            RecepitsData.order_id.details
                                              .order_by_name.username
                                          }{" "}
                                          {RecepitsData.order_id.details
                                            .tableName != undefined &&
                                            ` | ${RecepitsData.order_id.details.tableName}`}
                                        </p>
                                        <p>
                                          on{" "}
                                          {commonFunction.convertToDate(
                                            RecepitsData.created_at,
                                            "MMM DD, Y h:mm A"
                                          )}
                                        </p>
                                        <p className="color-5">
                                          {" "}
                                          {`${RecepitsData.register_id.register_name} Register`}
                                        </p>
                                      </article>
                                    </Col>
                                    {RecepitsData.order_id.customer.name ||
                                    RecepitsData.order_id.customer.email !=
                                      "" ||
                                    RecepitsData.order_id.customer.mobial !=
                                      null ||
                                    RecepitsData.order_id.customer.city ||
                                    RecepitsData.order_id.customer
                                      .shipping_address ||
                                    RecepitsData.order_id.customer.zipcode ||
                                    RecepitsData?.order_id.details
                                      .customer_custom_fields?.length > 0 ||
                                    RecepitsData.order_id.details.custom_fields
                                      .length > 0 ? (
                                      <Col lg={14} xs={24}>
                                        <address className="invoice-customer">
                                          <Heading
                                            className="invoice-customer__title"
                                            as="h5"
                                          >
                                            Invoice To:
                                          </Heading>

                                          {RecepitsData.order_id.customer
                                            ?.name ||
                                          RecepitsData.order_id.customer
                                            ?.email ||
                                          RecepitsData.order_id.customer
                                            ?.mobile ? (
                                            <p>
                                              {" "}
                                              {RecepitsData.order_id.customer
                                                ?.name
                                                ? RecepitsData.order_id.customer
                                                    ?.mobile ||
                                                  RecepitsData.order_id.customer
                                                    ?.email
                                                  ? `${RecepitsData.order_id.customer?.name} | `
                                                  : RecepitsData.order_id
                                                      .customer?.name
                                                : null}
                                              {RecepitsData.order_id.customer
                                                ?.mobile
                                                ? RecepitsData.order_id.customer
                                                    ?.email
                                                  ? `${RecepitsData.order_id.customer?.mobile} | `
                                                  : RecepitsData.order_id
                                                      .customer?.mobile
                                                : null}
                                              {RecepitsData.order_id.customer
                                                ?.email
                                                ? RecepitsData.order_id.customer
                                                    ?.email
                                                : null}{" "}
                                              {RecepitsData.order_id.customer
                                                ?.shipping_address ? (
                                                <br />
                                              ) : null}
                                              {RecepitsData.order_id.customer
                                                ?.shipping_address
                                                ? RecepitsData.order_id.customer
                                                    ?.city ||
                                                  RecepitsData.order_id.customer
                                                    ?.zipcode
                                                  ? `${RecepitsData.order_id.customer?.shipping_address} `
                                                  : RecepitsData.order_id
                                                      .customer
                                                      ?.shipping_address
                                                : null}
                                              {RecepitsData.order_id.customer
                                                .city ? (
                                                <br />
                                              ) : null}
                                              {RecepitsData.order_id.customer
                                                ?.city
                                                ? RecepitsData.order_id.customer
                                                    ?.zipcode
                                                  ? `${RecepitsData.order_id.customer?.city}`
                                                  : RecepitsData.order_id
                                                      .customer?.city
                                                : null}
                                              {RecepitsData.order_id.customer
                                                ?.zipcode
                                                ? ` - ${RecepitsData.order_id.customer?.zipcode}`
                                                : null}{" "}
                                            </p>
                                          ) : null}

                                          <p className="color-5">
                                            {RecepitsData?.order_id.details.customer_custom_fields?.map(
                                              (data, index) => {
                                                if (
                                                  RecepitsData.order_id.details
                                                    .customer_custom_fields
                                                    .length == 1 &&
                                                  data.value != ""
                                                ) {
                                                  return (
                                                    <>
                                                      {data.name}
                                                      {" : "}
                                                      <span>{data.value}</span>
                                                    </>
                                                  );
                                                } else if (
                                                  index + 1 ==
                                                    RecepitsData.order_id
                                                      .details
                                                      .customer_custom_fields
                                                      .length &&
                                                  data.value != ""
                                                ) {
                                                  return (
                                                    <>
                                                      {data.name}
                                                      {" : "}
                                                      <span>{data.value}</span>
                                                    </>
                                                  );
                                                } else if (data.value != "") {
                                                  return (
                                                    <>
                                                      {data.name}
                                                      {" : "}
                                                      <span>
                                                        {data.value}
                                                      </span>{" "}
                                                      {" | "}
                                                    </>
                                                  );
                                                }
                                              }
                                            )}
                                          </p>
                                          <p className="color-5">
                                            {RecepitsData.order_id.details.custom_fields.map(
                                              (val) => (
                                                <Tag color={val.tag_color}>
                                                  {val.name}
                                                </Tag>
                                              )
                                            )}
                                          </p>
                                        </address>
                                      </Col>
                                    ) : null}
                                  </Row>
                                </div>
                              </InvoiceLetterBox>
                              <Modal
                                title="Confirm Delete"
                                visible={deleteReceiptsModalVisible}
                                onCancel={() =>
                                  setDeleteReceiptsModalVisible(false)
                                }
                                cancelText="Go Back"
                                onOk={deleteReceipts}
                                okText="Delete Receipt"
                              >
                                <p>
                                  Deleting the receipt will permanently remove
                                  it and will no longer appear on reports. Also,
                                  deleting the receipt will keep the metrics as
                                  they were after cancellation. Are you sure you
                                  want to proceed?
                                </p>
                              </Modal>
                              <Modal
                                title="Confirm Cancelled."
                                visible={modalVisibleConfirmCancel}
                                footer={[
                                  <Button
                                    type="primary"
                                    onClick={() =>
                                      setModalVisibleConfirmCancel(false)
                                    }
                                  >
                                    Ok
                                  </Button>,
                                ]}
                              >
                                <p>Receipt has been cancelled.</p>
                              </Modal>
                              <Modal
                                title="Confirm Cancel"
                                bodyStyle={{
                                  paddingTop: 0,
                                  paddingBottom: "12px",
                                }}
                                visible={modalVisibleOrderCancel}
                                onCancel={() => {
                                  setModalVisibleOrderCancel(false);
                                  form.setFieldsValue({
                                    refund_amount: refundAmount,
                                  });
                                }}
                                width={600}
                                footer={[
                                  <Button
                                    type="default"
                                    className="btn-cancel btn-custom go_back"
                                    onClick={() => {
                                      setModalVisibleOrderCancel(false);
                                      form.setFieldsValue({
                                        refund_amount: refundAmount,
                                      });
                                    }}
                                  >
                                    Go Back
                                  </Button>,
                                  <Button
                                    type="primary"
                                    disabled={
                                      PaymentType || refundAmount == 0
                                        ? false
                                        : true
                                    }
                                    onClick={() => onSubmit()}
                                  >
                                    Cancel Receipt
                                  </Button>,
                                ]}
                              >
                                <Form
                                  style={{ width: "100%" }}
                                  name="Export"
                                  form={form}
                                  onFinish={onSubmit}
                                >
                                  <Form.Item
                                    name="refund_amount"
                                    label="Enter Refund Amount"
                                    rules={[
                                      {
                                        validator: (_, value) => {
                                          if (Number(value) > refundAmount) {
                                            return Promise.reject(
                                              "Refund amount cannot be more than the paid amount."
                                            );
                                          } else {
                                            return Promise.resolve();
                                          }
                                        },
                                      },
                                    ]}
                                  >
                                    <Input
                                      placeholder="Refund Amount"
                                      type="number"
                                    />
                                  </Form.Item>
                                  <Form.Item
                                    name="refund_pay_type"
                                    label="Payment Type"
                                    rules={[
                                      {
                                        message:
                                          "Choose a payment type to proceed",
                                        required:
                                          refundAmount > 0 ? true : false,
                                      },
                                    ]}
                                  >
                                    <Radio.Group
                                      onChange={(e) =>
                                        setPaymentType(e.target.value)
                                      }
                                      value={PaymentType}
                                      className="tick-radio"
                                    >
                                      <Radio.Button
                                        value="cash"
                                        style={{
                                          marginRight: "10px",
                                          marginBottom: "10px",
                                        }}
                                      >
                                        {PaymentType === "cash" ? (
                                          <img
                                            src={tickSvg}
                                            alt=""
                                            width="13px"
                                            style={{ marginRight: "5px" }}
                                          />
                                        ) : (
                                          ""
                                        )}
                                        Cash
                                      </Radio.Button>
                                      <Radio.Button
                                        value="card"
                                        style={{
                                          marginRight: "10px",
                                          marginBottom: "10px",
                                        }}
                                      >
                                        {PaymentType === "card" ? (
                                          <img
                                            src={tickSvg}
                                            alt=""
                                            width="13px"
                                            style={{ marginRight: "5px" }}
                                          />
                                        ) : (
                                          ""
                                        )}{" "}
                                        Credit / Debit Card
                                      </Radio.Button>
                                      {PaymentTypeList.map((val, index) => {
                                        return (
                                          <Radio.Button
                                            value={val.name}
                                            style={{
                                              marginRight: "10px",
                                              marginBottom: "10px",
                                            }}
                                          >
                                            {PaymentType === val.name ? (
                                              <img
                                                src={tickSvg}
                                                alt=""
                                                width="13px"
                                                style={{ marginRight: "5px" }}
                                              />
                                            ) : (
                                              ""
                                            )}
                                            {val.name}
                                          </Radio.Button>
                                        );
                                      })}
                                      <Radio.Button
                                        value="other"
                                        style={{
                                          marginRight: "10px",
                                          marginBottom: "10px",
                                        }}
                                      >
                                        {PaymentType === "other" ? (
                                          <img
                                            src={tickSvg}
                                            alt=""
                                            width="13px"
                                            style={{ marginRight: "5px" }}
                                          />
                                        ) : (
                                          ""
                                        )}
                                        Other
                                      </Radio.Button>
                                    </Radio.Group>
                                  </Form.Item>
                                  <Form.Item
                                    name="cancellation_reason"
                                    label="Cancellation Notes3"
                                    rules={[
                                      {
                                        max: 50,
                                        message:
                                          "Cancellation Notes cannot be more than 50 characters long.",
                                      },
                                    ]}
                                  >
                                    <Input placeholder="Cancellation notes" />
                                  </Form.Item>
                                </Form>
                              </Modal>
                              <br />
                              <ProductTable>
                                <div className="table-invoice table-responsive">
                                  <Table
                                    dataSource={dataSource}
                                    columns={invoiceTableColumns}
                                    pagination={false}
                                    rowClassName="invoice-table"
                                  />
                                </div>
                              </ProductTable>
                              <Row justify="end">
                                <Col
                                  xxl={4}
                                  xl={5}
                                  sm={8}
                                  xs={14}
                                  offset={rtl ? 0 : 10}
                                >
                                  <OrderSummary>
                                    <div className="invoice-summary-inner">
                                      <ul className="summary-list">
                                        <li>
                                          <span className="summary-list-title">
                                            Subtotal :
                                          </span>
                                          <span className="summary-list-text">
                                            {`₹${RecepitsData?.order_id.details.priceSummery.sub_total}`}
                                          </span>
                                        </li>

                                        {RecepitsData?.order_id.details
                                          .priceSummery.totalItemDisocunts >
                                          0 && (
                                          <li>
                                            <span className="summary-list-title">
                                              Item Discounts :
                                            </span>
                                            <span className="summary-list-text">
                                              {`-₹${RecepitsData?.order_id.details.priceSummery.totalItemDisocunts}`}
                                            </span>
                                          </li>
                                        )}
                                        {RecepitsData?.order_id.details
                                          .priceSummery.totalItemDisocunts >
                                          0 && (
                                          <li>
                                            <span className="summary-list-title">
                                              Item Discounts :
                                            </span>
                                            <span className="summary-list-text">
                                              {`-₹${RecepitsData?.order_id.details.priceSummery.totalItemDisocunts}`}
                                            </span>
                                          </li>
                                        )}
                                        {RecepitsData?.order_id?.details
                                          ?.bulckDiscountValue && (
                                          <li>
                                            <span className="summary-list-title">
                                              Bulk Discount
                                            </span>

                                            <span className="summary-list-text">
                                              {`-₹${RecepitsData?.order_id?.details?.bulckDiscountValue}`}
                                            </span>
                                          </li>
                                        )}
                                        {RecepitsData?.order_id?.details
                                          ?.AddtionChargeValue.length > 0 &&
                                          RecepitsData?.order_id?.details?.AddtionChargeValue.map(
                                            (charge) =>
                                              charge.is_automatically_added && (
                                                <li>
                                                  <span className="summary-list-title">
                                                    {charge.charge_name}{" "}
                                                    {charge.tax_group &&
                                                      charge.tax_group
                                                        .Totaltax &&
                                                      `(Tax ${charge.tax_group.Totaltax}%)`}
                                                  </span>

                                                  <span className="summary-list-text">
                                                    {charge.charge_value}
                                                  </span>
                                                </li>
                                              )
                                          )}
                                        {RecepitsData?.order_id.details
                                          .priceSummery.taxexArray &&
                                          RecepitsData?.order_id.details.priceSummery.taxexArray.map(
                                            (val) => {
                                              return (
                                                <li>
                                                  <span className="summary-list-title">
                                                    {val.name} :
                                                  </span>
                                                  <span className="summary-list-text">{`₹${Number(
                                                    val.value
                                                  ).toFixed(2)}`}</span>
                                                </li>
                                              );
                                            }
                                          )}
                                        {RecepitsData?.order_id.details
                                          .priceSummery.round_off_value && (
                                          <li>
                                            <span className="summary-list-title">
                                              Roundoff :
                                            </span>
                                            <span className="summary-list-text">{`₹${RecepitsData?.order_id.details.priceSummery.round_off_value}`}</span>
                                          </li>
                                        )}
                                      </ul>
                                      <Heading
                                        className="summary-total"
                                        as="h4"
                                      >
                                        <span className="summary-total-label">
                                          Total :{" "}
                                        </span>
                                        <span className="summary-total-amount">{`₹${RecepitsData?.order_id.details.priceSummery.total}`}</span>
                                      </Heading>
                                      <Heading
                                        className="summary-total"
                                        as="h4"
                                      >
                                        <span className="summary-total-label">
                                          For{" "}
                                          {data.name != ""
                                            ? data.name
                                            : `Customer ${data.no}`}{" "}
                                        </span>
                                        <span className="summary-total-amount">{`₹${data.value}`}</span>
                                      </Heading>
                                    </div>
                                  </OrderSummary>
                                </Col>
                                <Col></Col>
                              </Row>

                              {RecepitsData &&
                              RecepitsData.order_id.details.paymentStatus ==
                                "paid" ? (
                                <div className="border-top">
                                  {RecepitsData.order_id.details
                                    .orderTiketsDetails ? (
                                    <Row>
                                      Order Tickets :
                                      {RecepitsData.order_id.details.orderTiketsDetails.orderTicketsData.map(
                                        (i, index) => {
                                          return (
                                            <div>
                                              <span>
                                                <span
                                                  style={{
                                                    color: "rgb(0, 140, 186)",
                                                    cursor: "pointer",
                                                  }}
                                                  onClick={() => {
                                                    window.frames[
                                                      "print_frame"
                                                    ].document.body.innerHTML = ReactDOMServer.renderToStaticMarkup(
                                                      <OrderTicketPrint
                                                        categoryDetails={i}
                                                        PreviousTikets={[]}
                                                      />
                                                    );
                                                    window.frames[
                                                      "print_frame"
                                                    ].window.focus();
                                                    window.frames[
                                                      "print_frame"
                                                    ].window.print();
                                                  }}
                                                >
                                                  {index ==
                                                  RecepitsData.order_id.details
                                                    .orderTiketsDetails
                                                    .orderTicketsData.length -
                                                    1
                                                    ? `#${i.tiketNumber}`
                                                    : `#${i.tiketNumber},`}
                                                </span>
                                              </span>
                                            </div>
                                          );
                                        }
                                      )}
                                    </Row>
                                  ) : null}
                                  <Row>
                                    {data.payment_type_list.map((val) => {
                                      if (val.tick == true) {
                                        return (
                                          <>
                                            <Col
                                              lg={6}
                                              md={18}
                                              sm={24}
                                              offset={0}
                                            >
                                              <div className="receipt-payment-transactions">
                                                <p>{`₹${data.value} on ${val.name}`}</p>
                                                <p className="text-muted">
                                                  {commonFunction.convertToDate(
                                                    RecepitsData.created_at,
                                                    "MMM DD, Y h:mm A"
                                                  )}
                                                </p>
                                              </div>
                                            </Col>
                                          </>
                                        );
                                      }
                                    })}
                                    {RecepitsData &&
                                      RecepitsData.order_id.cancellation &&
                                      indx == 0 && (
                                        <Col lg={6} md={18} sm={24} offset={0}>
                                          <div className="receipt-payment-transactions">
                                            <p>{`₹${RecepitsData.order_id.cancellation.refund_amount} ${RecepitsData.order_id.cancellation.refund_pay_type} refund`}</p>
                                            <p className="text-muted">
                                              {commonFunction.convertToDate(
                                                RecepitsData.order_id
                                                  .cancellation.cancel_Date,
                                                "MMM DD, Y h:mm A"
                                              )}
                                            </p>
                                          </div>
                                        </Col>
                                      )}
                                  </Row>
                                </div>
                              ) : (
                                <>
                                  <div style={{ display: "none" }}>
                                    {PaymentTypeList.length}
                                  </div>
                                  <UnPaidReceipts
                                    RecepitsDataDetails={RecepitsData}
                                    PaymentTypeList={PaymentTypeList}
                                    updateFetch={fetchRecepitsData}
                                  />
                                </>
                              )}
                            </Cards>
                          </Col>
                        </Row>
                      </Main>
                    </>
                  );
                } else {
                  const tableData = [];
                  let Taxesdata = [];
                  let subTotalPrice = 0;
                  let ItemDiscout = 0;
                  let checkCustomDiscount = false;
                  data.product_List.map((product) => {
                    if (product.customDiscountedValue) {
                      checkCustomDiscount = true;
                      ItemDiscout += product.customDiscountedValue;
                    }
                    subTotalPrice += product.calculatedprice;
                    product.taxGroup?.taxes.map((data) => {
                      let totalTaxPrice = data.totalTaxPrice;
                      Taxesdata.push({
                        name: data.tax_name,
                        value: totalTaxPrice,
                      });
                    });

                    const {
                      id,
                      quantity,
                      oldCalculatedPrice,
                      display_name,
                      productTaxes,
                      customDiscountedValue,
                    } = product;

                    return tableData.push({
                      id: id,
                      quantity: quantity,
                      price: oldCalculatedPrice,
                      display_name: display_name,
                      taxes: productTaxes,
                      customDiscountedValue: customDiscountedValue,
                    });
                  });

                  var holder = {};
                  Taxesdata.forEach(function(d) {
                    if (holder.hasOwnProperty(d.name)) {
                      holder[d.name] = holder[d.name] + d.value;
                    } else {
                      holder[d.name] = d.value;
                    }
                  });
                  var FinalTaxesArray = [];
                  for (var prop in holder) {
                    FinalTaxesArray.push({ name: prop, value: holder[prop] });
                  }

                  RecepitsData.order_id.details.priceSummery = {
                    ...RecepitsData.order_id.details.priceSummery,
                    taxexArray: FinalTaxesArray,
                    sub_total: Number(subTotalPrice).toFixed(2),
                    totalItemDisocunts: Number(ItemDiscout).toFixed(2),
                  };

                  const columnsData = [
                    {
                      title: "Items",
                      dataIndex: "display_name",
                      key: "display_name",
                      width: "60%",
                      render(text, record) {
                        let text2 = text.toString();

                        let newSpilitArray = text2.split(/[+]/);
                        let newSpilitArray1 = text2.split(/[,]/);

                        let finalArray = [];
                        newSpilitArray.map((value) => {
                          finalArray.push(value.replace(/,/gi, ""));
                        });

                        return {
                          children: (
                            <>
                              {text2.includes("-") ? (
                                newSpilitArray1.map((val) => <div>{val}</div>)
                              ) : (
                                <div>
                                  {" "}
                                  {finalArray.length > 1 ? (
                                    <div>
                                      {finalArray.map((value, index) => {
                                        return (
                                          <div>
                                            {index > 0 ? "+" : null}
                                            {value}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  ) : (
                                    <div>{text}</div>
                                  )}
                                </div>
                              )}
                            </>
                          ),
                        };
                      },
                    },

                    {
                      title: "Quantity",
                      dataIndex: "quantity",
                      key: "quantity",
                      render(text, record) {
                        return {
                          props: {
                            style: { textAlign: "left" },
                          },
                          children: (
                            <span className="product-quantity">{text}</span>
                          ),
                        };
                      },
                    },
                    {
                      title: "Tax %",
                      dataIndex: "taxes",
                      key: "taxes",
                    },
                    {
                      title: "Price",
                      dataIndex: "price",
                      key: "price",
                      render(text, record) {
                        return {
                          children: (
                            <span className="product-unit">
                              ₹{Number(text).toFixed(2)}
                            </span>
                          ),
                        };
                      },
                    },
                    checkCustomDiscount
                      ? {
                          title: "Discount",
                          align: "left",
                          render(text, record, index) {
                            return {
                              children: (
                                <div>
                                  {text.discountedValue ||
                                  (text.customDiscountedValue &&
                                    text.quantity > 0)
                                    ? `₹${text.discountedValue ||
                                        text.customDiscountedValue} `
                                    : ""}
                                </div>
                              ),
                            };
                          },
                        }
                      : {},
                  ];

                  return (
                    <>
                      <Main>
                        <PageHeader
                          ghost
                          className="custome-status-header"
                          title={
                            <>
                              <span>
                                Status &nbsp;
                                {RecepitsData && (
                                  <>
                                    {RecepitsData.order_id.details
                                      .paymentStatus == "paid" ? (
                                      <Tag color="#43ac6a">Paid</Tag>
                                    ) : (
                                      <Tag color="#e99002">Unpaid</Tag>
                                    )}
                                    {RecepitsData.order_id.details
                                      .fulfillmentStatus == "Fulfilled" &&
                                    deletebuttonShow == false ? (
                                      <Tag color="#008cba">Fulfilled</Tag>
                                    ) : RecepitsData.order_id.details
                                        .fulfillmentStatus == "Unfulfilled" &&
                                      deletebuttonShow == false ? (
                                      <Tag color="#e7e7e7">Unfulfilled</Tag>
                                    ) : (
                                      <Tag color="#f04124">Cancelled</Tag>
                                    )}
                                  </>
                                )}
                              </span>
                              {RecepitsData.order_id.cancellation
                                ?.cancellation_reason && (
                                <p>
                                  Cancellation Notes -{" "}
                                  {
                                    RecepitsData.order_id.cancellation
                                      .cancellation_reason
                                  }
                                </p>
                              )}
                            </>
                          }
                          buttons={[
                            <div key="1" className="page-header-actions">
                              <Button
                                size="small"
                                shape="round"
                                type="default"
                                onClick={() => {
                                  window.frames[
                                    "print_frame"
                                  ].document.body.innerHTML = ReactDOMServer.renderToStaticMarkup(
                                    <ReceiptPrint
                                      receiptsDetails={RecepitsData.order_id}
                                      shopDetails={shopDetails}
                                      registerData={registerdata}
                                    />
                                  );
                                  window.frames["print_frame"].window.focus();
                                  window.frames["print_frame"].window.print();
                                }}
                              >
                                <FeatherIcon icon="printer" size={14} />
                                Print2
                              </Button>

                              {deletebuttonShow ? (
                                <Button
                                  size="small"
                                  shape="round"
                                  type="primary"
                                  onClick={() =>
                                    setDeleteReceiptsModalVisible(true)
                                  }
                                >
                                  Delete
                                </Button>
                              ) : (
                                <Button
                                  size="small"
                                  shape="round"
                                  type="primary"
                                  onClick={() =>
                                    setModalVisibleOrderCancel(true)
                                  }
                                >
                                  Cancel
                                </Button>
                              )}
                            </div>,
                          ]}
                        />

                        <Row gutter={15}>
                          <Col md={24}>
                            <Cards headless>
                              <InvoiceLetterBox>
                                <div className="invoice-letter-inner">
                                  <Row align="top">
                                    <Col lg={10} xs={24}>
                                      <article className="invoice-author">
                                        <Heading
                                          className="invoice-author__title"
                                          as="h3"
                                        >
                                          Invoice
                                        </Heading>
                                        <p>
                                          No : #{RecepitsData.receipt_number}
                                        </p>
                                        <p className="color-5">
                                          Prepared by{" "}
                                          {
                                            RecepitsData.order_id.details
                                              .order_by_name.username
                                          }{" "}
                                          {RecepitsData.order_id.details
                                            .tableName != undefined &&
                                            ` | ${RecepitsData.order_id.details.tableName}`}
                                        </p>
                                        <p>
                                          on{" "}
                                          {commonFunction.convertToDate(
                                            RecepitsData.created_at,
                                            "MMM DD, Y h:mm A"
                                          )}
                                        </p>
                                        <p className="color-5">
                                          {`${RecepitsData.register_id.register_name} Register`}
                                        </p>
                                      </article>
                                    </Col>

                                    {RecepitsData.order_id.customer.name ||
                                    RecepitsData.order_id.customer.email !=
                                      "" ||
                                    RecepitsData.order_id.customer.mobial !=
                                      null ||
                                    RecepitsData.order_id.customer.city ||
                                    RecepitsData.order_id.customer
                                      .shipping_address ||
                                    RecepitsData.order_id.customer.zipcode ||
                                    RecepitsData?.order_id.details
                                      .customer_custom_fields?.length > 0 ||
                                    RecepitsData.order_id.details.custom_fields
                                      .length > 0 ? (
                                      <Col lg={14} xs={24}>
                                        <address className="invoice-customer">
                                          <Heading
                                            className="invoice-customer__title"
                                            as="h5"
                                          >
                                            Invoice To:
                                          </Heading>

                                          {RecepitsData.order_id.customer
                                            ?.name ||
                                          RecepitsData.order_id.customer
                                            ?.email ||
                                          RecepitsData.order_id.customer
                                            ?.mobile ? (
                                            <p>
                                              {" "}
                                              {RecepitsData.order_id.customer
                                                ?.name
                                                ? RecepitsData.order_id.customer
                                                    ?.mobile ||
                                                  RecepitsData.order_id.customer
                                                    ?.email
                                                  ? `${RecepitsData.order_id.customer?.name} | `
                                                  : RecepitsData.order_id
                                                      .customer?.name
                                                : null}
                                              {RecepitsData.order_id.customer
                                                ?.mobile
                                                ? RecepitsData.order_id.customer
                                                    ?.email
                                                  ? `${RecepitsData.order_id.customer?.mobile} | `
                                                  : RecepitsData.order_id
                                                      .customer?.mobile
                                                : null}
                                              {RecepitsData.order_id.customer
                                                ?.email
                                                ? RecepitsData.order_id.customer
                                                    ?.email
                                                : null}{" "}
                                              {RecepitsData.order_id.customer
                                                ?.shipping_address ? (
                                                <br />
                                              ) : null}
                                              {RecepitsData.order_id.customer
                                                ?.shipping_address
                                                ? RecepitsData.order_id.customer
                                                    ?.city ||
                                                  RecepitsData.order_id.customer
                                                    ?.zipcode
                                                  ? `${RecepitsData.order_id.customer?.shipping_address} `
                                                  : RecepitsData.order_id
                                                      .customer
                                                      ?.shipping_address
                                                : null}
                                              {RecepitsData.order_id.customer
                                                .city ? (
                                                <br />
                                              ) : null}
                                              {RecepitsData.order_id.customer
                                                ?.city
                                                ? RecepitsData.order_id.customer
                                                    ?.zipcode
                                                  ? `${RecepitsData.order_id.customer?.city}`
                                                  : RecepitsData.order_id
                                                      .customer?.city
                                                : null}
                                              {RecepitsData.order_id.customer
                                                ?.zipcode
                                                ? ` - ${RecepitsData.order_id.customer?.zipcode}`
                                                : null}{" "}
                                            </p>
                                          ) : null}

                                          <p className="color-5">
                                            {RecepitsData?.order_id.details.customer_custom_fields?.map(
                                              (data, index) => {
                                                if (
                                                  RecepitsData.order_id.details
                                                    .customer_custom_fields
                                                    .length == 1 &&
                                                  data.value != ""
                                                ) {
                                                  return (
                                                    <>
                                                      {data.name}
                                                      {" : "}
                                                      <span>{data.value}</span>
                                                    </>
                                                  );
                                                } else if (
                                                  index + 1 ==
                                                    RecepitsData.order_id
                                                      .details
                                                      .customer_custom_fields
                                                      .length &&
                                                  data.value != ""
                                                ) {
                                                  return (
                                                    <>
                                                      {data.name}
                                                      {" : "}
                                                      <span>{data.value}</span>
                                                    </>
                                                  );
                                                } else if (data.value != "") {
                                                  return (
                                                    <>
                                                      {data.name}
                                                      {" : "}
                                                      <span>
                                                        {data.value}
                                                      </span>{" "}
                                                      {" | "}
                                                    </>
                                                  );
                                                }
                                              }
                                            )}
                                          </p>
                                          <p className="color-5">
                                            {RecepitsData.order_id.details.custom_fields.map(
                                              (val) => (
                                                <Tag color={val.tag_color}>
                                                  {val.name}
                                                </Tag>
                                              )
                                            )}
                                          </p>
                                        </address>
                                      </Col>
                                    ) : null}
                                  </Row>
                                </div>
                              </InvoiceLetterBox>
                              <Modal
                                title="Confirm Delete"
                                visible={deleteReceiptsModalVisible}
                                onCancel={() =>
                                  setDeleteReceiptsModalVisible(false)
                                }
                                cancelText="Go Back"
                                onOk={deleteReceipts}
                                okText="Delete Receipt"
                              >
                                <p>
                                  Deleting the receipt will permanently remove
                                  it and will no longer appear on reports. Also,
                                  deleting the receipt will keep the metrics as
                                  they were after cancellation. Are you sure you
                                  want to proceed?
                                </p>
                              </Modal>
                              <Modal
                                title="Confirm Cancelled."
                                visible={modalVisibleConfirmCancel}
                                footer={[
                                  <Button
                                    type="primary"
                                    onClick={() =>
                                      setModalVisibleConfirmCancel(false)
                                    }
                                  >
                                    Ok
                                  </Button>,
                                ]}
                              >
                                <p>Receipt has been cancelled.</p>
                              </Modal>
                              <Modal
                                title="Confirm Cancel"
                                bodyStyle={{
                                  paddingTop: 0,
                                  paddingBottom: "12px",
                                }}
                                visible={modalVisibleOrderCancel}
                                onCancel={() => {
                                  setModalVisibleOrderCancel(false);
                                  form.setFieldsValue({
                                    refund_amount: refundAmount,
                                  });
                                }}
                                width={600}
                                footer={[
                                  <Button
                                    type="default"
                                    className="btn-cancel btn-custom go_back"
                                    onClick={() => {
                                      setModalVisibleOrderCancel(false);
                                      form.setFieldsValue({
                                        refund_amount: refundAmount,
                                      });
                                    }}
                                  >
                                    Go Back
                                  </Button>,
                                  <Button
                                    type="primary"
                                    disabled={
                                      PaymentType || refundAmount == 0
                                        ? false
                                        : true
                                    }
                                    onClick={() => onSubmit()}
                                  >
                                    Cancel Receipt
                                  </Button>,
                                ]}
                              >
                                <Form
                                  style={{ width: "100%" }}
                                  name="Export"
                                  form={form}
                                  onFinish={onSubmit}
                                >
                                  <Form.Item
                                    name="refund_amount"
                                    label="Enter Refund Amount"
                                    rules={[
                                      {
                                        validator: (_, value) => {
                                          if (Number(value) > refundAmount) {
                                            return Promise.reject(
                                              "Refund amount cannot be more than the paid amount."
                                            );
                                          } else {
                                            return Promise.resolve();
                                          }
                                        },
                                      },
                                    ]}
                                  >
                                    <Input
                                      placeholder="Refund Amount"
                                      type="number"
                                    />
                                  </Form.Item>
                                  <Form.Item
                                    name="refund_pay_type"
                                    label="Payment Type"
                                    rules={[
                                      {
                                        message:
                                          "Choose a payment type to proceed",
                                        required:
                                          refundAmount > 0 ? true : false,
                                      },
                                    ]}
                                  >
                                    <Radio.Group
                                      onChange={(e) =>
                                        setPaymentType(e.target.value)
                                      }
                                      value={PaymentType}
                                      className="tick-radio"
                                    >
                                      <Radio.Button
                                        value="cash"
                                        style={{
                                          marginRight: "10px",
                                          marginBottom: "10px",
                                        }}
                                      >
                                        {PaymentType === "cash" ? (
                                          <img
                                            src={tickSvg}
                                            alt=""
                                            width="13px"
                                            style={{ marginRight: "5px" }}
                                          />
                                        ) : (
                                          ""
                                        )}
                                        Cash
                                      </Radio.Button>
                                      <Radio.Button
                                        value="card"
                                        style={{
                                          marginRight: "10px",
                                          marginBottom: "10px",
                                        }}
                                      >
                                        {PaymentType === "card" ? (
                                          <img
                                            src={tickSvg}
                                            alt=""
                                            width="13px"
                                            style={{ marginRight: "5px" }}
                                          />
                                        ) : (
                                          ""
                                        )}{" "}
                                        Credit / Debit Card
                                      </Radio.Button>
                                      {PaymentTypeList.map((val, index) => {
                                        return (
                                          <Radio.Button
                                            value={val.name}
                                            style={{
                                              marginRight: "10px",
                                              marginBottom: "10px",
                                            }}
                                          >
                                            {PaymentType === val.name ? (
                                              <img
                                                src={tickSvg}
                                                alt=""
                                                width="13px"
                                                style={{ marginRight: "5px" }}
                                              />
                                            ) : (
                                              ""
                                            )}
                                            {val.name}
                                          </Radio.Button>
                                        );
                                      })}
                                      <Radio.Button
                                        value="other"
                                        style={{
                                          marginRight: "10px",
                                          marginBottom: "10px",
                                        }}
                                      >
                                        {PaymentType === "other" ? (
                                          <img
                                            src={tickSvg}
                                            alt=""
                                            width="13px"
                                            style={{ marginRight: "5px" }}
                                          />
                                        ) : (
                                          ""
                                        )}
                                        Other
                                      </Radio.Button>
                                    </Radio.Group>
                                  </Form.Item>
                                  <Form.Item
                                    name="cancellation_reason"
                                    label="Cancellation Notes4"
                                    rules={[
                                      {
                                        max: 50,
                                        message:
                                          "Cancellation Notes cannot be more than 50 characters long.",
                                      },
                                    ]}
                                  >
                                    <Input placeholder="Cancellation notes" />
                                  </Form.Item>
                                </Form>
                              </Modal>
                              <br />
                              <ProductTable>
                                <div className="table-invoice table-responsive">
                                  <Table
                                    dataSource={tableData}
                                    columns={columnsData}
                                    pagination={false}
                                    rowClassName="invoice-table"
                                  />
                                </div>
                              </ProductTable>
                              <Row justify="end">
                                <Col
                                  xxl={4}
                                  xl={5}
                                  sm={8}
                                  xs={14}
                                  offset={rtl ? 0 : 10}
                                >
                                  <OrderSummary>
                                    <div className="invoice-summary-inner">
                                      <ul className="summary-list">
                                        <li>
                                          <span className="summary-list-title">
                                            Subtotal5 :
                                          </span>
                                          <span className="summary-list-text">
                                            {`₹${RecepitsData?.order_id.details.priceSummery.sub_total}`}
                                          </span>
                                        </li>
                                        {RecepitsData?.order_id.details
                                          .priceSummery.taxexArray &&
                                          RecepitsData?.order_id.details.priceSummery.taxexArray.map(
                                            (val) => {
                                              return (
                                                <li>
                                                  <span className="summary-list-title">
                                                    {val.name} :
                                                  </span>
                                                  <span className="summary-list-text">{`₹${Number(
                                                    val.value
                                                  ).toFixed(2)}`}</span>
                                                </li>
                                              );
                                            }
                                          )}
                                        {RecepitsData?.order_id.details
                                          .priceSummery.round_off_value && (
                                          <li>
                                            <span className="summary-list-title">
                                              Roundoff :
                                            </span>
                                            <span className="summary-list-text">{`₹${RecepitsData?.order_id.details.priceSummery.round_off_value}`}</span>
                                          </li>
                                        )}
                                      </ul>
                                      <Heading
                                        className="summary-total"
                                        as="h4"
                                      >
                                        <span className="summary-total-label">
                                          Total :{" "}
                                        </span>
                                        <span className="summary-total-amount">{`₹${Number(
                                          data.value
                                        ).toFixed(2)}`}</span>
                                      </Heading>
                                      <Heading
                                        className="summary-total"
                                        as="h4"
                                      >
                                        <span className="summary-total-label">
                                          For{" "}
                                          {data.name != ""
                                            ? data.name
                                            : `Customer ${data.no}`}{" "}
                                        </span>
                                        <span className="summary-total-amount">{`₹${Number(
                                          data.value
                                        ).toFixed(2)}`}</span>
                                      </Heading>
                                    </div>
                                  </OrderSummary>
                                </Col>
                                <Col></Col>
                              </Row>

                              {RecepitsData &&
                              RecepitsData.order_id.details.paymentStatus ==
                                "paid" ? (
                                <div className="border-top">
                                  {RecepitsData.order_id.details
                                    .orderTiketsDetails ? (
                                    <Row>
                                      Order Tickets :
                                      {RecepitsData.order_id.details.orderTiketsDetails.orderTicketsData.map(
                                        (i, index) => {
                                          return (
                                            <div>
                                              <span>
                                                <span
                                                  style={{
                                                    color: "rgb(0, 140, 186)",
                                                    cursor: "pointer",
                                                  }}
                                                  onClick={() => {
                                                    window.frames[
                                                      "print_frame"
                                                    ].document.body.innerHTML = ReactDOMServer.renderToStaticMarkup(
                                                      <OrderTicketPrint
                                                        categoryDetails={i}
                                                        PreviousTikets={[]}
                                                      />
                                                    );
                                                    window.frames[
                                                      "print_frame"
                                                    ].window.focus();
                                                    window.frames[
                                                      "print_frame"
                                                    ].window.print();
                                                  }}
                                                >
                                                  {index ==
                                                  RecepitsData.order_id.details
                                                    .orderTiketsDetails
                                                    .orderTicketsData.length -
                                                    1
                                                    ? `#${i.tiketNumber}`
                                                    : `#${i.tiketNumber},`}
                                                </span>
                                              </span>
                                            </div>
                                          );
                                        }
                                      )}
                                    </Row>
                                  ) : null}
                                  <Row>
                                    {data.payment_type_list.map((val) => {
                                      if (val.tick == true) {
                                        return (
                                          <>
                                            <Col
                                              lg={6}
                                              md={18}
                                              sm={24}
                                              offset={0}
                                            >
                                              <div className="receipt-payment-transactions">
                                                <p>{`₹${data.value} on ${val.name}`}</p>
                                                <p className="text-muted">
                                                  {commonFunction.convertToDate(
                                                    RecepitsData.created_at,
                                                    "MMM DD, Y h:mm A"
                                                  )}
                                                </p>
                                              </div>
                                            </Col>
                                          </>
                                        );
                                      }
                                    })}
                                    {RecepitsData &&
                                      RecepitsData.order_id.cancellation &&
                                      indx == 0 && (
                                        <Col lg={6} md={18} sm={24} offset={0}>
                                          <div className="receipt-payment-transactions">
                                            <p>{`₹${RecepitsData.order_id.cancellation.refund_amount} ${RecepitsData.order_id.cancellation.refund_pay_type} refund`}</p>
                                            <p className="text-muted">
                                              {commonFunction.convertToDate(
                                                RecepitsData.order_id
                                                  .cancellation.cancel_Date,
                                                "MMM DD, Y h:mm A"
                                              )}
                                            </p>
                                          </div>
                                        </Col>
                                      )}
                                  </Row>
                                </div>
                              ) : (
                                <>
                                  <div style={{ display: "none" }}>
                                    {PaymentTypeList.length}
                                  </div>
                                  <UnPaidReceipts
                                    RecepitsDataDetails={RecepitsData}
                                    PaymentTypeList={PaymentTypeList}
                                    updateFetch={fetchRecepitsData}
                                  />
                                </>
                              )}
                            </Cards>
                          </Col>
                        </Row>
                      </Main>
                    </>
                  );
                }
              }
            )
          ) : (
            <Main className="receipts_inv">
              <PageHeader
                ghost
                className="custome-status-header"
                title={
                  <>
                    <span>
                      Status &nbsp;
                      {RecepitsData && (
                        <>
                          {RecepitsData.order_id.details.paymentStatus ==
                          "paid" ? (
                            <Tag color="#43ac6a">Paid</Tag>
                          ) : (
                            <Tag color="#e99002">Unpaid</Tag>
                          )}
                          {RecepitsData.order_id.details.fulfillmentStatus ==
                            "Fulfilled" && deletebuttonShow == false ? (
                            <Tag color="#008cba">Fulfilled</Tag>
                          ) : RecepitsData.order_id.details.fulfillmentStatus ==
                              "Unfulfilled" && deletebuttonShow == false ? (
                            <Tag color="#e7e7e7">Unfulfilled</Tag>
                          ) : (
                            <Tag color="#f04124">Cancelled</Tag>
                          )}
                        </>
                      )}
                    </span>
                    {RecepitsData.order_id.cancellation
                      ?.cancellation_reason && (
                      <p>
                        Cancellation Notes -{" "}
                        {RecepitsData.order_id.cancellation.cancellation_reason}
                      </p>
                    )}
                  </>
                }
                buttons={[
                  <div key="1" className="page-header-actions">
                    <Button
                      size="small"
                      shape="round"
                      type="default"
                      onClick={() => {
                        window.frames[
                          "print_frame"
                        ].document.body.innerHTML = ReactDOMServer.renderToStaticMarkup(
                          <ReceiptPrint
                            receiptsDetails={RecepitsData.order_id}
                            shopDetails={shopDetails}
                            registerData={registerdata}
                          />
                        );
                        window.frames["print_frame"].window.focus();
                        window.frames["print_frame"].window.print();
                      }}
                    >
                      <FeatherIcon icon="printer" size={14} />
                      Print3
                    </Button>

                    {deletebuttonShow ? (
                      <Button
                        size="small"
                        shape="round"
                        type="primary"
                        onClick={() => setDeleteReceiptsModalVisible(true)}
                      >
                        Delete
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        shape="round"
                        type="primary"
                        onClick={() => setModalVisibleOrderCancel(true)}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>,
                ]}
              />
              {console.log("receiptsData**", RecepitsData)}
              <Row gutter={15}>
                <Col md={24}>
                  <Cards headless>
                    <InvoiceLetterBox>
                      <div className="invoice-letter-inner">
                        <Row align="top">
                          <Col lg={10} xs={24}>
                            <article className="invoice-author">
                              <Heading
                                className="invoice-author__title"
                                as="h3"
                              >
                                Invoice
                              </Heading>
                              <p>No : #{RecepitsData.receipt_number}</p>

                              <p className="color-5">
                                Prepared by{" "}
                                {
                                  RecepitsData.order_id.details.order_by_name
                                    .username
                                }{" "}
                                {RecepitsData.order_id.details.tableName !=
                                  undefined &&
                                  ` | ${RecepitsData.order_id.details.tableName}`}
                              </p>
                              <p>
                                on{" "}
                                {commonFunction.convertToDate(
                                  RecepitsData.created_at,
                                  "MMM DD, Y h:mm A"
                                )}
                              </p>
                              <p className="color-5">
                                {" "}
                                {`${RecepitsData.register_id.register_name} Register`}
                              </p>
                            </article>
                          </Col>

                          {RecepitsData.order_id.customer.name ||
                          RecepitsData.order_id.customer.email != "" ||
                          RecepitsData.order_id.customer.mobial != null ||
                          RecepitsData.order_id.customer.city ||
                          RecepitsData.order_id.customer.shipping_address ||
                          RecepitsData.order_id.customer.zipcode ||
                          RecepitsData?.order_id.details.customer_custom_fields
                            ?.length > 0 ||
                          RecepitsData.order_id.details.custom_fields?.length >
                            0 ? (
                            <Col lg={14} xs={24}>
                              <address className="invoice-customer">
                                <Heading
                                  className="invoice-customer__title"
                                  as="h5"
                                >
                                  Invoice To:
                                </Heading>

                                {RecepitsData.order_id.customer?.name ||
                                RecepitsData.order_id.customer?.email ||
                                RecepitsData.order_id.customer?.mobile ? (
                                  <p>
                                    {" "}
                                    {RecepitsData.order_id.customer?.name
                                      ? RecepitsData.order_id.customer
                                          ?.mobile ||
                                        RecepitsData.order_id.customer?.email
                                        ? `${RecepitsData.order_id.customer?.name} | `
                                        : RecepitsData.order_id.customer?.name
                                      : null}
                                    {RecepitsData.order_id.customer?.mobile
                                      ? RecepitsData.order_id.customer?.email
                                        ? `${RecepitsData.order_id.customer?.mobile} | `
                                        : RecepitsData.order_id.customer?.mobile
                                      : null}
                                    {RecepitsData.order_id.customer?.email
                                      ? RecepitsData.order_id.customer?.email
                                      : null}{" "}
                                    {RecepitsData.order_id.customer
                                      ?.shipping_address ? (
                                      <br />
                                    ) : null}
                                    {RecepitsData.order_id.customer
                                      ?.shipping_address
                                      ? RecepitsData.order_id.customer?.city ||
                                        RecepitsData.order_id.customer?.zipcode
                                        ? `${RecepitsData.order_id.customer?.shipping_address} `
                                        : RecepitsData.order_id.customer
                                            ?.shipping_address
                                      : null}
                                    {RecepitsData.order_id.customer.city ? (
                                      <br />
                                    ) : null}
                                    {RecepitsData.order_id.customer?.city
                                      ? RecepitsData.order_id.customer?.zipcode
                                        ? `${RecepitsData.order_id.customer?.city}`
                                        : RecepitsData.order_id.customer?.city
                                      : null}
                                    {RecepitsData.order_id.customer?.zipcode
                                      ? ` - ${RecepitsData.order_id.customer?.zipcode}`
                                      : null}{" "}
                                  </p>
                                ) : null}

                                <p className="color-5">
                                  {RecepitsData?.order_id.details.customer_custom_fields?.map(
                                    (data, index) => {
                                      if (
                                        RecepitsData.order_id.details
                                          .customer_custom_fields.length == 1 &&
                                        data.value != ""
                                      ) {
                                        return (
                                          <>
                                            {data.name}
                                            {" : "}
                                            <span>{data.value}</span>
                                          </>
                                        );
                                      } else if (
                                        index + 1 ==
                                          RecepitsData.order_id.details
                                            .customer_custom_fields.length &&
                                        data.value != ""
                                      ) {
                                        return (
                                          <>
                                            {data.name}
                                            {" : "}
                                            <span>{data.value}</span>
                                          </>
                                        );
                                      } else if (data.value != "") {
                                        return (
                                          <>
                                            {data.name}
                                            {" : "}
                                            <span>{data.value}</span> {" | "}
                                          </>
                                        );
                                      }
                                    }
                                  )}
                                </p>
                                <p className="color-5">
                                  {RecepitsData.order_id.details.custom_fields?.map(
                                    (val) => (
                                      <Tag color={val.tag_color}>
                                        {val.name}
                                      </Tag>
                                    )
                                  )}
                                </p>
                              </address>
                            </Col>
                          ) : null}
                        </Row>
                      </div>
                    </InvoiceLetterBox>

                    <Modal
                      title="Confirm Delete"
                      visible={deleteReceiptsModalVisible}
                      onCancel={() => setDeleteReceiptsModalVisible(false)}
                      cancelText="Go Back"
                      onOk={deleteReceipts}
                      okText="Delete Receipt"
                    >
                      <p>
                        Deleting the receipt will permanently remove it and will
                        no longer appear on reports. Also, deleting the receipt
                        will keep the metrics as they were after cancellation.
                        Are you sure you want to proceed?
                      </p>
                    </Modal>
                    <Modal
                      title="Confirm Cancelled."
                      visible={modalVisibleConfirmCancel}
                      footer={[
                        <Button
                          type="primary"
                          onClick={() => setModalVisibleConfirmCancel(false)}
                        >
                          Ok
                        </Button>,
                      ]}
                    >
                      <p>Receipt has been cancelled.</p>
                    </Modal>
                    <Modal
                      title="Confirm Cancel"
                      className="remove-border"
                      bodyStyle={{ paddingTop: 0, paddingBottom: "12px" }}
                      visible={modalVisibleOrderCancel}
                      onCancel={() => {
                        setModalVisibleOrderCancel(false);
                        form.setFieldsValue({
                          refund_amount: refundAmount,
                        });
                      }}
                      width={600}
                      footer={[
                        <Button
                          type="default"
                          className="btn-cancel btn-custom go_back"
                          onClick={() => {
                            setModalVisibleOrderCancel(false);
                            form.setFieldsValue({
                              refund_amount: refundAmount,
                            });
                          }}
                        >
                          Go Back
                        </Button>,
                        <Button
                          type="primary"
                          disabled={
                            PaymentType || refundAmount == 0 ? false : true
                          }
                          onClick={() => onSubmit()}
                        >
                          Cancel Receipt
                        </Button>,
                      ]}
                    >
                      <Form
                        style={{ width: "100%" }}
                        name="Export"
                        form={form}
                        onFinish={onSubmit}
                      >
                        <Form.Item
                          name="refund_amount"
                          label="Enter Refund Amount"
                          rules={[
                            {
                              validator: (_, value) => {
                                if (Number(value) > refundAmount) {
                                  return Promise.reject(
                                    "Refund amount cannot be more than the paid amount."
                                  );
                                } else {
                                  return Promise.resolve();
                                }
                              },
                            },
                          ]}
                        >
                          <Input placeholder="Refund Amount" type="number" />
                        </Form.Item>
                        <Form.Item
                          name="refund_pay_type"
                          label="Payment Type"
                          rules={[
                            {
                              message: "Choose a payment type to proceed",
                              required: refundAmount > 0 ? true : false,
                            },
                          ]}
                        >
                          <Radio.Group
                            onChange={(e) => setPaymentType(e.target.value)}
                            value={PaymentType}
                            className="tick-radio"
                          >
                            <Radio.Button
                              value="cash"
                              style={{
                                marginRight: "10px",
                                marginBottom: "10px",
                              }}
                            >
                              {PaymentType === "cash" ? (
                                <img
                                  src={tickSvg}
                                  alt=""
                                  width="13px"
                                  style={{ marginRight: "5px" }}
                                />
                              ) : (
                                ""
                              )}
                              Cash
                            </Radio.Button>
                            <Radio.Button
                              value="card"
                              style={{
                                marginRight: "10px",
                                marginBottom: "10px",
                              }}
                            >
                              {PaymentType === "card" ? (
                                <img
                                  src={tickSvg}
                                  alt=""
                                  width="13px"
                                  style={{ marginRight: "5px" }}
                                />
                              ) : (
                                ""
                              )}{" "}
                              Credit / Debit Card
                            </Radio.Button>
                            {PaymentTypeList.map((val, index) => {
                              return (
                                <Radio.Button
                                  value={val.name}
                                  style={{
                                    marginRight: "10px",
                                    marginBottom: "10px",
                                  }}
                                >
                                  {PaymentType === val.name ? (
                                    <img
                                      src={tickSvg}
                                      alt=""
                                      width="13px"
                                      style={{ marginRight: "5px" }}
                                    />
                                  ) : (
                                    ""
                                  )}
                                  {val.name}
                                </Radio.Button>
                              );
                            })}
                            <Radio.Button
                              value="other"
                              style={{
                                marginRight: "10px",
                                marginBottom: "10px",
                              }}
                            >
                              {PaymentType === "other" ? (
                                <img
                                  src={tickSvg}
                                  alt=""
                                  width="13px"
                                  style={{ marginRight: "5px" }}
                                />
                              ) : (
                                ""
                              )}
                              Other
                            </Radio.Button>
                          </Radio.Group>
                        </Form.Item>
                        <Form.Item
                          name="cancellation_reason"
                          label="Cancellation Notes1"
                          rules={[
                            {
                              max: 50,
                              message:
                                "Cancellation Notes cannot be more than 50 characters long.",
                            },
                          ]}
                        >
                          <Input placeholder="Cancellation notes" />
                        </Form.Item>
                      </Form>
                    </Modal>
                    <br />
                    <ProductTable>
                      <div className="table-invoice table-responsive">
                        <Table
                          dataSource={dataSource}
                          columns={invoiceTableColumns}
                          pagination={false}
                          rowClassName="invoice-table"
                        />
                      </div>
                    </ProductTable>
                    <Row justify="end">
                      <Col xxl={4} xl={5} sm={8} xs={14} offset={rtl ? 0 : 10}>
                        <OrderSummary>
                          <div className="invoice-summary-inner">
                            <ul className="summary-list">
                              <li>
                                <span className="summary-list-title">
                                  Subtotal :
                                </span>

                                <span className="summary-list-text">
                                  {`₹${RecepitsData?.order_id.details.priceSummery.sub_total}`}
                                </span>
                              </li>
                              {RecepitsData?.order_id.details.priceSummery
                                .totalItemDisocunts > 0 && (
                                <li>
                                  <span className="summary-list-title">
                                    Item Discounts :
                                  </span>
                                  <span className="summary-list-text">
                                    {`-₹${RecepitsData?.order_id.details.priceSummery.totalItemDisocunts}`}
                                  </span>
                                </li>
                              )}
                              {RecepitsData?.order_id?.details
                                ?.bulckDiscountValue && (
                                <li>
                                  <span className="summary-list-title">
                                    Bulk Discount
                                  </span>

                                  <span className="summary-list-text">
                                    {`-₹${RecepitsData?.order_id?.details?.bulckDiscountValue}`}
                                  </span>
                                </li>
                              )}
                              {RecepitsData?.order_id?.details
                                ?.AddtionChargeValue &&
                                RecepitsData?.order_id?.details?.AddtionChargeValue.map(
                                  (charge) =>
                                    charge.is_automatically_added && (
                                      <li>
                                        <span className="summary-list-title">
                                          {charge.charge_name}{" "}
                                          {charge.tax_group &&
                                            charge.tax_group.Totaltax &&
                                            `(Tax ${charge.tax_group.Totaltax}%)`}
                                        </span>

                                        <span className="summary-list-text">
                                          {charge.charge_value}
                                        </span>
                                      </li>
                                    )
                                )}

                              {RecepitsData?.order_id.details.priceSummery
                                .taxexArray &&
                                RecepitsData?.order_id.details.priceSummery.taxexArray.map(
                                  (val) => {
                                    return (
                                      <li>
                                        <span className="summary-list-title">
                                          {val.name} :
                                        </span>
                                        <span className="summary-list-text">{`₹${Number(
                                          val.value
                                        ).toFixed(2)}`}</span>
                                      </li>
                                    );
                                  }
                                )}
                              {RecepitsData?.order_id.details.priceSummery
                                .round_off_value && (
                                <li>
                                  <span className="summary-list-title">
                                    Roundoff :
                                  </span>
                                  <span className="summary-list-text">{`₹${RecepitsData?.order_id.details.priceSummery.round_off_value}`}</span>
                                </li>
                              )}
                            </ul>
                            <Heading className="summary-total" as="h4">
                              <span className="summary-total-label">
                                Total :{" "}
                              </span>
                              <span className="summary-total-amount">{`₹${RecepitsData?.order_id.details.priceSummery.total}`}</span>
                            </Heading>
                          </div>
                        </OrderSummary>
                      </Col>
                      <Col></Col>
                    </Row>

                    {RecepitsData &&
                    RecepitsData.order_id.details.paymentStatus == "paid" ? (
                      <div className="border-top">
                        {RecepitsData.order_id.details.orderTiketsDetails &&
                        RecepitsData.order_id.details.orderTiketsDetails
                          .orderTicketsData ? (
                          <Row>
                            Order Tickets :
                            {RecepitsData.order_id.details.orderTiketsDetails.orderTicketsData.map(
                              (i, index) => {
                                return (
                                  <div>
                                    <span>
                                      <span
                                        style={{
                                          color: "rgb(0, 140, 186)",
                                          cursor: "pointer",
                                        }}
                                        onClick={() => {
                                          window.frames[
                                            "print_frame"
                                          ].document.body.innerHTML = ReactDOMServer.renderToStaticMarkup(
                                            <OrderTicketPrint
                                              categoryDetails={i}
                                              PreviousTikets={[]}
                                            />
                                          );
                                          window.frames[
                                            "print_frame"
                                          ].window.focus();
                                          window.frames[
                                            "print_frame"
                                          ].window.print();
                                        }}
                                      >
                                        {index ==
                                        RecepitsData.order_id.details
                                          .orderTiketsDetails.orderTicketsData
                                          .length -
                                          1
                                          ? `#${i.tiketNumber}`
                                          : `#${i.tiketNumber},`}
                                      </span>
                                    </span>
                                  </div>
                                );
                              }
                            )}
                          </Row>
                        ) : null}
                        {RecepitsData &&
                          RecepitsData.order_id.details.immediate_sale
                            .multiple_payments_type && (
                            <Row>
                              {RecepitsData.order_id.details.immediate_sale.multiple_payments_type.map(
                                (val) => {
                                  return (
                                    <>
                                      <Col lg={6} md={18} sm={24} offset={0}>
                                        <div className="receipt-payment-transactions">
                                          <p>
                                            {`₹${val.value} on ${
                                              val.name ==
                                                "Credit / Debit Card" ||
                                              val.name == "card"
                                                ? "Card"
                                                : val.name
                                            }`}{" "}
                                            {console.log(
                                              "AAA123",
                                              RecepitsData.order_id.details
                                                .immediate_sale.card_Details &&
                                                RecepitsData.order_id.details
                                                  .immediate_sale
                                                  .multiple_payments_type[0]
                                                  .name == "card"
                                            )}
                                            {RecepitsData.order_id.details
                                              .immediate_sale.card_Details &&
                                            RecepitsData.order_id.details
                                              .immediate_sale
                                              .multiple_payments_type[0].name ==
                                              "card" ? (
                                              <Tooltip
                                                title={
                                                  <div>
                                                    Card Details :
                                                    <br />
                                                    {
                                                      RecepitsData.order_id
                                                        .details.immediate_sale
                                                        .card_Details
                                                    }
                                                  </div>
                                                }
                                              >
                                                {" "}
                                                <ExclamationCircleOutlined
                                                  style={{
                                                    cursor: "pointer",
                                                  }}
                                                />
                                              </Tooltip>
                                            ) : null}
                                            {RecepitsData.order_id.details
                                              .immediate_sale.payment_notes &&
                                            RecepitsData.order_id.details
                                              .immediate_sale
                                              .multiple_payments_type[0].name !=
                                              "cash" &&
                                            RecepitsData.order_id.details
                                              .immediate_sale
                                              .multiple_payments_type[0].name !=
                                              "card" &&
                                            RecepitsData.order_id.details
                                              .immediate_sale
                                              .multiple_payments_type[0].name !=
                                              "pending" ? (
                                              <Tooltip
                                                title={
                                                  <div>
                                                    Notes :
                                                    <br />
                                                    {
                                                      RecepitsData.order_id
                                                        .details.immediate_sale
                                                        .payment_notes
                                                    }
                                                  </div>
                                                }
                                              >
                                                <ExclamationCircleOutlined
                                                  style={{
                                                    cursor: "pointer",
                                                  }}
                                                />
                                              </Tooltip>
                                            ) : null}
                                          </p>
                                          <p className="text-muted">
                                            {commonFunction.convertToDate(
                                              RecepitsData.created_at,
                                              "MMM DD, Y h:mm A"
                                            )}
                                          </p>
                                        </div>
                                      </Col>
                                    </>
                                  );
                                }
                              )}

                              {RecepitsData &&
                                RecepitsData.order_id.cancellation && (
                                  <Col lg={6} md={18} sm={24} offset={0}>
                                    <div className="receipt-payment-transactions">
                                      <p>{`₹${RecepitsData.order_id.cancellation.refund_amount} ${RecepitsData.order_id.cancellation.refund_pay_type} refund`}</p>
                                      <p className="text-muted">
                                        {commonFunction.convertToDate(
                                          RecepitsData.order_id.cancellation
                                            .cancel_Date,
                                          "MMM DD, Y h:mm A"
                                        )}
                                      </p>
                                    </div>
                                  </Col>
                                )}
                            </Row>
                          )}
                      </div>
                    ) : (
                      <>
                        <div style={{ display: "none" }}>
                          {PaymentTypeList.length}
                        </div>
                        <UnPaidReceipts
                          RecepitsDataDetails={RecepitsData}
                          PaymentTypeList={PaymentTypeList}
                          updateFetch={fetchRecepitsData}
                        />
                      </>
                    )}
                  </Cards>
                </Col>
              </Row>
            </Main>
          )}
        </div>
      ) : (
        <div>
          {RecepitsData && (
            <Main>
              <PageHeader
                ghost
                className="custome-status-header"
                title={
                  <>
                    <span>
                      Status &nbsp;
                      {RecepitsData && (
                        <>
                          {RecepitsData.order_id.details.paymentStatus ==
                          "paid" ? (
                            <Tag color="#43ac6a">Paid</Tag>
                          ) : (
                            <Tag color="#e99002">Unpaid</Tag>
                          )}
                          {RecepitsData.order_id.details.fulfillmentStatus ==
                            "Fulfilled" && deletebuttonShow == false ? (
                            <Tag color="#008cba">Fulfilled</Tag>
                          ) : RecepitsData.order_id.details.fulfillmentStatus ==
                              "Unfulfilled" && deletebuttonShow == false ? (
                            <Tag color="#e7e7e7">Unfulfilled</Tag>
                          ) : (
                            <Tag color="#f04124">
                              {console.log(
                                "lalo123",
                                RecepitsData.order_id.details.fulfillmentStatus
                              )}
                              Cancelled
                            </Tag>
                          )}
                        </>
                      )}
                    </span>
                    {RecepitsData.order_id.cancellation
                      ?.cancellation_reason && (
                      <p>
                        Cancellation Notes -{" "}
                        {RecepitsData.order_id.cancellation.cancellation_reason}
                      </p>
                    )}
                  </>
                }
                buttons={[
                  <div key="1" className="page-header-actions">
                    <Button
                      size="small"
                      shape="round"
                      type="default"
                      onClick={() => {
                        window.frames[
                          "print_frame"
                        ].document.body.innerHTML = ReactDOMServer.renderToStaticMarkup(
                          <ReceiptPrint
                            receiptsDetails={RecepitsData.order_id}
                            shopDetails={shopDetails}
                            registerData={registerdata}
                          />
                        );
                        window.frames["print_frame"].window.focus();
                        window.frames["print_frame"].window.print();
                      }}
                    >
                      <FeatherIcon icon="printer" size={14} />
                      Print4
                    </Button>

                    {deletebuttonShow ? (
                      <Button
                        size="small"
                        shape="round"
                        type="primary"
                        onClick={() => setDeleteReceiptsModalVisible(true)}
                      >
                        Delete
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        shape="round"
                        type="primary"
                        onClick={() => setModalVisibleOrderCancel(true)}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>,
                ]}
              />
              {console.log("receiptsData**", RecepitsData)}
              <Row gutter={15}>
                <Col md={24}>
                  <Cards headless>
                    <InvoiceLetterBox>
                      <div className="invoice-letter-inner">
                        <Row align="top">
                          <Col lg={10} xs={24}>
                            <article className="invoice-author">
                              <Heading
                                className="invoice-author__title"
                                as="h3"
                              >
                                Invoice
                              </Heading>
                              <p>No : #{RecepitsData.receipt_number}</p>
                              <p className="color-5">
                                Prepared by{" "}
                                {
                                  RecepitsData.order_id.details.order_by_name
                                    .username
                                }{" "}
                                {RecepitsData.order_id.details.tableName !=
                                  undefined &&
                                  ` | ${RecepitsData.order_id.details.tableName}`}
                              </p>
                              <p>
                                on{" "}
                                {commonFunction.convertToDate(
                                  RecepitsData.created_at,
                                  "MMM DD, Y h:mm A"
                                )}
                              </p>
                              <p className="color-5">
                                {" "}
                                {`${RecepitsData.register_id.register_name} Register`}
                              </p>
                            </article>
                          </Col>

                          {RecepitsData.order_id.customer.name ||
                          RecepitsData.order_id.customer.email != "" ||
                          RecepitsData.order_id.customer.mobial != null ||
                          RecepitsData.order_id.customer.city ||
                          RecepitsData.order_id.customer.shipping_address ||
                          RecepitsData.order_id.customer.zipcode ||
                          RecepitsData?.order_id.details.customer_custom_fields
                            ?.length > 0 ||
                          RecepitsData.order_id.details.custom_fields.length >
                            0 ? (
                            <Col lg={14} xs={24}>
                              <address className="invoice-customer">
                                <Heading
                                  className="invoice-customer__title"
                                  as="h5"
                                >
                                  {RecepitsData.order_id.details
                                    .fulfillmentStatus == "Unfulfilled" &&
                                    deletebuttonShow == false && (
                                      <EditOutlined
                                        onClick={() =>
                                          editRef.current.showModal()
                                        }
                                        style={{ marginRight: "10px" }}
                                      />
                                    )}
                                  Invoice To 1:
                                </Heading>

                                {RecepitsData.order_id.customer?.name ||
                                RecepitsData.order_id.customer?.email ||
                                RecepitsData.order_id.customer?.mobile ? (
                                  <p>
                                    {" "}
                                    {RecepitsData.order_id.customer?.name
                                      ? RecepitsData.order_id.customer
                                          ?.mobile ||
                                        RecepitsData.order_id.customer?.email
                                        ? `${RecepitsData.order_id.customer?.name} | `
                                        : RecepitsData.order_id.customer?.name
                                      : null}
                                    {RecepitsData.order_id.customer?.mobile
                                      ? RecepitsData.order_id.customer?.email
                                        ? `${RecepitsData.order_id.customer?.mobile} | `
                                        : RecepitsData.order_id.customer?.mobile
                                      : null}
                                    {RecepitsData.order_id.customer?.email
                                      ? RecepitsData.order_id.customer?.email
                                      : null}{" "}
                                    {RecepitsData.order_id.customer
                                      ?.shipping_address ? (
                                      <br />
                                    ) : null}
                                    {RecepitsData.order_id.customer
                                      ?.shipping_address
                                      ? RecepitsData.order_id.customer?.city ||
                                        RecepitsData.order_id.customer?.zipcode
                                        ? `${RecepitsData.order_id.customer?.shipping_address} `
                                        : RecepitsData.order_id.customer
                                            ?.shipping_address
                                      : null}
                                    {RecepitsData.order_id.customer.city ? (
                                      <br />
                                    ) : null}
                                    {RecepitsData.order_id.customer?.city
                                      ? RecepitsData.order_id.customer?.zipcode
                                        ? `${RecepitsData.order_id.customer?.city}`
                                        : RecepitsData.order_id.customer?.city
                                      : null}
                                    {RecepitsData.order_id.customer?.zipcode
                                      ? ` - ${RecepitsData.order_id.customer?.zipcode}`
                                      : null}{" "}
                                  </p>
                                ) : null}

                                <p className="color-5">
                                  {RecepitsData?.order_id.details.customer_custom_fields?.map(
                                    (data, index) => {
                                      if (
                                        RecepitsData.order_id.details
                                          .customer_custom_fields.length == 1 &&
                                        data.value != ""
                                      ) {
                                        return (
                                          <>
                                            {data.name}
                                            {" : "}
                                            <span>{data.value}</span>
                                          </>
                                        );
                                      } else if (
                                        index + 1 ==
                                          RecepitsData.order_id.details
                                            .customer_custom_fields.length &&
                                        data.value != ""
                                      ) {
                                        return (
                                          <>
                                            {data.name}
                                            {" : "}
                                            <span>{data.value}</span>
                                          </>
                                        );
                                      } else if (data.value != "") {
                                        return (
                                          <>
                                            {data.name}
                                            {" : "}
                                            <span>{data.value}</span> {" | "}
                                          </>
                                        );
                                      }
                                    }
                                  )}
                                </p>
                                <p className="color-5">
                                  {RecepitsData.order_id.details.custom_fields.map(
                                    (val) => (
                                      <Tag color={val.tag_color}>
                                        {val.name}
                                      </Tag>
                                    )
                                  )}
                                </p>
                              </address>
                            </Col>
                          ) : null}
                        </Row>
                      </div>
                    </InvoiceLetterBox>
                    <Modal
                      title="Confirm Delete"
                      visible={deleteReceiptsModalVisible}
                      onCancel={() => setDeleteReceiptsModalVisible(false)}
                      cancelText="Go Back"
                      onOk={deleteReceipts}
                      okText="Delete Receipt"
                    >
                      <p>
                        Deleting the receipt will permanently remove it and will
                        no longer appear on reports. Also, deleting the receipt
                        will keep the metrics as they were after cancellation.
                        Are you sure you want to proceed?
                      </p>
                    </Modal>
                    <Modal
                      title="Confirm Cancelled."
                      visible={modalVisibleConfirmCancel}
                      footer={[
                        <Button
                          type="primary"
                          onClick={() => setModalVisibleConfirmCancel(false)}
                        >
                          Ok
                        </Button>,
                      ]}
                    >
                      <p>Receipt has been cancelled.</p>
                    </Modal>
                    <Modal
                      title="Confirm Cancel"
                      bodyStyle={{ paddingTop: 0, paddingBottom: "12px" }}
                      visible={modalVisibleOrderCancel}
                      onCancel={() => {
                        setModalVisibleOrderCancel(false);
                        form.setFieldsValue({
                          refund_amount: refundAmount,
                        });
                      }}
                      width={600}
                      footer={[
                        <Button
                          type="default"
                          className="btn-cancel btn-custom go_back"
                          onClick={() => {
                            setModalVisibleOrderCancel(false);
                            form.setFieldsValue({
                              refund_amount: refundAmount,
                            });
                          }}
                        >
                          Go Back
                        </Button>,
                        <Button
                          type="primary"
                          disabled={
                            PaymentType || refundAmount == 0 ? false : true
                          }
                          onClick={() => onSubmit()}
                        >
                          Cancel Receipt
                        </Button>,
                      ]}
                    >
                      <Form
                        style={{ width: "100%" }}
                        name="Export"
                        form={form}
                        onFinish={onSubmit}
                      >
                        <Form.Item
                          name="refund_amount"
                          label="Enter Refund Amount"
                          rules={[
                            {
                              validator: (_, value) => {
                                if (Number(value) > refundAmount) {
                                  return Promise.reject(
                                    "Refund amount cannot be more than the paid amount."
                                  );
                                } else {
                                  return Promise.resolve();
                                }
                              },
                            },
                          ]}
                        >
                          <Input placeholder="Refund Amount" type="number" />
                        </Form.Item>
                        <Form.Item
                          name="refund_pay_type"
                          label="Payment Type"
                          rules={[
                            {
                              message: "Choose a payment type to proceed",
                              required: refundAmount > 0 ? true : false,
                            },
                          ]}
                        >
                          <Radio.Group
                            onChange={(e) => setPaymentType(e.target.value)}
                            value={PaymentType}
                            className="tick-radio"
                          >
                            <Radio.Button
                              value="cash"
                              style={{
                                marginRight: "10px",
                                marginBottom: "10px",
                              }}
                            >
                              {PaymentType === "cash" ? (
                                <img
                                  src={tickSvg}
                                  alt=""
                                  width="13px"
                                  style={{ marginRight: "5px" }}
                                />
                              ) : (
                                ""
                              )}
                              Cash
                            </Radio.Button>
                            <Radio.Button
                              value="card"
                              style={{
                                marginRight: "10px",
                                marginBottom: "10px",
                              }}
                            >
                              {PaymentType === "card" ? (
                                <img
                                  src={tickSvg}
                                  alt=""
                                  width="13px"
                                  style={{ marginRight: "5px" }}
                                />
                              ) : (
                                ""
                              )}{" "}
                              Credit / Debit Card
                            </Radio.Button>
                            {PaymentTypeList.map((val, index) => {
                              return (
                                <Radio.Button
                                  value={val.name}
                                  style={{
                                    marginRight: "10px",
                                    marginBottom: "10px",
                                  }}
                                >
                                  {PaymentType === val.name ? (
                                    <img
                                      src={tickSvg}
                                      alt=""
                                      width="13px"
                                      style={{ marginRight: "5px" }}
                                    />
                                  ) : (
                                    ""
                                  )}
                                  {val.name}
                                </Radio.Button>
                              );
                            })}
                            <Radio.Button
                              value="other"
                              style={{
                                marginRight: "10px",
                                marginBottom: "10px",
                              }}
                            >
                              {PaymentType === "other" ? (
                                <img
                                  src={tickSvg}
                                  alt=""
                                  width="13px"
                                  style={{ marginRight: "5px" }}
                                />
                              ) : (
                                ""
                              )}
                              Other
                            </Radio.Button>
                          </Radio.Group>
                        </Form.Item>
                        <Form.Item
                          name="cancellation_reason"
                          label="Cancellation Notes2"
                          rules={[
                            {
                              max: 50,
                              message:
                                "Cancellation Notes cannot be more than 50 characters long.",
                            },
                          ]}
                        >
                          <Input placeholder="Cancellation notes" />
                        </Form.Item>
                      </Form>
                    </Modal>
                    <br />
                    <ProductTable>
                      <div className="table-invoice table-responsive">
                        <Table
                          dataSource={dataSource}
                          columns={invoiceTableColumns}
                          pagination={false}
                          rowClassName="invoice-table"
                        />
                      </div>
                    </ProductTable>
                    <Row justify="end">
                      <Col xxl={4} xl={5} sm={8} xs={14} offset={rtl ? 0 : 10}>
                        <OrderSummary>
                          <div className="invoice-summary-inner">
                            <ul className="summary-list">
                              <li>
                                <span className="summary-list-title">
                                  Subtotal :
                                </span>
                                <span className="summary-list-text">
                                  {`₹${RecepitsData?.order_id.details.priceSummery.sub_total}`}
                                </span>
                              </li>
                              {RecepitsData?.order_id.details.priceSummery
                                .totalItemDisocunts > 0 && (
                                <li>
                                  <span className="summary-list-title">
                                    Item Discounts :
                                  </span>
                                  <span className="summary-list-text">
                                    {`-₹${RecepitsData?.order_id.details.priceSummery.totalItemDisocunts}`}
                                  </span>
                                </li>
                              )}
                              {RecepitsData?.order_id?.details
                                ?.bulckDiscountValue && (
                                <li>
                                  <span className="summary-list-title">
                                    Bulk Discount
                                  </span>

                                  <span className="summary-list-text">
                                    {`-₹${RecepitsData?.order_id?.details?.bulckDiscountValue}`}
                                  </span>
                                </li>
                              )}
                              {RecepitsData?.order_id?.details
                                ?.AddtionChargeValue?.length > 0 &&
                                RecepitsData?.order_id?.details?.AddtionChargeValue.map(
                                  (charge) =>
                                    charge.is_automatically_added && (
                                      <li>
                                        <span className="summary-list-title">
                                          {charge.charge_name}{" "}
                                          {charge.tax_group &&
                                            charge.tax_group.Totaltax &&
                                            `(Tax ${charge.tax_group.Totaltax}%)`}
                                        </span>

                                        <span className="summary-list-text">
                                          {charge.charge_value}
                                        </span>
                                      </li>
                                    )
                                )}
                              {RecepitsData?.order_id.details.priceSummery
                                .taxexArray &&
                                RecepitsData?.order_id.details.priceSummery.taxexArray.map(
                                  (val) => {
                                    return (
                                      <li>
                                        <span className="summary-list-title">
                                          {val.name} :
                                        </span>
                                        <span className="summary-list-text">{`₹${Number(
                                          val.value
                                        ).toFixed(2)}`}</span>
                                      </li>
                                    );
                                  }
                                )}
                              {RecepitsData?.order_id.details.priceSummery
                                .round_off_value && (
                                <li>
                                  <span className="summary-list-title">
                                    Roundoff :
                                  </span>
                                  <span className="summary-list-text">{`₹${RecepitsData?.order_id.details.priceSummery.round_off_value}`}</span>
                                </li>
                              )}
                            </ul>
                            <Heading className="summary-total" as="h4">
                              <span className="summary-total-label">
                                Total :{" "}
                              </span>
                              <span className="summary-total-amount">{`₹${RecepitsData?.order_id.details.priceSummery.total}`}</span>
                            </Heading>
                          </div>
                        </OrderSummary>
                      </Col>
                      <Col></Col>
                    </Row>

                    {RecepitsData &&
                    RecepitsData.order_id.details.paymentStatus == "paid" ? (
                      <>
                        <div className="border-top">
                          {RecepitsData.order_id.details.orderTiketsDetails ? (
                            <Row>
                              Order Tickets :
                              {RecepitsData.order_id.details.orderTiketsDetails.orderTicketsData.map(
                                (i, index) => {
                                  return (
                                    <div>
                                      <span>
                                        <span
                                          style={{
                                            color: "rgb(0, 140, 186)",
                                            cursor: "pointer",
                                          }}
                                          onClick={() => {
                                            window.frames[
                                              "print_frame"
                                            ].document.body.innerHTML = ReactDOMServer.renderToStaticMarkup(
                                              <OrderTicketPrint
                                                categoryDetails={i}
                                                PreviousTikets={[]}
                                              />
                                            );
                                            window.frames[
                                              "print_frame"
                                            ].window.focus();
                                            window.frames[
                                              "print_frame"
                                            ].window.print();
                                          }}
                                        >
                                          {index ==
                                          RecepitsData.order_id.details
                                            .orderTiketsDetails.orderTicketsData
                                            .length -
                                            1
                                            ? `#${i.tiketNumber}`
                                            : `#${i.tiketNumber},`}
                                        </span>
                                      </span>
                                    </div>
                                  );
                                }
                              )}
                            </Row>
                          ) : null}
                          <Row>
                            <Col lg={22} md={18} sm={24} offset={0}>
                              {RecepitsData &&
                              RecepitsData.order_id.details.bookingDetails ? (
                                <>
                                  <span>
                                    <span className="other-details">
                                      Booking Details
                                    </span>
                                    {`${RecepitsData.order_id.details.bookingDetails.delivery_date} , ${RecepitsData.order_id.details.bookingDetails.delivery_time}`}
                                    {RecepitsData.order_id.details
                                      .bookingDetails.is_door_delivery
                                      ? " | Door Delivery"
                                      : null}
                                  </span>
                                </>
                              ) : null}
                            </Col>

                            {RecepitsData.order_id.details.fulfillmentStatus ==
                              "Unfulfilled" && (
                              <Col lg={2} md={18} sm={24} offset={0}>
                                <span
                                  style={{
                                    paddingTop: "15px",
                                    color: "#008cba",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => editRef.current.showModal()}
                                >
                                  Edit1
                                </span>
                              </Col>
                            )}
                          </Row>
                          <Row>
                            <Col lg={12} md={18} sm={24} offset={0}>
                              {RecepitsData &&
                              RecepitsData.order_id.details.bookingDetails
                                .booking_notes ? (
                                <>
                                  <span>
                                    <span className="other-details">
                                      Booking Notes
                                    </span>
                                    {`${RecepitsData.order_id.details.bookingDetails.booking_notes}`}
                                  </span>
                                </>
                              ) : null}
                            </Col>
                          </Row>
                        </div>

                        <div className="border-top">
                          <Row>
                            {console.log(
                              "njnjj655",
                              RecepitsData.order_id.details.bookingDetails
                                .booking_advance_payment_type
                            )}
                            {RecepitsData.order_id.details.bookingDetails.booking_advance_payment_type.map(
                              (val) => {
                                if (val.name != false) {
                                  return (
                                    <Col lg={6} md={18} sm={24} offset={0}>
                                      <div className="receipt-payment-transactions">
                                        <p>{`₹${val.value} on ${val.name}`}</p>
                                        <p className="text-muted">
                                          {val.bookingDate
                                            ? commonFunction.convertToDate(
                                                val.bookingDate,
                                                "MMM DD, Y h:mm A"
                                              )
                                            : commonFunction.convertToDate(
                                                val.paymentDate,
                                                "MMM DD, Y h:mm A"
                                              )}
                                        </p>
                                      </div>
                                    </Col>
                                  );
                                }
                              }
                            )}
                            {RecepitsData &&
                              RecepitsData.order_id.cancellation && (
                                <Col lg={6} md={18} sm={24} offset={0}>
                                  <div className="receipt-payment-transactions">
                                    <p>{`₹${RecepitsData.order_id.cancellation.refund_amount} ${RecepitsData.order_id.cancellation.refund_pay_type} refund`}</p>
                                    <p className="text-muted">
                                      {commonFunction.convertToDate(
                                        RecepitsData.order_id.cancellation
                                          .cancel_Date,
                                        "MMM DD, Y h:mm A"
                                      )}
                                    </p>
                                  </div>
                                </Col>
                              )}
                          </Row>
                          {RecepitsData.order_id.details.fulfillmentStatus ==
                            "Unfulfilled" && (
                            <div className="border-top">
                              <Row style={{ padding: "10px" }}>
                                <Col lg={12} md={18} sm={24} offset={0}>
                                  <Button
                                    type="primary"
                                    onClick={fullFillOrder}
                                  >
                                    Fulfil
                                  </Button>
                                </Col>
                              </Row>
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={{ display: "none" }}>
                          {PaymentTypeList.length}
                        </div>
                        <UnpaidBookingReceipts
                          RecepitsDataDetails={RecepitsData}
                          PaymentTypeList={PaymentTypeList}
                          updateFetch={fetchRecepitsData}
                        />
                      </>
                    )}
                  </Cards>
                </Col>
              </Row>
              <EditBookingReceipts
                ref={editRef}
                RecepitsDataDetails={RecepitsData}
                updateFetch={fetchRecepitsData}
              />
            </Main>
          )}
        </div>
      )}

      <ReceiptPrint
        ref={componentRef}
        receiptsDetails={printDetails}
        shopDetails={shopDetails}
        registerData={registerdata}
      />
      <OrderTicketPrint
        ref={componentRefOrderTikets}
        categoryDetails={categoryData}
        PreviousTikets={[]}
      />
    </>
  );
};

export default Invoice;
