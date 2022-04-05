import React, { useState, useEffect, useRef, useCallback } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
  Row,
  Col,
  Table,
  Input,
  Modal,
  Form,
  DatePicker,
  Radio,
  Select,
  Progress,
} from "antd";
import {
  CloseOutlined,
  DeleteOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import FeatherIcon from "feather-icons-react";
import { CardToolbox } from "./Style";
import { UserTableStyleWrapper } from "../pages/style";
import { PageHeader } from "../../components/page-headers/page-headers";
import { Main, TableWrapper } from "../styled";
import { Button } from "../../components/buttons/buttons";
import { Cards } from "../../components/cards/frame/cards-frame";
import { CalendarButtonPageHeader } from "../../components/buttons/calendar-button/calendar-button";
import { Popover } from "../../components/popup/popup";
import { useLocation } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

import "./petty.css";
import {
  addOrUpdatePatty,
  getAllPattyList,
  deletePatty,
  ExportPatty,
} from "../../redux/pattyCash/actionCreator";
import commonFunction from "../../utility/commonFunctions";
import { getAllPattyCashList } from "../../redux/customField/actionCreator";
import { getItem } from "../../utility/localStorageControl";
import tickSvg from "../../static/img/tick.svg";
const Patty = (props) => {
  const { pattyList, registerList, totalPatty } = useSelector(
    (state) => ({
      pattyList: state.pattycash.pattyList,
      registerList: state.register.RegisterList,
      totalPatty: state.pattycash.totalCounts,
    }),
    shallowEqual
  );
  const { Search } = Input;

  let searchInput = useRef(null);
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const inputfocus = useRef(null);

  let [search, setsearch] = useState("");
  const dispatch = useDispatch();
  const location = useLocation();
  const [modalVisible, setModelVisible] = useState(false);
  const [modalVisibleCancle, setModelVisibleCancle] = useState(false);
  const [modalVisibleDelete, setModelVisibleDelete] = useState(false);
  const [modalVisibleAdd, setModelVisibleAdd] = useState(false);
  const [pattyId, setPattyId] = useState(false);
  const [DateRanged, setDateRange] = useState("Today");
  let isMounted = useRef(true);
  const [startdate, setstartdate] = useState();
  const [Type, setType] = useState();
  const [endDate, setenddate] = useState();
  const [PattyCashList, setPattyCashList] = useState([]);
  const [TypeSelect, setTypeSelect] = useState("cash_out");
  const [modalVisibleAddEntry, setModalVisibleAddEntry] = useState(false);
  const [CheckedCategory, setCheckedCategory] = useState();
  const [categoryList, setCategotyList] = useState([]);
  const [requiredCategoryAndNotes, setRequiredCategoryAndNotes] = useState(
    true
  );

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    dispatch(getAllPattyList(1, 10));
  }, [getItem("setupCache").register.find((val) => val.active)._id]);
  useEffect(() => {
    async function fetchPattyCashList() {
      const getPattyCashList = await dispatch(getAllPattyCashList());
      if (
        isMounted.current &&
        getPattyCashList &&
        getPattyCashList.PattyCashList
      ) {
        let regId = getItem("setupCache").register.find((val) => val.active)
          ._id;
        getPattyCashList.PattyCashList.map((val) => {
          if (val.register_id == regId) {
          }
        });

        setPattyCashList(getPattyCashList.PattyCashList);
        let mappedCategoryArray = getPattyCashList.PattyCashList.map(
          (category) => {
            return {
              text: category.name,
              value: category.name,
            };
          }
        );
        mappedCategoryArray.push({
          text: "Petty Cash Out",
          value: "Petty Cash Out",
        });
        mappedCategoryArray.push({
          text: "Petty Cash In",
          value: "Petty Cash In",
        });

        setCategotyList(mappedCategoryArray);
      }
    }

    if (isMounted.current) {
      fetchPattyCashList();
    }
    return () => {
      isMounted.current = false;
    };
  }, [getItem("setupCache").register.find((val) => val.active)._id]);

  let emailData = localStorage.getItem("email_id");

  const onSubmit = useCallback(async (formData) => {
    const getAddedPatty = await dispatch(addOrUpdatePatty(formData));

    if (
      getAddedPatty &&
      getAddedPatty.PattyData &&
      !getAddedPatty.PattyData.error
    ) {
      dispatch(getAllPattyList());
      setCheckedCategory();
      setModelVisibleAdd(false);
      form.resetFields();
      setModalVisibleAddEntry(true);
    }
  }, []);
  useEffect(() => {
    if (modalVisibleAdd) {
      setRequiredCategoryAndNotes(true);
    }
    if (inputfocus.current) {
      const { input } = inputfocus.current;
      input.focus();
    }
  }, [modalVisibleAdd]);

  const content = (
    <>
      <NavLink
        to="#"
        onClick={() => {
          setModelVisible(true);
          setType("PDF");
        }}
      >
        <FeatherIcon size={16} icon="book-open" />
        <span>PDF</span>
      </NavLink>
      <NavLink
        to="#"
        onClick={() => {
          setModelVisible(true);
          setType("XLSX");
        }}
      >
        <FeatherIcon size={16} icon="x" />
        <span>Excel (XLSX)</span>
      </NavLink>
      <NavLink
        to="#"
        onClick={() => {
          setModelVisible(true);
          setType("CSV");
        }}
      >
        <FeatherIcon size={16} icon="file" />
        <span>CSV</span>
      </NavLink>
    </>
  );

  const dataSource = [];

  let searchArrPatty = pattyList.filter((value) => {
    return value.notes.toLowerCase().includes(search.toLowerCase());
  });

  if (searchArrPatty.length)
    searchArrPatty.map((value) => {
      const {
        _id,
        created_at,
        amount,
        type,
        notes,
        user_id,
        status,
        category,
        register_id,
      } = value;

      return dataSource.push({
        id: _id,
        Date: commonFunction.convertToDate(created_at, "MMM DD, Y, h:mm A"),
        Amount: amount,
        Type: type === "cash_in" ? "Cash In" : "Cash Out",
        Category: category
          ? category.name
          : type === "cash_in"
          ? "Petty Cash In"
          : "Petty Cash Out",
        Notes: notes,
        User: user_id ? user_id.username : "",
        status: status,
        register_id: register_id._id,
      });
    });

  const columns = [
    {
      title: "Date",
      dataIndex: "Date",
      key: "Date",
      fixed: "left",
      width: "25%",
      render(text, record) {
        return {
          children:
            record.status === "cancelled" ? (
              <div style={{ textDecoration: "line-through" }}>{text}</div>
            ) : (
              <div>{text}</div>
            ),
        };
      },
    },
    {
      title: "Amount",
      dataIndex: "Amount",
      key: "Amount",
      render(text, record) {
        return {
          children:
            record.status === "cancelled" ? (
              <div style={{ textDecoration: "line-through" }}>
                {record.Type === "Cash In"
                  ? `+₹${record.Amount}`
                  : `-₹${record.Amount}`}
              </div>
            ) : (
              <div>
                {record.Type === "Cash In"
                  ? `+₹${record.Amount}`
                  : `-₹${record.Amount}`}
              </div>
            ),
        };
      },
    },
    {
      title: "Type",
      dataIndex: "Type",
      key: "Type",
      filters: [
        {
          text: "Cash In",
          value: "Cash In",
        },
        {
          text: "Cash Out",
          value: "Cash Out",
        },
      ],
      onFilter: (value, record) => record.Type.indexOf(value) === 0,
      render(text, record) {
        return {
          children:
            record.status === "cancelled" ? (
              <div style={{ textDecoration: "line-through" }}> {text}</div>
            ) : (
              <div>{text}</div>
            ),
        };
      },
    },
    {
      title: "Category",
      dataIndex: "Category",
      key: "Category",
      filters: categoryList,
      onFilter: (value, record) => record.Category.indexOf(value) === 0,
      render(text, record) {
        return {
          children:
            record.status === "cancelled" ? (
              <div style={{ textDecoration: "line-through" }}> {text}</div>
            ) : (
              <div>{text}</div>
            ),
        };
      },
    },
    {
      title: "Note",
      dataIndex: "Notes",
      key: "Notes",
      className: "text123",
      render(text, record) {
        return {
          children:
            record.status === "cancelled" ? (
              <div style={{ textDecoration: "line-through" }}> {text}</div>
            ) : (
              <div>{text}</div>
            ),
        };
      },
    },
    {
      title: "User",
      dataIndex: "User",
      key: "User",
      render(text, record) {
        return {
          children:
            record.status === "cancelled" ? (
              <div style={{ textDecoration: "line-through" }}> {text}</div>
            ) : (
              <div>{text}</div>
            ),
        };
      },
    },
    {
      title: "",
      width: "10%",
      render(text, record) {
        return {
          props: {
            style: { textAlign: "center" },
          },
          children: (
            <div>
              {record.status !== "cancelled" ? (
                <span>
                  <CloseOutlined
                    style={{
                      cursor: "pointer",
                    }}
                    onClick={showModal.bind("", record.id)}
                  />
                </span>
              ) : (
                <div>
                  <span>
                    <DeleteOutlined
                      style={{
                        cursor: "pointer",
                      }}
                      onClick={showModalDelete.bind("", record.id)}
                    />
                  </span>
                </div>
              )}
            </div>
          ),
        };
      },
    },
  ];

  const submitExport = (values) => {
    values.type = Type;
    if (DateRanged === "custom") {
      values.endDate = endDate;
      values.startDate = startdate;
      dispatch(ExportPatty(values));
      setModelVisible(false);
    } else {
      dispatch(ExportPatty(values));
      setModelVisible(false);
    }
  };
  const showModal = (id) => {
    if (id && id !== "") {
      setModelVisibleCancle(true);
      setPattyId(id);
    }
  };

  const showModalDelete = (id) => {
    if (id && id !== "") {
      setModelVisibleDelete(true);
      setPattyId(id);
    }
  };

  const CancleEntry = async () => {
    if (pattyId) {
      let Obj = { status: "cancelled" };

      const getCanclledPatty = await dispatch(addOrUpdatePatty(Obj, pattyId));
      if (
        getCanclledPatty &&
        getCanclledPatty.PattyData &&
        !getCanclledPatty.PattyData.error
      ) {
        dispatch(getAllPattyList());
        setModelVisibleCancle(false);
      }
    }
  };

  const DeletePatty = async () => {
    if (pattyId) {
      const getDeletePatty = await dispatch(deletePatty(pattyId));

      dispatch(getAllPattyList());
      setModelVisibleDelete(false);
    }
  };

  let changePageData = async (value, limit) => {
    await dispatch(getAllPattyList(value, limit));
  };
  return (
    <>
      {!dataSource ? (
        <Progress
          style={{ marginTop: "64px" }}
          color="secondary"
          variant="determinate"
          value={progress}
        />
      ) : (
        <Main>
          <CardToolbox>
            <PageHeader
              ghost
              className="receipts-top0"
              subTitle={
                <>
                  <div className="table_titles">
                    <h2>Petty Cash</h2>
                    <span className="title-counter">{totalPatty} Petty</span>
                  </div>

                  <div
                    style={{ boxShadow: "none", marginLeft: "10px" }}
                    className="search_lrm"
                  >
                    <Input
                      suffix={<SearchOutlined />}
                      autoFocus
                      placeholder="Search by Notes"
                      style={{
                        borderRadius: "30px",
                        width: "250px",
                      }}
                      onChange={(e) => setsearch(e.target.value)}
                    />
                  </div>
                </>
              }
              buttons={[
                <div key="1" className="page-header-actions">
                  <CalendarButtonPageHeader key="1" type="patty" />
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

                  <Button
                    size="small"
                    type="primary"
                    className="ant-btn ant-btn-primary ant-btn-md"
                    onClick={() => setModelVisibleAdd(true)}
                  >
                    <FeatherIcon icon="plus" size={14} />
                    Add Petty Cash
                  </Button>
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
                        rowKey="id"
                        size="small"
                        dataSource={dataSource}
                        columns={columns}
                        fixed={true}
                        scroll={{ x: 800 }}
                        className="text-inherit"
                        // pagination={{
                        //   total: dataSource.length,
                        //   showSizeChanger: true,
                        //   pageSizeOptions: ["10", "50", "100", "500", "1000"],
                        // }}
                        pagination={{
                          total: totalPatty,
                          // pageSize: sizeOfData,
                          // current: changePage,
                          onChange: (currentpage, size) => {
                            changePageData(currentpage, size);
                            // setChangePage(currentpage);
                            // setSize(size);
                          },
                          showSizeChanger: totalPatty > 10 ? true : false,
                          onShowSizeChange: (current, size) =>
                            changePageData(current, size),
                        }}
                      />
                    </TableWrapper>
                  </div>
                </UserTableStyleWrapper>
              </Cards>
            </Col>
          </Row>
          <Modal
            title="Confirm Delete"
            okText="Delete Entry"
            visible={modalVisibleDelete}
            onOk={DeletePatty}
            onCancel={() => setModelVisibleDelete(false)}
            width={600}
          >
            <p>
              Deleting the entry will permanently remove it and will no longer
              appear on reports. Are you sure you want to proceed?
            </p>
          </Modal>

          <Modal
            title="Confirm Cancellation"
            okText="Cancel Entry"
            visible={modalVisibleCancle}
            onOk={CancleEntry}
            onCancel={() => setModelVisibleCancle(false)}
            width={600}
          >
            <p>Are you sure you want to cancel this entry ?</p>
          </Modal>
          <Modal
            title="Add Entry"
            visible={modalVisibleAddEntry}
            onOk={() => setModalVisibleAddEntry(false)}
            onCancel={() => setModalVisibleAddEntry(false)}
            width={600}
          >
            <p>
              Entry added successfully. You can view the entry once it's synced.
            </p>
          </Modal>

          <Modal
            title="Request a Report"
            visible={modalVisible}
            onOk={form1.submit}
            onCancel={() => setModelVisible(false)}
            width={600}
          >
            <div>
              <Form
                style={{ width: "100%" }}
                name="Export"
                form={form1}
                onFinish={submitExport}
              >
                <div className="add-product-block">
                  <div className="add-product-content">
                    <Form.Item
                      initialValue="today"
                      label="Date Range"
                      name="dateRange"
                    >
                      <Select
                        name="report"
                        style={{ width: "100%" }}
                        onChange={(value) => setDateRange(value)}
                      >
                        <Option value="today">Today </Option>
                        <Option value="yesterday">Yesterday</Option>
                        <Option value="this_month">This Month</Option>
                        <Option value="last_month">Last Month</Option>
                        <Option value="custom">Custom selection</Option>
                      </Select>
                    </Form.Item>
                    {DateRanged === "custom" ? (
                      <div>
                        <Form.Item
                          label="start"
                          style={{
                            display: "inline-block",
                            width: "calc(50% - 12px)",
                          }}
                        >
                          <DatePicker
                            style={{ height: "35px" }}
                            placeholder="dd-mm-yyyy"
                            format="DD/MM/YYYY"
                            onChange={(date, datestring) =>
                              setstartdate(datestring)
                            }
                          />
                        </Form.Item>
                        <Form.Item
                          label="end"
                          style={{
                            display: "inline-block",
                            width: "calc(50% - 12px)",
                          }}
                        >
                          <DatePicker
                            onChange={(date, datestring) =>
                              setenddate(datestring)
                            }
                            style={{ height: "35px" }}
                            placeholder="dd-mm-yyyy"
                            format="DD/MM/YYYY"
                          />
                        </Form.Item>
                      </div>
                    ) : (
                      ""
                    )}

                    <Form.Item
                      name="register"
                      label="Choose A Register"
                      initialValue="All"
                    >
                      <Select name="report" style={{ width: "100%" }}>
                        <Option value="All">All Registers </Option>
                        {registerList.map((data) => {
                          return (
                            <Option value={data._id}>
                              {data.register_name}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      name="email"
                      label="Send to Email Address"
                      initialValue={emailData}
                      rules={[
                        {
                          required: true,
                          message: "Please enter your email",
                        },
                        { type: "email", message: "A valid email is required" },
                      ]}
                    >
                      <Input placeholder="Report will be send to this email" />
                    </Form.Item>
                  </div>
                </div>
              </Form>
            </div>
          </Modal>

          <Modal
            title="Add Entry"
            visible={modalVisibleAdd}
            onOk={form.submit}
            bodyStyle={{ paddingTop: 0 }}
            onCancel={() => {
              setCheckedCategory();
              setModelVisibleAdd(false);
              form.resetFields();
            }}
            width={600}
            okText={TypeSelect === "cash_out" ? "Add Cash Out" : "Add Cash In"}
          >
            <div>
              <Form
                style={{ width: "100%" }}
                name="addPatty"
                form={form}
                onFinish={onSubmit}
              >
                <div className="add-product-block">
                  <div className="add-product-content">
                    <Form.Item name="type" label="Type" initialValue="cash_out">
                      <Radio.Group
                        style={{ marginBottom: 10 }}
                        onChange={(e) => setTypeSelect(e.target.value)}
                      >
                        <Radio value="cash_out">Cash Out</Radio>
                        <Radio value="cash_in">Cash In</Radio>
                      </Radio.Group>
                    </Form.Item>
                    <Form.Item
                      name="amount"
                      label="Amount"
                      rules={[
                        {
                          pattern: new RegExp(
                            /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/
                          ),
                          message: "Amount should be a positive number.",
                        },
                        {
                          message: "Amount required",
                          required: true,
                        },
                      ]}
                    >
                      <Input
                        ref={inputfocus}
                        type="number"
                        min={0}
                        step="any"
                        initialValue={0}
                        placeholder="Amount"
                        onKeyPress={(event) => {
                          if (event.key.match("[0-9,.]+")) {
                            return true;
                          } else {
                            return event.preventDefault();
                          }
                        }}
                      />
                    </Form.Item>
                    {PattyCashList.length > 0 ? (
                      <Form.Item
                        label="Category"
                        name="category"
                        rules={[
                          {
                            message: requiredCategoryAndNotes
                              ? "Notes / Category required"
                              : null,
                            required: requiredCategoryAndNotes,
                          },
                        ]}
                      >
                        <fieldset
                          id="group1"
                          onChange={(e) => {
                            setCheckedCategory(e.target.value);
                            setRequiredCategoryAndNotes(false);
                          }}
                        >
                          {PattyCashList.map((data, index) => {
                            return (
                              <div className="custom-radio custom-checkbox">
                                <input
                                  type="radio"
                                  value={data._id}
                                  name="group1"
                                  id={`radio9${index}`}
                                />
                                <label for={`radio9${index}`}>
                                  <span>
                                    {CheckedCategory === data._id ? (
                                      <img
                                        src={tickSvg}
                                        alt=""
                                        width="13px"
                                        style={{ marginRight: "2px" }}
                                      />
                                    ) : (
                                      ""
                                    )}{" "}
                                    {data.name}
                                  </span>
                                </label>
                              </div>
                            );
                          })}
                        </fieldset>
                      </Form.Item>
                    ) : (
                      ""
                    )}

                    <Form.Item
                      name="notes"
                      label="Notes"
                      onChange={(e) => {
                        if (e.target.value != "") {
                          setRequiredCategoryAndNotes(false);
                        } else {
                          setRequiredCategoryAndNotes(true);
                        }
                      }}
                      rules={[
                        {
                          max: 140,
                          message:
                            "Note cannot be more than 140 characters long.",
                        },
                        {
                          message: "Notes / Category required",
                          required: requiredCategoryAndNotes,
                        },
                      ]}
                    >
                      <Input placeholder="Notes" autoComplete="off" />
                    </Form.Item>
                  </div>
                </div>
              </Form>
            </div>
          </Modal>
        </Main>
      )}
    </>
  );
};

export default Patty;
