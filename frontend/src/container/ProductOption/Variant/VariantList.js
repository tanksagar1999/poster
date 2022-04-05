import React, { useState, useEffect, useRef } from "react";
import { NavLink, useRouteMatch } from "react-router-dom";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { Row, Col, Table, Input, Modal, Button, Form, Progress } from "antd";
import {
  SearchOutlined,
  ImportOutlined,
  CaretDownOutlined,
} from "@ant-design/icons";
import FeatherIcon from "feather-icons-react";
import { TableWrapper } from "../../styled";
import { Popover } from "../../../components/popup/popup";
import { Cards } from "../../../components/cards/frame/cards-frame";
import "../option.css";
import { TopToolBox } from "../Style";
import { useHistory } from "react-router-dom";
import { getItem } from "../../../utility/localStorageControl";
import {
  getAllVariantList,
  deleteVariant,
  ExportVariant,
} from "../../../redux/variant/actionCreator";
import { UserTableStyleWrapper } from "../../pages/style";

const VariantListData = (props) => {
  let searchInput = useRef(null);
  const dispatch = useDispatch();
  let [search, setSearch] = useState("");
  const history = useHistory();
  const [selectionType] = useState("checkbox");
  const [form] = Form.useForm();

  const { variantList, searchText, mainVariantList } = useSelector(
    (state) => ({
      searchText: state.variant.searchText,
      mainVariantList: state.variant.mainVariantList,
      variantList: state.variant.variantList,
    }),
    shallowEqual
  );

  const [state, setState] = useState({
    item: variantList,
    searchText: "",
    searchProduct: "",
  });

  const [modalVisible, setModelVisible] = useState(false);
  const [modalDeleteVisible, setModelDeleteVisible] = useState(false);

  const [ExportType, SetExportType] = useState("");

  const { selectedRowKeys } = state;

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    dispatch(getAllVariantList("sell"));
  }, []);

  useEffect(() => {
    if (variantList) {
      setState({
        item: variantList,
        selectedRowKeys,
      });
    }
  }, [variantList, selectedRowKeys]);

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
          placeholder={`Search ${dataIndex}`}
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
    searchText: selectedKeys[0];
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    searchText: "";
  };

  const onSubmit = (values) => {
    values.type = ExportType;
    dispatch(ExportVariant(values));
    setModelVisible(false);
  };

  const handleCancel = (e) => {
    setModelVisible(false);
    setModelDeleteVisible(false);
  };

  const deleteSelectedvariant = async () => {
    const { allSelectedRowsForDelete } = state;
    let allvariantdsForDelete = [];
    if (allSelectedRowsForDelete && allSelectedRowsForDelete.length > 0) {
      allSelectedRowsForDelete.map((item) => {
        allvariantdsForDelete.push(item.id);
      });

      const getDeletedVariant = await dispatch(
        deleteVariant({ ids: allvariantdsForDelete })
      );
      if (
        getDeletedVariant &&
        getDeletedVariant.deletedItem &&
        !getDeletedVariant.deletedItem.error
      ) {
        setModelDeleteVisible(false);
        dispatch(getAllVariantList());
        setState({
          ...state,
          selectedRows: [],
        });
      }
    }
  };
  let email = localStorage.getItem("email_id");

  const content = (
    <>
      <NavLink
        to="#"
        onClick={() => {
          setModelVisible(true);
          SetExportType("PDF");
        }}
      >
        <FeatherIcon size={16} icon="book-open" />
        <span>PDF</span>
      </NavLink>
      <NavLink
        to="#"
        onClick={() => {
          setModelVisible(true);
          SetExportType("XLSX");
        }}
      >
        <FeatherIcon size={16} icon="x" />
        <span>Excel (XLSX)</span>
      </NavLink>
      <NavLink
        to="#"
        onClick={() => {
          setModelVisible(true);
          SetExportType("CSV");
        }}
      >
        <FeatherIcon size={16} icon="file" />
        <span>CSV</span>
      </NavLink>
    </>
  );

  const contentforaction = (
    <>
      <NavLink to="#" onClick={() => setModelDeleteVisible(true)}>
        <FeatherIcon size={16} icon="book-open" />
        <span>Delete Selected item</span>
      </NavLink>
    </>
  );

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setState({
        ...state,
        allSelectedRowsForDelete: selectedRows,
      });
    },
  };

  let searchArr = mainVariantList.filter((value) =>
    value.variant_name.toLowerCase().includes(search.toLowerCase())
  );

  const dataSource = [];

  if (variantList.length)
    searchArr.map((value, i) => {
      const {
        _id,
        variant_name,
        comment,
        price,
        sort_order,
        is_linked_to_variant_group,
      } = value;
      return dataSource.push({
        id: _id,
        key: i,
        variant_name: variant_name,
        comment: comment,
        price: price,
        sort_order: sort_order,
        is_linked_to_variant_group: is_linked_to_variant_group,
      });
    });

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
      align: "center",
      width: "4%",
    },
    {
      title: "Variant Name",
      dataIndex: "variant_name",
      key: "variant_name",
      fixed: "left",
      className: "products_list_fix",
      render(text, record) {
        return {
          children: <div style={{ color: "#008cba" }}>{text}</div>,
        };
      },
    },
    {
      title: "Variant Price",
      dataIndex: "price",
      key: "price",
      align: "left",
      sorter: (a, b) => a.price - b.price,
      render: (data, record) => "₹" + record.price,
    },
    {
      title: "Variant Comment",
      dataIndex: "comment",
      key: "comment",
      align: "left",
    },
    {
      title: "Is Linked To A Variant Group?",
      dataIndex: "is_linked_to_variant_group",
      key: "is_linked_to_variant_group",
      align: "left",
    },
  ];

  return (
    <>
      {!dataSource ? (
        <Progress
          style={{ marginTop: "60px" }}
          strokeColor={"red"}
          size="small"
          showInfo={false}
          percent={progress}
        />
      ) : (
        <Row gutter={25}>
          <Col md={24} xs={24}>
            <Cards headless>
              <TopToolBox>
                <Row gutter={15} className="list-row">
                  <Col lg={14} xs={24}>
                    <div className="table_titles">
                      <h2>Varints</h2>
                      <span className="title-counter center_txcs">
                        {variantList.length} Variants{" "}
                      </span>
                      <div className="sercTable">
                        <Input
                          suffix={<SearchOutlined />}
                          placeholder="Search by Name"
                          autoFocus
                          style={{
                            borderRadius: "30px",
                            width: "250px",
                          }}
                          onChange={(e) => setSearch(e.target.value)}
                          value={search}
                        />
                      </div>
                    </div>
                  </Col>

                  <Col xxl={1} lg={1} xs={1}></Col>
                  <Col xxl={7} lg={9} xs={24}>
                    <div
                      className="table-toolbox-menu"
                      style={{ float: "right" }}
                    >
                      <div key="1" className="page-header-actions">
                        <NavLink
                          to="product-options/variant/import"
                          className="ant-btn ant-btn-white ant-btn-md"
                        >
                          <ImportOutlined /> Import
                        </NavLink>
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
                        <NavLink
                          to="product-options/variant/add"
                          className="ant-btn ant-btn-primary ant-btn-md"
                        >
                          <FeatherIcon
                            icon="plus"
                            size={16}
                            className="pls_iconcs"
                          />
                          Add Variant
                        </NavLink>
                      </div>
                    </div>
                  </Col>
                </Row>
              </TopToolBox>
              <UserTableStyleWrapper>
                <div className="contact-table">
                  <TableWrapper className="table-responsive">
                    <Table
                      rowKey="id"
                      className="products_lsttable"
                      rowSelection={{
                        type: selectionType,
                        ...rowSelection,
                      }}
                      onRow={(row) => ({
                        onClick: () =>
                          history.push(
                            `product-options/variant/edit/` + row.id
                          ),
                      })}
                      size="small"
                      dataSource={dataSource}
                      columns={columns}
                      fixed={true}
                      scroll={{ x: 800 }}
                      pagination={{
                        showSizeChanger: true,
                        total: dataSource.length,
                        pageSizeOptions: ["10", "50", "100", "500", "1000"],
                      }}
                    />
                  </TableWrapper>
                </div>
              </UserTableStyleWrapper>
            </Cards>
            <Modal
              title="Confirm Delete"
              okText="Delete"
              visible={modalDeleteVisible}
              onOk={deleteSelectedvariant}
              onCancel={handleCancel}
              width={600}
            >
              <p>Are you sure you want to delete selected variants ?</p>
            </Modal>
            <Modal
              title="Export Variants"
              visible={modalVisible}
              onOk={form.submit}
              onCancel={handleCancel}
              width={600}
            >
              <Form form={form} name="export_variant" onFinish={onSubmit}>
                <div className="add-product-block">
                  <div className="add-product-content">
                    <Form.Item
                      name="email"
                      label="Send to Email Address"
                      initialValue={email}
                      rules={[
                        {
                          message: "Email address is required",
                          required: true,
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </div>
                </div>
              </Form>
            </Modal>
          </Col>
        </Row>
      )}
    </>
  );
};

export { VariantListData };
