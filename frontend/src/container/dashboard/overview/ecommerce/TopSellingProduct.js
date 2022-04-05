import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Table } from "antd";
import { getAlldashboradDatwiseChangeData } from "../../../../redux/dashboard/actionCreator";
import { Cards } from "../../../../components/cards/frame/cards-frame";
import moment from "moment";
import "./ecomstyle.css";
const TopSellingProduct = ({ dashBoardDataDetails }) => {
  const dispatch = useDispatch();
  const [topProducts, setTopProducts] = useState([]);
  const [currentDate, setCurrentDate] = useState("today");

  useEffect(() => {
    async function fetchTopProduct() {
      let startDate;
      let endDate;
      if (currentDate === "today") {
        startDate = moment().format("L");
        endDate = moment().format("L");
      } else if (currentDate === "week") {
        var curr = new Date();
        var first = curr.getDate() - curr.getDay();
        var last = first + 6;
        var firstday = new Date(curr.setDate(first)).toUTCString();
        var lastday = new Date(curr.setDate(last)).toUTCString();
        startDate = moment(firstday).format("L");
        endDate = moment(lastday).format("L");
      } else if (currentDate === "month") {
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
      } else if (currentDate === "year") {
        startDate = moment(new Date(new Date().getFullYear(), 0, 1)).format(
          "L"
        );
        endDate = moment(new Date(new Date().getFullYear(), 11, 31)).format(
          "L"
        );
      }

      const getDashboardData = await dispatch(
        getAlldashboradDatwiseChangeData(startDate, endDate)
      );
      if (getDashboardData) {
        setTopProducts(getDashboardData.dashboardDateWiseDetails.top_selling);
      }
    }

    fetchTopProduct();
  }, [currentDate]);

  const sellingData = [];
  if (topProducts.length > 0) {
    topProducts.map((value) => {
      const { count, _id } = value;
      return sellingData.push({
        _id,
        count,
      });
    });
  }

  const sellingColumns = [
    {
      title: "Product Name",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Today Demand",
      dataIndex: "count",
      key: "count",
      align: "center",
      width: "25%",
    },
  ];

  return (
    <div className="full-width-table to-sel-pad">
      <Cards title="Top Selling" size="large">
        <div className="table-responsive">
          <Table
            scroll={false}
            columns={sellingColumns}
            dataSource={sellingData}
            pagination={false}
            fixed={true}
            size="small"
          />
        </div>
      </Cards>
    </div>
  );
};

export default TopSellingProduct;
