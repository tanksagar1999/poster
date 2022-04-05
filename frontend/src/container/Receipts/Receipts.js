import React, { useState, useEffect, useRef } from "react";
import { NavLink, useRouteMatch } from "react-router-dom";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
  Row,
  Col,
  Table,
  Input,
  Modal,
  Form,
  InputNumber,
  Tabs,
  Space,
  Progress,
} from "antd";
import { SearchOutlined, FolderViewOutlined } from "@ant-design/icons";
import { AutoComplete } from "../../components/autoComplete/autoComplete";
import FeatherIcon from "feather-icons-react";
import { CardToolbox } from "./Style";
import { UserTableStyleWrapper } from "../pages/style";
import { PageHeader } from "../../components/page-headers/page-headers";
import { Main, TableWrapper } from "../styled";
import { Button } from "../../components/buttons/buttons";
import { Cards } from "../../components/cards/frame/cards-frame";
import { CalendarButtonPageHeader } from "../../components/buttons/calendar-button/calendar-button";
import Highlighter from "react-highlight-words";
import {
  headerGlobalSearchAction,
  getAllReceiptsList,
} from "../../redux/receipts/actionCreator";
import { Popover } from "../../components/popup/popup";
import Exportform from "./Exportform";
import commonFunction from "../../utility/commonFunctions";
import "./receipt.css";
import { AutoCompleteStyled } from "../../components/autoComplete/style";
import { getItem, setItem } from "../../utility/localStorageControl";
import { PageHeaderCurrent } from "../../components/page-headers-current/page-headers-current";

