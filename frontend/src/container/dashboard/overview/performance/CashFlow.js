import React, { useState, useEffect } from "react";
import { Spin, Col, Row, Divider, Tooltip, Menu, Dropdown, Select } from "antd";
import FeatherIcon from "feather-icons-react";
import { NavLink, Link } from "react-router-dom";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { CardBarChart, Pstates } from "../../style";
import { Cards } from "../../../../components/cards/frame/cards-frame";
import Heading from "../../../../components/heading/heading";
import { ChartjsBarChartTransparent } from "../../../../components/charts/chartjs";
import { ExclamationCircleOutlined, DownOutlined } from "@ant-design/icons";
import {
  cashFlowGetData,
  cashFlowFilterData,
} from "../../../../redux/chartContent/actionCreator";
import { getSaleSummaryDatwiseChangeData } from "../../../../redux/dashboard/actionCreator";
import moment from "moment";
import { ConsoleSqlOutlined } from "@ant-design/icons";
import { Option } from "antd/lib/mentions";
import axios from "axios";
import { getItem, setItem } from "../../../../utility/localStorageControl";
const CashFlow = () => {
  const [topProducts, setTopProducts] = useState([]);
  const [cash, setCash] = useState(0);
  const [card, setCard] = useState(0);
  const [other, setOther] = useState(0);
  const [custumPayment, setCustumPaymnet] = useState(0);
  const [currentDate, setCurrentDate] = useState("today");
  const [allCustomPaymnetList, setAllCustomPaymnetList] = useState([]);
  const [pattyCashDetails, setPattyCashDetails] = useState();
  const [dashboardDetails, setDashBoardDetails] = useState();
  const [totalBooking, setTotalBooking] = useState(0);
  const [dropDownValue, setDropDownValue] = useState("All Registers");
  const [id, setId] = useState("allRegister");

  useEffect(() => {
    async function fetchTopProduct() {
      let startDate;
      let endDate;

      if (currentDate === "today") {
        startDate = moment().format("L");
        endDate = moment().format("L");
      } else if (currentDate === "yesterday") {
        var curr = new Date();

        startDate = moment(curr.setDate(curr.getDate() - 1)).format("L");
        endDate = startDate; /*moment(new Date()).format("L");*/
      } else if (currentDate === "this_month") {
        var nowdate = new Date();
        var monthStartDay = new Date(
          nowdate.getFullYear(),
          nowdate.getMonth(),
          1
        );

        var monthEndDay = new Date(
          nowdate.getFullYear(),
          nowdate.getMonth() + 1,
          0
        );
        startDate = moment(monthStartDay).format("L");
        endDate = moment(monthEndDay).format("L");
      } else if (currentDate === "last_month") {
        var date = new Date();
        startDate = moment(
          new Date(date.getFullYear(), date.getMonth() - 1, 1)
        ).format("L");
        endDate = moment(
          new Date(date.getFullYear(), date.getMonth(), 0)
        ).format("L");
      }

      const getDashboardData = await dispatch(
        getSaleSummaryDatwiseChangeData(startDate, endDate, currentDate, id)
      );

      if (getDashboardData) {
        setDashBoardDetails(
          getDashboardData.saleSummaruydashboardDateWiseDetails
        );
        setPattyCashDetails(
          getDashboardData.saleSummaruydashboardDateWiseDetails.pettyCash
        );
        console.table(
          "getDashboardData.saleSummaruydashboardDateWiseDetails.paymentCustomFields",
          getDashboardData.saleSummaruydashboardDateWiseDetails
            .paymentCustomFields
        );

        dashboardDetails?.total_booking[0]?.count > 0 &&
          setTotalBooking(dashboardDetails.total_booking[0]?.count);

        if (
          getDashboardData.saleSummaruydashboardDateWiseDetails.payment_summary
            .length > 0
        ) {
          let customPaymnetList = [];
          let custompaymnetSum = 0;
          getDashboardData.saleSummaruydashboardDateWiseDetails.payment_summary.map(
            (val) => {
              if (val._id == "cash") {
                setCash(val.sum);
              } else if (val._id == "card") {
                setCard(val.sum);
              } else if (val._id == "other") {
                setOther(val.sum);
              } else {
                custompaymnetSum += val.sum;
                customPaymnetList.push(val);
              }
            }
          );
          console.log("custompaymnetSum", custompaymnetSum);
          setCustumPaymnet(custompaymnetSum);
          setAllCustomPaymnetList(customPaymnetList);
        } else {
          setCash(0);
          setCard(0);
          setOther(0);
        }
      }
    }

    fetchTopProduct();
  }, [currentDate, dropDownValue, id]);

  const dispatch = useDispatch();

  const { cashFlowState, cfIsLoading } = useSelector((state) => {
    return {
      cashFlowState: state.chartContent.cashFlowData,
      cfIsLoading: state.chartContent.cfLoading,
    };
  });

  const { registerList } = useSelector(
    (state) => ({
      registerList: state.register.RegisterList,
    }),
    shallowEqual
  );

  useEffect(() => {
    if (cashFlowGetData) {
      dispatch(cashFlowGetData());
    }
  }, [dispatch]);

  // useEffect(()=>{

  //   const header = {
  //     headers:{
  //     Authorization : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwZGYwYmM3MTc5ODMzMzVjYzg0Y2Q3YiIsInJlZ2lzdGVyX2lkIjoiNjBkZjBhM2IxNzk4MzMzNWNjODRjZDcwIiwibWFpbl9yZWdpc3Rlcl9pZCI6IjYwZGYwYTNiMTc5ODMzMzVjYzg0Y2Q3MCIsInJvbGUiOiJvd25lciIsImlhdCI6MTY0NDk4NDcwMSwiZXhwIjoxNjQ3NTc2NzAxfQ.uVx6dypt1QQRr8lwwugY-3EiTFzNJG63IRDI5xwnIaw"
  //   }}

  //   if(id != null && id != undefined ){
  //     axios.get(`http://172.105.35.50:7000/api/dashboard/${id}`,header)
  //     .then(res=>{
  //       console.log("155",res.data)
  //       let a = {hourly_selling:[{_id:1,total:222}],total_booking:[{count:2}],total_sales:"220"}
  //       // setDashBoardDetails(res.data.data)
  //       setDashBoardDetails(a)

  //     })
  //   }else{
  //     axios.get(`http://172.105.35.50:7000/api/dashboard/${id}`,header)
  //     .then(res=>{
  //       let a = {hourly_selling:[{_id:1,total:222}],total_booking:[{count:2}],total_sales:"220"}
  //       // setDashBoardDetails(res.data.data)
  //       setDashBoardDetails(a)

  //       console.log("155",res.data)
  //     })
  //   }

  // },[dropDownValue])

  let labels = [];
  let data = [];

  function compareFunction(a, b) {
    return a._id - b._id;
  }

  if (dashboardDetails !== undefined) {
    dashboardDetails?.hourly_selling?.sort(compareFunction);
  }

  dashboardDetails !== "undefined"
    ? dashboardDetails?.hourly_selling?.map((i) => {
        let b = i._id.toString();
        if (b.length > 1) {
          labels.push(`${i._id}:00`);
        } else {
          labels.push(`0${i._id}:00`);
        }
        data.push(i.total);
      })
    : "";

  let totalBookings;

  dashboardDetails !== "undefined"
    ? (totalBookings = dashboardDetails?.total_booking[0]?.count)
    : "";

  let newLabels = [];
  let newtotalls = [];

  labels.map((i, idx) => {
    let c = labels[idx + 1];

    for (let j = i; j < c; j++) {
      if (labels.includes(j)) {
        newLabels.push(j);
        newtotalls.push(data[labels.indexOf(j)]);
      } else {
        newLabels.push(j);
        newtotalls.push(0);
      }
    }
  });

  newLabels.push(labels[labels.length - 1]);

  newtotalls.push(data[data.length - 1]);

  let scale;
  let stepSize;

  if (currentDate == "today" || currentDate == "yesterday") {
    let max = 0;
    newtotalls.map((i) => {
      if (i > max) {
        max = i;
      }
    });

    if (max > 0 && max <= 109) {
      stepSize = 50;
    } else if (max > 99 && max <= 1001) {
      stepSize = 200;
    } else if (max > 999 && max <= 5000) {
      stepSize = 2000;
    } else if (max > 5000 && max <= 10000) {
      stepSize = 2000;
    } else if (max > 10000 && max <= 100000) {
      stepSize = 20000;
    } else if (max > 100000 && max <= 500000) {
      stepSize = 50000;
    } else if (max > 500000 && max <= 1000000) {
      stepSize = 200000;
    }

    scale = {
      yAxes: [
        {
          display: true,
          ticks: {
            stepSize: stepSize,
            suggestedMin: 0,
          },
        },
      ],
      xAxes: [
        {
          ticks: {
            fontSize: 10,
            callback: function(val, index) {
              return val;
            },
          },
        },
      ],
    };
  }

  if (currentDate == "this_month") {
    newLabels = [];
    newtotalls = [];

    const monthLabel = [];
    const monthsArr = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const presentMonth = new Date().getMonth();
    const currentDates = new Date().getDate();

    if (dashboardDetails !== "undefined") {
      if (dashboardDetails?.hourly_selling?.length > 0) {
        for (let i = 1; i <= currentDates; i++) {
          monthLabel.push(`${monthsArr[presentMonth]} ${i}`);
        }
      }
    }

    newLabels = monthLabel;

    if (dashboardDetails?.hourly_selling?.length > 0) {
      newLabels.map((i, idx) => {
        dashboardDetails?.hourly_selling.map((j) => {
          if (j._id == idx + 1) {
            newtotalls[idx] = j.total;
          }
        });
      });
    }

    let max = 0;
    let stepSize;

    newtotalls.map((i) => {
      if (i > max) {
        max = i;
      }
    });

    if (max > 0 && max <= 100) {
      stepSize = 50;
    } else if (max > 100 && max <= 1000) {
      stepSize = 100;
    } else if (max > 1000 && max <= 5000) {
      stepSize = 1000;
    } else if (max > 5000 && max <= 10000) {
      stepSize = 2000;
    } else if (max > 10000 && max <= 100000) {
      stepSize = 20000;
    } else if (max > 100000 && max <= 500000) {
      stepSize = 50000;
    } else if (max > 500000 && max <= 1000000) {
      stepSize = 200000;
    }

    scale = {
      yAxes: [
        {
          display: true,
          ticks: {
            stepSize: stepSize,
            suggestedMin: 0,
          },
        },
      ],
      xAxes: [
        {
          ticks: {
            fontSize: 10,
            callback: function(val, index) {
              return index % 2 === 0 ? val : "";
            },
          },
        },
      ],
    };
  }

  if (currentDate == "last_month") {
    let lastMonth = dashboardDetails?.hourly_selling;

    newLabels = [];
    newtotalls = [];

    let today = new Date();
    let lastDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    let month = lastDayOfMonth.getMonth();

    const monthLabel = [];
    const monthsArr = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    let maxDate = 1;
    lastMonth.map((i) => {
      if (i._id > maxDate) {
        maxDate = i._id;
      }
    });

    for (let i = 1; i < maxDate + 1; i++) {
      monthLabel.push(`${monthsArr[month]} ${i}`);
    }

    newLabels = monthLabel;

    if (lastMonth.length > 0) {
      newLabels.map((i, idx) => {
        lastMonth.map((j) => {
          if (j._id == idx + 1) {
            newtotalls[idx] = j.total;
          }
        });
      });
    }

    let max = 0;
    let stepSize;

    newtotalls.map((i) => {
      if (i > max) {
        max = i;
      }
    });

    if (max > 0 && max <= 100) {
      stepSize = 50;
    } else if (max > 99 && max <= 1000) {
      stepSize = 100;
    } else if (max > 999 && max <= 5000) {
      stepSize = 1000;
    } else if (max > 5000 && max <= 10000) {
      stepSize = 2000;
    } else if (max > 10000 && max <= 100000) {
      stepSize = 20000;
    } else if (max > 100000 && max <= 500000) {
      stepSize = 50000;
    } else if (max > 500000 && max <= 1000000) {
      stepSize = 200000;
    }

    if (lastMonth.length == 0) {
      newLabels = [];
      newtotalls = [];
    }

    scale = {
      yAxes: [
        {
          display: true,
          ticks: {
            stepSize: stepSize,
            suggestedMin: 0,
          },
        },
      ],
      xAxes: [
        {
          ticks: {
            callback: function(val, index) {
              return index % 2 === 0 ? val : "";
            },
          },
        },
      ],
    };
  }

  const chartData = {
    labels: newLabels[0] == undefined ? [0] : newLabels,
    datasets: [
      {
        data: newtotalls,
        backgroundColor: "#bd025d",
        maxBarThickness: 5,
        barThickness: 5,
      },
    ],
  };

  scale.yAxes[0].ticks["callback"] = function(value) {
    var ranges = [
      { divider: 1e6, suffix: "M" },
      { divider: 1e3, suffix: "k" },
    ];
    function formatNumber(n) {
      for (var i = 0; i < ranges.length; i++) {
        if (n >= ranges[i].divider) {
          return (n / ranges[i].divider).toString() + ranges[i].suffix;
        }
      }
      return n;
    }
    return formatNumber(value);
  };

  const handleDropdownClick = (data) => {
    const { _id, register_name } = data;

    setDropDownValue(register_name);
    _id != undefined ? setId(data._id) : setId("allRegister");
  };

  const menu = (
    <Menu>
      <Menu.Item>
        <Link
          to="#"
          onClick={() =>
            handleDropdownClick({ register_name: "All Registers" })
          }
        >
          All Registers
        </Link>
      </Menu.Item>

      {registerList.map((data, idx) => {
        return (
          <Menu.Item key={idx}>
            <Link
              to="#"
              key={data._id}
              onClick={() => handleDropdownClick(data)}
            >
              {data.register_name}
            </Link>
          </Menu.Item>
        );
      })}
    </Menu>
  );

  return (
    <>
      {cashFlowState !== null && (
        <Cards
          isbutton={
            <div className="card-nav dashcard-nav">
              <ul>
                <li>Sale Summary</li>
                <li>
                  <Dropdown overlay={menu} trigger={["click"]}>
                    <a
                      className="ant-dropdown-link"
                      onClick={(e) => e.preventDefault()}
                    >
                      {dropDownValue} <DownOutlined />
                    </a>
                  </Dropdown>
                </li>
                <li className={currentDate === "today" ? "active" : "regular"}>
                  <Link onClick={() => setCurrentDate("today")} to="#">
                    Today
                  </Link>
                </li>
                <li
                  className={currentDate === "yesterday" ? "active" : "regular"}
                >
                  <Link onClick={() => setCurrentDate("yesterday")} to="#">
                    Yesterday
                  </Link>
                </li>
                <li
                  className={
                    currentDate === "this_month" ? "active" : "regular"
                  }
                >
                  <Link onClick={() => setCurrentDate("this_month")} to="#">
                    This Month
                  </Link>
                </li>
                <li
                  className={
                    currentDate === "last_month" ? "active" : "regular"
                  }
                >
                  <Link onClick={() => setCurrentDate("last_month")} to="#">
                    Last Month
                  </Link>
                </li>
              </ul>
            </div>
          }

          // more={moreContent}
        >
          <Row gutter={{ xs: 6, sm: 12, md: 18, lg: 24 }} className="bod_botm">
            <Col xs={12} xl={8}>
              <div className="growth-upward borderdas_rght mobile-frbr">
                <p>Cash</p>
                <h3>
                  {" "}
                  ₹
                  {Number(cash).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </h3>
              </div>
            </Col>
            <Col xs={12} xl={8}>
              <div className="growth-upward borderdas_rght mobileamrgt">
                <p>Card</p>
                <h3>
                  {" "}
                  ₹
                  {Number(card).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </h3>
              </div>
            </Col>
            <Col xs={12} xl={8}>
              <div className="growth-upward mobile-frbr">
                <p>Other</p>
                <h3>
                  {" "}
                  ₹
                  {Number(other).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </h3>
              </div>
            </Col>
            <Col xs={12} xl={8}>
              <div className="growth-upward borderdas_rght mobileamrgt">
                <p>
                  Custom{" "}
                  {allCustomPaymnetList.length > 0 && (
                    <Tooltip
                      title={
                        <div>
                          {allCustomPaymnetList.map((val) => {
                            return (
                              <div>
                                {val._id} : ₹
                                {Number(val.sum).toLocaleString("en-US", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </div>
                            );
                          })}
                        </div>
                      }
                      // cursor={{fill:"#bd025d"}}
                    >
                      <ExclamationCircleOutlined
                        style={{
                          cursor: "pointer",
                          // backgroundColor:"#bd025d"
                        }}
                      />
                    </Tooltip>
                  )}
                </p>

                <h3>
                  {" "}
                  ₹
                  {Number(custumPayment).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </h3>
              </div>
            </Col>
            <Col xs={12} xl={8}>
              {pattyCashDetails && (
                <div className="growth-upward  borderdas_rght mobile-frbr">
                  <p>
                    Petty Cash{" "}
                    <Tooltip
                      title={
                        <div>
                          <div>
                            Cash In : + <span>&#8377;</span>{" "}
                            {Number(pattyCashDetails.cashIn).toLocaleString(
                              "en-US",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}
                          </div>
                          <div>
                            Cash Out: - <span>&#8377;</span>{" "}
                            {Number(pattyCashDetails.cashOut).toLocaleString(
                              "en-US",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}
                          </div>
                        </div>
                      }
                    >
                      <ExclamationCircleOutlined
                        style={{
                          cursor: "pointer",
                        }}
                      />
                    </Tooltip>
                  </p>
                  <h3>
                    {" "}
                    ₹
                    {pattyCashDetails
                      ? Number(pattyCashDetails?.sum).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : Number(0).toFixed(2)}
                  </h3>
                </div>
              )}
            </Col>
            <Col xs={12} xl={8}>
              <div className="growth-upward mobileamrgt">
                <p>Total Bookings </p>
                <h2
                  style={{ color: "#008cba", fontWeight: "600", margin: "0" }}
                >
                  {totalBookings}
                </h2>
              </div>
            </Col>
          </Row>
          {/* <Row gutter={{ xs: 6, sm: 12, md: 18, lg: 24 }}>
            
          </Row> */}
          {cfIsLoading ? (
            <div className="sd-spin">
              <Spin />
            </div>
          ) : (
            <CardBarChart>
              <div>
                <Row gutter={{ xs: 6, sm: 12, md: 18, lg: 24 }}>
                  <Col xs={12} xl={12} style={{ marginBottom: "10px" }}>
                    <div className="mobile-frbr">
                      <span style={{ fontSize: "16px", fontWeight: "500" }}>
                        {dashboardDetails ? dashboardDetails?.total_bills : 0}
                      </span>{" "}
                      <span style={{ fontWeight: "500", fontSize: "16px" }}>
                        Receipts
                      </span>
                    </div>
                  </Col>

                  <Col xs={12} xl={12} style={{ marginBottom: "20px" }}>
                    <span className="rec-rgtamount">
                      ₹
                      {dashboardDetails
                        ? Number(dashboardDetails?.total_sales).toLocaleString(
                            "en-US",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )
                        : Number(0).toFixed(2)}
                    </span>
                  </Col>
                </Row>
              </div>
              {/* 
              <Row>
                <Divider type="horizontal" style={{ height: "100%" }} />
              </Row> */}

              <ChartjsBarChartTransparent
                chartData={chartData}
                displayLegend={false}
                scale={scale}
              />

              {/* <ChartjsBarChartTransparent
                labels={cashFlowState.labels}
                datasets={cashFlowDataset}
                height={106}
                options={{
                  maintainAspectRatio: true,
                  responsive: true,
                  layout: {
                    padding: {
                      top: 20,
                    },
                  },
                  legend: {
                    display: false,
                    position: "bottom",
                    align: "start",
                    labels: {
                      boxWidth: 6,
                      display: false,
                      usePointStyle: true,
                    },
                  },
                  scales: {
                    yAxes: [
                      {
                        gridLines: {
                          color: "#e5e9f2",
                          borderDash: [3, 3],
                          zeroLineColor: "#e5e9f2",
                          zeroLineWidth: 1,
                          zeroLineBorderDash: [3, 3],
                        },

                        ticks: {
                          beginAtZero: true,
                          fontSize: 12,
                          fontColor: "#182b49",
                          max: Math.max(...cashFlowState.dataIn),
                          stepSize: Math.floor(
                            Math.max(...cashFlowState.dataIn) / 5
                          ),
                          callback(label) {
                            return `${label}ok`;
                            label;
                          },
                        },
                      },
                    ],
                    xAxes: [
                      {
                        gridLines: {
                          display: true,
                          zeroLineWidth: 2,
                          zeroLineColor: "#fff",
                          color: "transparent",
                          z: 1,
                        },
                        ticks: {
                          beginAtZero: true,
                          fontSize: 12,
                          fontColor: "#182b49",
                        },
                      },
                    ],
                  },
                }}
              /> */}

              {/* <ul className="chart-dataIndicator">
                {cashFlowDataset &&
                  cashFlowDataset.map((item, key) => {

                      return (
                        <li
                          key={key + 1}
                          style={{ display: "inline-flex", alignItems: "center" }}
                        >
                          <span
                            style={{
                              width: "10px",
                              height: "10px",
                              display: "flex",
                              backgroundColor: item.hoverBackgroundColor,
                              borderRadius: "50%",
                              margin: "0px 6.5px",
                            }}
                          />
                          {item.label}
                        </li>
                      );
                  
                  })}
              </ul> */}
            </CardBarChart>
          )}
        </Cards>
      )}
    </>
  );
};

export default CashFlow;
