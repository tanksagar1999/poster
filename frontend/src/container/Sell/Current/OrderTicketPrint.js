import React from "react";
import "../sell.css";
import {
  setCartInfoFromLocalKey,
  removeCartFromLocalStorage,
  setOrderTickets,
  setItem,
  getItem,
} from "../../../utility/localStorageControl";
import commonFunction from "../../../utility/commonFunctions";
const OrderTicketPrint = React.forwardRef((props, ref) => {
  const { categoryDetails, PreviousTikets, ReceiptNumber } = props;
  return (
    <div ref={ref} className="print-source">
      {categoryDetails && (
        <>
          <h1
            style={{
              fontFamily: "Arial, Helvetica, sans-serif",
              fontSize: "20px",
              lineHeight: "12px",
              padding: "0",
              marginBottom: "5px",
              textAlign: "center",
            }}
          >
            #{categoryDetails.tiketNumber}
          </h1>
          <p
            style={{
              fontFamily: "Arial, Helvetica, sans-serif",
              fontSize: "10px",
              lineHeight: "12px",
              padding: "0",
              margin: "0",
              textAlign: "center",
            }}
          >
            ({categoryDetails.categoryName})
          </p>
          <table style={{ width: "100%" }}>
            <tr>
              <th
                style={{
                  fontSize: "10px",
                  fontWeight: "400",
                  fontFamily: "Arial, Helvetica, sans-serif",
                  textAlign: "left",
                }}
              >
                Time
              </th>
              <th
                style={{
                  fontSize: "10px",
                  textAlign: "right",
                  fontWeight: "400",
                  fontFamily: "Arial, Helvetica, sans-serif",
                }}
              >
                {commonFunction.convertToDate(
                  categoryDetails.enterDate,
                  "MMM DD, Y h:mm A"
                )}
              </th>
            </tr>
          </table>

          <table style={{ width: "100%" }}>
            <tr>
              <th
                style={{
                  fontSize: "10px",
                  fontWeight: "400",
                  fontFamily: "Arial, Helvetica, sans-serif",
                  textAlign: "left",
                }}
              >
                ReceiptNumber
              </th>
              <th
                style={{
                  fontSize: "10px",
                  textAlign: "right",
                  fontWeight: "400",
                  fontFamily: "Arial, Helvetica, sans-serif",
                }}
              >
                {ReceiptNumber}
              </th>
            </tr>
          </table>
          <table style={{ width: "100%" }}>
            <tr>
              <th
                style={{
                  fontSize: "10px",
                  fontWeight: "400",
                  fontFamily: "Arial, Helvetica, sans-serif",
                  textAlign: "left",
                }}
              >
                Created by1
              </th>
              <th
                style={{
                  fontSize: "10px",
                  textAlign: "right",
                  fontWeight: "400",
                  fontFamily: "Arial, Helvetica, sans-serif",
                }}
              >
                {getItem("userDetails").username}
              </th>
            </tr>
          </table>

          {categoryDetails.add_remove == "both" ? (
            <>
              <table style={{ width: "100%" }}>
                <tr>
                  <hr style={{ margin: "2px 0 0" }} />
                </tr>
              </table>
              <p
                style={{
                  fontFamily: "Arial, Helvetica, sans-serif",
                  fontSize: "10px",
                  lineHeight: "12px",
                  padding: "0",
                  margin: "0",
                  textAlign: "center",
                }}
              >
                ADDED ITEMS
              </p>
              <table style={{ width: "100%" }}>
                <tr>
                  <th
                    style={{
                      fontFamily: "Arial, Helvetica, sans-serif",
                      fontSize: "10px",
                      lineHeight: "12px",
                      padding: "0",
                      margin: "0",
                      textAlign: "left",
                    }}
                  >
                    ITEM
                  </th>

                  <th
                    style={{
                      fontFamily: "Arial, Helvetica, sans-serif",
                      fontSize: "10px",
                      lineHeight: "12px",
                      padding: "0",
                      margin: "0",
                      textAlign: "right",
                    }}
                  >
                    QTY
                  </th>
                </tr>

                {categoryDetails.itemList.map((i) => {
                  if (i.add_or_remove == "Added Items") {
                    let text2 = i.display_name.toString();
                    let newSpilitArray = text2.split(/[+]/);
                    let newSpilitArray1 = text2.split(/[,]/);
                    let finalArray = [];
                    newSpilitArray.map((value) => {
                      finalArray.push(value.replace(/,/gi, ""));
                    });
                    return (
                      <>
                        <tr>
                          <td  style={{
                      fontFamily: "Arial, Helvetica, sans-serif",
                      fontSize: "10px",
                      lineHeight: "12px",
                      padding: "0",
                      margin: "0",
                      textAlign: "left",
                    }}>
                            <div style={{ marginBottom: "5px",fontSize:"10px", lineHeight: "12px" }}>
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
                                              {index == 0
                                                ? `${
                                                    i.newqty
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
                                      <div> {i.display_name}</div>
                                    )}
                                  </div>
                                )}
                              </>
                              {i.orderTiketsNotes && (
                                <div style={{ fontSize: "10px" }}>
                                  Notes - {i.orderTiketsNotes}
                                </div>
                              )}
                            </div>
                          </td>
                          <td  style={{
                      fontFamily: "Arial, Helvetica, sans-serif",
                      fontSize: "10px",
                      lineHeight: "12px",
                      padding: "0",
                      margin: "0",
                      textAlign: "right",
                    }}>{i.newqty ? i.newqty : i.quantity}</td>
                        </tr>
                      </>
                    );
                  }
                })}
              </table>
              <p
                style={{
                  fontFamily: "Arial, Helvetica, sans-serif",
                  fontSize: "10px",
                  lineHeight: "12px",
                  padding: "0",
                  textAlign: "center",
                  marginBottom: "2px",
                }}
              >
                CANCELLED ITEMS
              </p>

              <table style={{ width: "100%" }}>
                <tr>
                  <th
                    style={{
                      fontFamily: "Arial, Helvetica, sans-serif",
                      fontSize: "10px",
                      lineHeight: "12px",
                      padding: "0",
                      margin: "0",
                      textAlign: "left",
                    }}
                  >
                    ITEM
                  </th>

                  <th
                    style={{
                      fontFamily: "Arial, Helvetica, sans-serif",
                      fontSize: "10px",
                      lineHeight: "12px",
                      padding: "0",
                      margin: "0",
                      textAlign: "right",
                    }}
                  >
                    QTY
                  </th>
                </tr>

                {categoryDetails.itemList.map((i) => {
                  if (i.add_or_remove == "Removed Items") {
                    let text2 = i.display_name.toString();
                    let newSpilitArray = text2.split(/[+]/);
                    let newSpilitArray1 = text2.split(/[,]/);
                    let finalArray = [];
                    newSpilitArray.map((value) => {
                      finalArray.push(value.replace(/,/gi, ""));
                    });
                    return (
                      <>
                        <tr>
                          <td  style={{
                      fontFamily: "Arial, Helvetica, sans-serif",
                      fontSize: "10px",
                      lineHeight: "12px",
                      padding: "0",
                      margin: "0",
                      textAlign: "left",
                    }}>
                            <div style={{ marginBottom: "5px",fontSize:"10px", lineHeight: "12px" }}>

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
                                              -
                                              {index == 0
                                                ? `${
                                                    i.newqty
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
                                      <div> {i.display_name}</div>
                                    )}
                                  </div>
                                )}
                              </>
                              {i.orderTiketsNotes && (
                                <div style={{ fontSize: "10px" }}>
                                  Notes - {i.orderTiketsNotes}
                                </div>
                              )}
                            </div>
                          </td>
                          <td  style={{
                      fontFamily: "Arial, Helvetica, sans-serif",
                      fontSize: "10px",
                      lineHeight: "12px",
                      padding: "0",
                      margin: "0",
                      textAlign: "right",
                    }}>-{i.newqty ? i.newqty : i.quantity}</td>
                        </tr>
                      </>
                    );
                  }
                })}
              </table>
            </>
          ) : (
            <>
              <table style={{ width: "100%" }}>
                <tr>
                  <hr style={{ margin: "4px 0 0" }} />
                </tr>
              </table>
              <p
                style={{
                  fontFamily: "Arial, Helvetica, sans-serif",
                  fontSize: "10px",
                  lineHeight: "12px",
                  padding: "0",
                  textAlign: "center",
                  marginBottom: "2px",
                }}
              >
                {categoryDetails.add_remove == "Added Items"
                  ? "Added Items"
                  : "CANCELLED ITEMS"}
              </p>
              <table style={{ width: "100%" }}>
                <tr>
                  <th
                    style={{
                      fontSize: "10px",
                      fontWeight: "700",
                      fontFamily: "Arial, Helvetica, sans-serif",
                      textAlign: "left",
                    }}
                  >
                    Item
                  </th>
                  <th
                    style={{
                      fontSize: "10px",
                      textAlign: "right",
                      fontWeight: "700",
                      fontFamily: "Arial, Helvetica, sans-serif",
                    }}
                  >
                    Qty
                  </th>
                </tr>

                {categoryDetails.itemList.map((i) => {
                  let text2 = i.display_name.toString();
                  let newSpilitArray = text2.split(/[+]/);
                  let newSpilitArray1 = text2.split(/[,]/);
                  let finalArray = [];
                  newSpilitArray.map((value) => {
                    finalArray.push(value.replace(/,/gi, ""));
                  });
                  return (
                    <>
                      <tr>
                        <td>
                          <>
                          <div style={{ marginBottom: "0px",fontSize:"10px", lineHeight: "12px" }}>
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
                                              {index == 0
                                                ? `${
                                                    i.newqty
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
                                      <div> {i.display_name}</div>
                                    )}
                                  </div>
                                )}
                              </>
                              {i.orderTiketsNotes && (
                                <div style={{ fontSize: "10px" }}>
                                  Notes - {i.orderTiketsNotes}
                                </div>
                              )}
                            </div>
                          </>
                        </td>

                        <td
                          style={{
                            fontSize: "10px",
                            lineHeight:"12px",
                      textAlign: "right",
                      fontFamily: "Arial, Helvetica, sans-serif",
                          }}
                        >
                          {" "}
                          {categoryDetails.add_remove == "Removed Items" && `-`}
                          {i.newqty ? i.newqty : i.quantity}
                        </td>
                      </tr>
                    </>
                  );
                })}
              </table>
            </>
          )}
          {PreviousTikets.length > 0 && (
            <p 
            style={{
              fontSize: "10px",
              fontWeight: "700",
              fontFamily: "Arial, Helvetica, sans-serif",
            }}
            >
              Previous Order Tickets:{" "}
              {PreviousTikets.sort(function(a, b) {
                return a - b;
              }).map((i, index) => {
                return (
                  <>
                    <span>
                      {index == PreviousTikets.length - 1 ? `${i}` : `${i},`}
                    </span>
                  </>
                );
              })}
            </p>
          )}
        </>
      )}
      <table style={{ width: "100%" }}>
        <tr>
          <hr style={{ margin: "4px 0 0" }} />
        </tr>
      </table>
    </div>
  );
});
export { OrderTicketPrint };
