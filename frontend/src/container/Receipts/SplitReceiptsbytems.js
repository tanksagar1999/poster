import React, { useState, useRef, useEffect, useCallback } from "react";
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
import { useHistory } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import { useSelector } from "react-redux";
import {
  InvoiceHeader,
  InvoiceLetterBox,
  ProductTable,
  OrderSummary,
} from "./Style";
import { PageHeader } from "../../components/page-headers/page-headers";
import { Main } from "../styled";
import { Cards } from "../../components/cards/frame/cards-frame";
import Heading from "../../components/heading/heading";
import { Button } from "../../components/buttons/buttons";
import { useDispatch } from "react-redux";
import {
  getReceiptsById,
  cancelOrder,
  deleteReceipt,
} from "../../redux/receipts/actionCreator";
import commonFunction from "../../utility/commonFunctions";
import {
  getAllAddtionalList,
  getAllTagList,
} from "../../redux/customField/actionCreator";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { getAllPaymentTypeList } from "../../redux/customField/actionCreator";
import { UnPaidReceipts } from "./UnPaidReceipts";
import "./receipt.css";
import { TagFilled } from "@ant-design/icons";
import be from "date-fns/locale/be/index";
import tickSvg from "../../static/img/tick.svg";

function SplitReceiptsbytems({ RecepitsData }) {
  return (
    <div>
      {RecepitsData &&
        RecepitsData.order_id.details.immediate_sale.multiple_payments_type.map(
          (data) => {
            return (
              <>
                <Main>
                  <PageHeader
                    ghost
                    title={
                      <span>
                        Status &nbsp;
                        {RecepitsData && (
                          <>
                            {RecepitsData.order_id.details.fulfillmentStatus ==
                              "Fulfilled" && deletebuttonShow == false ? (
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
                    }
                    buttons={[
                      <div key="1" className="page-header-actions">
                        <Button size="small" shape="round" type="default">
                          <FeatherIcon icon="printer" size={14} />
                          Print
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

                  <Row gutter={15}>
                    <Col md={24}>
                      <Cards headless>
                        <InvoiceLetterBox>
                          <div className="invoice-letter-inner">
                            <Row align="middle">
                              <Col lg={8} xs={24}>
                                <article className="invoice-author">
                                  <Heading className="heading">
                                    Receipt Details
                                  </Heading>
                                  {RecepitsData && (
                                    <p className="receipts-details">
                                      Prepared by{" "}
                                      {
                                        RecepitsData.order_id.details
                                          .order_by_name
                                      }{" "}
                                      <br />
                                      on{" "}
                                      {commonFunction.convertToDate(
                                        RecepitsData.created_at,
                                        "MMM DD, Y h:mm A"
                                      )}
                                      <br />
                                      {`${RecepitsData.register_id.register_name} Register`}
                                      <br />
                                      {RecepitsData.receipt_number}
                                      {RecepitsData.order_id.details
                                        .tableName != undefined &&
                                        ` - ${RecepitsData.order_id.details.tableName}`}
                                    </p>
                                  )}
                                </article>
                              </Col>
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
                            Deleting the receipt will permanently remove it and
                            will no longer appear on reports. Also, deleting the
                            receipt will keep the metrics as they were after
                            cancellation. Are you sure you want to proceed?
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
                          okText="Cancel Receipt"
                          visible={modalVisibleOrderCancel}
                          onCancel={() => setModalVisibleOrderCancel(false)}
                          width={600}
                          onOk={form.submit}
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
                                    if (
                                      Number(value) >
                                      RecepitsData.order_id.details.priceSummery
                                        .total
                                    ) {
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
                              label="Cancellation Notes"
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
                                  {singleTaxNameWithPrice.length > 0 &&
                                    singleTaxNameWithPrice.map((val) => {
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
                                    })}
                                  {RecepitsData?.order_id.details.priceSummery
                                    .round_off_value != false && (
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
                                <Heading className="summary-total" as="h4">
                                  <span className="summary-total-label">
                                    For{" "}
                                    {data.name != ""
                                      ? data.name
                                      : `Customer ${data.no}`}{" "}
                                  </span>
                                  <span className="summary-total-amount">{`₹${data.price}`}</span>
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
                            <Row>
                              <Col lg={12} md={18} sm={24} offset={0}>
                                {RecepitsData ? (
                                  <>
                                    {RecepitsData.order_id.customer?.name ||
                                    RecepitsData.order_id.customer?.mobile ||
                                    RecepitsData.order_id.customer?.email ? (
                                      <span>
                                        <span className="other-details">
                                          Customer Details
                                        </span>
                                        {RecepitsData.order_id.customer?.name
                                          ? RecepitsData.order_id.customer
                                              ?.mobile ||
                                            RecepitsData.order_id.customer
                                              ?.email
                                            ? `${RecepitsData.order_id.customer?.name} | `
                                            : RecepitsData.order_id.customer
                                                ?.name
                                          : null}
                                        {RecepitsData.order_id.customer?.mobile
                                          ? RecepitsData.order_id.customer
                                              ?.email
                                            ? `${RecepitsData.order_id.customer?.mobile} | `
                                            : RecepitsData.order_id.customer
                                                ?.mobile
                                          : null}
                                        {RecepitsData.order_id.customer?.email
                                          ? RecepitsData.order_id.customer
                                              ?.email
                                          : null}
                                      </span>
                                    ) : null}
                                  </>
                                ) : null}
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={12} md={18} sm={24} offset={0}>
                                {RecepitsData ? (
                                  <>
                                    {RecepitsData.order_id.customer?.city ||
                                    RecepitsData.order_id.customer
                                      ?.shipping_address ||
                                    RecepitsData.order_id.customer?.zipcode ? (
                                      <span>
                                        <span className="other-details">
                                          Customer Address
                                        </span>
                                        {RecepitsData.order_id.customer
                                          ?.shipping_address
                                          ? RecepitsData.order_id.customer
                                              ?.city ||
                                            RecepitsData.order_id.customer
                                              ?.zipcode
                                            ? `${RecepitsData.order_id.customer?.shipping_address} `
                                            : RecepitsData.order_id.customer
                                                ?.shipping_address
                                          : null}
                                        {RecepitsData.order_id.customer?.city
                                          ? RecepitsData.order_id.customer
                                              ?.zipcode
                                            ? `${RecepitsData.order_id.customer?.city}`
                                            : RecepitsData.order_id.customer
                                                ?.city
                                          : null}
                                        {RecepitsData.order_id.customer?.zipcode
                                          ? ` - ${RecepitsData.order_id.customer?.zipcode}`
                                          : null}
                                      </span>
                                    ) : null}
                                  </>
                                ) : null}
                              </Col>
                            </Row>

                            <Row>
                              <Col lg={12} md={18} sm={24} offset={0}>
                                {RecepitsData ? (
                                  <>
                                    {RecepitsData.order_id.details
                                      .customer_custom_fields ? (
                                      <span>
                                        <span className="other-details">
                                          Additional Customer Details
                                        </span>
                                        {RecepitsData.order_id.details.customer_custom_fields.map(
                                          (data, index) => {
                                            if (
                                              RecepitsData.order_id.details
                                                .customer_custom_fields
                                                .length == 1 &&
                                              data.value != ""
                                            ) {
                                              return (
                                                <>
                                                  {data.name}{" "}
                                                  <span
                                                    style={{
                                                      fontWeight: "bold",
                                                    }}
                                                  >
                                                    {data.value}
                                                  </span>
                                                </>
                                              );
                                            } else if (
                                              index + 1 ==
                                                RecepitsData.order_id.details
                                                  .customer_custom_fields
                                                  .length &&
                                              data.value != ""
                                            ) {
                                              return (
                                                <>
                                                  {data.name}{" "}
                                                  <span
                                                    style={{
                                                      fontWeight: "bold",
                                                    }}
                                                  >
                                                    {data.value}
                                                  </span>
                                                </>
                                              );
                                            } else if (data.value != "") {
                                              return (
                                                <>
                                                  {data.name}{" "}
                                                  <span
                                                    style={{
                                                      fontWeight: "bold",
                                                    }}
                                                  >
                                                    {data.value}
                                                  </span>{" "}
                                                  {" | "}
                                                </>
                                              );
                                            }
                                          }
                                        )}
                                      </span>
                                    ) : null}
                                  </>
                                ) : null}
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={12} md={18} sm={24} offset={0}>
                                {RecepitsData ? (
                                  <>
                                    {RecepitsData.order_id.details.custom_fields
                                      ?.length > 0 ? (
                                      <span>
                                        <span className="other-details">
                                          Tags
                                        </span>
                                        {RecepitsData.order_id.details.custom_fields.map(
                                          (val) => (
                                            <Tag color={val.tag_color}>
                                              {val.name}
                                            </Tag>
                                          )
                                        )}
                                      </span>
                                    ) : null}
                                  </>
                                ) : null}
                              </Col>
                            </Row>

                            {data.payment_type_list.map((val) => {
                              if (val.tick == true) {
                                return (
                                  <>
                                    <Col lg={6} md={18} sm={24} offset={0}>
                                      <div className="receipt-payment-transactions">
                                        <p>{`₹${data.price} on ${val.name}`}</p>
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
                          </div>
                        ) : (
                          <>
                            <div style={{ display: "none" }}>
                              {PaymentTypeList.length}
                            </div>
                            <UnPaidReceipts
                              RecepitsDataDetails={RecepitsData}
                              PaymentTypeList={PaymentTypeList}
                              setRecepitsData={setRecepitsData}
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
        )}
    </div>
  );
}

export { SplitReceiptsbytems };
