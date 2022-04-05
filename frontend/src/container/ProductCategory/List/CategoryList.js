import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Table, Input, Modal, Progress } from "antd";
import { SearchOutlined, CaretDownOutlined } from "@ant-design/icons";
import FeatherIcon from "feather-icons-react";
import { Button } from "../../../components/buttons/buttons";
import { Popover } from "../../../components/popup/popup";
import { UserTableStyleWrapper } from "../../pages/style";
import { TableWrapper } from "../../styled";
import {
  getAllCategoriesList,
  deleteProductCategory,
} from "../../../redux/products/actionCreator";

const CategoryList = () => {
  const offLineMode = useSelector((state) => state.auth.offlineMode);
  const [offLineModeCheck, setOfflineModeCheck] = useState(false);
  const history = useHistory();
  let searchInput = useRef(null);
  let isMounted = useRef(true);
  let [categoryListData, setCategoryListData] = useState([]);
  const [selectionType] = useState("checkbox");
  const [modalDeleteVisible, setModelDeleteVisible] = useState(false);
  const dispatch = useDispatch();

  const [progress, setProgress] = useState(0);

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setProgress((oldProgress) => {
  //       if (oldProgress === 100) {
  //         return 0;
  //       }
  //       const diff = Math.random() * 10;
  //       return Math.min(oldProgress + diff, 100);
  //     });
  //   }, 100);

  //   return () => {
  //     clearInterval(timer);
  //   };
  // }, []);

  useEffect(() => {
    async function fetchCategoryList() {
      const getCategoryList = await dispatch(getAllCategoriesList("sell"));
      if (isMounted.current && getCategoryList && getCategoryList.categoryList)
        setCategoryListData(getCategoryList.categoryList);
    }
    if (isMounted.current) {
      fetchCategoryList();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  const [state, setState] = useState({
    item: categoryListData,
    searchText: "",
    searchProduct: "",
  });

  const { selectedRowKeys, item } = state;

  useEffect(() => {
    if (categoryListData) {
      setState({
        item: categoryListData,
        selectedRowKeys,
      });
    }
  }, [categoryListData, selectedRowKeys]);

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div className="custom-filter-dropdown">
        <Input
          ref={(node) => {
            searchInput = node;
          }}
          placeholder={`Search category name`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
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
          style={{ width: 90 }}
        >
          Search
        </Button>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#BD025D" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.select());
      }
    },
  });

  const handleSearch = (selectedKeys, confirm) => {
    confirm();
    setState({
      ...state,
      searchProduct: selectedKeys[0],
    });
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setState({
      ...state,
      searchProduct: "",
    });
  };

  const deleteSelectedProductCategory = async () => {
    const { allSelectedRowsForDelete } = state;
    let allProductCategoryIdsForDelete = [];
    allSelectedRowsForDelete.map((item) => {
      allProductCategoryIdsForDelete.push(item.id);
    });
    const getDeletedProductCategory = await dispatch(
      deleteProductCategory({ ids: allProductCategoryIdsForDelete })
    );
    if (
      getDeletedProductCategory &&
      getDeletedProductCategory.deletedItem &&
      !getDeletedProductCategory.deletedItem.error
    ) {
      setModelDeleteVisible(false);
      const getCategoryList = await dispatch(getAllCategoriesList());

      setCategoryListData(getCategoryList.categoryList);
      setState({
        ...state,
        selectedRows: [],
      });
    }
  };

  const contentforaction = (
    <>
      <NavLink to="#" onClick={() => setModelDeleteVisible(true)}>
        <FeatherIcon size={16} icon="book-open" />
        <span>Delete Selected item</span>
      </NavLink>
    </>
  );

  const dataSource = [];

  if (categoryListData.length > 0) {
    categoryListData.map((value, i) => {
      const { _id, category_name, sort_order } = value;
      return dataSource.push({
        id: _id,
        key: i,
        category_name: category_name,
        sort_order: sort_order,
      });
    });
  }

  const columns = [
    {
      title: (
        <>
          <Popover
            placement="bottomLeft"
            content={contentforaction}
            trigger="click"
          >
            <CaretDownOutlined style={{ marginLeft: "12px" }} />
          </Popover>
        </>
      ),
      key: "action",
      dataIndex: "action",
      width: "2%",
    },
    {
      title: "Product Category Name",
      dataIndex: "category_name",
      key: "category_name",

      className: "products_list_fix",
      ...getColumnSearchProps("category_name"),
      render(text, record) {
        return {
          children: <div style={{ color: "#008cba" }}>{text}</div>,
        };
      },
    },
    {
      title: (
        <>
          <span style={{ float: "left" }}>Sort Order</span>
        </>
      ),
      dataIndex: "sort_order",
      key: "sort_order",
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setState({
        ...state,
        allSelectedRowsForDelete: selectedRows,
      });
    },
  };
  const handleCancel = (e) => {
    setModelDeleteVisible(false);
  };
  return (
    <div>
      {!dataSource ? (
        <Progress
          style={{ marginTop: "60px" }}
          strokeColor={"red"}
          size="small"
          showInfo={false}
          percent={progress}
        />
      ) : (
        <>
          <Modal
            title="Confirm Delete"
            okText="Delete"
            visible={modalDeleteVisible}
            onOk={deleteSelectedProductCategory}
            onCancel={handleCancel}
            width={600}
          >
            <p>Are you sure you want to delete selected product categories ?</p>
          </Modal>
          <Modal
            title="You are Offline"
            visible={offLineModeCheck}
            onOk={() => setOfflineModeCheck(false)}
            onCancel={() => setOfflineModeCheck(false)}
            width={600}
          >
            <p>You are offline not add and update </p>
          </Modal>
          <TableWrapper className="table-responsive">
            <Table
              className="custom-tbl products_lsttable"
              rowSelection={{
                type: selectionType,
                ...rowSelection,
              }}
              onRow={(row) => ({
                onClick: () =>
                  offLineMode
                    ? setOfflineModeCheck(true)
                    : history.push(`product-categories/add`, {
                        product_category_id: row.id,
                      }),
              })}
              size="small"
              dataSource={dataSource}
              columns={columns}
              fixed={true}
              scroll={{ x: 800 }}
              pagination={{
                pageSize: 10,
                total: dataSource.length,
              }}
            />
          </TableWrapper>
        </>
      )}
    </div>
  );
};

export { CategoryList };