const Receipts = () => {
  const { TabPane } = Tabs;
  const [activeTab, changeTab] = useState("");

  const [progress, setProgress] = useState(0);
  let searchInput = useRef(null);
  const dispatch = useDispatch();
  let [search, setsearch] = useState("");
  const [state, setState] = useState();
  const { ReceiptsList, totalReceipts, currentRegister } = useSelector(
    (state) => ({
      ReceiptsList: state.receipts.ReceiptsList,
      totalReceipts: state.receipts.totalReceipts,
      currentRegister: state.register.RegisterList.find((val) => val.active),
    }),
    shallowEqual
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (ReceiptsList.length > 0 && oldProgress > 90) {
          clearInterval(timer);
          setProgress(100);
        }
        // if (ReceiptsList.length > 0) {
        //   if (oldProgress > 90) {
        //     clearInterval(timer);
        //     setProgress(100)
        //   } else {
        //     clearInterval(timer);
        //     return 100
        //   }
        // }
        if (oldProgress > 90 && ReceiptsList.length == 0) {
          setProgress(100);
          // setProgress(-20)
          return 100;
        }
        if (oldProgress <= 90) {
          const diff = Math.random() * 10;

          return Math.min(oldProgress + diff, 100);
        }
      });
    }, 40);

    return () => {
      clearInterval(timer);
    };
  }, [progress]);
  useEffect(() => {
    dispatch(getAllReceiptsList(1, 10));
  }, [currentRegister]);

  const { searchText, searchedColumn } = useSelector((state) => {
    return {
      searchText: state.receipts.searchText,
      searchedColumn: state.receipts.searchedColumn,
    };
  });

  const [modalVisible, setModelVisible] = useState(false);

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: "90" }}
          >
            Search
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#BD025D" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdo0wnVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys, confirm) => {
    confirm();
    setState({
      ...state,
      searchText: selectedKeys[0],
    });
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setState({
      ...state,
      searchText: "",
    });
  };
  let searchArrByRecepitsNumber = ReceiptsList.filter((value) =>
    value.receipt_number.toLowerCase().includes(search.toLowerCase())
  );

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

  const dataSource = [];
  if (searchArrByRecepitsNumber.length)
    searchArrByRecepitsNumber.map((value) => {
      const { _id, created_at, receipt_number, order_id } = value;

      return dataSource.push({
        id: _id,
        created: created_at,
        receipt_number: receipt_number,
        customer_mobile: order_id?.customer
          ? order_id?.customer.mobile
            ? order_id?.customer.mobile
            : "-"
          : "-",
        payment_status:
          order_id?.details.paymentStatus == "paid" ? "Paid" : "Unpaid",
        total: order_id?.details.priceSummery?.total,
        fulfillmentStatus: order_id?.details.fulfillmentStatus,
      });
    });

  let lastIndex = 0;
  const updateIndex = () => {
    lastIndex++;
    return lastIndex;
  };
  const columns = [
    {
      title: "Bill Number",
      dataIndex: "receipt_number",
      key: "receipt_number",
      width: "17%",
      className: "center-col-padding",
      onFilter: (value, record) => record.receipt_number.includes(value),
      ...getColumnSearchProps("receipt_number"),
      render(text, record) {
        let path = `receipts/${record.id}`;
        return {
          props: {
            style: { textAlign: "left" },
          },
          children:
            record.fulfillmentStatus === "cancelled" ? (
              <NavLink to={path} style={{ textDecoration: "line-through" }}>
                {text}
              </NavLink>
            ) : (
              <NavLink to={path}>{text}</NavLink>
            ),
        };
      },
    },
    {
      title: "Created At",
      dataIndex: "created",
      key: `created${updateIndex()}`,
      width: "20%",
      render(created_at, record) {
        return {
          children:
            record.fulfillmentStatus === "cancelled" ? (
              <span style={{ textDecoration: "line-through" }}>
                {commonFunction.convertToDate(created_at, "MMM DD, Y, h:mm A")}
              </span>
            ) : (
              <span>
                {commonFunction.convertToDate(created_at, "MMM DD, Y, h:mm A")}
              </span>
            ),
        };
      },
    },
    ,
    {
      title: "Customer Mobile",
      dataIndex: "customer_mobile",
      key: `customer_mobile${updateIndex()}`,
      width: "20%",
      ...getColumnSearchProps("customer_mobile"),
      render(text, record) {
        return {
          children:
            record.fulfillmentStatus === "cancelled" ? (
              <div style={{ textDecoration: "line-through" }}> {text}</div>
            ) : (
              <div>{text}</div>
            ),
        };
      },
    },
    {
      title: "Fulfillment Status",
      dataIndex: "fulfillmentStatus",
      filters: [
        {
          text: "Unfulfilled",
          value: "Unfulfilled",
        },
        {
          text: "Fulfilled",
          value: "Fulfilled",
        },
      ],
      onFilter: (value, record) => record.fulfillmentStatus.includes(value),
      render(text, record) {
        return {
          children:
            record.fulfillmentStatus === "cancelled" ? (
              <div style={{ textDecoration: "line-through" }}> {text}</div>
            ) : (
              <div>{text}</div>
            ),
        };
      },
    },
    {
      title: "Payment Status",
      dataIndex: "payment_status",
      width: "17%",
      key: `payment_status${updateIndex()}`,
      filters: [
        {
          text: "Paid",
          value: "Paid",
        },
        {
          text: "Unpaid",
          value: "Unpaid",
        },
      ],
      onFilter: (value, record) => record.payment_status.includes(value),
      render(text, record) {
        return {
          children:
            record.fulfillmentStatus === "cancelled" ? (
              <div style={{ textDecoration: "line-through" }}> {text}</div>
            ) : (
              <div>{text}</div>
            ),
        };
      },
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      width: "10%",
      align: "left",
      render(text, record) {
        return {
          children:
            record.fulfillmentStatus === "cancelled" ? (
              <div style={{ textDecoration: "line-through" }}>₹{text}</div>
            ) : (
              <div>₹{text}</div>
            ),
        };
      },
    },
  ];
  let changePageData = (value, limit) => {
    dispatch(getAllReceiptsList(value, limit));
  };

  return (
    <>
      <Main>
        <CardToolbox>
          <PageHeader
            ghost
            title=""
            subTitle={
              <>
                <div className="table_titles">
                  <h2>Receipts</h2>
                  <span className="title-counter">
                    {totalReceipts} Receipts
                  </span>
                </div>
                &nbsp;
                <Input
                  suffix={<SearchOutlined />}
                  autoFocus
                  placeholder="Search by Bill Number"
                  style={{
                    borderRadius: "30px",
                    width: "250px",
                  }}
                  onChange={(e) => setsearch(e.target.value)}
                  value={search}
                  autoComplete="off"
                  className="receipts-search"
                />
              </>
            }
            buttons={[
              <div key="1" className="page-header-actions">
                <CalendarButtonPageHeader key="1" type="receipts" />
                <Popover
                  placement="bottomLeft"
                  content={content}
                  trigger="click"
                >
                  <Button size="small" type="white">
                    <FeatherIcon icon="download" size={14} />
                    Export
                  </Button>
                </Popover>
              </div>,
            ]}
          />
        </CardToolbox>

        <Row gutter={15}>
          <Col md={24}>
            <Cards headless>
              <UserTableStyleWrapper>
                <div className="contact-table">
                  <TableWrapper className="table-responsive">
                    <Table
                      className="receipt-custom-table"
                      rowKey="id"
                      size="small"
                      dataSource={dataSource}
                      columns={columns}
                      fixed={true}
                      scroll={{ x: 800 }}
                      pagination={{
                        total: totalReceipts,
                        showSizeChanger: true,
                        pageSizeOptions: ["10", "50", "100", "500", "1000"],
                        onChange: (currentpage, limit) => {
                          changePageData(currentpage, limit);
                        },
                      }}
                    />
                  </TableWrapper>
                </div>
              </UserTableStyleWrapper>
            </Cards>
          </Col>
        </Row>

        <Modal
          title="Request a Report"
          visible={modalVisible}
          onOk={() => setModelVisible(false)}
          onCancel={() => setModelVisible(false)}
          width={600}
        >
          <Exportform />
        </Modal>
      </Main>
    </>
  );
};

export default Receipts;
