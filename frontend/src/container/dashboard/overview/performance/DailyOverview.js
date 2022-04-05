import React, { useState, useEffect, useRef } from "react";
import { Progress, Input, Modal, Form } from "antd";
import FeatherIcon from "feather-icons-react";
import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { OverviewCard } from "../../style";
import { Cards } from "../../../../components/cards/frame/cards-frame";
import Heading from "../../../../components/heading/heading";
import { Button } from "../../../../components/buttons/buttons";
import { Dropdown } from "../../../../components/dropdown/dropdown";
import { Popover } from "../../../../components/popup/popup";

const DailyOverview = ({ dashBoardDataDetails }) => {
  const { rtl } = useSelector((state) => {
    return {
      rtl: state.ChangeLayoutMode.rtlData,
    };
  });

  const [modalVisible, setModelVisible] = useState(false);
  const [totalBooking, setTotalBooking] = useState(0);
  useEffect(() => {
    if (
      dashBoardDataDetails &&
      dashBoardDataDetails.total_booking &&
      dashBoardDataDetails.total_booking.length > 0
    ) {
      setTotalBooking(dashBoardDataDetails.total_booking[0].count);
    }
  }, [dashBoardDataDetails]);
  const content = (
    <>
      <NavLink to="#" onClick={() => setModelVisible(true)}>
        <FeatherIcon size={16} icon="book-open" />
        <span>PDF</span>
      </NavLink>
      <NavLink to="#" onClick={() => setModelVisible(true)}>
        <FeatherIcon size={16} icon="x" />
        <span>Excel (XLSX)</span>
      </NavLink>
      <NavLink to="#" onClick={() => setModelVisible(true)}>
        <FeatherIcon size={16} icon="file" />
        <span>CSV</span>
      </NavLink>
    </>
  );

  return (
    <OverviewCard>
      <div className="d-flex align-items-center justify-content-between overview-head">
        <Heading as="h4">Daily Overview</Heading>
        <Popover placement="bottomLeft" content={content} trigger="click">
          <Button>
            Export <FeatherIcon icon="chevron-down" size={14} />
          </Button>
        </Popover>
      </div>
      <div className="overview-box">
        <Modal
          title="Request a Report"
          visible={modalVisible}
          onOk={() => setModelVisible(false)}
          onCancel={() => setModelVisible(false)}
          width={600}
        >
          <div>
            <Form style={{ width: "100%" }} name="addProduct">
              <div className="add-product-block">
                <div className="add-product-content">
                  <Form.Item name="Email Address" label="Send to Email Address">
                    <Input />
                  </Form.Item>
                </div>
              </div>
            </Form>
          </div>
        </Modal>
        <Cards headless>
          <div className="d-flex align-items-center justify-content-between">
            <div className="icon-box box-primary" style={{ backgroundColor: "#5f63f210", borderRadius: "10px", padding: "5px" }}>

              <img
                src={require(`../../../../../src/static/img/SalesRevenue.svg`)}
                alt=""
                height="50px"
                width="50px"
              />

            </div>
            <div className="overview-box-single">

              <h2 style={{ color: "#008cba", fontWeight: "600", margin: "0" }}> ₹{dashBoardDataDetails?.total_sales.toLocaleString("en-IN")}.00</h2>
              <p>Total sales Today</p>
            </div>
            {/* <div className="overview-box-single text-right">
              <Heading as="h2"> ₹582.75</Heading>
              <p>Total sales</p>
            </div> */}
          </div>
          {/* <Progress
            percent={70}
            showInfo={false}
            className="progress-primary"
          /> */}

          {/* <p>
            <span className="growth-upward">
              <FeatherIcon icon="arrow-up" size={14} />
              25% <span>Since yesterday</span>
            </span>
            <span
              className="overview-box-percentage"
              style={{ float: !rtl ? "right" : "left" }}
            >
              70%
            </span>
          </p> */}
        </Cards>
      </div>
      <div className="overview-box">
        <Cards headless>
          <div className="d-flex align-items-center justify-content-between">
            <div className="icon-box box-secondary" style={{ backgroundColor: "#20c99710", borderRadius: "10px", padding: "5px" }}>

              <img
                src={require(`../../../../../src/static/img/Profit.svg`)}
                alt=""
                height="50px"
                width="50px"
              />

            </div>
            <div className="overview-box-single">
              <h2 style={{ color: "#008cba", fontWeight: "600", margin: "0" }}>  {dashBoardDataDetails?.total_bills}</h2>
              <p>Total Bills Today</p>
            </div>
            {/* <div className="overview-box-single text-right">
              <Heading as="h2">2000</Heading>
              <p>Total Bills</p>
            </div> */}
          </div>
          {/* <Progress
            percent={75}
            showInfo={false}
            className="progress-primary"
          /> */}

          {/* <p>
            <span className="growth-upward">
              <FeatherIcon icon="arrow-up" size={14} />
              25% <span>Since yesterday</span>
            </span>
            <span
              className="overview-box-percentage"
              style={{ float: !rtl ? "right" : "left" }}
            >
              70%
            </span>
          </p> */}
        </Cards>
        <Cards headless>
          <div className="d-flex align-items-center justify-content-between">
            <div className="icon-box box-secondary" style={{ backgroundColor: "#ff69a510", borderRadius: "10px", padding: "5px" }}>

              <img
                src={require(`../../../../../src/static/img/Newcustomer.svg`)}
                alt=""
                height="50px"
                width="50px"
              />

            </div>
            <div className="overview-box-single">
              <h2 style={{ color: "#008cba", fontWeight: "600", margin: "0" }}>
                {dashBoardDataDetails?.new_customers}
              </h2>

              <p>New customers</p>
            </div>
          </div>
        </Cards>
        {/* <Cards headless>
          <div className="d-flex align-items-center justify-content-between">
            <div className="overview-box-single">
            <h2 style={{color:"#008cba",fontWeight:"600",margin:"0"}}>
                {totalBooking}
            </h2>
              <p>Total Bookings</p>
            </div>
          </div>
        </Cards> */}
      </div>
    </OverviewCard>
  );
};

export default DailyOverview;
