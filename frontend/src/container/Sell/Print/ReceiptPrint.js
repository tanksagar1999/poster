import React from "react";
import { getItem } from "../../../utility/localStorageControl";
import commonFunction from "../../../utility/commonFunctions";
import "../sell.css";
import { Row, Col, Table } from "antd";

const ReceiptPrint = (props) => {
  let {
    receiptsDetails,
    shopDetails,
    registerData,
    title,
    partnerData,
    price,
    ReceiptNumber,
  } = props;

  console.log("mood_typemood_type", receiptsDetails);
  let fullAddress = registerData?.bill_header.split("\n");

  let paidPaymnet = 0;
  let advancePayment = 0;

  let Taxesdata = [];
  let subTotalPrice = 0;
  let itemDiscunts = 0;
  if (receiptsDetails) {
    if (receiptsDetails.details.saleType == "immediate") {
      receiptsDetails.details.immediate_sale.multiple_payments_type.map(
        (val) => {
          if (val.name == "pending" || val.name == "Credit Sales (Pending)") {
          } else {
            paidPaymnet = paidPaymnet + Number(val.value);
          }
        }
      );
    } else {
      receiptsDetails.details.bookingDetails.booking_advance_payment_type.map(
        (val) => {
          paidPaymnet += Number(val.value);
          advancePayment += Number(val.value);
        }
      );
    }
    receiptsDetails.details.itemsSold.map((product) => {
      subTotalPrice += product.calculatedprice;
      product.customDiscountedValue
        ? (itemDiscunts += product.customDiscountedValue)
        : null;

      if (receiptsDetails?.details?.AddtionChargeValue?.length > 0) {
        receiptsDetails?.details?.AddtionChargeValue.map((j) => {
          if (j.is_automatically_added) {
            j.tax_group?.taxes.map((data) => {
              let totalTaxPrice = data.totalTaxPrice;
              Taxesdata.push({
                name: data.tax_name,
                value: totalTaxPrice,
              });
            });
          }
        });
      }
      product.taxGroup?.taxes.map((data) => {
        let totalTaxPrice = data.totalTaxPrice;
        Taxesdata.push({
          name: data.tax_name,
          value: totalTaxPrice,
        });
      });
    });
  }
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

  return (
    <div className="print-source">
      {receiptsDetails && shopDetails && registerData && (
        <>
          {title && (
            <h4
              style={{
                fontFamily: "Arial, Helvetica, sans-serif",
                fontSize: "12px",
                lineHeight: "16px",
                textAlign: "center",
              }}
            >
              {title}
            </h4>
          )}
          <Row gutter={[16, 16]}>
            <Col
              lg={24}
              md={24}
              sm={24}
              xs={24}
              style={{ background: "#fff" }}
              s
            >
              <div className="billing_det">
                <div>
                  {receiptsDetails.details.tableName && (
                    <h5 style={{ textAlign: "right" }}>
                      {receiptsDetails.details.tableName}
                    </h5>
                  )}
                  {getItem("print_register_name") != null &&
                    getItem("print_register_name") == true && (
                      <>
                        <h6>{registerData.register_name}</h6>
                      </>
                    )}

                  {registerData.include_shop_logo &&
                    shopDetails.shop_logo != "false" && (
                      <p
                        style={{
                          fontFamily: "Arial, Helvetica, sans-serif",
                          lineHeight: "16px",
                          padding: "0",
                          margin: "0",
                          textAlign: "center",
                          marginBottom: "10px",
                        }}
                      >
                        <img
                          src={shopDetails.shop_logo}
                          alt=""
                          style={{
                            width: "120px",
                            height: "120px",
                            textAlign: "center",
                            margin: "0 auto",
                          }}
                        />
                      </p>
                    )}
                  <table style={{ width: "100%" }}>
                    <tr>
                      <th
                        style={{
                          fontSize: "14px",
                          fontWeight: "700",
                          lineHeight: "16px",
                          fontFamily: "Arial, Helvetica, sans-serif",
                          textAlign: "center",
                        }}
                      >
                        {shopDetails.shop_name}
                      </th>
                    </tr>
                  </table>
                </div>

                {fullAddress?.map((data) => (
                  <p
                    style={{
                      fontFamily: "Arial, Helvetica, sans-serif",
                      fontSize: "12px",
                      lineHeight: "16px",
                      padding: "0",
                      margin: "0",
                      textAlign: "center",
                    }}
                  >
                    {data}
                  </p>
                ))}
                <p
                  style={{
                    fontFamily: "Arial, Helvetica, sans-serif",
                    fontSize: "12px",
                    lineHeight: "16px",
                    padding: "0",
                    margin: "0",
                    textAlign: "center",
                  }}
                >
                  Recepit:{" "}
                  {getItem(`Bill-${registerData.receipt_number_prefix}`) &&
                    ` ${
                      getItem(`Bill-${registerData.receipt_number_prefix}`)
                        .receipt
                    }-${
                      getItem(`Bill-${registerData.receipt_number_prefix}`).sn
                    }`}
                </p>
                <p
                  style={{
                    fontFamily: "Arial, Helvetica, sans-serif",
                    fontSize: "12px",
                    lineHeight: "16px",
                    padding: "0",
                    margin: "0",
                    textAlign: "center",
                  }}
                >
                  {commonFunction.convertToDate(
                    receiptsDetails.details.date,
                    "MMM DD, Y, h:mm A"
                  )}
                </p>
                {receiptsDetails.customer.name && (
                  <p
                    style={{
                      fontFamily: "Arial, Helvetica, sans-serif",
                      fontSize: "12px",
                      lineHeight: "16px",
                      padding: "0",
                      margin: "0",
                      textAlign: "center",
                    }}
                  >
                    Customer: {receiptsDetails.customer.name}
                  </p>
                )}

                {receiptsDetails.customer.mobile &&
                  receiptsDetails.customer.mobile != 0 &&
                  receiptsDetails.customer.mobile != NaN && (
                    <p
                      style={{
                        fontFamily: "Arial, Helvetica, sans-serif",
                        fontSize: "12px",
                        lineHeight: "16px",
                        padding: "0",
                        margin: "0",
                        textAlign: "center",
                      }}
                    >
                      Customer Mobile: {receiptsDetails.customer.mobile}
                    </p>
                  )}
                {receiptsDetails.customer.shipping_address != null ||
                  receiptsDetails.customer.city != null ||
                  (receiptsDetails.customer.zipcode != null && (
                    <p
                      style={{
                        fontFamily: "Arial, Helvetica, sans-serif",
                        fontSize: "12px",
                        lineHeight: "16px",
                        padding: "0",
                        margin: "0",
                        textAlign: "center",
                        textAlign: "center",
                      }}
                    >
                      Address: {receiptsDetails.customer.shipping_address}{" "}
                      {receiptsDetails.customer.city}{" "}
                      {receiptsDetails.customer.zipcode}
                    </p>
                  ))}
                {getItem("print_order_tiket_number") != null &&
                  getItem("print_order_tiket_number") == true &&
                  receiptsDetails.details.orderTiketsDetails &&
                  receiptsDetails.details.orderTiketsDetails
                    .orderTicketsData && (
                    <>
                      <span>
                        Order :
                        {receiptsDetails.details.orderTiketsDetails.orderTicketsData.map(
                          (i, index) => {
                            return (
                              <>
                                {index ==
                                receiptsDetails.details.orderTiketsDetails
                                  .orderTicketsData.length -
                                  1
                                  ? `#${i.tiketNumber}`
                                  : `#${i.tiketNumber},`}
                              </>
                            );
                          }
                        )}
                      </span>
                    </>
                  )}
              </div>
              <Row gutter={[16, 16]}>
                <Col lg={24} md={24} sm={24} xs={24}>
                  <hr style={{ margin: "4px 0" }} />
                </Col>
              </Row>
              <div>
                <div>
                  <table style={{ width: "100%" }}>
                    <tr>
                      <th
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          fontFamily: "Arial, Helvetica, sans-serif",
                          textAlign: "left",
                        }}
                      >
                        Item
                      </th>
                      <th
                        style={{
                          fontSize: "12px",
                          textAlign: "center",
                          fontWeight: "700",
                          fontFamily: "Arial, Helvetica, sans-serif",
                        }}
                      >
                        Qty
                      </th>
                      {getItem("do_not_each_tax") != null &&
                      getItem("do_not_each_tax") == true ? null : (
                        <th
                          style={{
                            fontSize: "12px",
                            textAlign: "center",
                            fontWeight: "700",
                            fontFamily: "Arial, Helvetica, sans-serif",
                          }}
                        >
                          Tax%{" "}
                        </th>
                      )}

                      <th
                        style={{
                          fontSize: "12px",
                          textAlign: "right",
                          fontWeight: "700",
                          fontFamily: "Arial, Helvetica, sans-serif",
                        }}
                      >
                        Price{" "}
                      </th>
                    </tr>
                    {receiptsDetails.details.itemsSold.map((item, index) => {
                      let text2 = item?.display_name?.toString();
                      let newSpilitArray = text2?.split(/[+]/);
                      let newSpilitArray1 = text2?.split(/[,]/);
                      let finalArray = [];
                      newSpilitArray?.map((value) => {
                        finalArray.push(value.replace(/,/gi, ""));
                      });

                      return (
                        <>
                          <tr>
                            <td
                              style={{
                                fontSize: "12px",
                                padding: "0",
                                marginBottom: "2px",
                                fontFamily: "Arial, Helvetica, sans-serif",
                                textAlign: "left",
                              }}
                            >
                              {text2?.includes("-") ? (
                                newSpilitArray1?.map((val) => <div>{val}</div>)
                              ) : (
                                <div>
                                  {finalArray?.length > 1 ? (
                                    <div>
                                      {finalArray?.map((value, index) => {
                                        return (
                                          <div>
                                            {index > 0 ? "+" : null}
                                            {value}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  ) : (
                                    <div>{item.display_name}</div>
                                  )}
                                </div>
                              )}

                              {getItem("print_receipt_product_notes") != null &&
                                getItem("print_receipt_product_notes") ==
                                  true &&
                                item.notes &&
                                item.notes != "" && <>{`- ${item.notes}`}</>}
                            </td>
                            <td
                              style={{
                                fontSize: "12px",
                                textAlign: "center",
                                padding: "0",
                                marginBottom: "2px",
                                fontFamily: "Arial, Helvetica, sans-serif",
                              }}
                            >
                              {item.quantity}
                            </td>
                            {getItem("do_not_each_tax") != null &&
                            getItem("do_not_each_tax") == true ? null : (
                              <td
                                style={{
                                  fontSize: "12px",
                                  textAlign: "center",
                                  padding: "0",
                                  marginBottom: "2px",
                                  fontFamily: "Arial, Helvetica, sans-serif",
                                }}
                              >
                                {item.productTaxes}
                              </td>
                            )}

                            <td
                              style={{
                                fontSize: "12px",
                                textAlign: "right",
                                padding: "0",
                                marginBottom: "2px",
                                fontFamily: "Arial, Helvetica, sans-serif",
                              }}
                            >
                              {item.calculatedprice}
                            </td>
                          </tr>
                        </>
                      );
                    })}
                  </table>
                </div>
                <Row gutter={[16, 16]}>
                  <Col lg={24} md={24} sm={24} xs={24}>
                    <hr style={{ margin: "4px 0" }} />
                  </Col>
                </Row>
                <Row gutter={[0, 0]}>
                  <div>
                    <table style={{ width: "100%" }}>
                      <tr>
                        <th
                          style={{
                            fontSize: "12px",
                            textAlign: "left",
                            fontWeight: "400",
                            lineHeight: "14px",
                            margin: "0",
                            fontFamily: "Arial, Helvetica, sans-serif",
                            padding: "0",
                          }}
                        >
                          Subtotal
                        </th>
                        <th
                          style={{
                            fontSize: "12px",
                            fontWeight: "400",
                            lineHeight: "14px",
                            margin: "0",
                            fontFamily: "Arial, Helvetica, sans-serif",
                            textAlign: "right",
                            padding: "0",
                          }}
                        >
                          {Number(subTotalPrice).toFixed(2)}
                        </th>
                      </tr>
                    </table>
                  </div>
                </Row>
                {itemDiscunts > 0 && (
                  <Row gutter={[0, 0]}>
                    <div>
                      <table style={{ width: "100%" }}>
                        <tr>
                          <th
                            style={{
                              fontSize: "12px",
                              textAlign: "left",
                              fontWeight: "400",
                              lineHeight: "14px",
                              margin: "0",
                              fontFamily: "Arial, Helvetica, sans-serif",
                              padding: "0",
                            }}
                          >
                            Item Discounts
                          </th>
                          <th
                            style={{
                              fontSize: "12px",
                              fontWeight: "400",
                              lineHeight: "14px",
                              margin: "0",
                              fontFamily: "Arial, Helvetica, sans-serif",
                              textAlign: "right",
                              padding: "0",
                            }}
                          >
                            {`-${Number(itemDiscunts).toFixed(2)}`}
                          </th>
                        </tr>
                      </table>
                    </div>
                  </Row>
                )}

                {receiptsDetails?.details?.bulckDiscountValue && (
                  <Row gutter={[0, 0]}>
                    <div>
                      <table style={{ width: "100%" }}>
                        <tr>
                          <th
                            style={{
                              fontSize: "12px",
                              textAlign: "left",
                              fontWeight: "400",
                              lineHeight: "14px",
                              margin: "0",
                              fontFamily: "Arial, Helvetica, sans-serif",
                              padding: "0",
                            }}
                          >
                            Bulk Discount
                          </th>
                          <th
                            style={{
                              fontSize: "12px",
                              fontWeight: "400",
                              lineHeight: "14px",
                              margin: "0",
                              fontFamily: "Arial, Helvetica, sans-serif",
                              textAlign: "right",
                              padding: "0",
                            }}
                          >
                            {`-${Number(
                              receiptsDetails?.details?.bulckDiscountValue
                            ).toFixed(2)}`}
                          </th>
                        </tr>
                      </table>
                    </div>
                  </Row>
                )}

                {receiptsDetails?.details?.AddtionChargeValue &&
                  receiptsDetails?.details?.AddtionChargeValue.map(
                    (charge) =>
                      charge.is_automatically_added && (
                        <Row gutter={[0, 0]}>
                          <div>
                            <table style={{ width: "100%" }}>
                              <tr>
                                <th
                                  style={{
                                    fontSize: "12px",
                                    textAlign: "left",
                                    fontWeight: "400",
                                    lineHeight: "14px",
                                    margin: "0",
                                    fontFamily: "Arial, Helvetica, sans-serif",
                                    padding: "0",
                                  }}
                                >
                                  {charge.charge_name}{" "}
                                  {charge.tax_group &&
                                    charge.tax_group.Totaltax &&
                                    `(Tax ${charge.tax_group.Totaltax}%)`}
                                </th>
                                <th
                                  style={{
                                    fontSize: "12px",
                                    fontWeight: "400",
                                    lineHeight: "14px",
                                    margin: "0",
                                    fontFamily: "Arial, Helvetica, sans-serif",
                                    textAlign: "right",
                                    padding: "0",
                                  }}
                                >
                                  {Number(charge.charge_value).toFixed(2)}
                                </th>
                              </tr>
                            </table>
                          </div>
                        </Row>
                      )
                  )}
                {FinalTaxesArray.length > 0 &&
                  FinalTaxesArray.map((val) => {
                    return (
                      <Row gutter={[0, 0]}>
                        <Col lg={24} md={24} sm={24} xs={24}>
                          <div>
                            <table style={{ width: "100%" }}>
                              <tr>
                                <th
                                  style={{
                                    fontSize: "12px",
                                    textAlign: "left",
                                    fontWeight: "400",
                                    lineHeight: "14px",
                                    margin: "0",
                                    fontFamily: "Arial, Helvetica, sans-serif",
                                    padding: "0",
                                  }}
                                >
                                  {val.name}
                                </th>
                                <th
                                  style={{
                                    fontSize: "12px",
                                    fontWeight: "400",
                                    lineHeight: "14px",
                                    margin: "0",
                                    fontFamily: "Arial, Helvetica, sans-serif",
                                    textAlign: "right",
                                    padding: "0",
                                  }}
                                >
                                  {Number(val.value ? val.value : 0).toFixed(2)}
                                </th>
                              </tr>
                            </table>
                          </div>
                        </Col>
                      </Row>
                    );
                  })}
                {receiptsDetails.details.priceSummery.round_off_value && (
                  <Row gutter={[0, 0]}>
                    <Col lg={24} md={24} sm={24} xs={24}>
                      <div>
                        <table style={{ width: "100%" }}>
                          <tr>
                            <th
                              style={{
                                fontSize: "12px",
                                textAlign: "left",
                                fontWeight: "700",
                                lineHeight: "14px",
                                margin: "0",
                                fontFamily: "Arial, Helvetica, sans-serif",
                                padding: "0",
                              }}
                            >
                              Roundoff
                            </th>
                            <th
                              style={{
                                fontSize: "12px",
                                fontWeight: "700",
                                lineHeight: "14px",
                                margin: "0",
                                fontFamily: "Arial, Helvetica, sans-serif",
                                textAlign: "right",
                                padding: "0",
                              }}
                            >
                              {Number(
                                receiptsDetails.details.priceSummery
                                  .round_off_value
                              ).toFixed(2)}
                            </th>
                          </tr>
                        </table>
                      </div>
                    </Col>
                  </Row>
                )}
                <Row gutter={[0, 0]}>
                  <Col lg={24} md={24} sm={24} xs={24}>
                    <div>
                      <table style={{ width: "100%" }}>
                        <tr>
                          <th
                            style={{
                              fontSize: "12px",
                              fontWeight: "700",
                              lineHeight: "14px",
                              margin: "0",
                              fontFamily: "Arial, Helvetica, sans-serif",
                              padding: "0",
                              textAlign: "left",
                            }}
                          >
                            Total
                          </th>
                          <th
                            style={{
                              fontSize: "12px",
                              fontWeight: "700",
                              lineHeight: "14px",
                              margin: "0",
                              fontFamily: "Arial, Helvetica, sans-serif",
                              textAlign: "right",
                              padding: "0",
                            }}
                          >
                            {Number(
                              receiptsDetails.details.priceSummery.total
                            ).toFixed(2) > 0
                              ? Number(
                                  receiptsDetails.details.priceSummery.total
                                ).toFixed(2)
                              : Number(getItem("total")).toFixed(2)}
                          </th>
                        </tr>
                        {advancePayment > 0 && (
                          <tr>
                            <th
                              style={{
                                fontSize: "12px",
                                fontWeight: "700",
                                lineHeight: "14px",
                                margin: "0",
                                fontFamily: "Arial, Helvetica, sans-serif",
                                padding: "0",
                              }}
                            >
                              Advance
                            </th>
                            <th
                              style={{
                                fontSize: "12px",
                                fontWeight: "700",
                                lineHeight: "14px",
                                margin: "0",
                                fontFamily: "Arial, Helvetica, sans-serif",
                                textAlign: "right",
                                padding: "0",
                              }}
                            >
                              {Number(advancePayment).toFixed(2)}
                            </th>
                          </tr>
                        )}

                        {(paidPaymnet > 0 || getItem("total")) && (
                          <tr>
                            <th
                              style={{
                                fontSize: "12px",
                                fontWeight: "700",
                                lineHeight: "14px",
                                fontFamily: "Arial, Helvetica, sans-serif",
                                textAlign: "left",
                              }}
                            >
                              Paid
                            </th>
                            <th
                              style={{
                                fontSize: "12px",
                                fontWeight: "700",
                                lineHeight: "14px",
                                fontFamily: "Arial, Helvetica, sans-serif",
                                textAlign: "right",
                              }}
                            >
                              {Number(paidPaymnet).toFixed(2) > 0
                                ? Number(
                                    receiptsDetails.details.priceSummery.total
                                  ).toFixed(2)
                                : Number(getItem("total")).toFixed(2)}
                            </th>
                          </tr>
                        )}

                        {partnerData && price && (
                          <tr>
                            <th
                              style={{
                                fontSize: "12px",
                                fontWeight: "700",
                                lineHeight: "14px",
                                fontFamily: "Arial, Helvetica, sans-serif",
                                textAlign: "left",
                              }}
                            >
                              For {partnerData.name}
                            </th>
                            <th
                              style={{
                                fontSize: "12px",
                                fontWeight: "700",
                                lineHeight: "14px",
                                fontFamily: "Arial, Helvetica, sans-serif",
                                textAlign: "right",
                              }}
                            >
                              {Number(price).toFixed(2)}
                            </th>
                          </tr>
                        )}

                        {receiptsDetails.details.immediate_sale &&
                          Number(
                            receiptsDetails.details.immediate_sale
                              .balance_to_customer
                          ) > 0 && (
                            <div>
                              <tr>
                                <th
                                  style={{
                                    fontSize: "12px",
                                    fontWeight: "700",
                                    lineHeight: "14px",
                                    fontFamily: "Arial, Helvetica, sans-serif",
                                  }}
                                >
                                  Cash Received
                                </th>
                                <th
                                  style={{
                                    fontSize: "12px",
                                    fontWeight: "700",
                                    lineHeight: "14px",
                                    fontFamily: "Arial, Helvetica, sans-serif",
                                    textAlign: "right",
                                  }}
                                >
                                  {Number(
                                    receiptsDetails.details.immediate_sale
                                      .cash_tender
                                  ).toFixed(2)}
                                </th>
                              </tr>
                              <tr>
                                <th
                                  style={{
                                    fontSize: "12px",
                                    fontWeight: "700",
                                    lineHeight: "14px",
                                    fontFamily: "Arial, Helvetica, sans-serif",
                                  }}
                                >
                                  Cash Returned
                                </th>
                                <th
                                  style={{
                                    fontSize: "12px",
                                    fontWeight: "700",
                                    lineHeight: "14px",
                                    fontFamily: "Arial, Helvetica, sans-serif",
                                    textAlign: "right",
                                  }}
                                >
                                  {Number(
                                    receiptsDetails.details.immediate_sale
                                      .balance_to_customer
                                  ).toFixed(2)}
                                </th>
                              </tr>
                            </div>
                          )}
                      </table>
                    </div>
                  </Col>
                </Row>
                {receiptsDetails.details.saleType == "booking" && (
                  <div>
                    <div>
                      <Row gutter={[16, 16]}>
                        <Col lg={24} md={24} sm={24} xs={24}>
                          <hr style={{ margin: "4px 0" }} />
                        </Col>
                      </Row>
                      <table style={{ width: "100%" }}>
                        <tr>
                          <th
                            style={{
                              fontSize: "14px",
                              lineHeight: "16px",
                              fontWeight: "700",
                              fontFamily: "Arial, Helvetica, sans-serif",
                              textAlign: "center",
                            }}
                          >
                            BOOKING
                          </th>
                        </tr>
                      </table>
                    </div>
                    <p
                      style={{
                        fontFamily: "Arial, Helvetica, sans-serif",
                        fontSize: "12px",
                        lineHeight: "16px",
                        padding: "0",
                        margin: "0",
                      }}
                    >
                      BB-875-oB-1
                    </p>
                    <p
                      style={{
                        fontFamily: "Arial, Helvetica, sans-serif",
                        fontSize: "12px",
                        lineHeight: "16px",
                        padding: "0",
                        margin: "0",
                      }}
                    >
                      Notes:{" "}
                      {receiptsDetails.details.bookingDetails.booking_notes}
                    </p>
                    <p
                      style={{
                        fontFamily: "Arial, Helvetica, sans-serif",
                        fontSize: "12px",
                        lineHeight: "16px",
                        padding: "0",
                        margin: "0",
                      }}
                    >
                      {receiptsDetails.details.bookingDetails.delivery_date} at{" "}
                      {receiptsDetails.details.bookingDetails.delivery_time}
                    </p>
                  </div>
                )}
                {/* <Row gutter={[16, 16]}>
                        <Col lg={24} md={24} sm={24} xs={24}>
                          <hr style={{ margin: "4px 0" }} />
                        </Col>
                      </Row> */}
                {/* {(partnerData && !price) && (
                      <p
                        style={{
                            fontSize: "14px",
                            fontWeight: "700",
                            lineHeight: "16px",
                            fontFamily: "Arial, Helvetica, sans-serif",
                            textAlign: "center",
                            marginLeft:"-150px"
                        }}
                      >
                            For {partnerData.name}
                        </p>
                  )} */}
                {registerData.bill_footer && registerData.bill_footer != "" && (
                  <>
                    {" "}
                    <Row gutter={[16, 16]}>
                      <Col lg={24} md={24} sm={24} xs={24}>
                        <hr style={{ margin: "4px 0" }} />
                      </Col>
                    </Row>
                    {partnerData && !price && (
                      <>
                        <Row gutter={[16, 16]}>
                          <Col lg={24} md={24} sm={24} xs={24}>
                            <div>
                              <p
                                style={{
                                  fontSize: "14px",
                                  fontWeight: "700",
                                  lineHeight: "16px",
                                  fontFamily: "Arial, Helvetica, sans-serif",
                                  textAlign: "center",
                                  padding: "0",
                                  margin: "0",
                                }}
                              >
                                For {partnerData.name}
                              </p>
                            </div>
                          </Col>
                        </Row>
                        <Row gutter={[16, 16]}>
                          <Col lg={24} md={24} sm={24} xs={24}>
                            <hr style={{ margin: "4px 0" }} />
                          </Col>
                        </Row>
                      </>
                    )}
                    <Row gutter={[16, 16]}>
                      <Col lg={24} md={24} sm={24} xs={24}>
                        <div>
                          <p
                            style={{
                              fontSize: "12px",
                              fontFamily: "Arial, Helvetica, sans-serif",
                              textAlign: "center",
                              padding: "0",
                              margin: "0",
                            }}
                          >
                            {registerData.bill_footer}
                          </p>
                        </div>
                      </Col>
                    </Row>
                  </>
                )}
              </div>
              <div></div>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};
export { ReceiptPrint };
