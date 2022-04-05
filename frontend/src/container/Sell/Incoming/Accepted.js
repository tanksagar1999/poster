import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useRouteMatch, withRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Table, Input, Checkbox, Radio, Tag } from "antd";
import { SearchOutlined } from '@ant-design/icons';
import FeatherIcon from 'feather-icons-react';
import { Main, TableWrapper } from '../../styled';
import { Button } from '../../../components/buttons/buttons';
import '../sell.css';
import { variant } from '../../../demoData/incoming.json';


const Accepted = props => {

  const { path } = useRouteMatch();
  let searchInput = useRef(null);
  const [searchVal, setSearchVal] = useState(null);
  const dispatch = useDispatch();
  const { Search } = Input;

  const { products, searchProduct } = useSelector(state => {
    return {
      products: state.products.productData,
      //filteredData: state.products.filteredData,
      searchProduct: state.products.searchProduct,
    };
  });

  const [state, setState] = useState({
    item: variant,
    searchText: "",
    searchProduct: ""
  });

  const [modalVisible, setModelVisible] = useState(false);

  const { selectedRowKeys, item } = state;

  useEffect(() => {
    if (variant) {
      setState({
        item: variant,
        selectedRowKeys,

      });
    }
  }, [products, selectedRowKeys]);

  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters
    }) => (
      <div className="custom-filter-dropdown">
        <Input
          ref={node => {
            searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
        </Button>
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90 }}
        >
          Search
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
        setTimeout(() => searchInput.select());
      }
    },

  });

  const handleSearch = (selectedKeys, confirm) => {
    confirm();
    setState({
      ...state,
      searchProduct: selectedKeys[0]
    });
  };

  const handleReset = clearFilters => {
    clearFilters();
    setState({
      ...state,
      searchProduct: "",
    });
  };

  const handleSearchGlobal = e => {
    dispatch(headerGlobalSearchActionProduct(e.target.value));
  };

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


  const contentforaction = (
    <>
      <NavLink to="#">
        <FeatherIcon size={16} icon="book-open" />
        <span>Delete Selected item</span>
      </NavLink>

    </>
  );

  const dataSource = [];
  if (products.length)
    item.map(value => {
      const { id, Source, order_id, Time, Items, Value, Type, Customer } = value;
      return dataSource.push({
        id: id,
        action: (
          <div>
            <Button type="success" size="medium" className="incoming-data-btn"  > Accpet</Button>

          </div>
        ),
        Source: Source,
        order_id: order_id,
        Value: Value,
        Time: Time,
        Items: (
          <div>
            <Tag color="blue">Dragon Soup 1/2</Tag>
            <Tag color="gold">Chivas Regal(12Y0)</Tag>
            <Tag color="geekblue">Chicken Biryani Half</Tag>
          </div>
        ),
        Type: Type,
        Customer: Customer,


      });
    });

  let lastIndex = 0
  const updateIndex = () => {
    lastIndex++
    return lastIndex
  }
  const columns = [

    {
      title: "Action",
      dataIndex: "action",
      key: 'action',
    },
    {
      title: "Source",
      dataIndex: "Source",
      key: 'source',
      onFilter: (value, record) => record.channel.includes(value),
      filters: [
        {
          text: 'Zometo',
          value: 'Zometo',
        },
        {
          text: 'Swiggi',
          value: 'Swiggi',
        }
      ],
    },
    {
      title: "Time",
      dataIndex: "Time",
      key: 'Time',
    },
    {
      title: "Order ID",
      dataIndex: "order_id",
      key: 'order_id',
      width: '15%'
    },
    {
      title: "Items",
      dataIndex: "Items",
      key: 'Items',
    },
    {
      title: 'Value',
      dataIndex: 'Value',
      key: 'Value',
    },
    {
      title: 'Type',
      dataIndex: 'Type',
      key: 'Type',
    },
    {
      title: 'Customer',
      dataIndex: 'Customer',
      key: 'Customer',
    },
  ];

  const onSelectChange = selectedRowKey => {
    setState({ ...state, selectedRowKeys: selectedRowKey });
  };


  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const nextPath = path => {
    history.push(path);
  };

  return (
    <div>
      <TableWrapper className="table-seller table-responsive">
        <Table
          rowKey='id'
          size="small"
          className="seller-table"
          dataSource={dataSource}
          columns={columns}
          pagination={{ pageSize: 10, showSizeChanger: true, total: dataSource.length }}
        />
      </TableWrapper>
    </div>


  );
};

export { Accepted };

