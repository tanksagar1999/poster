import React, { lazy, Suspense, useEffect, useState, useRef } from "react";
import { Row, Col, Skeleton, List, Typography, Divider, Badge } from "antd";
import FeatherIcon from "feather-icons-react";
import { PageHeader } from "../../components/page-headers/page-headers";
import { Cards } from "../../components/cards/frame/cards-frame";
import { Main } from "../styled";
import { getAlldashboradData } from "../../redux/dashboard/actionCreator";

import { useDispatch } from "react-redux";
import { ViewSummary } from "./ViewSummary";
import commonFunction from "../../utility/commonFunctions";
import { getItem, setItem } from "../../utility/localStorageControl";
import "./ecommerce.css";
const DailyOverview = lazy(() =>
  import("./overview/performance/DailyOverview")
);
const WebsitePerformance = lazy(() =>
  import("./overview/performance/WebsitePerformance")
);
const TopSellingProduct = lazy(() =>
  import("./overview/ecommerce/TopSellingProduct")
);

const Ecommerce = () => {
  const dispatch = useDispatch();
  const [dashBoardData, setDashBoardData] = useState();
  let isMounted = useRef(true);
  const viewSummaryHideAndShow = useRef();
  useEffect(() => {
    async function fetchDashboardDetails() {
      const getDashboardData = await dispatch(getAlldashboradData());

      if (
        isMounted.current &&
        getDashboardData &&
        getDashboardData.dashboardDetails
      )
        setDashBoardData(getDashboardData.dashboardDetails);
    }
    if (isMounted.current) {
      fetchDashboardDetails();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  let [viewSummaryData, setViewSummaryData] = useState();
  return (
    <>
      <Main
        className="padding-top-form mobilepad_frm"
        style={{
          margin: "95px 0 0 0",
        }}
      >
        <Row justify="center" gutter={25} type="flex">
          <Col xxl={12} xl={12} lg={12} xs={24}>
            <Suspense
              fallback={
                <Cards headless>
                  <Skeleton active />
                </Cards>
              }
            >
              <DailyOverview dashBoardDataDetails={dashBoardData} />
            </Suspense>
          </Col>
          <Col xxl={12} xl={12} lg={12} xs={24}>
            <Suspense
              fallback={
                <Cards headless>
                  <Skeleton active />
                </Cards>
              }
            >
              <WebsitePerformance />
            </Suspense>
          </Col>
          <Col xxl={12} xl={12} lg={12} xs={24}>
            <Suspense
              fallback={
                <Cards headless>
                  <Skeleton active />
                </Cards>
              }
            >
              <TopSellingProduct dashBoardDataDetails={dashBoardData} />
            </Suspense>
          </Col>
          <Col xxl={12} xl={12} lg={12} xs={24} className="need-help">
            <Suspense
              fallback={
                <Cards headless>
                  <Skeleton active />
                </Cards>
              }
            >
              <Cards title="Recent Activity">
                {dashBoardData &&
                  dashBoardData.recent_activity &&
                  dashBoardData.recent_activity.map((item, index) => {
                    return (
                      <div key={index}>
                        <Row className="activity">
                          <Col>
                            <h3>
                              {item.action == "close"
                                ? "Shift Closed"
                                : "Shift Open"}
                            </h3>
                          </Col>
                          <Col>
                            <small>
                              {" "}
                              {commonFunction.convertToDate(
                                item.actual_time,
                                "MMM DD, Y, h:mm A"
                              )}
                            </small>
                          </Col>
                        </Row>
                        <p className="amount">
                          <small>
                            {item.register_id.register_name} | ₹
                            {Number(
                              item.closing_balance
                                ? item.closing_balance
                                : item.opening_balance
                            ).toFixed(2)}{" "}
                            by {item.userName}
                          </small>
                          {item.action == "close" && (
                            <small
                              className="folat-right"
                              onClick={() => {
                                setViewSummaryData(item);
                                viewSummaryHideAndShow.current.showModal();
                              }}
                            >
                              View Summary
                            </small>
                          )}
                        </p>
                      </div>
                    );
                  })}
              </Cards>
            </Suspense>
          </Col>
        </Row>
        <ViewSummary
          ref={viewSummaryHideAndShow}
          viewSummaryData={viewSummaryData}
        />
      </Main>
    </>
  );
};

export default Ecommerce;
