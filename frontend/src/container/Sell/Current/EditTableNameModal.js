import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
} from "react";

import "./productEditModal.css";
import { Modal, Button, Form, Input, Radio, Checkbox } from "antd";
import { getProductById } from "../../../redux/products/actionCreator";
import { CheckOutlined, ConsoleSqlOutlined } from "@ant-design/icons";
import {
  updateTableNameFromCartId,
  removeCartFromLocalStorage,
  getCartInfoLocalListsData,
  createNewCartwithKeyandPush,
  setCartInfoFromLocalKey,
  removeItem,
  getItem,
} from "../../../utility/localStorageControl";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { INCREMENT, DECREMENT } from "../../../redux/draft/actionCreator";

const EditTableNameModal = forwardRef((props, ref) => {
  const {
    cartDetails,
    updateInfoLocalListsData,
    redirectToCurrent,
    redirectToCurrentFunction,
    setSelectedProduct,
    setCartInfoLocalListsData,
    setlocalCartInfo,
    setTableName,
    modelVisible,
    modelVisibleValue,
    activeTab,
    localCartInfo,
    finalTotal,
    registerData,
    setselectedTable,
    selectedProduct,
    setBulkDiscount,
    setBulkValue,
    setBulkDiscountType,
    setAddtionalChargeList,
    setCustomer,
    setCustomerData,
    setBulckDisountDetails,
    setBulckDiscontButtonText,
    fetchAllAddtionalcharge,
  } = props;

  const dispatch = useDispatch();

  const exampleInput = useRef();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (exampleInput.current) {
      exampleInput.current.focus();
    }
  }, [exampleInput]);

  const currentRegisterData = useSelector((state) =>
    state.register.RegisterList.find((val) => val.active)
  );

  useEffect(() => {
    if (isModalVisible) {
      form.setFieldsValue({
        tableName: cartDetails?.tableName
          ? cartDetails?.tableName
          : localCartInfo && localCartInfo.tableName
          ? localCartInfo.tableName
          : "",
      });
    }

    setRemoveClick(false);
  }, [isModalVisible, modelVisibleValue]);

  useImperativeHandle(ref, () => ({
    showModal(value) {
      setIsModalVisible(true);

      modelVisible && modelVisible(true);
    },
    hideModal() {
      setIsModalVisible(false);
      modelVisible && modelVisible(false);
    },
  }));

  const setTableNameModal = (e) => {
    form.setFieldsValue({
      tableName: e.target.value ? e.target.value : "",
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    modelVisible && modelVisible(false);
  };

  const onSubmit = (formData) => {
    if (
      localCartInfo != null &&
      Object.keys(localCartInfo).length &&
      localCartInfo.darftDetalisUpdate &&
      selectedProduct &&
      Object.keys(cartDetails).length == 0
    ) {
      setCartInfoFromLocalKey(
        localCartInfo?.cartKey,
        [...selectedProduct],
        true,
        formData
      );

      setlocalCartInfo({});
      removeItem("active_cart");
      setBulkDiscount(0);
      setBulkValue(0);
      setselectedTable();
      setBulkDiscountType("FLAT");
      let localData = getItem("setupCache");
      fetchAllAddtionalcharge();
      setCustomer("Add Customer");
      setCustomerData(null);
      fetchAllAddtionalcharge();
    } else if (
      selectedProduct?.length == 0 &&
      Object.keys(cartDetails).length == 0
    ) {
      createNewCartwithKeyandPush(
        "DRAFT_CART",
        [...selectedProduct],
        registerData,
        formData
      );
      setselectedTable("");
      setlocalCartInfo({});
      removeItem("active_cart");
      setBulkDiscount(0);
      setBulkValue(0);
      setselectedTable();
      setCustomer("Add Customer");
      setCustomerData(null);
      setBulkDiscountType("FLAT");
      let localData = getItem("setupCache");
      setBulckDisountDetails({
        click: false,
        type: "FLAT",
        value: 0,
      });
      setBulckDiscontButtonText({
        text: "Bulk discount",
        color: "#008cba",
        discountValue: 0,
      });
      fetchAllAddtionalcharge();
    } else if (selectedProduct && Object.keys(cartDetails).length == 0) {
      setCartInfoFromLocalKey(
        localCartInfo?.cartKey,
        [...selectedProduct],
        true,
        formData
      );
      setselectedTable("");
      setlocalCartInfo({});
      removeItem("active_cart");
      setBulkDiscount(0);
      setBulkValue(0);
      setselectedTable();
      setCustomer("Add Customer");
      setCustomerData(null);
      setBulkDiscountType("FLAT");
      setBulckDisountDetails({
        click: false,
        type: "FLAT",
        value: 0,
      });
      setBulckDiscontButtonText({
        text: "Bulk discount",
        color: "#008cba",
        discountValue: 0,
      });
      let localData = getItem("setupCache");
      fetchAllAddtionalcharge();
    }

    if (formData?.tableName && cartDetails?.cartKey) {
      updateTableNameFromCartId(formData?.tableName, cartDetails?.cartKey);
      setIsModalVisible(false);
      modelVisibleValue && modelVisible(false);
      {
        activeTab ? "" : dispatch(INCREMENT());
      }
    } else {
      setIsModalVisible(false);
      modelVisibleValue && modelVisible(false);
      {
        activeTab ? "" : dispatch(INCREMENT());
      }
    }

    if (redirectToCurrent == "yes") {
      redirectToCurrentFunction();
      setSelectedProduct([]);
    } else {
      updateInfoLocalListsData();
    }
  };

  const [removeButtonClick, setRemoveClick] = useState(false);

  const removeDraft = () => {
    if (cartDetails?.orderTicketsData) {
      setRemoveClick(true);
    } else {
      dispatch(DECREMENT());
      removeCartFromLocalStorage(cartDetails.cartKey);
      if (currentRegisterData) {
        setCartInfoLocalListsData(
          getCartInfoLocalListsData().filter(
            (d) =>
              d.type == "DRAFT_CART" && d.register_id == currentRegisterData._id
          )
        );
        setlocalCartInfo();
        setTableName();
      }
      setIsModalVisible(false);
      modelVisible && modelVisible(false);
    }
  };

  return (
    <>
      <Modal
        title="Save and New"
        visible={isModalVisible || modelVisibleValue}
        bodyStyle={{ paddingTop: 0, marginTop: "0" }}
        onCancel={handleCancel}
        footer={
          removeButtonClick
            ? [
                <Button
                  key="ok"
                  onClick={() => {
                    handleCancel();
                  }}
                >
                  OK
                </Button>,
              ]
            : [
                <Button
                  key="back"
                  onClick={() => {
                    handleCancel();
                  }}
                >
                  Go Back
                </Button>,
                redirectToCurrent == "no" ? (
                  <Button onClick={removeDraft}>Remove</Button>
                ) : (
                  ""
                ),
                <Button key="submit" type="primary" onClick={form.submit}>
                  Save & New
                </Button>,
              ]
        }
      >
        <Form
          autoComplete="off"
          style={{ width: "100%" }}
          form={form}
          onFinish={onSubmit}
          name="editTableName"
        >
          {removeButtonClick ? (
            <div>
              <p>
                This draft has order tickets. To remove this draft, open it and
                then clear.
              </p>
            </div>
          ) : (
            <>
              <Form.Item label="Draft Name"></Form.Item>
              <Form.Item name="tableName" label="">
                <Input
                  type="text"
                  style={{ marginBottom: 6 }}
                  placeholder="Draft name (optional)"
                  ref={exampleInput}
                  value={cartDetails?.tableName}
                  onChange={setTableNameModal}
                />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </>
  );
});

export { EditTableNameModal };
