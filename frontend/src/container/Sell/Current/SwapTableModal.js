import React, { useState, forwardRef, useImperativeHandle } from "react";
import ReactDOM from "react-dom";

import "./productEditModal.css";
import { Modal, Button, Form, Input, Radio, Select } from "antd";

import {
  createNewCartwithKeyandPush,
  setCartInfoFromLocalKey,
  removeCartFromLocalStorage,
  getTableStatusFromId,
} from "../../../utility/localStorageControl";

const SwapTableModal = forwardRef((props, ref) => {
  let {
    table_name,
    swapTableNameList,
    selectedProduct,
    setlocalCartInfo,
    setTableName,
    localCartInfo,
    customeTableList,
    registerData,
  } = props;
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  useImperativeHandle(ref, () => ({
    showModal() {
      setIsModalVisible(true);
    },
  }));

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const [value, setValue] = useState(1);

  const onSubmit = (values) => {
    removeCartFromLocalStorage(localCartInfo.cartKey);
    let tableDetails = swapTableNameList.find(
      (i) => i.swapTableName == values.table_name
    );

    let localCartInFoData = createNewCartwithKeyandPush(
      "custom-table-local",
      {
        tableName: values.table_name,
        tablekey: values.table_name.replace(/\s+/g, "-").toLowerCase(),
        swapTableCustum: tableDetails.swapCustum,
        index: tableDetails.this_index,
      },
      registerData
    );
    setlocalCartInfo(localCartInFoData);
    setTableName(values.table_name);
    let data = false;
    data = setCartInfoFromLocalKey(localCartInFoData.cartKey, [
      ...selectedProduct,
    ]);
    if (data) {
      setIsModalVisible(false);
    }
  };

  return (
    <>
      <Modal
        title={`Swap ${table_name}`}
        visible={isModalVisible}
        bodyStyle={{ paddingTop: 0 }}
        onOk={form.submit}
        onCancel={handleCancel}
        okText="Swap Table"
      >
        <Form
          autoComplete="off"
          style={{ width: "100%" }}
          form={form}
          onFinish={onSubmit}
          name="editProduct"
        >
          <Form.Item name="table_name" label="Swap to">
            <Select placeholder="Select a table to swap">
              {swapTableNameList != undefined &&
                swapTableNameList.map((val) => {
                  let status = getTableStatusFromId(
                    val.swapTableName.replace(/\s+/g, "-").toLowerCase(),
                    registerData
                  );
                  return (
                    <>
                      {status == "" && (
                        <Option value={val.swapTableName}>
                          {val.swapTableName}
                        </Option>
                      )}
                    </>
                  );
                })}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
});

export { SwapTableModal };
