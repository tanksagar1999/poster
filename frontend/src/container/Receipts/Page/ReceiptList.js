import React from 'react';
import { useSelector } from 'react-redux';
import { Row, Col, Table, Input, Button } from "antd";
import Icon from '@ant-design/icons';
import { SearchOutlined } from '@ant-design/icons';
import { UserTableStyleWrapper } from '../../style';
import './ReceiptList.css';
import { AutoComplete } from '../../../components/autoComplete/autoComplete';
import Heading from '../../../components/heading/heading';
import { Cards } from '../../../components/cards/frame/cards-frame';
import { TableWrapper, Main } from '../../styled';
import Highlighter from "react-highlight-words";
import { TopToolBox } from '../../style/Style';

const data = [
  {
    key: "1",
    receipt_numbr: "BL-BTU-2025-2996",
    created: "Mar 12, 2021, 4:17 PM",
    channel: "Zometo",
    customer_mobile: "988976888",
    fulfilled_status: "Fullfilled",
    payment_status: "Paid",
    total: "$273.00"
  },
  {
    key: "2",
    receipt_numbr: "TL-BTU-2025-2996",
    created: "Mar 12, 2021, 4:17 PM",
    channel: "Zometo",
    customer_mobile: "988976888",
    fulfilled_status: "Fullfilled",
    payment_status: "Paid",
    total: "$273.00"
  },
  {
    key: "3",
    receipt_numbr: "CL-BTU-2025-2996",
    created: "Mar 12, 2021, 4:17 PM",
    channel: "Zometo",
    customer_mobile: "988976888",
    fulfilled_status: "Fullfilled",
    payment_status: "Paid",
    total: "$273.00"
  },
  {
    key: "4",
    receipt_numbr: "EL-BTU-2025-2996",
    created: "Mar 12, 2021, 4:17 PM",
    channel: "Zometo",
    customer_mobile: "988976888",
    fulfilled_status: "Unfulfilled",
    payment_status: "Paid",
    total: "$273.00"
  },
  {
    key: "5",
    receipt_numbr: "EL-BTU-2025-2996",
    created: "Mar 12, 2021, 4:17 PM",
    channel: "Zometo",
    customer_mobile: "988976888",
    fulfilled_status: "Fullfilled",
    payment_status: "Paid",
    total: "$273.00"
  }
];

class ReceiptList extends React.Component {
  state = {
    sRT: "",
    dataSource: data,
    nameSearch: ""
  };

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters
    }) => (
      <div className="custom-filter-dropdown">
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => this.handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <SearchOutlined style={{ color: filtered ? "#BD025D" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text => (
      <Highlighter
        highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
        searchWords={[this.state.searchText]}
        autoEscape
        textToHighlight={text.toString()}
      />
    )
  });

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: "" });
  };




  render() {
    const columns = [
      {
        title: "Receipt Number",
        dataIndex: "receipt_numbr",
        key: "name",
        width: "30%",
        sorter: (a, b) => a.receipt_numbr.length - b.receipt_numbr.length,
        sortDirections: ['descend'],
        ...this.getColumnSearchProps("receipt_numbr")
      },
      {
        title: "Created At",
        dataIndex: "created",
        key: "created",
        width: "30%",
        sorter: (a, b) => a.created.length - b.created.length,
        sortDirections: ['descend'],
        ...this.getColumnSearchProps("created")
      },
      {
        title: "Channel",
        dataIndex: "channel",
        key: "channel",
        sorter: (a, b) => a.channel.length - b.channel.length,
        sortDirections: ['descend'],
        ...this.getColumnSearchProps("channel")
      },
      {
        title: "Customer Mobile",
        dataIndex: "customer_mobile",
        key: "Customer Mobile",
        sortDirections: ['descend'],
        sorter: (a, b) => a.customer_mobile.length - b.customer_mobile.length,
        ...this.getColumnSearchProps("customer_mobile")
      }
      ,
      {
        title: "Fulfillment Status",
        dataIndex: "fulfilled_status",
        key: "fulfilled_status",
        filters: [
          {
            text: 'Fulfilled',
            value: 'Fulfilled',
          },
          {
            text: 'Unfulfilled',
            value: 'Unfulfilled',
          }
        ],
        onFilter: (value, record) => record.fulfilled_status.indexOf(value) === 0,
        sorter: (a, b) => a.fulfilled_status.length - b.fulfilled_status.length,
        sortDirections: ['descend']
      },
      {
        title: "Payment Status",
        dataIndex: "payment_status",
        key: "payment_status",
        filters: [
          {
            text: 'Paid',
            value: 'Paid',
          },
          {
            text: 'Unpaid',
            value: 'Unpaid',
          }
        ],
        onFilter: (value, record) => record.payment_status.indexOf(value) === 0,
        sorter: (a, b) => a.payment_status.length - b.payment_status.length,
        sortDirections: ['descend']
      },
      {
        title: "Total",
        dataIndex: "total",
        key: "total",
        sortDirections: ['descend'],
        ...this.getColumnSearchProps("total")
      }
    ];

    const handleSearch = searchText => {
      const data = searchData.filter(value => value.title.toUpperCase().startsWith(searchText.toUpperCase()));
      setState({
        ...state,
        notData: data,
      });
    };

    return (
      <Cards headless>
        <Row gutter={15}>
          <Col md={24}>
            <TopToolBox>
              <Row gutter={15}>
                <Col xxl={5} lg={10} xs={24}>
                  <div className="table-search-box">
                    <AutoComplete width="100%" patterns />
                  </div>
                </Col>
                <Col xxl={15} lg={5} xs={24} />
              </Row>
            </TopToolBox>
          </Col>
          <Col md={24}>
            <TableWrapper className="table-seller table-responsive">
              <Table scroll={false} columns={columns} dataSource={this.state.dataSource} />;
            </TableWrapper>
          </Col>
        </Row>
      </Cards>

    )
  }
}


export default ReceiptList;
