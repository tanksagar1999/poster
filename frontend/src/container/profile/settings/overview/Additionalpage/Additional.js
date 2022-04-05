import React, { useRef, useState, useEffect } from "react";
import { Table, Input, Modal } from "antd";
import { NavLink, useHistory } from "react-router-dom";
import { Cards } from "../../../../../components/cards/frame/cards-frame";
import { Popover } from "../../../../../components/popup/popup";
import FeatherIcon from "feather-icons-react";
import { CaretDownOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { SearchOutlined } from "@ant-design/icons";
import "../../setting.css";
import {
  getAllAddtionalChargeList,
  deleteAddtionalCharge,
} from "../../../../../redux/AddtionalCharge/actionCreator";

const Additional = () => {
  const offLineMode = useSelector((state) => state.auth.offlineMode);
  const [offLineModeCheck, setOfflineModeCheck] = useState(false);
  const [AddtionalChargeList, setAddtionalChargeList] = useState([]);
  const dispatch = useDispatch();
  let isMounted = useRef(true);
  let [search, setsearch] = useState("");
  const [modalDeleteVisible, setModelDeleteVisible] = useState(false);
  const [selectionType] = useState("checkbox");
  const history = useHistory();

  useEffect(() => {
    async function fetchAddtionalChargeList() {
      const getAddtionalChargeList = await dispatch(
        getAllAddtionalChargeList("sell")
      );
      if (
        isMounted.current &&
        getAddtionalChargeList &&
        getAddtionalChargeList.AddtionalChargeList
      )
        setAddtionalChargeList(getAddtionalChargeList.AddtionalChargeList);
    }
    if (isMounted.current) {
      fetchAddtionalChargeList();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);
  const [state, setState] = useState({
    item: AddtionalChargeList,
  });
  const deleteSelectedAddtionalCharge = async () => {
    const { allSelectedRowsForDelete } = state;
    let allAddtionalChargeIdsForDelete = [];
    allSelectedRowsForDelete.map((item) => {
      allAddtionalChargeIdsForDelete.push(item.id);
    });
    const getDeletedAddtionalCharge = await dispatch(
      deleteAddtionalCharge({ ids: allAddtionalChargeIdsForDelete })
    );
    if (
      getDeletedAddtionalCharge &&
      getDeletedAddtionalCharge.AddtionalChargeDeletedData &&
      !getDeletedAddtionalCharge.AddtionalChargeDeletedData.error
    ) {
      setModelDeleteVisible(false);
      const getAddtionalChargeList = await dispatch(
        getAllAddtionalChargeList()
      );
      setAddtionalChargeList(getAddtionalChargeList.AddtionalChargeList);
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
  let searchArrAddtionalCharge = AddtionalChargeList.filter((value) =>
    value.charge_name.toLowerCase().includes(search.toLowerCase())
  );

  if (searchArrAddtionalCharge.length)
    searchArrAddtionalCharge.map((value) => {
      const {
        _id,
        key,
        charge_name,
        charge_type,
        charge_value,
        tax_group,
        is_automatically_added,
      } = value;
      return dataSource.push({
        id: _id,
        additional_charge: charge_name,
        type: charge_type === "cash" ? "Cash" : "Percentage",
        value_chagre: charge_value,
        tax_group: tax_group.tax_group_name,
        is_automatically_added: is_automatically_added === true ? "Yes" : "No",
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
      width: "2%",
    },
    {
      title: "Additional Charge Name",
      dataIndex: "additional_charge",
      key: "additional_charge",
      fixed: "left",
      render(text, record) {
        return {
          children: <div style={{ color: "#008cba" }}>{text}</div>,
        };
      },
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Value",
      dataIndex: "value_chagre",
      key: "value_chagre",
      render(text, record) {
        return {
          children:
            record.type === "cash" ? <div>₹{text}</div> : <div>{text}%</div>,
        };
      },
    },
    {
      title: "Tax Group",
      dataIndex: "tax_group",
      key: "tax_group",
    },
    {
      title: "Is Automatically Added?",
      dataIndex: "is_automatically_added",
      key: "is_automatically_added",

      render(text, record) {
        return {
          props: {
            style: { textAlign: "left" },
          },
          children: <div>{text}</div>,
        };
      },
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
    <>
      <Cards
        title={
          <div style={{ boxShadow: "none", margin: "0 0 0 2px" }}>
            <Input
              className="set_serbt"
              suffix={<SearchOutlined />}
              autoFocus
              placeholder="Search by Name"
              style={{
                borderRadius: "30px",
                width: "250px",
              }}
              onChange={(e) => setsearch(e.target.value)}
              value={search}
            />
          </div>
        }
        isbutton={
          <NavLink
            to={offLineMode ? "#" : "/settings/additional-charges/add"}
            className="ant-btn ant-btn-primary ant-btn-md"
            style={{ color: "#FFF" }}
            onClick={() =>
              offLineMode
                ? setOfflineModeCheck(true)
                : setOfflineModeCheck(false)
            }
          >
            <FeatherIcon icon="plus" size={14} />
            Add Additional Charge
          </NavLink>
        }
      >
        <Modal
          title="You are Offline"
          visible={offLineModeCheck}
          onOk={() => setOfflineModeCheck(false)}
          onCancel={() => setOfflineModeCheck(false)}
          width={600}
        >
          <p>You are offline not add and update </p>
        </Modal>
        <Modal
          title="Confirm Delete"
          okText="Delete"
          visible={modalDeleteVisible}
          onOk={deleteSelectedAddtionalCharge}
          onCancel={handleCancel}
          width={600}
        >
          <p>Are you sure you want to delete selected addtional charges ?</p>
        </Modal>
        <Table
          rowKey="id"
          fixed={true}
          rowSelection={{
            type: selectionType,
            ...rowSelection,
          }}
          onRow={(row) => ({
            onClick: () =>
              offLineMode
                ? setOfflineModeCheck(true)
                : history.push(`/settings/additional-charges/add`, {
                    addtional_charge_id: row.id,
                  }),
          })}
          dataSource={dataSource}
          columns={columns}
          size="small"
          style={{ marginTop: "8px" }}
        />
      </Cards>
    </>
  );
};

export default Additional;
