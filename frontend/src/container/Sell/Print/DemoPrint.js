import React, { useRef } from "react";
import { Row, Col, Table, Button } from "antd";
import { useReactToPrint } from "react-to-print";
import commonFunction from "../../../utility/commonFunctions";
import { getItem } from "../../../utility/localStorageControl";

const dataSources = [
  {
    key: "1",
    Item: "Mike",
    Qty: 32,
    Tax: "10",
    Price: "120",
  },
  {
    key: "1",
    Item: "Mike",
    Qty: 32,
    Tax: "10",
    Price: "120",
  },
];

const columnss = [
  {
    title: "Item",
    dataIndex: "Item",
    key: "Item",
  },
  {
    title: "Qty",
    dataIndex: "Qty",
    key: "Qty",
    align: "center",
  },
  {
    title: "Tax%",
    dataIndex: "Tax",
    key: "Tax",
    align: "center",
  },
  {
    title: "Price",
    dataIndex: "Price",
    key: "Price",
    align: "right",
  },
];

const DemoPrint = React.forwardRef((props, ref) => {
  const { categoryDetails, PreviousTikets, title } = props;

  return (
    <div className="print-source">
      {categoryDetails && (
        <Row gutter={[16, 16]}>
          <Col lg={24} md={24} sm={24} xs={24} style={{ background: "#fff" }}>
            <div className="billing_det">
              <div>
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
                      {/* Name Hotel */}
                      {categoryDetails.tiketNumber}
                    </th>
                  </tr>
                </table>
              </div>
              <p
                style={{
                  fontFamily: "Arial, Helvetica, sans-serif",
                  fontSize: "12px",
                  lineHeight: "16px",
                  textAlign: "center",
                }}
              >
                {/* Ludhina,punjab */}
                {categoryDetails.categoryName}
              </p>
              <p
                style={{
                  fontFamily: "Arial, Helvetica, sans-serif",
                  fontSize: "12px",
                  lineHeight: "16px",
                  textAlign: "center",
                }}
              >
                BB-9WS-2210-24 -{categoryDetails.table_name}
                {/* Mobile: 8844744444 */}
              </p>
              <p
                style={{
                  fontFamily: "Arial, Helvetica, sans-serif",
                  fontSize: "12px",
                  lineHeight: "16px",
                  textAlign: "center",
                }}
              >
                Time -
                {commonFunction.convertToDate(
                  categoryDetails.enterDate,
                  "MMM DD, Y h:mm A"
                )}
              </p>
              <p
                style={{
                  fontFamily: "Arial, Helvetica, sans-serif",
                  fontSize: "12px",
                  lineHeight: "16px",
                  textAlign: "center",
                }}
              >
                Created by -{getItem("userDetails").username}
              </p>
              {/* <p
                  style={{
                    fontFamily: "Arial, Helvetica, sans-serif",
                    fontSize: "12px", lineHeight:"16px",
                  }}
                >
                  Customer : suny
                </p>
                <p
                  style={{
                    fontFamily: "Arial, Helvetica, sans-serif",
                    fontSize: "12px", lineHeight:"16px",
                  }}
                >
                  Customer Mo: 7878787878
                </p> */}
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
                        textAlign: "right",
                        fontWeight: "700",
                        fontFamily: "Arial, Helvetica, sans-serif",
                      }}
                    >
                      Qty
                    </th>
                    {/* <th
                        style={{
                          fontSize: "12px",
                          textAlign: "center",
                          fontWeight: "700",
                          fontFamily: "Arial, Helvetica, sans-serif",
                        }}
                      >
                        Tax%{" "}
                      </th>
                      <th
                        style={{
                          fontSize: "12px",
                          textAlign: "right",
                          fontWeight: "700",
                          fontFamily: "Arial, Helvetica, sans-serif",
                        }}
                      >
                        Price{" "}
                      </th> */}
                  </tr>

                  {categoryDetails.itemList.map((i, idx) => {
                    return (
                      <tr key={idx}>
                        <td
                          style={{
                            fontSize: "12px",
                            padding: "0",
                            fontFamily: "Arial, Helvetica, sans-serif",
                            textAlign: "left",
                          }}
                        >
                          {i.display_name}
                        </td>
                        <td
                          style={{
                            fontSize: "12px",
                            textAlign: "right",
                            padding: "0",
                            fontFamily: "Arial, Helvetica, sans-serif",
                          }}
                        >
                          {i.quantity}
                        </td>
                        {/* <td
                              style={{
                                fontSize: "12px",
                                textAlign: "center",
                                padding: "0",
                                fontFamily: "Arial, Helvetica, sans-serif",
                              }}
                            >
                              3
                            </td>
                            <td
                              style={{
                                fontSize: "12px",
                                textAlign: "right",
                                padding: "0",
                                fontFamily: "Arial, Helvetica, sans-serif",
                              }}
                            >
                              5
                            </td> */}
                      </tr>
                    );
                  })}

                  {/* <tr>
                      <td
                        style={{
                          fontSize: "12px",
                          padding: "0",
                          fontFamily: "Arial, Helvetica, sans-serif",
                        }}
                      >
                        Milk
                      </td>
                      <td
                        style={{
                          fontSize: "12px",
                          textAlign: "center",
                          padding: "0",
                          fontFamily: "Arial, Helvetica, sans-serif",
                        }}
                      >
                        23
                      </td>
                      <td
                        style={{
                          fontSize: "12px",
                          textAlign: "center",
                          padding: "0",
                          fontFamily: "Arial, Helvetica, sans-serif",
                        }}
                      >
                        3
                      </td>
                      <td
                        style={{
                          fontSize: "12px",
                          textAlign: "right",
                          padding: "0",
                          fontFamily: "Arial, Helvetica, sans-serif",
                        }}
                      >
                        5
                      </td>
                    </tr> */}
                </table>
              </div>
              {/* <Row gutter={[16, 16]}>
                  <Col lg={24} md={24} sm={24} xs={24}>
                    <hr style={{ margin: "4px 0" }} />
                  </Col>
                </Row>
                <Row gutter={[16, 16]}>
                  <Col lg={12} md={12} sm={12} xs={12}>
                    <div className="sub_total">
                      <p
                        style={{
                          fontSize: "12px",
                          fontFamily: "Arial, Helvetica, sans-serif",
                        }}
                      >
                        Subtotal
                      </p>
                    </div>
                  </Col>
                  <Col lg={12} md={12} sm={12} xs={12}>
                    <div className="sub_totals">
                      <p
                        style={{
                          fontSize: "12px",
                          fontFamily: "Arial, Helvetica, sans-serif",
                        }}
                      >
                        120
                      </p>
                    </div>
                  </Col>
                </Row>
                <Row gutter={[16, 16]}>
                  <Col lg={12} md={12} sm={12} xs={12}>
                    <div className="sub_total">
                      <p
                        style={{
                          fontSize: "12px",
                          fontFamily: "Arial, Helvetica, sans-serif",
                        }}
                      >
                        {" "}
                        SGST
                      </p>
                    </div>
                  </Col>
                  <Col lg={12} md={12} sm={12} xs={12}>
                    <div className="sub_totals">
                      <p
                        style={{
                          fontSize: "12px",
                          fontFamily: "Arial, Helvetica, sans-serif",
                        }}
                      >
                        3
                      </p>
                    </div>
                  </Col>
                </Row>
                <Row gutter={[16, 16]}>
                  <Col lg={12} md={12} sm={12} xs={12}>
                    <div className="sub_total">
                      <p
                        style={{
                          fontSize: "12px",
                          fontFamily: "Arial, Helvetica, sans-serif",
                        }}
                      >
                        SGST
                      </p>
                    </div>
                  </Col>
                  <Col lg={12} md={12} sm={12} xs={12}>
                    <div className="sub_totals">
                      <p
                        style={{
                          fontSize: "12px",
                          fontFamily: "Arial, Helvetica, sans-serif",
                        }}
                      >
                        3.00
                      </p>
                    </div>
                  </Col>
                </Row>

                <Row gutter={[16, 16]}>
                  <Col lg={24} md={24} sm={24} xs={24}>
                    <div>
                      <table style={{ width: "100%" }}>
                        <tr>
                          <th
                            style={{
                              fontSize: "12px",
                              fontWeight: "700", lineHeight:"14px",textAlign:"left",
                              fontFamily: "Arial, Helvetica, sans-serif",
                            }}
                          >
                            Total
                          </th>
                          <th
                            style={{
                              fontSize: "12px",
                              fontWeight: "700", lineHeight:"14px",
                              fontFamily: "Arial, Helvetica, sans-serif",
                              textAlign: "right",
                            }}
                          >
                            500
                          </th>
                        </tr>
                        <tr>
                          <th
                            style={{
                              fontSize: "12px",
                              fontWeight: "700",
                              lineHeight:"14px",
                              textAlign:"left",
                              fontFamily: "Arial, Helvetica, sans-serif",
                            }}
                          >
                            Advance
                          </th>
                          <th
                            style={{
                              fontSize: "12px",
                              fontWeight: "700", lineHeight:"14px",
                              fontFamily: "Arial, Helvetica, sans-serif",
                              textAlign: "right",
                            }}
                          >
                            500
                          </th>
                        </tr>
                      </table>
                    </div>
                  </Col>
                </Row>

                <Row gutter={[16, 16]}>
                  <Col lg={24} md={24} sm={24} xs={24}>
                    <hr style={{ margin: "4px 0" }} />
                  </Col>
                </Row>
                <div className="billing_det">
                
                  <div>
                      <table style={{ width: "100%" }}>
                        <tr>
                          <th
                            style={{
                              fontSize: "14px",
                              lineHeight:"16px",
                              fontWeight: "700",
                              fontFamily: "Arial, Helvetica, sans-serif",textAlign:"center"
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
                      fontSize: "12px",lineHeight:"16px",
                    }}
                  >
                    BB-875-oB-1
                  </p>
                  <p
                    style={{
                      fontFamily: "Arial, Helvetica, sans-serif",
                      fontSize: "12px",lineHeight:"16px",
                    }}
                  >
                    Notes: soicy hot
                  </p>
                  <p
                    style={{
                      fontFamily: "Arial, Helvetica, sans-serif",
                      fontSize: "12px",lineHeight:"16px",
                    }}
                  >
                    Jan 20,2022 at 4:PM
                  </p>
                </div>
                <Row gutter={[16, 16]}>
                  <Col lg={24} md={24} sm={24} xs={24}>
                    <hr style={{ margin: "4px 0" }} />
                  </Col>
                </Row>
                <Row gutter={[16, 16]}>
                  <Col lg={24} md={24} sm={24} xs={24}>
                    <div className="sub_total">
                      <p
                        style={{
                          fontSize: "12px",
                          fontFamily: "Arial, Helvetica, sans-serif", textAlign:"center"
                        }}
                      >
                        Thank You For coming
                      </p>
                    </div>
                  </Col>
                </Row> */}
            </div>
            {/* <div>
                <Button type="primary" onClick={() => handlePrint1()}>
                  print1
                </Button>
              </div> */}
          </Col>
        </Row>
      )}
    </div>
  );
});

export default DemoPrint;
