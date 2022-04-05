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
  Button,
} from "antd";
import { AddAndUpdateBooking } from "../../redux/sell/actionCreator";
import { useDispatch } from "react-redux";
import commonFunction from "../../utility/commonFunctions";
import tickSvg from "../../static/img/tick.svg";

function UnPaidReceipts(props) {
  const { RecepitsDataDetails, PaymentTypeList, updateFetch } = props;

  const [form] = Form.useForm();
  const [spiltForm] = Form.useForm();
  const { TextArea } = Input;
  const dispatch = useDispatch();
  const [PaymentType, setPaymentType] = useState(false);
  const [modalSpiltVisible, setModelSpiltVisible] = useState(false);
  const [cardDetails, setCardDetails] = useState("");
  const [notes, setNotes] = useState("");

  let [pyamnetTypeArrayList, setPaymnetTypeArrayList] = useState([
    {
      name: "Cash",
      value: 0,
    },
    { name: "Credit / Debit Card", value: 0 },

    { name: "Other", value: 0 },
  ]);
  const [splitPaymnetsIs, setSplitPaymnetsIs] = useState(false);
  const [splitUpdateButoonDisbled, setSplitUpdateButtonDisbled] = useState(
    true
  );

  const [excess, setExcess] = useState(0);
  const [pending, setPending] = useState(
    RecepitsDataDetails?.order_id.details.immediate_sale.pending_payments
  );
  const [filterSplitArray, setFilterSplitArray] = useState([]);
  const [compaltePaymnetsList, setComplatePaymnetsList] = useState();

  useEffect(() => {
    setComplatePaymnetsList(
      RecepitsDataDetails?.order_id.details.immediate_sale.multiple_payments_type.filter(
        (val) => val.name != "Credit Sales (Pending)" && val.name != "pending"
      )
    );
  }, [RecepitsDataDetails]);
  useEffect(() => {
    PaymentTypeList.map((val) => {
      val.value = 0;
    });
    setPaymnetTypeArrayList([...pyamnetTypeArrayList, ...PaymentTypeList]);
  }, [PaymentTypeList]);
  useEffect(() => {
    let paymnetType;
    if (PaymentType == "cash") {
      paymnetType = "Cash";
    } else if (PaymentType == "card") {
      paymnetType = "Credit / Debit Card";
    } else if (PaymentType == "other") {
      paymnetType = "Other";
    } else {
      paymnetType = PaymentType;
    }
    pyamnetTypeArrayList.map((data) => {
      if (data.name == paymnetType) {
        data.value =
          RecepitsDataDetails?.order_id.details.immediate_sale.pending_payments;
      } else {
        data.value = 0;
      }
    });
    var sum = pyamnetTypeArrayList.reduce(function(acc, obj) {
      return acc + Number(obj.value);
    }, 0);

    if (
      sum ==
      RecepitsDataDetails?.order_id.details.immediate_sale.pending_payments
    ) {
      setSplitUpdateButtonDisbled(false);
    }
  }, [PaymentType]);

  const SubmitSplitPaymentType = () => {
    let filterSplitArray = pyamnetTypeArrayList.filter(
      (item) => item.value > 0 && item.value != ""
    );

    setFilterSplitArray(filterSplitArray);
    setModelSpiltVisible(false);
  };

  const handleCancel = (e) => {
    setModelSpiltVisible(false);
    setFilterSplitArray([]);
  };

  const updateOrder = async () => {
    let paymnetType;
    if (PaymentType == "Cash") {
      paymnetType = "cash";
    } else if (PaymentType == "Credit / Debit Card") {
      paymnetType = "card";
    } else if (PaymentType == "Other") {
      paymnetType = "other";
    } else {
      paymnetType = PaymentType;
    }
    RecepitsDataDetails.order_id.details.paymentStatus = "paid";
    filterSplitArray.length > 1
      ? (RecepitsDataDetails.order_id.details.immediate_sale.multiple_payments_type = [
          ...compaltePaymnetsList,
          ...filterSplitArray,
        ])
      : (RecepitsDataDetails.order_id.details.immediate_sale.multiple_payments_type = [
          ...compaltePaymnetsList,
          {
            name: paymnetType,
            value:
              RecepitsDataDetails.order_id.details.immediate_sale
                .pending_payments,
          },
        ]);

    if (cardDetails != "") {
      RecepitsDataDetails.order_id.details.immediate_sale.card_Details = cardDetails;
    } else if (notes != "") {
      RecepitsDataDetails.order_id.details.immediate_sale.payment_notes = notes;
    }
    RecepitsDataDetails.order_id.details.immediate_sale.pending_payments = 0;

    let ordederUpdatedata = { details: RecepitsDataDetails.order_id.details };

    const getUpdateReceiptsData = await dispatch(
      AddAndUpdateBooking(ordederUpdatedata, RecepitsDataDetails.order_id._id)
    );
    if (getUpdateReceiptsData) {
      updateFetch(RecepitsDataDetails._id);
    }
  };

  return (
    <div>
      {RecepitsDataDetails &&
        RecepitsDataDetails.order_id.details.fulfillmentStatus ==
          "Fulfilled" && (
          <div>
            <div className="border-top">
              <Row style={{ padding: "10px" }}>
                <Col lg={12} md={18} sm={24} offset={0}>
                  {RecepitsDataDetails ? (
                    <>
                      <span>
                        <span className="other-details">Payment Details1</span>
                        Pending Payment ₹
                        {
                          RecepitsDataDetails?.order_id.details.immediate_sale
                            .pending_payments
                        }
                      </span>
                    </>
                  ) : null}
                </Col>
              </Row>
            </div>
            <div className="border-top">
              <Row style={{ padding: "10px" }}>
                <Col lg={12} md={18} sm={24} offset={0}>
                  <Form form={form}>
                    {filterSplitArray.length > 1 ? (
                      <Form.Item name="filterSplit" label="Payment Type">
                        <Radio.Group className="tick-radio">
                          {filterSplitArray.map((item) => {
                            return (
                              <Radio.Button
                                style={{
                                  marginRight: "10px",
                                  marginBottom: "10px",
                                }}
                              >
                                <img
                                  src={tickSvg}
                                  alt=""
                                  width="13px"
                                  style={{ marginRight: "5px" }}
                                />
                                {item.name} -{item.value}
                              </Radio.Button>
                            );
                          })}

                          <Button
                            onClick={() => setModelSpiltVisible(true)}
                            className="splits-button"
                          >
                            Splits
                          </Button>
                        </Radio.Group>
                      </Form.Item>
                    ) : (
                      <Form.Item name="Payment Type" label="Payment Type">
                        <Radio.Group
                          onChange={(e) => setPaymentType(e.target.value)}
                          value={PaymentType}
                          className="tick-radio"
                        >
                          {pyamnetTypeArrayList.map((val) => {
                            return (
                              <>
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
                              </>
                            );
                          })}

                          <Button
                            onClick={() => setModelSpiltVisible(true)}
                            style={{
                              marginRight: "10px",
                              marginBottom: "10px",
                              color: "#008cba",
                            }}
                          >
                            Spilts
                          </Button>
                        </Radio.Group>
                      </Form.Item>
                    )}
                    <Modal
                      title="Split Payments / Bill"
                      okText="Spilt"
                      visible={modalSpiltVisible}
                      onCancel={handleCancel}
                      footer={[
                        <Button onClick={() => handleCancel()}>Cancel</Button>,
                        <Button
                          type="primary"
                          onClick={() => SubmitSplitPaymentType()}
                          disabled={splitUpdateButoonDisbled}
                        >
                          Update
                        </Button>,
                      ]}
                      width={600}
                    >
                      {splitUpdateButoonDisbled && (
                        <small style={{ paddingBottom: "10px" }}>
                          {pending > 0 && excess == 0 && (
                            <span>₹{pending} pending</span>
                          )}
                          {excess > 0 && pending == 0 && (
                            <span>₹{excess} excess</span>
                          )}
                        </small>
                      )}
                      <Form
                        style={{ width: "100%" }}
                        name="export"
                        form={spiltForm}
                        labelCol={{ span: 10 }}
                      >
                        {pyamnetTypeArrayList.map((val, index) => {
                          return (
                            <Form.Item label={val.name} name={val.name}>
                              <div style={{ display: "none" }}>{val.value}</div>
                              <Input
                                placeholder="0"
                                type="number"
                                value={val.value}
                                style={{ marginBottom: 6 }}
                                a-key={index}
                                onChange={(e) => {
                                  pyamnetTypeArrayList[
                                    e.target.getAttribute("a-key")
                                  ] = {
                                    name: val.name,
                                    value: e.target.value,
                                  };
                                  setPaymnetTypeArrayList([
                                    ...pyamnetTypeArrayList,
                                  ]);
                                  var sum = pyamnetTypeArrayList.reduce(
                                    function(acc, obj) {
                                      return acc + Number(obj.value);
                                    },
                                    0
                                  );

                                  if (
                                    sum ==
                                    RecepitsDataDetails?.order_id.details
                                      .immediate_sale.pending_payments
                                  ) {
                                    setSplitUpdateButtonDisbled(false);
                                    setPending(0);
                                    setExcess(0);
                                  } else if (
                                    sum >
                                    RecepitsDataDetails?.order_id.details
                                      .immediate_sale.pending_payments
                                  ) {
                                    setSplitUpdateButtonDisbled(true);
                                    setPending(0);
                                    setExcess(
                                      sum -
                                        RecepitsDataDetails?.order_id.details
                                          .immediate_sale.pending_payments
                                    );
                                  } else if (
                                    RecepitsDataDetails?.order_id.details
                                      .immediate_sale.pending_payments > sum
                                  ) {
                                    setSplitUpdateButtonDisbled(true);
                                    setExcess(0);
                                    setPending(
                                      RecepitsDataDetails?.order_id.details
                                        .immediate_sale.pending_payments - sum
                                    );
                                  } else {
                                    setSplitUpdateButtonDisbled(true);
                                  }
                                }}
                              />
                            </Form.Item>
                          );
                        })}
                      </Form>
                    </Modal>

                    {PaymentType === "Credit / Debit Card" ? (
                      <>
                        <Form.Item label="Card Details" name="card_details">
                          <Input
                            placeholder="Card details (optional)"
                            onChange={(e) => {
                              if (e.target.value != "") {
                                setCardDetails(e.target.value);
                              }
                            }}
                          ></Input>
                        </Form.Item>
                      </>
                    ) : (
                      ""
                    )}
                    {/*   */}
                    {PaymentType === "Other" ||
                    PaymentType === "Cash" ||
                    (PaymentType ===
                      pyamnetTypeArrayList.find(
                        (data) => data.name === PaymentType
                      )?.name &&
                      PaymentType != "Credit / Debit Card") ? (
                      <>
                        <Form.Item label="Notes" name="payment_notes">
                          <TextArea
                            placeholder="Notes (optional)"
                            onChange={(e) => {
                              if (e.target.value != "") {
                                setNotes(e.target.value);
                              }
                            }}
                          ></TextArea>
                        </Form.Item>
                      </>
                    ) : (
                      ""
                    )}
                  </Form>
                </Col>
              </Row>
            </div>
            <div className="border-top">
              <Row style={{ padding: "10px" }}>
                <Col lg={12} md={18} sm={24} offset={0}>
                  <div style={{ display: "none" }}>
                    {filterSplitArray.length}
                  </div>
                  <Button
                    disabled={
                      PaymentType || filterSplitArray.length > 1 ? false : true
                    }
                    type="primary"
                    onClick={() => updateOrder()}
                  >
                    Mark As Paid
                  </Button>

                  {PaymentType == false && (
                    <p>
                      {" "}
                      <small>Choose a payment type to proceed.</small>
                    </p>
                  )}
                </Col>
              </Row>
            </div>
          </div>
        )}
      {compaltePaymnetsList && (
        <Row>
          {compaltePaymnetsList.map((val) => {
            if (val.name == "Credit / Debit Card") {
              return (
                <>
                  <Col lg={4} md={18} sm={24} offset={0}>
                    <div className="receipt-payment-transactions">
                      <p>{`₹${val.value} on Card`}</p>
                      <p className="text-muted">
                        {commonFunction.convertToDate(
                          RecepitsDataDetails.created_at,
                          "MMM DD, Y h:mm A"
                        )}
                      </p>
                    </div>
                  </Col>
                </>
              );
            } else {
              return (
                <>
                  <Col lg={4} md={18} sm={24} offset={0}>
                    <div className="receipt-payment-transactions">
                      <p>{`₹${val.value} on ${val.name}`}</p>
                      <p className="text-muted">
                        {commonFunction.convertToDate(
                          RecepitsDataDetails.created_at,
                          "MMM DD, Y h:mm A"
                        )}
                      </p>
                    </div>
                  </Col>
                </>
              );
            }
          })}
          {RecepitsDataDetails &&
            RecepitsDataDetails.order_id.cancellation &&
            RecepitsDataDetails.order_id.cancellation.refund_amount > 0 && (
              <Col lg={4} md={18} sm={24} offset={0}>
                <div className="receipt-payment-transactions">
                  <p>{`₹${RecepitsDataDetails.order_id.cancellation.refund_amount} ${RecepitsDataDetails.order_id.cancellation.refund_pay_type} refund`}</p>
                  <p className="text-muted">
                    {commonFunction.convertToDate(
                      RecepitsDataDetails.created_at,
                      "MMM DD, Y h:mm A"
                    )}
                  </p>
                </div>
              </Col>
            )}
        </Row>
      )}
    </div>
  );
}

export { UnPaidReceipts };
