import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
} from "react";
import { Modal, Button, Form, Input, Radio, Checkbox, Row, Col } from "antd";
import "./ecommerce.css";
import { useReactToPrint } from "react-to-print";
import { ViewPrint } from "./ViewPrint";
import commonFunction from "../../utility/commonFunctions";

const ViewSummary = forwardRef((props, ref) => {
  const [modalVisible, setIsModalVisible] = useState(false);
  let { viewSummaryData } = props;
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  useImperativeHandle(ref, () => ({
    showModal(value) {
      setIsModalVisible(true);
    },
    hideModal() {
      setIsModalVisible(false);
    },
  }));
  const hanldePrintSummary = () => {
    handlePrint();
    setIsModalVisible(false);
  };
  console.table("viewSummaryData123", viewSummaryData);

  if (
    viewSummaryData?.view_summary?.paymentCount?.receipts &&
    viewSummaryData?.view_summary?.paymentCount?.receipts
  ) {
    viewSummaryData.view_summary.paymentCount.refunds.map((k) => {
      if (viewSummaryData?.view_summary?.paymentCount?.receipts.length > 0) {
        viewSummaryData?.view_summary?.paymentCount?.receipts.map((val) => {
          if (k._id === val._id) {
            val.refund = k.count;
          }
        });
      }
    });
  }
  let extraRefund = [];
  extraRefund = viewSummaryData?.view_summary?.paymentCount?.refunds.filter(
    function(o1) {
      return !viewSummaryData?.view_summary?.paymentCount?.receipts?.some(
        function(o2) {
          return o1._id === o2._id;
        }
      );
    }
  );

  return (
    <>
      {viewSummaryData && (
        <div>
          <Modal
            title="Shift Summary"
            visible={modalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={[
              <Button onClick={() => hanldePrintSummary()}>
                Print Shift Summary
              </Button>,
              <Button type="primary" onClick={() => setIsModalVisible(false)}>
                Ok
              </Button>,
            ]}
            width={700}
          >
            {viewSummaryData && viewSummaryData.register_id.register_name && (
              <p>Register:{viewSummaryData.register_id.register_name} </p>
            )}

            {viewSummaryData.view_summary.startTime && (
              <p>
                Start Time:{" "}
                {commonFunction.convertToDate(
                  viewSummaryData.view_summary.startTime.actual_time,
                  "MMM DD, Y, h:mm A"
                )}{" "}
                |
                <small style={{ color: "#999" }}>
                  {" "}
                  Shift{" "}
                  {viewSummaryData.view_summary.startTime.action == "close"
                    ? "Closed"
                    : "Open"}{" "}
                  by {viewSummaryData.view_summary.startTime.userName}
                </small>
              </p>
            )}

            <p>
              End Time:{" "}
              {commonFunction.convertToDate(
                viewSummaryData.actual_time,
                "MMM DD, Y, h:mm A"
              )}
              |
              <small style={{ color: "#999" }}>
                {" "}
                Shift Closed by {viewSummaryData.userName}
              </small>
            </p>
            <Row>
              <Col
                lg={12}
                md={6}
                sm={6}
                xs={6}
                style={{ paddingRight: "10px" }}
              >
                <p className="viewSummary-p">Sales Summary</p>
                <table style={{ width: "100%", marginBottom: "15px" }}>
                  <tr>
                    <td className="table-td">Sales Total</td>
                    <td className="table-td">
                      {Number(
                        viewSummaryData.view_summary.salesSummary.totalSales
                      ).toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="table-td">Active Receipts</td>
                    <td className="table-td">
                      {viewSummaryData.view_summary.salesSummary.activeReceipts}
                    </td>
                  </tr>{" "}
                  <tr>
                    <td className="table-td">Cancelled Receipts</td>
                    <td className="table-td">
                      {viewSummaryData.view_summary.salesSummary.cancelReceipts}
                    </td>
                  </tr>
                </table>
                <p className="viewSummary-p">Payments Summary</p>
                <table style={{ width: "100%", marginBottom: "15px" }}>
                  <tr>
                    <td className="table-td">Payments Total</td>
                    <td className="table-td">
                      {Number(
                        viewSummaryData.view_summary.salesSummary.totalSales
                      ).toFixed(2)}
                    </td>
                  </tr>
                  {viewSummaryData.view_summary.paymentTotal.map((value) => {
                    return (
                      <tr>
                        <td className="table-td">{value._id}</td>
                        <td className="table-td">
                          {Number(value.sum).toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </table>

                <p className="viewSummary-p">Count By Payments</p>
                <table style={{ width: "100%", marginBottom: "15px" }}>
                  <tr>
                    <td className="table-td">Payment Type</td>
                    <td className="table-td">Receipt</td>
                    <td className="table-td">Refund</td>
                  </tr>
                  {viewSummaryData?.view_summary?.paymentCount?.receipts
                    .length > 0 ? (
                    <>
                      {viewSummaryData?.view_summary?.paymentCount?.receipts.map(
                        (val) => {
                          return (
                            <tr>
                              <td className="table-td">{val._id}</td>
                              <td className="table-td">{val.count}</td>
                              {val.refund ? (
                                <td className="table-td">{val.refund}</td>
                              ) : (
                                <td className="table-td">0</td>
                              )}
                            </tr>
                          );
                        }
                      )}
                    </>
                  ) : (
                    <>
                      <tr>
                        <td className="table-td">Cash</td>
                        <td className="table-td">0</td>
                        <td className="table-td">0</td>
                      </tr>
                      <tr>
                        <td className="table-td">Card</td>
                        <td className="table-td">0</td>
                        <td className="table-td">0</td>
                      </tr>
                      <tr>
                        <td className="table-td">Other</td>
                        <td className="table-td">0</td>
                        <td className="table-td">0</td>
                      </tr>
                    </>
                  )}
                  {extraRefund.length > 0 &&
                    extraRefund.map((i) => (
                      <tr>
                        <td className="table-td">{i._id}</td>
                        <td className="table-td">0</td>
                        <td className="table-td">{i.count}</td>
                      </tr>
                    ))}
                </table>
              </Col>
              <Col lg={12} md={6} sm={6} xs={6}>
                <p className="viewSummary-p">Cash Summary</p>
                <table style={{ width: "100%" }}>
                  <tr>
                    <td className="table-td">Opening Cash Balance</td>
                    <td className="table-td">
                      ₹
                      {viewSummaryData.view_summary.startTime &&
                      viewSummaryData.view_summary.startTime.action == "open"
                        ? viewSummaryData.view_summary.startTime.opening_balance
                        : viewSummaryData.view_summary.startTime
                            .closing_balance}
                    </td>
                  </tr>

                  <tr>
                    <td className="table-td">Cash In (Sales)</td>
                    <td className="table-td">
                      ₹
                      {Number(
                        viewSummaryData.view_summary.paymentTotal.find(
                          (val) => val._id == "cash"
                        )
                          ? viewSummaryData.view_summary.paymentTotal.find(
                              (val) => val._id == "cash"
                            ).sum
                          : 0
                      ).toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="table-td">Cash Out (Refunds)</td>
                    <td className="table-td">
                      ₹
                      {Number(
                        viewSummaryData.view_summary.cashSummary
                          .cashOutRefunds == 0
                          ? 0
                          : viewSummaryData.view_summary.cashSummary
                              .cashOutRefunds[0].sum
                      ).toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="table-td">Petty Cash In</td>
                    <td className="table-td">
                      ₹{" "}
                      {Number(
                        viewSummaryData.view_summary.cashSummary.pettyCashIn ==
                          0
                          ? 0
                          : viewSummaryData.view_summary.cashSummary.pettyCashIn
                              .sum
                      ).toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="table-td">Petty Cash Out</td>
                    <td className="table-td">
                      ₹
                      {Number(
                        viewSummaryData.view_summary.cashSummary.pettyCashOut ==
                          0
                          ? 0
                          : viewSummaryData.view_summary.cashSummary
                              .pettyCashOut.sum
                      ).toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="table-td">Expected Closing Cash Balance</td>
                    <td className="table-td">
                      {" "}
                      ₹
                      {Number(
                        viewSummaryData.view_summary.cashSummary
                          .expectedClosingBalance
                      ).toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="table-td">Actual Closing Cash Balance</td>
                    <td className="table-td">
                      ₹
                      {Number(
                        viewSummaryData.view_summary.cashSummary
                          .actualClosingBalance
                      ).toFixed(2)}
                    </td>
                  </tr>
                  {viewSummaryData.view_summary.cashSummary.excess < 0 ? (
                    <tr style={{ backgroundColor: "#f2dede" }}>
                      <td className="table-td">Shortage</td>
                      <td className="table-td">
                        -₹
                        {Number(
                          viewSummaryData.view_summary.cashSummary.excess * -1
                        ).toFixed(2)}
                      </td>
                    </tr>
                  ) : (
                    <tr style={{ backgroundColor: "#c4e3f3" }}>
                      <td className="table-td">Excess</td>
                      <td className="table-td">
                        ₹
                        {Number(
                          viewSummaryData.view_summary.cashSummary.excess
                        ).toFixed(2)}
                      </td>
                    </tr>
                  )}
                </table>
              </Col>
            </Row>
          </Modal>
          <ViewPrint ref={componentRef} viewSummaryData={viewSummaryData} />
        </div>
      )}
    </>
  );
});
export { ViewSummary };
