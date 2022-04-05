import React, { useState, useEffect, useRef } from "react";
import {
  Row,
  Col,
  Input,
  Form,
  Table,
  Space,
  Popover,
  Card,
  message,
  Radio,
  Typography,
  Spin,
  Checkbox,
  InputNumber,
  Avatar,
  List,
  Menu,
  Dropdown,
  Select,
  Modal,
} from "antd";

import {
  useDispatch,
  useSelector,
  shallowEqual,
  connectAdvanced,
} from "react-redux";
import { SellModuleNav } from "../Style";
import { Button } from "../../../components/buttons/buttons";

import {
  EditOutlined,
  DeleteOutlined,
  TeamOutlined,
  VerticalRightOutlined,
  CheckOutlined,
  LoadingOutlined,
  CloseCircleFilled,
  CheckCircleOutlined,
  SearchOutlined,
  ConsoleSqlOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { filterListData } from "../../../redux/customer/actionCreator";

import { getAllPaymentTypeList } from "../../../redux/customField/actionCreator";
import { CreateOrder } from "../../../redux/sell/actionCreator";
import { ChargeDetails } from "./ChargeDetails";
import {
  getAllAddtionalList,
  getAllTagList,
} from "../../../redux/customField/actionCreator";

import { NavLink } from "react-router-dom";
import {
  getTopSellList,
  getAllCategoriesList,
  getCategoryWiseAllProductList,
} from "../../../redux/products/actionCreator";

import { CustomerModal } from "./customerModal";
import { ProductDetailModal } from "./productDetailModal";
import { NewProductModal } from "./newProductModal";
import { SwapTableModal } from "./SwapTableModal";
import { OrderTicketModal } from "./OrderTicketModal";
import { GridViewCurrent } from "./GridViewCurrent";
import {
  getItem,
  setItem,
  setCartInfoFromLocalKey,
  removeCartFromLocalStorage,
  createNewCartwithKeyandPush,
  getCartInfoFromLocalKey,
  tableStatusChange,
  removeItem,
  storeOtherData,
  setOrderTickets,
  getLocalCartCount,
} from "../../../utility/localStorageControl";
import { EditTableNameModal } from "./../../Sell/Current/EditTableNameModal";
import { ReceiptPrint } from "../Print/ReceiptPrint";

import tickSvg from "../../../static/img/tick.svg";

import moment from "moment";
import ModalPopUp from "./popUp";
import ReactDOMServer from "react-dom/server";

import { any } from "prop-types";
import { OrderTicketPrint } from "./OrderTicketPrint";
import {
  generate_random_number,
  generate_random_string,
} from "../../../utility/utility";

const CurrentBuilder = (props) => {
  let {
    tabChangeToCurrent,
    setCustomerAndCartData,
    search,
    nullSearch,
    localCartInfo,
    tableName,
    updateCartCount,
    tableConfiguration,
    tableIsCustome,
    swapTableNameList,
    setlocalCartInfo,
    setTableName,
    customeTableList,
    chargePageIsShow,
    registerData,
    setItems,
    setDarftCount,
  } = props;

  if (
    localCartInfo &&
    getCartInfoFromLocalKey(localCartInfo.cartKey, registerData)
  ) {
    localCartInfo = getCartInfoFromLocalKey(
      localCartInfo.cartKey,
      registerData
    );
  } else if (getItem("active_cart") != null && getItem("active_cart")) {
    localCartInfo = getCartInfoFromLocalKey(
      getItem("active_cart"),
      registerData
    );
  }

  let [selectedProduct, setSelectedProduct] = useState(
    getItem("bookingDetails") != false
      ? getItem("bookingDetails") != null &&
        getItem("bookingDetails") != undefined
        ? getItem("bookingDetails").details.itemsSold
        : []
      : localCartInfo != undefined && Object.keys(localCartInfo).length > 0
      ? localCartInfo.data
      : []
  );
  const [selectedTable, setselectedTable] = useState(
    getItem("bookingDetails") !== false && getItem("bookingDetails") !== null
      ? getItem("bookingDetails").details.bookingDetails.booking_number
      : localCartInfo && localCartInfo.tableName != ""
      ? localCartInfo.tableName
      : tableName
  );
  let [status, setStatus] = useState(false);

  const customerRef = useRef();
  const productDetailsRef = useRef();
  const newproductDetailsRef = useRef();
  const editTableNameModalRef = useRef();
  const coupanCodeRef = useRef();
  const inputRef = useRef();
  const discountRef = useRef();

  const swapRef = useRef();
  const orderTicketRef = useRef();

  let [customer, setCustomer] = useState(
    getItem("bookingDetails") !== false && getItem("bookingDetails") !== null
      ? getItem("bookingDetails").customer.mobile
      : localCartInfo &&
        localCartInfo.otherDetails &&
        localCartInfo.otherDetails.customer &&
        localCartInfo.otherDetails.customer.mobile != null
      ? localCartInfo.otherDetails.customer.mobile
      : "Add Customer"
  );

  const [CustomerData, setCustomerData] = useState(
    getItem("bookingDetails") !== false && getItem("bookingDetails") !== null
      ? {
          name: getItem("bookingDetails").customer.name
            ? getItem("bookingDetails").customer.name
            : null,
          email: getItem("bookingDetails").customer.email
            ? getItem("bookingDetails").customer.email
            : null,
          _id: getItem("bookingDetails").customer._id
            ? getItem("bookingDetails").customer._id
            : null,
          mobile: getItem("bookingDetails").customer.mobile,
        }
      : localCartInfo &&
        localCartInfo.otherDetails &&
        localCartInfo.otherDetails.customer
      ? localCartInfo.otherDetails.customer
      : null
  );

  let [PrefrenceData, setPrefrenceData] = useState(null);
  let [CategoryID, setCategoryId] = useState("");
  const [activeAll, setActiveAll] = useState("");
  const [activeTop, setActiveTop] = useState(false);
  let [allCategoryList, setAllCategoryList] = useState([]);
  let [allProductList, setAllProductList] = useState([]);
  const [PaymentType, setPaymentType] = useState("cash");
  let [productDetailsForUpdate, setProductDetailsForUpdate] = useState({});
  let [bulkDiscountType, setBulkDiscountType] = useState(
    localCartInfo?.otherDetails?.bulkDiscountDetails?.bulkDiscountType
      ? localCartInfo?.otherDetails?.bulkDiscountDetails?.bulkDiscountType
      : "FLAT"
  );
  let [bulkDiscount, setBulkDiscount] = useState(
    localCartInfo?.otherDetails?.bulkDiscountDetails?.bulkDiscount
      ? localCartInfo?.otherDetails?.bulkDiscountDetails?.bulkDiscount
      : 0
  );
  let [PopoverVisible, setPopoverVisible] = useState(false);
  let [PopoverVisibleAdditional, setPopoverVisibleAdditional] = useState(false);
  let [PopoverVisibleCoupon, setPopoverVisibleCoupon] = useState(false);
  const [filterArray, setFilterArray] = useState([]);

  let [AddtionalChargeList, setAddtionalChargeList] = useState([]);
  let [checkClick, setCheckClick] = useState(1);
  const [PaymentTypeList, setPaymentTypeList] = useState([]);
  const [coupanText, setCoupanText] = useState("Coupon Code");

  let tickAdditionalList = [];
  let totalAddtionalcharge = 0;

  let [newProductData, setNewProductData] = useState({});
  let [spinOn, setSpinOn] = useState(false);
  let [gridView, setGridView] = useState(false);
  const [change, setNotChange] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [enforceCustomer, setEnforceCustomer] = useState(false);
  const [newItem, setNewItem] = useState(false);
  const [DiscountMoreThanTotal, setDiscountMoreThanTotal] = useState(
    "Bulk Discount"
  );
  const [colorBulk, setColorBulk] = useState("#008cba");
  let [modalOpen, setModalOpen] = useState(false);
  let [table2, settabel2] = useState(false);
  let [data1, setdata1] = useState([]);
  let [buclkDiscontDetails, setBulckDisountDetails] = useState({
    type: localCartInfo?.otherDetails?.bulkDiscountDetails?.type
      ? localCartInfo.otherDetails.bulkDiscountDetails.type
      : "FLAT",
    value: localCartInfo?.otherDetails?.bulkDiscountDetails?.value
      ? localCartInfo.otherDetails.bulkDiscountDetails.value
      : 0,
    click: false,
  });

  let [bulckdiscuntButtonText, setBulckDiscontButtonText] = useState({
    text: "Bulk discount",
    color: "#008cba",
    discountValue: 0,
  });

  const [form] = Form.useForm();
  const { Text } = Typography;
  let isMounted = useRef(true);
  const dispatch = useDispatch();
  let TotalPrice = 0;
  let pageNumber = 1;
  const [AllProduct, setAllProduct] = useState([]);
  const [searchProductList, setSearchProductList] = useState([]);
  const [bulkValue, setBulkValue] = useState(
    localCartInfo?.otherDetails?.bulkDiscountDetails?.bulkValue
      ? localCartInfo?.otherDetails?.bulkDiscountDetails?.bulkValue
      : 0
  );
  const [finalCoupanCodeValue, setFinalCoupanCodeValue] = useState(0);
  const [finalCoupan_code, setFinalCoupan_code] = useState();
  const [cartToEdit, setCartToEdit] = useState({});
  const [olddetails, setOlddetails] = useState(false);
  const [DiscountRulesList, setDiscountRulesList] = useState([]);
  const [coupanCodeText, setCouponText] = useState();
  const [coupanCodeValue, setCoupanCodeCodeValue] = useState(0);
  const [isAutomaticCoupon, setIsautomaticCoupon] = useState(false);
  const [listViewOnOff, setListViewOnOff] = useState(false);
  const [chargeClick, setChargeClick] = useState(
    localCartInfo?.otherDetails?.chargeClick
      ? localCartInfo?.otherDetails?.chargeClick
      : false
  );
  const [searchItems, setsearchItems] = useState("");
  const [AdddiscountValue, setAdddiscountValue] = useState([]);
  const [onClickList, setOnClickList] = useState(false);
  const [manualCouponObject, setManualCouponObject] = useState(null);
  const [staticManualCouponObject, setStaticManualCouponObject] = useState(
    null
  );
  const [userDetailData, setuserDetailData] = useState(false);
  const [topSellList, setTopSellList] = useState([]);
  const orderTicketClickRef = useRef();

  const antIcon = <LoadingOutlined style={{ fontSize: 18 }} spin />;

  const { Option } = Select;

  const [shopDetails, setShopDetails] = useState([]);
  const [printDetails, setPrintDetails] = useState();
  const [notUpdate, setNotUpdate] = useState(false);
  const [popUpData, setPopUpData] = useState();
  const [popUpModel, setPopUpModel] = useState(false);
  const [ModelView, setModelViewData] = useState(false);

  let [finalPrice, setFinalPrice] = useState(0);
  let [taxtotal, settextotal] = useState(0);
  let [taxandtotal, settaxandtotal] = useState(0);
  let [round, setround] = useState(0);
  let [TotalAddtionalChargeValue, setTotalAddtionalChargeValue] = useState(0);
  let [selectedAddonProducts, setselectedAddonProducts] = useState([]);
  var [selecteddiscountProducts, setselecteddiscountProducts] = useState([]);
  var [selectedGetoneproduct, setselectedGetoneproduct] = useState([]);
  let [discountAppliedProductId, setdiscountAppliedProductId] = useState({
    index: "",
  });
  let [adddiscountFlag, setadddiscountFlag] = useState(false);
  var [discountValue, setDiscountValue] = useState([]);
  var [customDiscountPresent, setCustomDiscountValue] = useState(false);
  const [disCountValues, setDiscountValues] = useState(0);
  const [key, setKey] = useState(false);
  const componentRef = useRef();

  useEffect(() => {
    if (localCartInfo && localCartInfo.data && localCartInfo.data.length > 0) {
      setSelectedProduct(localCartInfo.data);
    }
  }, [props]);

  useEffect(() => {
    if (coupanCodeRef.current) {
      coupanCodeRef.current.focus();
    }
    if (discountRef.current) {
      discountRef.current.focus();
    }
  }, [localCartInfo]);

  useEffect(() => {
    async function fetchShopDetails() {
      let allLocal = getItem("setupCache");
      if (allLocal && allLocal.shopDetails) {
        setShopDetails(allLocal.shopDetails);
      }
    }
    if (isMounted.current) {
      fetchShopDetails();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  const [checkCurrent, setCheckCurrent] = useState(true);

  useEffect(() => {
    if (orderTicketClickRef && orderTicketClickRef.current) {
      orderTicketClickRef.current.addEventListener(
        "keydown",
        handleKeyDown,
        false
      );
      return () => {
        orderTicketClickRef.current.removeEventListener(
          "keydown",
          handleKeyDown
        );
      };
    }
  }, []);

  useEffect(() => {
    if (AllProduct.length > 0) {
      const getSections = () => {
        if (AllProduct.length === 0) {
          return [];
        }
        let filterdArray = AllProduct.sort((a, b) =>
          a.product_name.localeCompare(b.product_name)
        );
        setCharWiseProductList(filterdArray);
        return Object.values(
          filterdArray.reduce((acc, word) => {
            let firstLetter = word.product_name[0].toLocaleUpperCase();
            if (!acc[firstLetter]) {
              acc[firstLetter] = {
                title: firstLetter,
                data: [word],
              };
            } else {
              acc[firstLetter].data.push(word);
            }
            return acc;
          }, {})
        );
      };
      setFilterArray(getSections());
    }
  }, [AllProduct]);

  useEffect(() => {
    if (localCartInfo && localCartInfo.Status == "Unpaid") {
      setChargeClick(true);
    }
  }, []);

  useEffect(() => {
    if (tableName) {
      setselectedTable(tableName);
    } else if (localCartInfo && localCartInfo.tableName != "") {
      setselectedTable(localCartInfo.tableName);
    }
  }, [tableName]);

  // useEffect(() => {
  //   if (localCartInfo?.otherDetails) {
  //     console.log("sagarlocal", localCartInfo);
  //     if (
  //       localCartInfo?.otherDetails.customer.mobile != null &&
  //       localCartInfo?.otherDetails.customer.mobile != 0
  //     ) {
  //       if (
  //         localCartInfo?.otherDetails.customer.name &&
  //         localCartInfo?.otherDetails.customer.name != "" &&
  //         localCartInfo?.otherDetails.customer.name != null
  //       ) {
  //         console.log(
  //           "localCartInfo?.otherDetails.customer",
  //           localCartInfo?.otherDetails.customer
  //         );
  //         setCustomerData({
  //           mobile: localCartInfo?.otherDetails.customer.mobile,
  //           name: localCartInfo?.otherDetails.customer.name,
  //           shipping_address: localCartInfo?.otherDetails.shipping_address,
  //           city: localCartInfo?.otherDetails.city,
  //           zipcode: localCartInfo?.otherDetails.zipcode,
  //         });
  //         setCustomer(Number(localCartInfo?.otherDetails.customer.mobile));
  //       } else {
  //         setCustomerData({
  //           mobile: localCartInfo?.otherDetails.customer.mobial,
  //         });
  //         setCustomer(Number(localCartInfo?.otherDetails.customer.mobile));
  //       }
  //     }
  //   }
  //   if (localCartInfo && localCartInfo.tableName) {
  //     setselectedTable(localCartInfo.tableName);
  //   }
  // }, []);

  async function fetchAllAddtionalChargeList() {
    let filterList = [];
    let deliveryAddCharge = [];
    let dineInAddCharge = [];
    let takeAwayAddCharge = [];
    let localData = getItem("setupCache");
    const allAddtionalChargeList = localData?.additionalCharges;
    console.log("allAddtionalChargeList32121", allAddtionalChargeList);
    if (allAddtionalChargeList)
      filterList = allAddtionalChargeList.filter(
        (value) => value.order_type === "all_orders"
      );
    setAddtionalChargeList(filterList);
    if (
      localCartInfo?.type == "delivery-local" &&
      allAddtionalChargeList.length > 0
    )
      deliveryAddCharge = allAddtionalChargeList.filter(
        (value) => value.order_type === "delivery"
      );

    if (
      localCartInfo?.type === "custom-table-local" &&
      allAddtionalChargeList.length > 0
    ) {
      dineInAddCharge = allAddtionalChargeList.filter(
        (value) => value.order_type === "dine_in"
      );
    }

    if (
      localCartInfo?.type === "take-away-local" &&
      allAddtionalChargeList.length > 0
    ) {
      takeAwayAddCharge = allAddtionalChargeList.filter(
        (value) => value.order_type === "take_away"
      );
    }

    takeAwayAddCharge?.map((value) => {
      if (
        localCartInfo &&
        localCartInfo.otherDetails &&
        localCartInfo.otherDetails.AddtionalChargeList?.length > 0
      ) {
        localCartInfo.otherDetails.AddtionalChargeList.map((val) => {
          if (value._id == val._id && val.is_automatically_added) {
            value.is_automatically_added = true;
          }
        });
      }
      if (value.tax_group && value.tax_group.taxes) {
        let totalTax = 0;
        value.tax_group.taxes.map((tax) => (totalTax += tax.tax_percentage));
        value.tax_group.Totaltax = totalTax;
      } else {
        value.tax_group.Totaltax = 0;
      }
    });

    filterList?.map((value) => {
      if (
        localCartInfo &&
        localCartInfo.otherDetails &&
        localCartInfo.otherDetails.AddtionalChargeList?.length > 0
      ) {
        localCartInfo.otherDetails.AddtionalChargeList.map((val) => {
          if (value._id == val._id && val.is_automatically_added) {
            value.is_automatically_added = true;
          }
        });
      }
      if (value.tax_group && value.tax_group.taxes) {
        let totalTax = 0;
        value.tax_group.taxes.map((tax) => (totalTax += tax.tax_percentage));
        value.tax_group.Totaltax = totalTax;
      } else {
        value.tax_group.Totaltax = 0;
      }
    });

    dineInAddCharge?.map((value) => {
      if (
        localCartInfo &&
        localCartInfo.otherDetails &&
        localCartInfo.otherDetails.AddtionalChargeList?.length > 0
      ) {
        localCartInfo.otherDetails.AddtionalChargeList.map((val) => {
          if (value._id == val._id && val.is_automatically_added) {
            value.is_automatically_added = true;
          }
        });
      }

      if (value.tax_group && value.tax_group.taxes) {
        let totalTax = 0;
        value.tax_group.taxes.map((tax) => (totalTax += tax.tax_percentage));
        value.tax_group.Totaltax = totalTax;
      } else {
        value.tax_group.Totaltax = 0;
      }
    });

    deliveryAddCharge?.map((value) => {
      if (
        localCartInfo &&
        localCartInfo.otherDetails &&
        localCartInfo.otherDetails.AddtionalChargeList?.length > 0
      ) {
        localCartInfo.otherDetails.AddtionalChargeList.map((val) => {
          if (value._id == val._id && val.is_automatically_added) {
            value.is_automatically_added = true;
          }
        });
      }

      if (value.tax_group && value.tax_group.taxes) {
        let totalTax = 0;
        value.tax_group.taxes.map((tax) => (totalTax += tax.tax_percentage));
        value.tax_group.Totaltax = totalTax;
      } else {
        value.tax_group.Totaltax = 0;
      }
    });

    if (filterList?.length > 0) setAddtionalChargeList(filterList);
    if (deliveryAddCharge?.length > 0)
      setAddtionalChargeList(deliveryAddCharge);
    if (dineInAddCharge?.length > 0) setAddtionalChargeList(dineInAddCharge);
    if (takeAwayAddCharge?.length > 0)
      setAddtionalChargeList(takeAwayAddCharge);
  }
  useEffect(() => {
    setActiveAll("active");

    async function fetchAllCategoryList() {
      const allCategoryList = await dispatch(getAllCategoriesList("sell"));

      let filterData = [];
      const getProductList = await dispatch(
        getCategoryWiseAllProductList(null, pageNumber, registerData._id)
      );
      if (getProductList && getProductList.productList?.length > 0) {
        filterData = allCategoryList.categoryList.filter((val) => {
          if (
            getProductList.productList.find(
              (itm) => itm.product_category._id == val._id
            ) != undefined
          ) {
            return val;
          }
        });
      }

      if (filterData.length > 0) {
        setAllCategoryList(filterData);
      } else if (
        isMounted.current &&
        allCategoryList &&
        allCategoryList.categoryList
      ) {
        setAllCategoryList(allCategoryList.categoryList);
      }
    }

    async function fetchProductList() {
      const getProductList = await dispatch(
        getCategoryWiseAllProductList(null, pageNumber, registerData._id)
      );
      if (isMounted.current && getProductList && getProductList.productList)
        getProductList.productList.map((value, index) => {
          if (value !== null) {
            let totalTax = 0;
            value.price = Number(value.price.toFixed(2));
            let itemPrice = 0;
            if (value.option_status === "combo") {
              if (value.option_item_group.length > 0) {
                value.option_item_group.map((item) => {
                  let minimumArray = [];

                  item.products.map((value) => {
                    let FilterVarints = item.product_variants.filter(
                      (data) => data.product_id._id === value._id
                    );
                    if (FilterVarints.length > 0) {
                      FilterVarints.map((variant) => {
                        minimumArray.push(
                          variant.product_id.price + variant.variant_id.price
                        );
                      });
                    } else {
                      minimumArray.push(value.price);
                    }
                  });
                  let itemMinPrice = Math.min.apply(Math, minimumArray);
                  itemPrice += itemMinPrice;
                });
                value.newPrice = Number(value.price + itemPrice).toFixed(2);
              } else {
                value.newPrice = Number(value.price).toFixed(2);
              }
            } else {
              if (value.option_variant_group.length > 0) {
                let varintsPrice = 0;
                value.option_variant_group.map((varints) => {
                  let minimumArray = [];

                  varints.product_variants.map((variant) => {
                    minimumArray.push(variant.price);
                  });
                  let variantMinPrice = Math.min.apply(Math, minimumArray);
                  varintsPrice += variantMinPrice;
                });
                value.newPrice = Number(value.price + varintsPrice).toFixed(2);
              } else {
                value.newPrice = Number(value.price).toFixed(2);
              }
            }

            if (value.product_name.length > 30) {
              let divideArray = value.product_name.match(/.{1,30}/g);
              value.Newproduct_name = value.product_name.replace(
                divideArray[1],
                ".."
              );
            }
            value?.tax_group?.taxes
              ? value?.tax_group?.taxes.map(
                  (tax) => (totalTax += tax.tax_percentage)
                )
              : "";
            if (value?.tax_group) {
              value.tax_group.Totaltax = totalTax;
            }
            if (
              value.tax_group !== null &&
              value.tax_group.taxes_inclusive_in_product_price
            ) {
              if (value.price === 0) {
                value.price = value.price;
              } else {
                let price1;
                if (totalTax === 0) {
                  value.price = Number(value.price.toFixed(2));
                } else {
                  let total2;
                  let price2;
                  let price3;
                  price1 = value.price * totalTax;
                  total2 = 100 + totalTax;
                  price2 = price1 / total2;
                  price3 = Number(value.price - price2).toFixed(2);
                  value.price = Number(price3);
                }
              }
            }
          }
        });

      if (getProductList) {
        setAllProduct(getProductList?.productList);
        setAllProductList(getProductList?.productList);
      }
    }
    async function fetchPaymentType() {
      const getPaymentTypeList = await dispatch(getAllPaymentTypeList("sell"));

      if (
        isMounted.current &&
        getPaymentTypeList &&
        getPaymentTypeList.PaymentTypeList
      )
        setPaymentTypeList(getPaymentTypeList.PaymentTypeList.reverse());
    }

    async function fetchUserDetail() {
      getItem("userDetails") != null &&
        setuserDetailData(getItem("userDetails"));
    }

    async function fetchTopSellList() {
      const allTopSellList = await dispatch(getTopSellList());

      allTopSellList?.topProductList.map((value, index) => {
        if (value !== null) {
          let totalTax = 0;
          value.price = Number(value.price.toFixed(2));
          let itemPrice = 0;
          if (value.option_status === "combo") {
            if (value.option_item_group.length > 0) {
              value.option_item_group.map((item) => {
                let minimumArray = [];

                item.products.map((value) => {
                  let FilterVarints = item.product_variants.filter(
                    (data) => data.product_id._id === value._id
                  );
                  if (FilterVarints.length > 0) {
                    FilterVarints.map((variant) => {
                      minimumArray.push(
                        variant.product_id.price + variant.variant_id.price
                      );
                    });
                  } else {
                    minimumArray.push(value.price);
                  }
                });
                let itemMinPrice = Math.min.apply(Math, minimumArray);
                itemPrice += itemMinPrice;
              });
              value.newPrice = Number(value.price + itemPrice).toFixed(2);
            } else {
              value.newPrice = Number(value.price).toFixed(2);
            }
          } else {
            if (value.option_variant_group.length > 0) {
              let varintsPrice = 0;
              value.option_variant_group.map((varints) => {
                let minimumArray = [];

                varints.product_variants.map((variant) => {
                  minimumArray.push(variant.price);
                });
                let variantMinPrice = Math.min.apply(Math, minimumArray);
                varintsPrice += variantMinPrice;
              });
              value.newPrice = Number(value.price + varintsPrice).toFixed(2);
            } else {
              value.newPrice = Number(value.price).toFixed(2);
            }
          }

          if (value.product_name.length > 30) {
            let divideArray = value.product_name.match(/.{1,30}/g);
            value.Newproduct_name = value.product_name.replace(
              divideArray[1],
              ".."
            );
          }
          value?.tax_group?.taxes
            ? value?.tax_group?.taxes.map(
                (tax) => (totalTax += tax.tax_percentage)
              )
            : "";
          if (value?.tax_group) {
            value.tax_group.Totaltax = totalTax;
          }
          if (
            value.tax_group !== null &&
            value.tax_group.taxes_inclusive_in_product_price
          ) {
            if (value.price === 0) {
              value.price = value.price;
            } else {
              let price1;
              if (totalTax === 0) {
                value.price = Number(value.price.toFixed(2));
              } else {
                let total2;
                let price2;
                let price3;
                price1 = value.price * totalTax;
                total2 = 100 + totalTax;
                price2 = price1 / total2;
                price3 = Number(value.price - price2).toFixed(2);
                value.price = Number(price3);
              }
            }
          }
        }
      });
      if (
        isMounted.current &&
        allTopSellList &&
        allTopSellList.topProductList.length
      ) {
        setTopSellList(allTopSellList.topProductList);
      }
    }

    if (isMounted.current) {
      fetchAllCategoryList();
      fetchProductList();

      fetchPaymentType();
      fetchUserDetail();
      fetchTopSellList();
      fetchAllAddtionalChargeList();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);
  //totalvaru1
  useEffect(() => {
    let total = 0;
    let totalTaxes = 0;
    let taxesArray = [];

    selectedProduct.map((product) => {
      total += product.calculatedprice;

      if (!(product.customDiscountedValue == undefined)) {
        if (!(product?.customDiscountedValue == product.calculatedprice)) {
          taxesArray.push(
            (product.productTaxes *
              (product.calculatedprice - product.customDiscountedValue)) /
              100
          );
        }
      } else {
        taxesArray.push((product.productTaxes * product.calculatedprice) / 100);
      }
    });

    let CouponCodeMaxValueOfFixedAmount = getItem("MaxValueOfFixedAmount");
    let CouponCodeMaxValueOfPercenatege = getItem("MaxValueOfPercenatge");

    if (
      CouponCodeMaxValueOfFixedAmount?.discount > 0 ||
      CouponCodeMaxValueOfPercenatege?.discount > 0
    ) {
      let CoupanPercenategeWithTotal =
        (total * CouponCodeMaxValueOfPercenatege.discount) / 100;

      if (
        CouponCodeMaxValueOfFixedAmount.discount > CoupanPercenategeWithTotal
      ) {
        if (CouponCodeMaxValueOfFixedAmount.minimum_order < total) {
          total = total - CouponCodeMaxValueOfFixedAmount.discount;
          setFinalCoupan_code(CouponCodeMaxValueOfFixedAmount.coupon_code);
          setFinalCoupanCodeValue(CouponCodeMaxValueOfFixedAmount.discount);
          setCoupanCodeCodeValue(CouponCodeMaxValueOfFixedAmount);
          setIsautomaticCoupon(true);
        } else {
          setFinalCoupanCodeValue(0);
        }
      } else {
        if (CouponCodeMaxValueOfPercenatege.minimum_order < total) {
          total = total - CoupanPercenategeWithTotal;
          setFinalCoupan_code(CouponCodeMaxValueOfPercenatege.coupon_code);
          setFinalCoupanCodeValue(CoupanPercenategeWithTotal);
          setCoupanCodeCodeValue(CouponCodeMaxValueOfPercenatege);
          setIsautomaticCoupon(true);
        } else {
          setFinalCoupanCodeValue(0);
        }
      }
    } else if (
      bulkValue.couponCodeValue &&
      coupanCodeValue.minimum_order < total
    ) {
      if (bulkValue.DiscountType == "percentage") {
        setFinalCoupan_code(bulkValue.currentCoupanCode);
        setFinalCoupanCodeValue((total * bulkValue.couponCodeValue) / 100);
        total = total - (total * bulkValue.couponCodeValue) / 100;
        setCoupanText("Coupon Code");
      } else {
        total = total - bulkValue.couponCodeValue;
        setFinalCoupan_code(bulkValue.currentCoupanCode);
        setFinalCoupanCodeValue(bulkValue.couponCodeValue);
        setCoupanText("Coupon Code");
      }
    } else {
      setFinalCoupanCodeValue(0);
      setFinalCoupan_code();
    }

    taxesArray.map((tax) => (totalTaxes += tax));
    if (AddtionalChargeList.length > 0 && selectedProduct.length > 0) {
      AddtionalChargeList.map((value) => {
        if (value.is_automatically_added) {
          if (value.tax_group?.taxes) {
            let TotalTax = value.tax_group.taxes.reduce(
              (accumulator, current) => accumulator + current.tax_percentage,
              0
            );
            totalTaxes += (TotalTax * value.charge_value) / 100;
          }

          if (value.charge_type === "percentage") {
            totalAddtionalcharge += (value.charge_value * total) / 100;
            total += (value.charge_value * total) / 100;
          } else {
            totalAddtionalcharge += value.charge_value;
            total += value.charge_value;
          }
          setTotalAddtionalChargeValue(Number(totalAddtionalcharge).toFixed(2));
        }
      });
    }
    settaxandtotal(total);

    settextotal(totalTaxes);
    let discount =
      discountValue.length > 0 ? discountValue[0].discountedValue : 0;

    let curDis = 0;
    selectedProduct.map((data, index) => {
      curDis =
        data.quantity > 0
          ? (data.customDiscountedValue
              ? parseInt(data.customDiscountedValue)
              : 0) + curDis
          : 0;
      return curDis;
    });

    total =
      total +
      totalTaxes -
      (discount !== undefined ? discount : 0 + (curDis ? curDis : 0));

    if (getItem("doNotRoundOff") === false) {
      let total1 = total;
      total = Math.round(total);

      let float_part = Number((total1 - total).toFixed(2));

      setround(float_part * -1);
    }

    if (bulkValue > 0 && bulkValue != "") {
      total = total - bulkValue;
    }

    // if (total < 0) {
    //   setFinalPrice(0.0);
    // } else if (selectedProduct[0]?.customDiscountedValue) {
    //   // const cost = Number(total) - selectedProduct[0]?.customDiscountedValue
    //   // setFinalPrice(Number(cost).toFixed(2));
    //   setFinalPrice(Number(total).toFixed(2));
    // } else {

    setFinalPrice(Number(total).toFixed(2));
    let status = false;

    selectedProduct.map((i) => {
      if (i.quantity > 0 && Number(i?.discountData) > 0) {
        status = true;
      }
    });

    setStatus(status);
    setItem("total", total);
    setItem("totalTax", totalTaxes);
  }, [selectedProduct, AddtionalChargeList]);

  // total calculation part  //
  //totalvaru2
  let [totalcalculatedPrice, setTotalCalculatedPrice] = useState(0);
  let [totalcalculatedTax, setTotalCalculatedTax] = useState(0);
  function taxesCalculated(product, customDiscount) {
    if (customDiscount) {
      product.taxGroup.taxes?.length > 0 &&
        product.taxGroup.taxes.map(
          (j) =>
            (j.totalTaxPrice =
              (j.tax_percentage * product.calculatedprice - customDiscount) /
              100)
        );
      return (
        (product.productTaxes * (product.calculatedprice - customDiscount)) /
        100
      );
    } else {
      product.taxGroup.taxes?.length > 0 &&
        product.taxGroup.taxes.map(
          (j) =>
            (j.totalTaxPrice =
              (j.tax_percentage * product.calculatedprice) / 100)
        );
      return (product.productTaxes * product.calculatedprice) / 100;
    }
  }
  function roundOffTotal(total) {
    let total1 = total;
    total = Math.round(total);
    let float_part = Number((total1 - total).toFixed(2));
    setround(float_part * -1);
    return total;
  }
  function addAdtionalchargeValue(total, totalTaxes) {
    if (AddtionalChargeList.length > 0 && selectedProduct.length > 0) {
      let totalAddtionalcharge = 0;
      AddtionalChargeList.map((value) => {
        if (value.is_automatically_added) {
          if (value.tax_group?.taxes) {
            let TotalTax =
              value.tax_group.taxes?.length > 0 &&
              value.tax_group.taxes.reduce(
                (accumulator, current) => accumulator + current.tax_percentage,
                0
              );
            value.tax_group.taxes?.length > 0 &&
              value.tax_group.taxes.map(
                (j) =>
                  (j.totalTaxPrice =
                    (j.tax_percentage * value.charge_value) / 100)
              );
            totalTaxes += (TotalTax * value.charge_value) / 100;
          }
          if (value.charge_type === "percentage") {
            totalAddtionalcharge += (value.charge_value * total) / 100;
            total += (value.charge_value * total) / 100;
          } else {
            totalAddtionalcharge += value.charge_value;
            total += value.charge_value;
          }
        }
      });
      setTotalAddtionalChargeValue(Number(totalAddtionalcharge).toFixed(2));
      return {
        totalValues: total,
        taxValue: totalTaxes,
        totalAddtionalcharge: totalAddtionalcharge,
      };
    } else {
      return {
        totalValues: total,
        taxValue: totalTaxes,
        totalAddtionalcharge: totalAddtionalcharge,
      };
    }
  }
  let bulckDiscontCalculation = (total, totalTaxes) => {
    let crrentTotalPrice = total + totalTaxes;
    if (
      buclkDiscontDetails.type == "FLAT" &&
      buclkDiscontDetails.value > crrentTotalPrice
    ) {
      setBulckDiscontButtonText({
        color: "red",
        text: "Discount is more than total",
        discountValue: 0,
      });
      return {
        totalTaxes,
        total,
      };
    } else if (
      buclkDiscontDetails.type == "FLAT" &&
      buclkDiscontDetails.value > 0
    ) {
      let bulkPrice = buclkDiscontDetails.value / total;
      let taxesArr = [];
      let Totaltaxandbulk = 0;
      let totalPrice = 0;
      selectedProduct.map((value, index) => {
        totalPrice += value.calculatedprice;
        let bulkprice2 = value.calculatedprice * bulkPrice;
        let bulkPrice3 = value.calculatedprice - bulkprice2;
        taxesArr.push((bulkPrice3 * value.productTaxes) / 100);
        value.taxGroup.taxes.map((i) => {
          i.totalTaxPrice = (bulkPrice3 * i.tax_percentage) / 100;
        });
      });
      taxesArr.map((tax) => (Totaltaxandbulk += tax));

      let bulkfinalTotal = totalPrice - buclkDiscontDetails.value;
      setBulckDiscontButtonText({
        text: `Bulk discount ₹${Number(buclkDiscontDetails.value).toFixed(2)}`,
        color: "#008cba",
        discountValue: Number(buclkDiscontDetails.value).toFixed(2),
      });

      return {
        total: bulkfinalTotal,
        totalTaxes: Totaltaxandbulk,
      };
    } else if (
      buclkDiscontDetails.type == "PERCENTAGE" &&
      buclkDiscontDetails.value > 0
    ) {
      selectedProduct.map((product) => {
        product?.taxGroup?.taxes?.length > 0 &&
          product.taxGroup.taxes.map(
            (j) =>
              (j.totalTaxPrice =
                j.tax_percentage -
                (j.tax_percentage * buclkDiscontDetails.value) / 100)
          );
      });
      let calTax = totalTaxes - (totalTaxes * buclkDiscontDetails.value) / 100;
      let caltotal = total - (total * buclkDiscontDetails.value) / 100;
      setBulckDiscontButtonText({
        text: `Bulk discount ₹${Number(
          (total * buclkDiscontDetails.value) / 100
        ).toFixed(2)}`,
        color: "#008cba",
        discountValue: Number(
          (total * buclkDiscontDetails.value) / 100
        ).toFixed(2),
      });
      return {
        total: caltotal,
        totalTaxes: calTax,
      };
    } else if (
      buclkDiscontDetails.type == "PERCENTAGE" &&
      buclkDiscontDetails.value > (total * buclkDiscontDetails.value) / 100
    ) {
      setBulckDiscontButtonText({
        color: "red",
        text: "Discount is more than total",
        discountValue: 0,
      });
      return {
        totalTaxes,
        total,
      };
    } else {
      setBulckDiscontButtonText({
        color: "#008cba",
        text: "Bulk discount",
        discountValue: 0,
      });
      return {
        totalTaxes,
        total,
      };
    }
  };
  useEffect(() => {
    let total = 0;
    let totalTaxes = 0;
    selectedProduct.map((product) => {
      if (product.productTaxes > 0) {
        if (
          product.customDiscountedValue &&
          product.customDiscountedValue > 0
        ) {
          totalTaxes += taxesCalculated(product, product.customDiscountedValue);
        } else {
          totalTaxes += taxesCalculated(product);
        }
      }

      total += product.calculatedprice;
      if (product.customDiscountedValue && product.customDiscountedValue > 0) {
        total = total - product.customDiscountedValue;
      }
    });

    let bulckChargeDetails = bulckDiscontCalculation(total, totalTaxes);

    total = bulckChargeDetails.total;
    totalTaxes = bulckChargeDetails.totalTaxes;

    let addtinalChrage = addAdtionalchargeValue(total, totalTaxes);
    total = addtinalChrage.totalValues;
    totalTaxes = addtinalChrage.taxValue;
    total = total + totalTaxes;
    if (getItem("doNotRoundOff") === false) {
      total = roundOffTotal(total);
    }
    total < 0 ? setTotalCalculatedPrice(0) : setTotalCalculatedPrice(total);
    totalTaxes < 0
      ? setTotalCalculatedTax(0)
      : setTotalCalculatedTax(totalTaxes);
  }, [selectedProduct, AddtionalChargeList, buclkDiscontDetails.click]);
  function renderBulkDiscountContent() {
    return (
      <div>
        {finalCoupanCodeValue > 0 ? (
          <div>
            <span>
              Coupon {finalCoupan_code} applied -
              {coupanCodeValue.discount_type == "percentage"
                ? `${coupanCodeValue.discount}%`
                : `₹${Number(finalCoupanCodeValue).toFixed(2)}`}
            </span>
          </div>
        ) : (
          <>
            {getItem("userDetails") != null &&
            getItem("userDetails").role == "cashier" &&
            (getItem("allow_cashier_to_discount") == null ||
              getItem("allow_cashier_to_discount") == false) ? null : (
              <div
                style={{
                  display: "block",
                  boxSizing: "border-box",
                  fontSize: "11px",
                  padding: "3px",
                }}
              >
                <Radio.Group
                  style={{ marginBottom: 10 }}
                  onChange={(event) => {
                    setBulckDisountDetails({
                      ...buclkDiscontDetails,
                      type: event.target.value,
                    });
                    setBulkDiscountType(event.target.value);
                  }}
                  value={buclkDiscontDetails.type}
                >
                  <Radio value="FLAT">Cash</Radio>
                  <Radio value="PERCENTAGE">Percentage</Radio>
                </Radio.Group>
                <br></br>
                <Input
                  type="number"
                  ref={discountRef}
                  step="any"
                  style={{ marginBottom: 10 }}
                  placeholder="Discount values"
                  min={0}
                  onChange={(event) => {
                    setBulkDiscount(event.target.value),
                      setDiscountValues(event.target.value);
                    setBulckDisountDetails({
                      ...buclkDiscontDetails,
                      value: event.target.value,
                    });
                  }}
                  value={
                    buclkDiscontDetails.type == "PERCENTAGE" &&
                    buclkDiscontDetails.value > 100
                      ? 100
                      : buclkDiscontDetails.value
                  }
                  onKeyPress={(event) => {
                    if (event.key.match("[0-9,.]+")) {
                      return true;
                    } else {
                      return event.preventDefault();
                    }
                  }}
                />{" "}
                <br></br>
                <Button
                  size="middle"
                  type="success"
                  disabled={notUpdate}
                  style={{
                    marginLeft: 55,
                    background: "#BD025D",
                    border: "#BD025D",
                  }}
                  onClick={() => {
                    setBulckDisountDetails({
                      ...buclkDiscontDetails,
                      click: !buclkDiscontDetails.click,
                    });

                    setPopoverVisible(false);
                  }}
                >
                  Done
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    );
  }
  useEffect(() => {
    setSelectedProduct(getItem("product_Details"));
  }, [chargeClick]);

  let suffix =
    searchItems != "" ? (
      <CloseCircleFilled onClick={() => setsearchItems("")} />
    ) : (
      <SearchOutlined />
    );

  function setProductClassFromCategoryIndex(cat_id) {
    let index = allCategoryList.findIndex((p) => p._id == cat_id);
    if (index > 40 && index <= 80) {
      return "product-cat_id-" + index - 40;
    } else if (index > 81 && index <= 120) {
      return "product-cat_id-" + index - 80;
    } else if (index > 120 && index <= 160) {
      return "product-cat_id-" + index - 120;
    } else {
      return "product-cat_id-" + index;
    }
  }
  let [listOfUpdatedproducts, setListOfUpdatedProduts] = useState([]);
  useEffect(() => {
    let finalData = [];
    if (localCartInfo && localCartInfo.orderTicketsData) {
      let totalOrderTikets = [];
      localCartInfo.orderTicketsData.map((val) => {
        val.itemList.map((i) => {
          totalOrderTikets.push(i);
        });
      });
      var holder = {};
      totalOrderTikets.forEach(function(d) {
        d.newqty = d.newqty ? d.newqty : d.quantity;
        if (d.add_or_remove == "Added Items") {
          if (holder.hasOwnProperty(d.key)) {
            holder[d.key] = holder[d.key] + d.newqty;
          } else {
            holder[d.key] = d.newqty;
          }
        } else if (d.add_or_remove == "Removed Items") {
          if (holder.hasOwnProperty(d.key)) {
            holder[d.key] = holder[d.key] - d.newqty;
          } else {
            holder[d.key] = d.newqty;
          }
        }
      });
      var obj2 = [];
      for (var prop in holder) {
        obj2.push({
          key: prop,
          newqty: holder[prop],
        });
      }

      obj2.map((i) => {
        selectedProduct.map((data) => {
          if (i.key === data.key) {
            if (data.quantity > i.newqty) {
              (data.add_or_remove = "Added Items"),
                (data.newqty = data.quantity - i.newqty);
              finalData.push(data);
            } else if (data.quantity < i.newqty) {
              data.add_or_remove = "Removed Items";
              data.newqty = i.newqty - data.quantity;
              finalData.push(data);
            }
          }
        });
      });

      var result = selectedProduct.filter(function(o1) {
        return !obj2.some(function(o2) {
          return o1.key === o2.key;
        });
      });
      if (result.length > 0) {
        result.map((val) => {
          finalData.push(val);
        });
      }
      var result2 = obj2.filter(function(o1) {
        return !selectedProduct.some(function(o2) {
          return o1.key === o2.key;
        });
      });

      if (result2.length > 0) {
        result2.map((i) => {
          let findData = totalOrderTikets.find((j) => j.key === i.key);
          findData.newqty = i.newqty;
          findData.add_or_remove = "Removed Items";
          finalData.push(findData);
        });
      }
    } else {
      selectedProduct.map((val) => {
        val.newqty = val.quantity;
        finalData.push(val);
      });
    }

    let arrayData = Object.values(
      finalData.reduce(function(res, value) {
        if (!res[value?.order_ticket_group?._id]) {
          res[value?.order_ticket_group?._id] = {
            categoryName: value?.order_ticket_group?.order_ticket_group_name,
            data: [value],
          };
        } else {
          res[value?.order_ticket_group?._id].data.push(value);
        }

        return res;
      }, {})
    );

    let status = false;
    arrayData.map((i) => {
      if (i.data[0].newqty > 0) {
        status = true;
      }
    });

    setListOfUpdatedProduts([...arrayData]);
  }, [selectedProduct]);
  function checkCategory(val) {
    let Add = [];
    let remove = [];
    val.data.map((j) => {
      if (j.add_or_remove == "Removed Items") {
        remove.push(j);
      } else {
        Add.push(j);
      }
    });
    return Add.length > 0 && remove.length > 0
      ? "both"
      : Add.length > 0 && remove.length == 0
      ? "Added Items"
      : "Removed Items";
  }
  const createOrderTikits = () => {
    let OrderTicketsData = [];
    let PreviousTikets = [];
    if (
      localCartInfo &&
      getCartInfoFromLocalKey(localCartInfo?.cartKey, registerData) &&
      getCartInfoFromLocalKey(localCartInfo?.cartKey, registerData)
        ?.orderTicketsData
    ) {
      OrderTicketsData = getCartInfoFromLocalKey(
        localCartInfo?.cartKey,
        registerData
      ).orderTicketsData.reverse();

      OrderTicketsData.map((val) => {
        PreviousTikets.push(val.tiketNumber);
      });
    }

    listOfUpdatedproducts.map((val) => {
      let OrderTicketNumber;
      if (getItem("previousOrderTicketNumber") != null) {
        let Details = getItem("previousOrderTicketNumber");

        if (moment(Details.date).isSame(moment().format("L"))) {
          OrderTicketNumber = 1 + Details.number;
          setItem("previousOrderTicketNumber", {
            date: moment().format("L"),
            number: 1 + Details.number,
          });
        } else {
          OrderTicketNumber = 1;
          setItem("previousOrderTicketNumber", {
            date: moment().format("L"),
            number: 1,
          });
        }
      } else {
        OrderTicketNumber = 1;
        setItem("previousOrderTicketNumber", {
          date: moment().format("L"),
          number: 1,
        });
      }
      let object = {
        orderNotes: " " /* values.order_tickets_notes*/,
        tiketNumber: OrderTicketNumber,
        categoryName: val.categoryName,
        add_remove: checkCategory(val),
        itemList: val.data,
        enterDate: new Date(),
        table_name: selectedTable,
      };

      window.frames[
        "print_frame"
      ].document.body.innerHTML = ReactDOMServer.renderToStaticMarkup(
        <OrderTicketPrint
          categoryDetails={object}
          PreviousTikets={PreviousTikets}
        />
      );
      window.frames["print_frame"].window.focus();
      window.frames["print_frame"].window.print();
      if (
        getItem("print_server_copy") !== null &&
        getItem("print_server_copy") == true
      ) {
        window.frames[
          "print_frame"
        ].document.body.innerHTML = ReactDOMServer.renderToStaticMarkup(
          <OrderTicketPrint
            title="SERVER COPY"
            categoryDetails={object}
            PreviousTikets={PreviousTikets}
          />
        );
        window.frames["print_frame"].window.focus();
        window.frames["print_frame"].window.print();
      }
      setListOfUpdatedProduts([]);
      setOrderTickets(localCartInfo?.cartKey, val.data, object);
    });
  };

  const setCartAndCustomerDataAndNavigate = async () => {
    if (change) {
      onClickSearch();
      setNotChange(false);
      return;
    } else {
      if (
        getItem("orderTicketButton") != null &&
        getItem("orderTicketButton") == true &&
        getItem("enable_quick_billing") != null &&
        getItem("enable_quick_billing")
      ) {
        createOrderTikits();
      }

      setCustomerAndCartData(cartinfo);
      if (getItem("enable_quick_billing")) {
        let orderData = {};

        let ReceiptNumber = getItem(
          `Bill-${registerData.receipt_number_prefix}`
        );

        if (ReceiptNumber != null && ReceiptNumber["receipt"] != undefined) {
          let num = Number(ReceiptNumber.sn) + 1;

          setItem(`Bill-${registerData.receipt_number_prefix}`, {
            receipt: ReceiptNumber.receipt,
            sn: num,
          });
          orderData["ReceiptNumber"] = `${ReceiptNumber.receipt}-${num}`;
        } else {
          orderData["ReceiptNumber"] = `${
            registerData.receipt_number_prefix
          }-${generate_random_string(3)}-${generate_random_number(4)}-1`;
          setItem(`Bill-${registerData.receipt_number_prefix}`, {
            receipt: `${
              registerData.receipt_number_prefix
            }-${generate_random_string(3)}-${generate_random_number(4)}`,
            sn: 1,
          });
        }
        // console.log("CustomerData.mobile", CustomerData.mobile, customer);
        orderData.customer = {
          mobile: CustomerData?.mobile
            ? Number(CustomerData.mobile)
            : customer == "Add Customer"
            ? ""
            : Number(customer),
          email: CustomerData?.email == undefined ? "" : CustomerData?.email,
          name: CustomerData?.name,
          shipping_address: CustomerData?.shipping_address,
          zipcode: CustomerData?.zipcode,
          city: CustomerData?.city,
        };
        orderData.details = {
          source: "web",
          sourceVersion: "5.2",
          saleType: "immediate",
          paymentStatus: "paid",
          itemsSold: getItem("product_Details"),
          fulfillmentStatus: "Fulfilled",
          tableName: tableName,
          order_by_name: userDetailData,
          immediate_sale: {
            multiple_payments_type: [
              {
                name: PaymentType,
                value: finalPrice,
                paymentDate: new Date(),
              },
            ],
          },
          priceSummery: {
            total: totalcalculatedPrice,
            totalTaxes: totalcalculatedTax,
          },
        };
        if (Number(bulckdiscuntButtonText.discountValue) > 0) {
          orderData.details.bulckDiscountValue = Number(
            bulckdiscuntButtonText.discountValue
          );
        }
        if (TotalAddtionalChargeValue > 0) {
          orderData.details.AddtionChargeValue = AddtionalChargeList;
        }

        if (CustomerData?.custom_fields) {
          let tagList = [];
          let additionalList = [];
          TagList.map((field) => {
            CustomerData.custom_fields.map((val) => {
              if (val.type == "tag" && field.name == val.name) {
                tagList.push(field);
              } else if (val.type == "additional_detail")
                additionalList.push(val);
            });
          });
          orderData.details.custom_fields = tagList;
          orderData.details.customer_custom_fields = additionalList;
          return;
        }

        // window.frames[
        //   "print_frame"
        // ].document.body.innerHTML = ReactDOMServer.renderToStaticMarkup(
        //   <ReceiptPrint
        //     receiptsDetails={orderData}
        //     shopDetails={shopDetails}
        //     registerData={registerData}
        //   />
        // );
        // window.frames["print_frame"].window.print();

        const getOrder = await dispatch(CreateOrder(orderData));
        var ww = screen.availWidth;
        var wh = screen.availHeight - 90;

        //Print Window (pw)
        var pw = window.open("", "newWin", "width=" + ww + ",height=" + wh);

        pw.document.write(
          ReactDOMServer.renderToStaticMarkup(
            <ReceiptPrint
              receiptsDetails={orderData}
              shopDetails={shopDetails}
              registerData={registerData}
            />
          )
        );
        pw.document.write("</body></html>");
        pw.document.close();
        pw.print();
        pw.close();
        if (getOrder) {
          setItem("receiptDetails", getOrder.orderData);

          // window.frames[
          //   "print_frame"
          // ].document.body.innerHTML = ReactDOMServer.renderToStaticMarkup(
          //   <ReceiptPrint
          //     receiptsDetails={getOrder.orderData}
          //     shopDetails={shopDetails}
          //     registerData={registerData}
          //   />
          // );
          // window.frames["print_frame"].window.print();

          if (
            getItem("print_server_copy") !== null &&
            getItem("print_server_copy") == true
          ) {
            window.frames[
              "print_frame"
            ].document.body.innerHTML = ReactDOMServer.renderToStaticMarkup(
              <ReceiptPrint
                title="SERVER COPY"
                receiptsDetails={getOrder.orderData}
                shopDetails={shopDetails}
                registerData={registerData}
              />
            );
            window.frames["print_frame"].window.focus();
            window.frames["print_frame"].window.print();
          }
          console.log("localCartInfolocalCartInfo23456", localCartInfo);
          if (
            localCartInfo?.type == "take-away-local" ||
            localCartInfo?.type == "delivery-local"
          ) {
            tableStatusChange(localCartInfo.cartKey, "Delete");
            // removeCartFromLocalStorage(localCartInfo.cartKey);
          } else {
            removeCartFromLocalStorage(localCartInfo?.cartKey);
            setSelectedProduct([]);
            setselectedTable();
          }
          registerData.table_numbers != ""
            ? tabChangeToCurrent("ORDER")
            : setChargeClick(false);
          // registerData.table_numbers != ""
          //   ? tabChangeToCurrent("ORDER")
          //   : setChargeClick(false);
        }
        setSelectedProduct([]);
        return;
        // setChargeClick(true);
      } else {
        setChargeClick(true);
        return;
      }

      return;
    }
  };

  // total Calculateds

  function currentcustomerData(value) {
    form.setFieldsValue({
      mobile: value.mobile,
      name: value.name === "" ? value.mobile : value.name,
    });
    setCustomerData({
      name: value.name === "" ? value.mobile : value.name,
      mobile: value.mobile,
      shipping_address: value.shipping_address,
      city: value.city,
      zipcode: value.zipcode,
      _id: value.id ? value.id : "",
    });
  }

  const onSearch = async (e) => {
    if (e.key === "Enter" && e.target.value !== "") {
      setSpinOn(true);
      setNotChange(false);
      const getSearchList = await dispatch(filterListData(e.target.value));
      if (getSearchList && getSearchList.customerListData.length > 0) {
        message.success({
          content: "Mobile number is match",
          style: {
            float: "right",
            marginTop: "2vh",
          },
        });
        setSpinOn(false);
        setCustomerData(getSearchList.customerListData[0]);
      } else {
        message.error({
          content: "Mobile number is not match",
          style: {
            float: "right",
            marginTop: "2vh",
          },
        });
        setSpinOn(false);

        setCustomerData({
          ...CustomerData,
        });
      }
    }
  };

  const onClickSearch = async () => {
    customer === "Add Customer" ? "" : setSpinOn(true);

    const getSearchList = await dispatch(filterListData(customer));
    if (getSearchList && getSearchList.customerListData.length > 0) {
      setSpinOn(false);
      setCustomerData(getSearchList.customerListData[0]);
    } else {
      customer === "Add Customer" ? "" : setSpinOn(false);

      setCustomerData({
        ...CustomerData,
      });
    }
  };

  const qunatityChange = (records, e) => {
    if (localCartInfo && localCartInfo.Status == "Unpaid") {
      setNotUpdate(true);
    } else {
      const findIndex = selectedProduct.findIndex(
        (product) => product.key === records.key
      );

      if (findIndex != -1) {
        selectedProduct[findIndex].quantity = Number(e.target.value);

        let price1 = 0;

        if (selectedProduct[findIndex].price) {
          price1 = selectedProduct[findIndex].price;
        } else {
          price1 = selectedProduct[findIndex].key_price;
        }

        if (
          selectedProduct[findIndex].discountType == "free_item" &&
          selectedProduct[findIndex]?.customDiscountedValue
        ) {
          if (
            selectedProduct[findIndex].quantity *
              selectedProduct[findIndex].price >=
            selectedProduct[findIndex].discountData *
              selectedProduct[findIndex].price
          ) {
            selectedProduct[findIndex].customDiscountedValue =
              selectedProduct[findIndex].price *
              selectedProduct[findIndex].discountData;
          } else {
            selectedProduct[findIndex].customDiscountedValue =
              selectedProduct[findIndex].quantity *
              selectedProduct[findIndex].price;
          }
          // } else {
          //   if (selectedProduct[findIndex]?.discountData) {
          //     if (
          //       selectedProduct[findIndex].quantity * price1 >=
          //       selectedProduct[findIndex].discountData
          //     ) {
          //       // if((selectedProduct[findIndex].discountData * price1)>=selectedProduct[findIndex].calculatedprice){
          //       // selectedProduct[findIndex].customDiscountedValue = selectedProduct[findIndex].calculatedprice
          //       // }else{
          //       selectedProduct[findIndex].customDiscountedValue =
          //         selectedProduct[findIndex].discountData * price1;
          //       // }
          //     } else {
          //       selectedProduct[findIndex].customDiscountedValue =
          //         selectedProduct[findIndex].quantity * price1;
          //     }
          //   }
        }
        let price = getProductPrice(selectedProduct[findIndex]);
        selectedProduct[findIndex].calculatedprice =
          selectedProduct[findIndex].quantity * price;
        //used to set custom discount as quantity vary
        if (selectedProduct[findIndex].discountType === "cash") {
          // selectedProduct[findIndex].customDiscountedValue = Number(
          //   // selectedProduct[findIndex]?.quantity *
          //     selectedProduct[findIndex].discountData
          // ).toFixed(2);
        } else if (selectedProduct[findIndex].discountType === "percentage") {
          selectedProduct[findIndex].customDiscountedValue = Number(
            (selectedProduct[findIndex]?.calculatedprice / 100) *
              selectedProduct[findIndex].discountData
          ).toFixed(2);
        }
        applyDiscount(findIndex);
      }

      setSelectedProduct([...selectedProduct]);
      if (localCartInfo) {
        localCartInfo = setCartInfoFromLocalKey(localCartInfo.cartKey, [
          ...selectedProduct,
        ]);
      }
    }
  };
  const columns = () => {
    let cols = [
      {
        title: "Item",
        dataIndex: "display_name",
        key: "display_name",
        width: "30%",
        render(text, record) {
          let text2 = text.toString();
          let newSpilitArray = text2.split(/[+]/);
          let newSpilitArray1 = text2.split(/[,]/);
          let finalArray = [];
          newSpilitArray.map((value) => {
            finalArray.push(value.replace(/,/gi, ""));
          });
          return {
            children: (
              <>
                {text2.includes("-") ? (
                  newSpilitArray1.map((val) => <div>{val}</div>)
                ) : (
                  <div>
                    {" "}
                    {finalArray.length > 1 ? (
                      <div>
                        {finalArray.map((value, index) => {
                          return (
                            <div>
                              {index > 0 ? "+" : null}
                              {value}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div>{text}</div>
                    )}
                  </div>
                )}
              </>
            ),
          };
        },
      },
      {
        title: "Quantity",
        dataIndex: "quantity",
        key: "quantity",
        align: "left",
        render(text, record, index) {
          return {
            children: (
              <>
                {getItem("hide_quantity_increase_decrease_buttons") ? (
                  <Input
                    className="qchnagew"
                    type="number"
                    style={{ padding: "4px " }}
                    min={1}
                    value={record.quantity}
                    onChange={(e) => {
                      qunatityChange(record, e);
                    }}
                    onKeyPress={(event) => {
                      if (event.key.match("[0-9]+")) {
                        return true;
                      } else {
                        return event.preventDefault();
                      }
                    }}
                  />
                ) : (
                  <div className="quantityies qucuentlft">
                    <span
                      className="qunatity-adjust"
                      onClick={() => text > 0 && removeOneQuantity(record)}
                    >
                      −
                    </span>
                    {text}
                    <span
                      className="qunatity-adjust"
                      onClick={() => addOneQuantity(record)}
                    >
                      +
                    </span>
                  </div>
                )}
              </>
            ),
          };
        },
      },
      {
        title: "Price",
        dataIndex: "calculatedprice",
        key: "calculatedprice",
        align: "left",
        render(text, record) {
          return {
            children: <div>₹{Number(text).toFixed(2)}</div>,
          };
        },
      },
      {
        title: "",
        align: "center",

        render(text, record) {
          return {
            children: (
              <EditOutlined
                onClick={() => {
                  if (localCartInfo && localCartInfo.Status == "Unpaid") {
                    setNotUpdate(true);
                  } else {
                    setItem("product_Details", selectedProduct);
                    productDetailsForEdit(record, true);
                  }
                }}
              />
            ),
          };
        },
      },
    ];

    // let action =

    // if (!status) {
    //   cols.splice(cols.length - 1, 0, action);
    // }

    let col_discount = {
      title: "Discount",
      align: "center",
      render(text, record, index) {
        return {
          children: (
            <div>
              {text.discountedValue ||
              (text.customDiscountedValue && text.quantity > 0)
                ? `₹${text.discountedValue || text.customDiscountedValue} `
                : ""}
            </div>
          ),
        };
      },
    };

    if (status) {
      cols.splice(cols.length - 1, 0, col_discount);
    }

    return cols;
  };

  const getCategoryById = async (category_id) => {
    if (category_id == "Top") {
      setAllProduct([...topSellList]);
      setAllProductList([...topSellList]);
      setCategoryId(category_id);
      return;
    }

    const getProductList = await dispatch(
      getCategoryWiseAllProductList(category_id, pageNumber, registerData._id)
    );

    if (isMounted.current && getProductList && getProductList.productList) {
      getProductList.productList.map((value, index) => {
        let totalTax = 0;
        value.price = Number(value.price.toFixed(2));
        if (value.option_variant_group.length > 0) {
          let minimumArray = [];
          value.option_variant_group.map((varints) => {
            varints.product_variants.map((variant) => {
              minimumArray.push(variant.price);
            });
          });
          let variantMinPrice = Math.min.apply(Math, minimumArray);
          value.newPrice = Number(value.price + variantMinPrice).toFixed(2);
        } else {
          value.newPrice = Number(value.price).toFixed(2);
        }
        if (value.product_name.length > 30) {
          let divideArray = value.product_name.match(/.{1,30}/g);
          value.Newproduct_name = value.product_name.replace(
            divideArray[1],
            ".."
          );
        }
        console.log("value.tax_group34444", value.tax_group);
        if (value.tax_group && value.tax_group.taxes.length > 0) {
          value.tax_group.taxes.map((tax) => (totalTax += tax.tax_percentage));
          value.tax_group.Totaltax = totalTax;
        } else {
          value.tax_group.Totaltax = totalTax;
        }

        if (value.tax_group.taxes_inclusive_in_product_price) {
          if (value.price === 0) {
            value.price = value.price;
          } else {
            let price1;
            if (totalTax === 0) {
              value.price = Number(value.price.toFixed(2));
            } else {
              let total2;
              let price2;
              let price3;
              price1 = value.price * totalTax;
              total2 = 100 + totalTax;
              price2 = price1 / total2;
              price3 = Number(value.price - price2).toFixed(2);
              value.price = Number(price3);
            }
          }

          // value.price =
          //   value.price - (value.price * totalTax) / (100 + totalTax);
        }
      });

      setAllProductList(getProductList.productList);
    }
    setCategoryId(category_id);
  };

  function removeAllDiscounts() {
    selectedProduct.map((value) => {
      value.discountedValue = 0;
      return value;
    });
  }

  function applyManualDiscount(manualDiscountStateObject, findIndex) {
    let applied = false;
    if (manualDiscountStateObject !== null && manualCouponObject === null) {
      let presentInBuy = manualDiscountStateObject.buy_products.includes(
        selectedProduct[findIndex].id
      );
      if (presentInBuy) {
        let getDiscountProduct = selectedProduct?.find(function(o1) {
          return manualDiscountStateObject.get_products.includes(o1.id);
        });
        let index = selectedProduct?.findIndex(function(o1) {
          return o1.id === getDiscountProduct?.id;
        });
        if (index !== -1) {
          if (
            selectedProduct[findIndex]?.quantity <= getDiscountProduct?.quantity
          ) {
            removeAllDiscounts();
            let price = getProductPrice(getDiscountProduct);
            selectedProduct[index].discountedValue = Number(
              selectedProduct[findIndex]?.quantity * price
            ).toFixed(2);
            applied = true;
          }
        }
      } else {
        let presentInGet = manualDiscountStateObject.get_products.includes(
          selectedProduct[findIndex].id
        );
        if (presentInGet) {
          let buyDiscountProduct = selectedProduct?.find(function(o1) {
            return manualDiscountStateObject.buy_products.includes(o1.id);
          });
          if (
            selectedProduct[findIndex]?.quantity <= buyDiscountProduct?.quantity
          ) {
            removeAllDiscounts();
            let price = getProductPrice(selectedProduct[findIndex]);
            selectedProduct[findIndex].discountedValue = Number(
              selectedProduct[findIndex]?.quantity * price
            ).toFixed(2);
            applied = true;
          }
        }
      }
    }
    return applied;
  }

  function getDiscountObject(productsArray) {
    let getDiscountProduct = getItem("ApplyBuyOneGetOne")?.find(function(o1) {
      return productsArray?.some(function(o2) {
        return (
          o1.get_products.includes(o2.id) || o1.buy_products.includes(o2.id)
        );
      });
    });
    return getDiscountProduct;
  }

  function applyDiscount(findIndex) {
    let applied = applyManualDiscount(staticManualCouponObject, findIndex);
    if (applied) {
      let clone = JSON.parse(JSON.stringify(staticManualCouponObject));
      setManualCouponObject(clone);
      // pass if applied
    } else if (manualCouponObject != null) {
      let presentInBuy = manualCouponObject.buy_products.includes(
        selectedProduct[findIndex].id
      );
      if (presentInBuy) {
        let getDiscountProduct = selectedProduct?.find(function(o1) {
          return manualCouponObject.get_products.includes(o1.id);
        });
        let index = selectedProduct?.findIndex(function(o1) {
          return o1.id === getDiscountProduct?.id;
        });
        if (index !== -1) {
          if (
            selectedProduct[findIndex]?.quantity <= getDiscountProduct?.quantity
          ) {
            removeAllDiscounts();
            let price = getProductPrice(getDiscountProduct);
            selectedProduct[
              index
            ].discountedValue = manualCouponObject.apply_discount_only_once_per_order
              ? price
              : Number(selectedProduct[findIndex]?.quantity * price).toFixed(2);
          }
        }
      } else {
        let presentInGet = manualCouponObject.get_products.includes(
          selectedProduct[findIndex].id
        );
        if (presentInGet) {
          let buyDiscountProduct = selectedProduct?.find(function(o1) {
            return manualCouponObject.buy_products.includes(o1.id);
          });
          if (
            selectedProduct[findIndex]?.quantity <= buyDiscountProduct?.quantity
          ) {
            removeAllDiscounts();
            let price = getProductPrice(selectedProduct[findIndex]);
            selectedProduct[
              findIndex
            ].discountedValue = manualCouponObject.apply_discount_only_once_per_order
              ? price
              : Number(selectedProduct[findIndex]?.quantity * price).toFixed(2);
          }
        }
      }
    } else {
      let presentInBuy = getItem("ApplyBuyOneGetOne")?.some(function(o2) {
        return o2.buy_products.includes(selectedProduct[findIndex].id);
      });
      let discountObject = getDiscountObject(selectedProduct);
      let apply_discount_only_once_per_order = discountObject
        ? discountObject.apply_discount_only_once_per_order
        : false;

      if (presentInBuy) {
        let getDiscountProduct = selectedProduct?.find(function(o1) {
          return getItem("ApplyBuyOneGetOne")?.some(function(o2) {
            return o2.get_products.includes(o1.id);
          });
        });
        let index = selectedProduct?.findIndex(function(o1) {
          return o1.id === getDiscountProduct?.id;
        });
        if (index !== -1) {
          if (
            selectedProduct[findIndex]?.quantity <= getDiscountProduct?.quantity
          ) {
            let price = getProductPrice(getDiscountProduct);
            selectedProduct[
              index
            ].discountedValue = apply_discount_only_once_per_order
              ? price
              : Number(selectedProduct[findIndex]?.quantity * price).toFixed(2);
          }
        }
      } else {
        let presentInGet = getItem("ApplyBuyOneGetOne")?.some(function(o2) {
          return o2.get_products.includes(selectedProduct[findIndex].id);
        });
        if (presentInGet) {
          let buyDiscountProduct = selectedProduct?.find(function(o1) {
            return getItem("ApplyBuyOneGetOne")?.some(function(o2) {
              return o2.buy_products.includes(o1.id);
            });
          });
          if (
            selectedProduct[findIndex]?.quantity <= buyDiscountProduct?.quantity
          ) {
            let price = getProductPrice(selectedProduct[findIndex]);
            selectedProduct[
              findIndex
            ].discountedValue = apply_discount_only_once_per_order
              ? price
              : Number(selectedProduct[findIndex]?.quantity * price).toFixed(2);
          }
        }
      }
    }
    let presentDiscount = selectedProduct.filter(
      (data) =>
        parseInt(data.customDiscountedValue) !== 0 &&
        data.customDiscountedValue !== undefined
    );
    let presentCustomDiscount = selectedProduct.some(
      (data) =>
        data.customDiscountedValue !== 0 &&
        data.customDiscountedValue !== undefined
    );

    setDiscountValue(presentDiscount);
    setCustomDiscountValue(presentCustomDiscount);
  }
  let [localDetails, setLocalDetails] = useState();
  const newProductSaveInCart = (formdata, getProduct) => {
    const findIndex = selectedProduct.findIndex(
      (product) => product.key === getProduct.key
    );
    let pro = [...selectedProduct];

    if (findIndex < 0) {
      pro = [...selectedProduct, getProduct];

      setItem("product_Details", pro);
    } else {
      selectedProduct[findIndex].quantity =
        selectedProduct[findIndex].quantity + getProduct.quantity;
      selectedProduct[findIndex].calculatedprice =
        selectedProduct[findIndex].calculatedprice + getProduct.calculatedprice;
      pro = [...selectedProduct];

      setItem("product_Details", pro);
    }

    if (manualCouponObject == null) {
      let index = pro?.findIndex(function(o1) {
        return getItem("ApplyBuyOneGetOne")?.some(function(o2) {
          return o2.buy_products.includes(o1.id);
        });
      });

      if (index !== -1) {
        getItem("ApplyBuyOneGetOne")?.map((data) =>
          pro.map((item) => {
            if (data.get_products.includes(item.id)) {
              item.discountedValue = item.price;
            } else {
              item.discountedValue = 0;
            }
          })
        );
      }
      let presentDiscount = pro.filter(
        (data) =>
          parseInt(data.discountedValue) !== 0 &&
          data.discountedValue !== undefined
      );
      let presentCustomDiscount = pro.some(
        (data) =>
          data.customDiscountedValue !== 0 &&
          data.customDiscountedValue !== undefined
      );
      setDiscountValue(presentDiscount);
      setCustomDiscountValue(presentCustomDiscount);
      setAdddiscountValue(presentDiscount);
    }

    applyProductAutoDiscount(pro);
    setSelectedProduct(pro);

    newproductDetailsRef.current.hideModal();
    if (localCartInfo && localCartInfo.cartKey) {
      localCartInfo = setCartInfoFromLocalKey(localCartInfo?.cartKey, [
        ...selectedProduct,
        getProduct,
      ]);
    } else if (registerData.table_numbers == "") {
      localCartInfo = createNewCartwithKeyandPush(
        "DRAFT_CART",
        [...selectedProduct, getProduct],
        registerData
      );
      setLocalDetails(localCartInfo);
    }
  };

  function addOneQuantity(records) {
    if (localCartInfo && localCartInfo.Status == "Unpaid") {
      setNotUpdate(true);
    } else {
      const findIndex = selectedProduct.findIndex(
        (product) => product.key === records.key
      );

      if (findIndex != -1) {
        selectedProduct[findIndex].quantity = ++selectedProduct[findIndex]
          .quantity;

        let price1 = 0;

        if (selectedProduct[findIndex].price) {
          price1 = selectedProduct[findIndex].price;
        } else {
          price1 = selectedProduct[findIndex].key_price;
        }

        if (
          selectedProduct[findIndex].discountType == "free_item" &&
          selectedProduct[findIndex]?.customDiscountedValue
        ) {
          if (
            selectedProduct[findIndex].quantity *
              selectedProduct[findIndex].price >=
            selectedProduct[findIndex].discountData *
              selectedProduct[findIndex].price
          ) {
            selectedProduct[findIndex].customDiscountedValue =
              selectedProduct[findIndex].price *
              selectedProduct[findIndex].discountData;
          } else {
            selectedProduct[findIndex].customDiscountedValue =
              selectedProduct[findIndex].quantity *
              selectedProduct[findIndex].price;
          }
          // } else {
          //   if (selectedProduct[findIndex]?.discountData) {
          //     if (
          //       selectedProduct[findIndex].quantity * price1 >=
          //       selectedProduct[findIndex].discountData
          //     ) {
          //       // if((selectedProduct[findIndex].discountData * price1)>=selectedProduct[findIndex].calculatedprice){
          //       // selectedProduct[findIndex].customDiscountedValue = selectedProduct[findIndex].calculatedprice
          //       // }else{
          //       selectedProduct[findIndex].customDiscountedValue =
          //         selectedProduct[findIndex].discountData * price1;
          //       // }
          //     } else {
          //       selectedProduct[findIndex].customDiscountedValue =
          //         selectedProduct[findIndex].quantity * price1;
          //     }
          //   }
        }
        let price = getProductPrice(selectedProduct[findIndex]);
        selectedProduct[findIndex].calculatedprice =
          selectedProduct[findIndex].quantity * price;
        //used to set custom discount as quantity vary
        if (selectedProduct[findIndex].discountType === "cash") {
          // selectedProduct[findIndex].customDiscountedValue = Number(
          //   // selectedProduct[findIndex]?.quantity *
          //     selectedProduct[findIndex].discountData
          // ).toFixed(2);
        } else if (selectedProduct[findIndex].discountType === "percentage") {
          selectedProduct[findIndex].customDiscountedValue = Number(
            (selectedProduct[findIndex]?.calculatedprice / 100) *
              selectedProduct[findIndex].discountData
          ).toFixed(2);
        }
        applyDiscount(findIndex);
      }

      setSelectedProduct([...selectedProduct]);
      if (localCartInfo) {
        localCartInfo = setCartInfoFromLocalKey(localCartInfo.cartKey, [
          ...selectedProduct,
        ]);
      }
    }
  }

  function applyDiscountNegetive(findIndex) {
    if (manualCouponObject != null) {
      let presentInBuy = manualCouponObject.buy_products.includes(
        selectedProduct[findIndex].id
      );
      if (presentInBuy) {
        let getDiscountProduct = selectedProduct?.find(function(o1) {
          return manualCouponObject.get_products.includes(o1.id);
        });
        let index = selectedProduct?.findIndex(function(o1) {
          return o1.id === getDiscountProduct?.id;
        });
        if (index !== -1) {
          if (
            selectedProduct[findIndex]?.quantity <= getDiscountProduct?.quantity
          ) {
            let price = getProductPrice(getDiscountProduct);
            selectedProduct[index].discountedValue = Number(
              selectedProduct[findIndex]?.quantity * price
            ).toFixed(2);
          }
          if (selectedProduct[findIndex]?.quantity === 0) {
            setManualCouponObject(null);
            applyProductAutoDiscount(selectedProduct);
          }
        }
      } else {
        let presentInGet = manualCouponObject.get_products.includes(
          selectedProduct[findIndex].id
        );
        if (presentInGet) {
          let buyDiscountProduct = selectedProduct?.find(function(o1) {
            return manualCouponObject.buy_products.includes(o1.id);
          });
          if (
            selectedProduct[findIndex]?.quantity <= buyDiscountProduct?.quantity
          ) {
            let price = getProductPrice(selectedProduct[findIndex]);
            selectedProduct[findIndex].discountedValue = Number(
              selectedProduct[findIndex]?.quantity * price
            ).toFixed(2);
          }
          if (selectedProduct[findIndex]?.quantity === 0) {
            setManualCouponObject(null);
            applyProductAutoDiscount(selectedProduct);
          }
        }
      }
    } else {
      let presentInBuy = getItem("ApplyBuyOneGetOne")?.some(function(o2) {
        return o2.buy_products.includes(selectedProduct[findIndex].id);
      });
      if (presentInBuy) {
        let getDiscountProduct = selectedProduct?.find(function(o1) {
          return getItem("ApplyBuyOneGetOne")?.some(function(o2) {
            return o2.get_products.includes(o1.id);
          });
        });
        let index = selectedProduct?.findIndex(function(o1) {
          return o1.id === getDiscountProduct?.id;
        });
        if (index !== -1) {
          if (
            selectedProduct[findIndex]?.quantity <= getDiscountProduct?.quantity
          ) {
            let price = getProductPrice(getDiscountProduct);
            selectedProduct[index].discountedValue = Number(
              selectedProduct[findIndex]?.quantity * price
            ).toFixed(2);
          }
        }
      } else {
        let presentInGet = getItem("ApplyBuyOneGetOne")?.some(function(o2) {
          return o2.get_products.includes(selectedProduct[findIndex].id);
        });
        if (presentInGet) {
          let buyDiscountProduct = selectedProduct?.find(function(o1) {
            return getItem("ApplyBuyOneGetOne")?.some(function(o2) {
              return o2.buy_products.includes(o1.id);
            });
          });
          if (
            selectedProduct[findIndex]?.quantity <= buyDiscountProduct?.quantity
          ) {
            let price = getProductPrice(selectedProduct[findIndex]);
            selectedProduct[findIndex].discountedValue = Number(
              selectedProduct[findIndex]?.quantity * price
            ).toFixed(2);
          }
        }
      }
    }
  }

  function removeOneQuantity(records) {
    if (localCartInfo && localCartInfo.Status == "Unpaid") {
      setNotUpdate(true);
    } else {
      const findIndex = selectedProduct.findIndex(
        (product) => product.key === records.key
      );

      if (findIndex != -1) {
        selectedProduct[findIndex].quantity = --selectedProduct[findIndex]
          .quantity;
        if (
          selectedProduct[findIndex].quantity *
            selectedProduct[findIndex].price <
          selectedProduct[findIndex].customDiscountedValue
        ) {
          selectedProduct[findIndex].customDiscountedValue =
            selectedProduct[findIndex].quantity *
            selectedProduct[findIndex].price;
        }
        let price = getProductPrice(selectedProduct[findIndex]);

        selectedProduct[findIndex].calculatedprice =
          selectedProduct[findIndex].quantity * price;
        // removeOneQuantityOrderTikets(selectedProduct[findIndex]);
        //used to set custom discount as quantity vary
        if (selectedProduct[findIndex].discountType === "cash") {
          // selectedProduct[findIndex].customDiscountedValue = Number(
          //   selectedProduct[findIndex]?.quantity *
          //     Number(selectedProduct[findIndex].discountData)
          // ).toFixed(2);
        } else if (selectedProduct[findIndex].discountType === "percentage") {
          selectedProduct[findIndex].customDiscountedValue = Number(
            (selectedProduct[findIndex]?.calculatedprice / 100) *
              Number(selectedProduct[findIndex].discountData)
          ).toFixed(2);
        }
        applyDiscountNegetive(findIndex);
      }
      let presentDiscount = selectedProduct.filter(
        (data) =>
          parseInt(data.discountedValue) !== 0 &&
          data.discountedValue !== undefined
      );
      let presentCustomDiscount = selectedProduct.some(
        (data) =>
          data.customDiscountedValue !== 0 &&
          data.customDiscountedValue !== undefined
      );
      setDiscountValue([{ presentDiscount }]);
      setCustomDiscountValue(presentCustomDiscount);
      selectedProduct = selectedProduct.filter((i) => !i.quantity == 0);
      setSelectedProduct([...selectedProduct]);
      if (localCartInfo && localCartInfo.cartKey) {
        localCartInfo = setCartInfoFromLocalKey(localCartInfo.cartKey, [
          ...selectedProduct,
        ]);
      }
    }
  }
  const [TagList, setTagList] = useState([]);

  useEffect(() => {
    async function fetchTagList() {
      const getTagList = await dispatch(getAllTagList("sell"));
      if (isMounted.current && getTagList && getTagList.TagList) {
        setTagList(getTagList.TagList);
      }
    }
    if (isMounted.current) {
      fetchTagList();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  function applyProductAutoDiscount(pro) {
    let discountObject = getDiscountObject(pro);
    let apply_discount_only_once_per_order = discountObject
      ? discountObject.apply_discount_only_once_per_order
      : false;
    let index = pro?.findIndex(function(o1) {
      return getItem("ApplyBuyOneGetOne")?.some(function(o2) {
        return o2.buy_products.includes(o1.id);
      });
    });
    if (index !== -1) {
      getItem("ApplyBuyOneGetOne")?.map((data) =>
        pro.map((item) => {
          if (data.get_products.includes(item.id)) {
            let price = getProductPrice(item);
            item.discountedValue = apply_discount_only_once_per_order
              ? price
              : Number(item.quantity * price).toFixed(2);
          }
        })
      );
    }
    var presentDiscount = pro.filter(
      (data) => data.discountedValue !== 0 && data.discountedValue !== undefined
    );
    let presentCustomDiscount = pro.some(
      (data) =>
        data.customDiscountedValue !== 0 &&
        data.customDiscountedValue !== undefined
    );
    setDiscountValue(presentDiscount);
    setCustomDiscountValue(presentCustomDiscount);
    setAdddiscountValue(presentDiscount);
  }

  function productDetails(details, click) {
    if (localCartInfo && localCartInfo.Status == "Unpaid") {
      setNotUpdate(true);
    } else {
      if (
        details.option_variant_group.length > 0 ||
        details.option_addon_group.length > 0 ||
        details.option_item_group.length > 0
      ) {
        let isVarience = false;
        let isAddon = false;
        let isAddon1st = false;
        let isAddon2nd = false;
        let isAddon3rd = false;
        let product_variants = [];
        let isAddon1stOptions = [];
        let isAddon2ndOptions = [];
        let isAddon3rdOptions = [];
        let AddonOptions = [];

        if (details.option_variant_group.length >= 1) {
          isVarience = true;
          product_variants = details.option_variant_group[0].product_variants;
          product_variants = product_variants.map((v) => ({
            ...v,
            isSelected: false,
          }));

          // product_variants.sort((a, b) => (a.sort_order > b.sort_order ? 1 : -1));

          details.option_variant_group[0].product_variants = product_variants;
        }

        if (details.option_variant_group.length >= 2) {
          isVarience = true;
          product_variants = details.option_variant_group[1].product_variants;
          product_variants = product_variants.map((v) => ({
            ...v,
            isSelected: false,
          }));

          // product_variants.sort((a, b) => (a.sort_order > b.sort_order ? 1 : -1));
          details.option_variant_group[1].product_variants = product_variants;
        }

        if (details.option_variant_group.length >= 3) {
          isVarience = true;
          product_variants = details.option_variant_group[2].product_variants;
          product_variants = product_variants.map((v) => ({
            ...v,
            isSelected: false,
          }));

          // product_variants.sort((a, b) => (a.sort_order > b.sort_order ? 1 : -1));
          details.option_variant_group[2].product_variants = product_variants;
        }

        if (details.option_variant_group.length >= 4) {
          isVarience = true;
          product_variants = details.option_variant_group[3].product_variants;
          product_variants = product_variants.map((v) => ({
            ...v,
            isSelected: false,
          }));

          // product_variants.sort((a, b) => (a.sort_order > b.sort_order ? 1 : -1));
          details.option_variant_group[3].product_variants = product_variants;
        }

        if (details.option_addon_group.length > 0) {
          isAddon = true;
        }

        if (details.option_addon_group.length >= 1) {
          isAddon1st = true;
          isAddon1stOptions = details.option_addon_group[0].product_addons;
          isAddon1stOptions = isAddon1stOptions.map((v) => ({
            ...v,
            isSelected: false,
          }));

          // isAddon1stOptions.sort((a, b) =>
          //   a.sort_order > b.sort_order ? 1 : -1
          // );
          details.option_addon_group[0].product_addons = isAddon1stOptions;
        }

        if (details.option_addon_group.length >= 2) {
          isAddon2nd = true;
          isAddon2ndOptions = details.option_addon_group[1].product_addons;
          isAddon2ndOptions = isAddon2ndOptions.map((v) => ({
            ...v,
            isSelected: false,
          }));

          // isAddon2ndOptions.sort((a, b) =>
          //   a.sort_order > b.sort_order ? 1 : -1
          // );
          details.option_addon_group[1].product_addons = isAddon2ndOptions;
        }

        if (details.option_addon_group.length >= 3) {
          isAddon3rd = true;
          isAddon3rdOptions = details.option_addon_group[2].product_addons;
          isAddon3rdOptions = isAddon3rdOptions.map((v) => ({
            ...v,
            isSelected: false,
          }));

          // isAddon3rdOptions.sort((a, b) =>
          //   a.sort_order > b.sort_order ? 1 : -1
          // );
          details.option_addon_group[2].product_addons = isAddon3rdOptions;
        }

        AddonOptions = [
          ...isAddon1stOptions,
          ...isAddon2ndOptions,
          ...isAddon3rdOptions,
        ];

        // if (details.option_addon_group.length >= 2) {
        //   details.option_addon_group.sort((a, b) =>
        //     a.sort_order > b.sort_order ? 1 : -1
        //   );
        // }

        //details.option_variant_group;

        //option_variant_group = option_variant_group.map(v => ({...v, isActive: true}))
        let taxes = 0;
        details.tax_group.taxes.map((data) => {
          taxes += data.tax_percentage;
        });
        let Details = {
          key: details._id,
          id: details._id,
          item: details.product_name,
          display_name: details.product_name,
          price: details.price,
          calculatedprice: details.price,
          quantity: 1,
          newqty: 1,
          option_variant_group: details.option_variant_group,
          old_varints_group: details.option_variant_group,
          option_addon_group: details.option_addon_group,
          cal: details.calculatedprice,
          qty: details.quantity,
          new_item: true,
          isAddon: isAddon,
          isAddon1st: isAddon1st,
          isAddon2nd: isAddon2nd,
          isAddon3rd: isAddon3rd,
          AddonOptions: AddonOptions,
          isVarience: isVarience,
          variance_price: 0,
          variance_object: {},
          productTaxes: details.tax_group.Totaltax,
          taxGroup: details.tax_group,
          option_item_group: details.option_item_group,
          option_status: details.option_status,
          order_ticket_group: details.product_category.order_ticket_group,
          notes: details.notes,
          add_or_remove: "Added Items",
        };
        newproductDetailsRef.current.showModal();
        setNewProductData(Details);
        updateCartCount();
        return;
      } else {
        const getProductAddedIndex = selectedProduct.findIndex(
          (product) => product.key === details._id
        );

        if (getProductAddedIndex === -1) {
          let isVarience = false;
          let isAddon = false;
          let isAddon1st = false;
          let isAddon2nd = false;
          let isAddon3rd = false;
          let product_variants = [];
          let isAddon1stOptions = [];
          let isAddon2ndOptions = [];
          let isAddon3rdOptions = [];
          let AddonOptions = [];

          if (details.option_variant_group.length > 0) {
            isVarience = true;
            product_variants = details.option_variant_group[0].product_variants;
            product_variants = product_variants.map((v) => ({
              ...v,
              isSelected: false,
            }));
            details.option_variant_group[0].product_variants = product_variants;
          }

          if (details.option_addon_group.length > 0) {
            isAddon = true;
          }

          if (details.option_addon_group.length >= 1) {
            isAddon1st = true;
            isAddon1stOptions = details.option_addon_group[0].product_addons;
            isAddon1stOptions = isAddon1stOptions.map((v) => ({
              ...v,
              isSelected: false,
            }));
            details.option_addon_group[0].product_addons = isAddon1stOptions;
          }

          if (details.option_addon_group.length >= 2) {
            isAddon2nd = true;
            isAddon2ndOptions = details.option_addon_group[1].product_addons;
            isAddon2ndOptions = isAddon2ndOptions.map((v) => ({
              ...v,
              isSelected: false,
            }));
            details.option_addon_group[1].product_addons = isAddon2ndOptions;
          }

          if (details.option_addon_group.length >= 3) {
            isAddon3rd = true;
            isAddon3rdOptions = details.option_addon_group[2].product_addons;
            isAddon3rdOptions = isAddon3rdOptions.map((v) => ({
              ...v,
              isSelected: false,
            }));
            details.option_addon_group[2].product_addons = isAddon3rdOptions;
          }

          AddonOptions = [
            ...isAddon1stOptions,
            ...isAddon2ndOptions,
            ...isAddon3rdOptions,
          ];
          let product = {
            key: details._id,
            id: details._id,
            key_price: 0,
            item: details.product_name,
            display_name: details.product_name,
            price: details.price,
            calculatedprice: details.price,
            quantity: 1,
            newqty: 1,
            notes: details.notes,

            option_variant_group: details.option_variant_group,
            option_addon_group: details.option_addon_group,
            cal: details.calculatedprice,
            new_item: true,
            isAddon: isAddon,
            isAddon1st: isAddon1st,
            isAddon2nd: isAddon2nd,
            isAddon3rd: isAddon3rd,
            AddonOptions: AddonOptions,
            isVarience: isVarience,
            variance_price: 0,
            variance_object: {},
            productTaxes: details.tax_group.Totaltax,
            taxGroup: details.tax_group,
            option_item_group: details.option_item_group,
            add_or_remove: "Added Items",
            order_ticket_group: details.product_category.order_ticket_group,
          };
          let pro = [...selectedProduct, product];

          setSelectedProduct(pro);
          updateCartCount();
          if (manualCouponObject == null) {
            applyProductAutoDiscount(pro);
          }
          setItem("product_Details", pro);
          if (
            localCartInfo != undefined &&
            Object.keys(localCartInfo).length > 0
          ) {
            localCartInfo = setCartInfoFromLocalKey(getItem("active_cart"), [
              ...selectedProduct,
              product,
            ]);
          } else if (registerData.table_numbers == "") {
            localCartInfo = createNewCartwithKeyandPush(
              "DRAFT_CART",
              [...selectedProduct, product],
              registerData
            );
          }
        } else {
          addOneQuantity(selectedProduct[getProductAddedIndex]);

          updateCartCount();
        }
      }
    }
  }

  function existsInManualDiscountProducts(discountObject, product) {
    let exists = false;
    if (discountObject !== null) {
      let presentInBuy = discountObject.buy_products.includes(product.id);
      if (presentInBuy) {
        exists = true;
      } else {
        let presentInGet = discountObject.get_products.includes(product.id);
        if (presentInGet) {
          exists = true;
        }
      }
    }
    return exists;
  }

  const removeSelectedItems = (itemToRemove) => {
    const findIndex = selectedProduct.findIndex(
      (product) => product.key === itemToRemove.key
    );
    selectedProduct.splice(findIndex, 1);
    let exists = existsInManualDiscountProducts(
      manualCouponObject,
      itemToRemove
    );
    if (exists) {
      setManualCouponObject(null);
      setStaticManualCouponObject(null);
      removeAllDiscounts();
      applyProductAutoDiscount(selectedProduct);
    }
    setSelectedProduct([...selectedProduct]);
    productDetailsRef.current.hideModal();
    if (localCartInfo && localCartInfo?.cartKey) {
      localCartInfo = setCartInfoFromLocalKey(
        localCartInfo?.cartKey,
        selectedProduct
      );
    }
  };

  const emptyCart = () => {
    setSelectedProduct([]);
    setTableName();
    setselectedTable();

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
    const allAddtionalChargeList = localData?.additionalCharges;

    setAddtionalChargeList(allAddtionalChargeList);
    if (
      localCartInfo?.type == "take-away-local" ||
      localCartInfo?.type == "delivery-local"
    ) {
      // localStorage.removeItem("active_cart");
      // removeItem("active_cart");
      tableStatusChange(localCartInfo.cartKey, "Delete");
    } else if (localCartInfo?.cartKey) {
      removeCartFromLocalStorage(localCartInfo.cartKey);
      setSelectedProduct([]);
      setselectedTable();
    }
    setlocalCartInfo();
    setCustomer("Add Customer");
    setCustomerData(null);
    updateCartCount();
    registerData.table_numbers != ""
      ? tabChangeToCurrent("ORDER")
      : setChargeClick(false);
  };

  const makeDraftOnHold = () => {
    editTableNameModalRef.current.showModal();
  };

  const redirectToCurrentFunc = () => {
    tabChangeToCurrent("CURRENT");
  };

  const saveFromEditModal = (formData, getProduct, ops) => {
    const findIndex = selectedProduct
      .reverse()
      .findIndex((product) => product.key === getProduct.key);

    selectedProduct[findIndex] = getProduct;
    let presentDiscount = selectedProduct.filter(
      (data) =>
        parseInt(data.discountedValue) !== 0 &&
        data.discountedValue !== undefined
    );
    let presentCustomDiscount = selectedProduct.some(
      (data) =>
        data.customDiscountedValue !== 0 &&
        data.customDiscountedValue !== undefined
    );
    setDiscountValue([{ presentDiscount }]);
    setCustomDiscountValue(presentCustomDiscount);
    setSelectedProduct([...selectedProduct]);
    productDetailsRef.current.hideModal();
    if (localCartInfo && localCartInfo.cartKey) {
      localCartInfo = setCartInfoFromLocalKey(localCartInfo?.cartKey, [
        ...selectedProduct,
      ]);
    }
  };

  function productDetailsForEdit(details2, isOpen) {
    setProductDetailsForUpdate(details2);
    if (isOpen) {
      productDetailsRef.current.showModal(isOpen);
    }
  }

  function CalculationAddtionalCharge(e, id) {
    AddtionalChargeList.map((value) => {
      if (value._id === id) {
        value.is_automatically_added = e.target.checked;
        setAddtionalChargeList([...AddtionalChargeList]);

        if (value.is_automatically_added === true) {
          tickAdditionalList.push(value);
        }
      }
    });
  }
  //List View
  const [charWiseProductList, setCharWiseProductList] = useState([]);

  let searchItemsList = [];

  if (searchItems != "" && onClickList == false) {
    searchItemsList = charWiseProductList.filter((value) => {
      return value.product_name
        .toLowerCase()
        .includes(searchItems.toLowerCase());
    });
  }

  function AddAdditionalCharge() {
    return (
      <div>
        <p className="custom-label">Select applicable charges</p>
        <div className="checkboxGroup">
          {AddtionalChargeList.map((value, index) => {
            if (value.is_automatically_added === true) {
              tickAdditionalList.push(value);
            }
            return (
              <>
                <Checkbox
                  defaultChecked={value.is_automatically_added}
                  key={index}
                  onChange={(e) => CalculationAddtionalCharge(e, value._id)}
                >
                  {value.charge_type === "percentage"
                    ? `${value.charge_name} - ${Number(
                        value.charge_value
                      ).toFixed(2)}%`
                    : `${value.charge_name} - ₹${Number(
                        value.charge_value
                      ).toFixed(2)}`}
                </Checkbox>
                <br></br>
              </>
            );
          })}
        </div>
        <Button
          size="small"
          type="success"
          style={{
            marginLeft: 40,
            marginTop: 10,
            background: "#BD025D",
            border: "#BD025D",
          }}
          onClick={() => {
            setPopoverVisibleAdditional(false);
          }}
        >
          Done
        </Button>
      </div>
    );
  }

  function getProductPrice(product) {
    let price = 0;
    if (product.isVarience) {
      price = Number(product.key_price);
    } else {
      price = Number(product.price);
    }
    return price;
  }

  function applyDiscountCart(DiscountValue) {
    if (DiscountValue.discount_type === "buy_x_get_y") {
    }
    selectedProduct.map((value) => {
      let presentInBuy = DiscountValue.buy_products.includes(value.id);
      if (presentInBuy) {
        let getDiscountProduct = selectedProduct?.find(function(o1) {
          return DiscountValue.get_products.includes(o1.id);
        });
        let index = selectedProduct?.findIndex(function(o1) {
          return o1.id === getDiscountProduct?.id;
        });
        if (index !== -1) {
          if (value?.quantity <= getDiscountProduct?.quantity) {
            removeAllDiscounts();
            let price = getProductPrice(getDiscountProduct);
            selectedProduct[index].discountedValue = Number(
              value?.quantity * price
            ).toFixed(2);
            setCoupanText("Coupon Code");
          }
        }
      } else {
        let presentInGet = DiscountValue.get_products.includes(value.id);
        if (presentInGet) {
          let buyDiscountProduct = selectedProduct?.find(function(o1) {
            return DiscountValue.buy_products.includes(o1.id);
          });
          if (value?.quantity <= buyDiscountProduct?.quantity) {
            removeAllDiscounts();
            let price = getProductPrice(value);
            value.discountedValue = Number(value?.quantity * price).toFixed(2);
            setCoupanText("Coupon Code");
          }
        }
      }
    });
    let presentDiscount = selectedProduct.filter(
      (data) =>
        parseInt(data.discountedValue) !== 0 &&
        data.discountedValue !== undefined
    );
    let presentCustomDiscount = selectedProduct.some(
      (data) =>
        data.customDiscountedValue !== 0 &&
        data.customDiscountedValue !== undefined
    );
    setDiscountValue(presentDiscount);
    setCustomDiscountValue(presentCustomDiscount);
  }

  const coupanCodeFilter = () => {
    if (coupanCodeText?.trim() == "") {
      setCoupanText("Coupon Code");
      setPopoverVisibleCoupon(false);
      return;
    }
    let DiscountValue = getItem("CouponCodeList").find(
      (val) => val.coupon_code.toLowerCase() == coupanCodeText.toLowerCase()
    );
    if (
      DiscountValue?.status == "enable" &&
      DiscountValue?.level == "order" &&
      DiscountValue?.days_of_week.includes(moment().format("dddd"))
    ) {
      let ToDay = new Date();
      var format = "h:mmA";
      let startDate = new Date(DiscountValue.start_date);
      let endDate = DiscountValue.end_date
        ? new Date(DiscountValue.end_date)
        : 0;
      let happyHours = [];
      happyHours = DiscountValue.happy_hours_time?.split("-");
      happyHours = happyHours ? happyHours : [];
      var time = moment(moment().format("h:mmA"), format),
        beforeTime = moment(
          DiscountValue.happy_hours_time?.split("-")[0],
          format
        ),
        afterTime = moment(
          DiscountValue.happy_hours_time?.split("-")[1],
          format
        );
      if (
        endDate != 0 &&
        startDate.setHours(0, 0, 0, 0) == endDate.setHours(0, 0, 0, 0) &&
        startDate.setHours(0, 0, 0, 0) == ToDay.setHours(0, 0, 0, 0)
      ) {
        if (happyHours.length > 0 && time.isBetween(beforeTime, afterTime)) {
          setCoupanCodeCodeValue(DiscountValue);
          setPopoverVisibleCoupon(false);
          setBulkValue({
            DiscountType: DiscountValue.discount_type,
            couponCodeValue: DiscountValue.discount,
            currentCoupanCode: DiscountValue.coupon_code,
          });
        } else if (happyHours.length == 0) {
          setCoupanCodeCodeValue(DiscountValue);
          setPopoverVisibleCoupon(false);
          setBulkValue({
            DiscountType: DiscountValue.discount_type,
            couponCodeValue: DiscountValue.discount,
            currentCoupanCode: DiscountValue.coupon_code,
          });
        } else {
          setCoupanText(<p className="cuopan-worng">Coupan not applicable</p>);
        }
      } else if (startDate <= ToDay) {
        if (
          endDate != 0 &&
          endDate >= ToDay &&
          happyHours.length > 0 &&
          time.isBetween(beforeTime, afterTime)
        ) {
          setCoupanCodeCodeValue(DiscountValue);
          setPopoverVisibleCoupon(false);
          setBulkValue({
            DiscountType: DiscountValue.discount_type,
            couponCodeValue: DiscountValue.discount,
            currentCoupanCode: DiscountValue.coupon_code,
          });
        } else if (endDate === 0 && happyHours.length == 0) {
          setCoupanCodeCodeValue(DiscountValue);
          setPopoverVisibleCoupon(false);
          setBulkValue({
            DiscountType: DiscountValue.discount_type,
            couponCodeValue: DiscountValue.discount,
            currentCoupanCode: DiscountValue.coupon_code,
          });
        } else if (
          endDate === 0 &&
          happyHours.length > 0 &&
          time.isBetween(beforeTime, afterTime)
        ) {
          setCoupanCodeCodeValue(DiscountValue);
          setPopoverVisibleCoupon(false);
          setBulkValue({
            DiscountType: DiscountValue.discount_type,
            couponCodeValue: DiscountValue.discount,
            currentCoupanCode: DiscountValue.coupon_code,
          });
        } else if (happyHours.length == 0 && endDate != 0 && endDate >= ToDay) {
          setCoupanCodeCodeValue(DiscountValue);
          setPopoverVisibleCoupon(false);
          setBulkValue({
            DiscountType: DiscountValue.discount_type,
            couponCodeValue: DiscountValue.discount,
            currentCoupanCode: DiscountValue.coupon_code,
          });
        } else {
          setCoupanText(<p className="cuopan-worng">Coupan not applicable</p>);
        }
      }
    } else if (
      DiscountValue?.status == "enable" &&
      DiscountValue?.level == "product" &&
      DiscountValue?.days_of_week.includes(moment().format("dddd"))
    ) {
      let apply_coupon = false;
      let ToDay = new Date().setHours(0, 0, 0, 0);
      let startDate = new Date(DiscountValue.start_date).setHours(0, 0, 0, 0);
      let endDate = DiscountValue.end_date
        ? new Date(DiscountValue.end_date).setHours(0, 0, 0, 0)
        : ToDay;
      let happyHours = DiscountValue.happy_hours_time?.split("-");
      happyHours = happyHours ? happyHours : [];
      let format = "h:mmA";
      let time = moment(moment().format("h:mmA"), format),
        beforeTime = moment(
          DiscountValue.happy_hours_time?.split("-")[0],
          format
        ),
        afterTime = moment(
          DiscountValue.happy_hours_time?.split("-")[1],
          format
        );
      if (ToDay >= startDate && ToDay <= endDate) {
        if (happyHours.length > 0 && time.isBetween(beforeTime, afterTime)) {
          apply_coupon = true;
        } else if (happyHours.length == 0) {
          apply_coupon = true;
        }
      }
      if (apply_coupon) {
        setCoupanCodeCodeValue(DiscountValue);
        setPopoverVisibleCoupon(false);
        setBulkValue({
          DiscountType: DiscountValue.discount_type,
          couponCodeValue: DiscountValue.discount,
          currentCoupanCode: DiscountValue.coupon_code,
        });
        applyDiscountCart(DiscountValue);
        setManualCouponObject(DiscountValue);
        setStaticManualCouponObject(DiscountValue);
      }
    } else {
      setCoupanText(<p className="cuopan-worng">Coupan not applicable</p>);
      setCoupanCodeCodeValue(0);
      setBulkValue(0);
    }
  };

  const coupanCode = () => (
    <div>
      <Input
        placeholder="Coupon code"
        ref={coupanCodeRef}
        min={0}
        value={coupanCodeText}
        onChange={(e) => setCouponText(e.target.value)}
      />
      <br></br>
      {coupanText != "Coupon Code" && (
        <p className="cuopan-worng">Invalid Coupon.</p>
      )}
      <Button
        size="small"
        type="primary"
        style={{
          marginLeft: 60,
          marginTop: 10,
        }}
        onClick={() => coupanCodeFilter()}
      >
        Apply
      </Button>
    </div>
  );

  function calQty(product) {
    if (selectedProduct.length > 0) {
      let totalQuantity = 0;
      let CurrentProduct = selectedProduct.filter(
        (value) => value.id === product._id
      );

      if (CurrentProduct.length > 0) {
        CurrentProduct.map((value) => (totalQuantity += value.quantity));
        return `${totalQuantity} x`;
      }
      // if (CurrentProduct != undefined) {
      //   return `${CurrentProduct.quantity} x`;
      // }
    }
  }

  let cartinfo = {
    itemsSold: selectedProduct,
    customer: CustomerData,
    totalPrice: totalcalculatedPrice,
    customerMobialNumber: customer,
    PaymentTypeList,
    totalTaxes: taxtotal,
    onMobialNumberFiledEnterClick: onSearch,
    round_off_value: round,
    tableName: tableName,
    order_by: userDetailData,
  };

  chargePageIsShow(chargeClick);

  setItem("product_Details", selectedProduct);

  const cancelreceipt = () => {
    if (
      localCartInfo &&
      getCartInfoFromLocalKey(localCartInfo?.cartKey, registerData) &&
      getCartInfoFromLocalKey(localCartInfo?.cartKey, registerData)
        ?.orderTicketsData
    ) {
      localCartInfo = getCartInfoFromLocalKey(
        localCartInfo?.cartKey,
        registerData
      );

      let totalOrderTikets = [];
      let PreviousTikets = [];
      localCartInfo.orderTicketsData.map((val) => {
        PreviousTikets.push(val.tiketNumber);

        val.itemList.map((i) => {
          totalOrderTikets.push(i);
        });
      });
      var holder = {};
      totalOrderTikets.forEach(function(d) {
        d.newqty = d.newqty ? d.newqty : d.quantity;
        if (d.add_or_remove == "Added Items") {
          if (holder.hasOwnProperty(d.key)) {
            holder[d.key] = holder[d.key] + d.newqty;
          } else {
            holder[d.key] = d.newqty;
          }
        } else if (d.add_or_remove == "Removed Items") {
          if (holder.hasOwnProperty(d.key)) {
            holder[d.key] = holder[d.key] - d.newqty;
          } else {
            holder[d.key] = d.newqty;
          }
        }
      });
      var obj2 = [];
      for (var prop in holder) {
        obj2.push({ key: prop, newqty: holder[prop] });
      }
      [];

      let filterCancelList = obj2.map((val) => {
        let product = totalOrderTikets.find((itm) => itm.key == val.key);
        product.newqty = val.newqty;
        product.add_remove = "Removed Items";
        return product;
      });

      let arrayData = Object.values(
        filterCancelList.reduce(function(res, value) {
          if (!res[value?.order_ticket_group?._id]) {
            res[value?.order_ticket_group?._id] = {
              categoryName: value?.order_ticket_group?.order_ticket_group_name,
              data: [value],
            };
          } else {
            res[value?.order_ticket_group?._id].data.push(value);
          }

          return res;
        }, {})
      );

      console.log("obj2obj2obj2", arrayData);
      arrayData.map((val) => {
        let OrderTicketNumber;
        if (getItem("previousOrderTicketNumber") != null) {
          let Details = getItem("previousOrderTicketNumber");

          if (moment(Details.date).isSame(moment().format("L"))) {
            OrderTicketNumber = 1 + Details.number;
            setItem("previousOrderTicketNumber", {
              date: moment().format("L"),
              number: 1 + Details.number,
            });
          } else {
            OrderTicketNumber = 1;
            setItem("previousOrderTicketNumber", {
              date: moment().format("L"),
              number: 1,
            });
          }
        } else {
          OrderTicketNumber = 1;
          setItem("previousOrderTicketNumber", {
            date: moment().format("L"),
            number: 1,
          });
        }
        let object = {
          orderNotes: " " /* values.order_tickets_notes*/,
          tiketNumber: OrderTicketNumber,
          categoryName: val.categoryName,
          add_remove: "Removed Items",
          itemList: val.data,
          enterDate: new Date(),
          table_name: selectedTable,
        };

        window.frames[
          "print_frame"
        ].document.body.innerHTML = ReactDOMServer.renderToStaticMarkup(
          <OrderTicketPrint
            categoryDetails={object}
            PreviousTikets={PreviousTikets}
          />
        );
        window.frames["print_frame"].window.focus();
        window.frames["print_frame"].window.print();
        if (
          getItem("print_server_copy") !== null &&
          getItem("print_server_copy") == true
        ) {
          window.frames[
            "print_frame"
          ].document.body.innerHTML = ReactDOMServer.renderToStaticMarkup(
            <OrderTicketPrint
              title="SERVER COPY"
              categoryDetails={object}
              PreviousTikets={PreviousTikets}
            />
          );
          window.frames["print_frame"].window.focus();
          window.frames["print_frame"].window.print();
        }
        setListOfUpdatedProduts([]);
        setOrderTickets(localCartInfo?.cartKey, val.data, object);
      });
    }
  };

  let handlePopUpModel = () => {
    cancelreceipt();
    setSelectedProduct([]);
    setDiscountMoreThanTotal("Bulk Discount");
    setColorBulk("#1890ff");
    setBulkDiscount(0);
    emptyCart();
    setItem("discount", false);
    setPopUpModel(false);
  };

  const modelNameViewer = (value) => {
    setModelViewData(value);
  };

  const chargeOnClick = () => {
    if (
      getItem("product_Details") !== null &&
      getItem("product_Details").length > 0
    ) {
      if (
        getItem("enforce_customer_mobile_number") &&
        customer === "Add Customer"
      ) {
        setEnforceCustomer(true);
      } else {
        setCartAndCustomerDataAndNavigate();
      }
    }
  };

  const [modelopened, setModelOpened] = useState(false);

  const handleKeyDown = (event, current) => {
    if (event.keyCode == 120) {
      if (
        getItem("orderTicketButton") !== null &&
        getItem("orderTicketButton") == true
      ) {
        if (
          getItem("product_Details") !== null &&
          getItem("product_Details").length > 0
        ) {
          setKey(!key);
          // if(checkCurrent == true){
          orderTicketRef.current.showModal();
          setModelOpened(true);
          // }

          // window.removeEventListener("keydown", handleKeyDown);
        }
      }
      // orderTicketClickRef?.current?.click()
      return;
    }

    if (event.keyCode == 113) {
      if (
        getItem("product_Details") !== null &&
        getItem("product_Details").length > 0
      ) {
        setKey(!key);
        chargeOnClick();
      }
      return;
    }

    if (event.keyCode == 119) {
      inputRef.current.focus();
      return;
    }
  };

  useEffect(() => {
    setDarftCount(
      getItem("LOCAL_STORAGE_CART_KEY_NAME").filter(
        (d) => d.type == "DRAFT_CART" && d.register_id == registerData._id
      ).length
    );
  }, [selectedProduct, localDetails]);
  let otherDetails = {};

  otherDetails.customer = {
    mobile: CustomerData?.mobile
      ? CustomerData.mobile
      : customer == "Add Customer"
      ? "Add Customer"
      : customer,
    email: CustomerData?.email == undefined ? "" : CustomerData?.email,
  };

  if (CustomerData?.name) {
    otherDetails.customer["name"] = CustomerData?.name;
  }
  if (CustomerData?.shipping_address) {
    otherDetails.customer["shipping_address"] = CustomerData?.shipping_address;
  }
  if (CustomerData?.zipcode) {
    otherDetails.customer["zipcode"] = CustomerData?.zipcode;
  }
  if (CustomerData?.city) {
    otherDetails.customer["city"] = CustomerData?.city;
  }

  // store a other details
  otherDetails.bulkDiscountDetails = {
    ...buclkDiscontDetails,
    bulkValue: bulckdiscuntButtonText.discountValue,
  };
  otherDetails.AddtionalChargeList = AddtionalChargeList;
  otherDetails.TotalAddtionalChargeValue = TotalAddtionalChargeValue;
  otherDetails.finalCharge = totalcalculatedPrice;
  otherDetails.chargeClick = chargeClick;

  if (localCartInfo && localCartInfo.cartKey) {
    storeOtherData(localCartInfo.cartKey, otherDetails);
  } else if (localDetails) {
    storeOtherData(localDetails.cartKey, otherDetails);
  }

  let registerDatadetails = getItem("setupCache").register.find(
    (val) => val.active
  );
  const didMount = useRef(false);
  useEffect(() => {
    if (didMount.current) {
      if (registerData.table_numbers == "") {
        setlocalCartInfo({});
        removeItem("active_cart");

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
        fetchAllAddtionalChargeList;
        setSelectedProduct([]);
        setTableName("Current Sale");
      } else {
        localCartInfo = {};
        setlocalCartInfo({});
        removeItem("active_cart");

        setCustomer("Add Customer");
        setCustomerData(null);

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

        fetchAllAddtionalChargeList;
        setSelectedProduct([]);

        setTableName();
      }
    } else {
      didMount.current = true;
    }
  }, [registerDatadetails._id]);

  return (
    <div
      onClick={() => {
        if (change) {
          onClickSearch();
          setNotChange(false);
        }
      }}
    >
      <div>
        {chargeClick ? (
          <div>
            <ChargeDetails
              tabChangeToCurrent={tabChangeToCurrent}
              orderCartData={cartinfo}
              localCartInfo={localCartInfo}
              chargeClick={setChargeClick}
              setCustomer={setCustomer}
              onclickFun={onClickSearch}
              searchApi={change}
              setNotSarchApi={setNotChange}
              shopDetails={shopDetails}
              registerData={registerData}
              table_name={selectedTable}
              selectedProduct={selectedProduct}
              emptyCart={emptyCart}
              checkClick={chargeClick}
            />
          </div>
        ) : (
          <div>
            <Row className="dec-current">
              <Col xxl={14} lg={14} xl={14} xs={24}>
                {getItem("listView") ? (
                  <Row
                    style={{
                      backgroundColor: "#fff",
                      padding: 10,
                    }}
                  >
                    <GridViewCurrent
                      addToCart={productDetails}
                      selectedAllProduct={selectedProduct}
                      productList={allProductList}
                      categoryList={allCategoryList}
                      calculationQty={calQty}
                      categoryFilter={getCategoryById}
                    />
                  </Row>
                ) : (
                  <Row>
                    <Col xxl={5} lg={5} xl={5} xs={7} className="category-col">
                      <Card headless className="category-card">
                        <SellModuleNav>
                          <ul className="currentbuild-ul">
                            {search != "" ? (
                              <li
                                style={{
                                  fontSize: 13,
                                }}
                              >
                                <NavLink to="#" className="active">
                                  <span className="nav-text">
                                    <span>Search results</span>
                                  </span>
                                </NavLink>
                              </li>
                            ) : (
                              false
                            )}
                            {getItem("hideAllAndTop") ? (
                              ""
                            ) : (
                              <>
                                <li
                                  style={{
                                    fontSize: 13,
                                  }}
                                >
                                  <NavLink
                                    to="#"
                                    className={activeAll}
                                    onClick={() => {
                                      getCategoryById(null);
                                      setActiveAll("active");
                                      setActiveTop(false);
                                      nullSearch("");
                                    }}
                                  >
                                    <span className="nav-text">
                                      <span>All</span>
                                    </span>
                                  </NavLink>
                                </li>
                                <li
                                  style={{
                                    fontSize: 13,
                                  }}
                                >
                                  <NavLink
                                    to="#"
                                    className={
                                      activeTop ? "active" : "not-active"
                                    }
                                    onClick={() => {
                                      setActiveTop(true);
                                      setActiveAll("not-active");
                                      getCategoryById("Top");
                                    }}
                                  >
                                    <span className="nav-text">
                                      <span>Top</span>
                                    </span>
                                  </NavLink>
                                </li>
                              </>
                            )}
                            {allCategoryList.length > 0
                              ? allCategoryList.map((value, index) => {
                                  let active = "";
                                  value._id === CategoryID
                                    ? (active = "active")
                                    : (active = "not-active");
                                  return (
                                    <li
                                      style={{
                                        fontSize: 13,
                                      }}
                                      key={index}
                                      className="category-list"
                                    >
                                      <NavLink
                                        to="#"
                                        className={active}
                                        onClick={() => {
                                          setActiveAll("not-active");
                                          setActiveTop(false);
                                          getCategoryById(value._id);
                                          nullSearch("");
                                        }}
                                      >
                                        <span className="nav-text">
                                          <span data-id={value._id}>
                                            {value.category_name}
                                          </span>
                                        </span>
                                      </NavLink>
                                    </li>
                                  );
                                })
                              : ""}
                          </ul>
                        </SellModuleNav>
                      </Card>
                    </Col>

                    <Col
                      xxl={19}
                      lg={19}
                      xl={19}
                      xs={17}
                      className="menuitem-col"
                    >
                      <Card headless className="menu-item-card">
                        <div id="scrollableDiv" className="sell-table-parent">
                          <Row>
                            {AllProduct.length > 0 &&
                            AllProduct.filter(
                              (product) =>
                                product.product_name
                                  .toLowerCase()
                                  .includes(search.toLowerCase()) ||
                                (product.product_code !== undefined &&
                                  product.product_code
                                    .toLowerCase()
                                    .includes(search.toLowerCase()))
                            ).length > 0 &&
                            search != ""
                              ? AllProduct.filter(
                                  (product) =>
                                    product.product_name
                                      .toLowerCase()
                                      .includes(search.toLowerCase()) ||
                                    (product.product_code !== undefined &&
                                      product.product_code
                                        .toLowerCase()
                                        .includes(search.toLowerCase()))
                                ).map((product, index) => {
                                  if (
                                    product.limit_to_register.length == 0 ||
                                    product.limit_to_register.includes(
                                      registerData._id
                                    )
                                  ) {
                                    return (
                                      <Col
                                        key={index}
                                        xs={12}
                                        xl={6}
                                        className="sell-table-col"
                                        onClick={() => productDetails(product)}
                                      >
                                        <div
                                          className={
                                            "sell-main " +
                                            (product.product_category._id
                                              ? setProductClassFromCategoryIndex(
                                                  product.product_category._id
                                                )
                                              : "")
                                          }
                                        >
                                          <div className="product-title">
                                            {product.Newproduct_name
                                              ? product.Newproduct_name
                                              : product.product_name}
                                          </div>
                                          <div className="product-price inlineDIv">
                                            {calQty(product)}{" "}
                                            {`₹${
                                              product.newPrice
                                                ? product.newPrice
                                                : product.price
                                            } `}
                                            {product.option_addon_group
                                              ?.length > 0 ||
                                            product.option_item_group?.length >
                                              0 ||
                                            product.option_variant_group
                                              ?.length > 0 ? (
                                              <div className="inlineDIv">
                                                <div className="sp-price-plus">
                                                  +
                                                </div>
                                              </div>
                                            ) : (
                                              ""
                                            )}
                                          </div>{" "}
                                        </div>
                                      </Col>
                                    );
                                  }
                                })
                              : allProductList.length > 0 &&
                                allProductList
                                  .filter(
                                    (product) =>
                                      product.product_name
                                        .toLowerCase()
                                        .includes(search.toLowerCase()) ||
                                      (product.product_code !== undefined &&
                                        product.product_code
                                          .toLowerCase()
                                          .includes(search.toLowerCase()))
                                  )
                                  .map((product, index) => {
                                    if (
                                      product.limit_to_register.length == 0 ||
                                      product.limit_to_register.includes(
                                        registerData._id
                                      )
                                    ) {
                                      return (
                                        <Col
                                          key={index}
                                          xs={12}
                                          xl={6}
                                          className="sell-table-col"
                                          onClick={() =>
                                            productDetails(product, checkClick)
                                          }
                                        >
                                          <div
                                            className={
                                              "sell-main " +
                                              (product.product_category._id
                                                ? setProductClassFromCategoryIndex(
                                                    product.product_category._id
                                                  )
                                                : "")
                                            }
                                          >
                                            <div className="addtobox">
                                              <div className="product-title">
                                                {product.Newproduct_name
                                                  ? product.Newproduct_name
                                                  : product.product_name}{" "}
                                              </div>
                                              <div className="product-price inlineDIv">
                                                {calQty(product)}{" "}
                                                {`₹${
                                                  product?.newPrice
                                                    ? product.newPrice
                                                    : product.price
                                                } `}
                                                {product.option_addon_group
                                                  ?.length > 0 ||
                                                product.option_item_group
                                                  ?.length > 0 ||
                                                product.option_variant_group
                                                  ?.length > 0 ? (
                                                  <div className="inlineDIv">
                                                    <div className="sp-price-plus">
                                                      +
                                                    </div>
                                                  </div>
                                                ) : (
                                                  ""
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        </Col>
                                      );
                                    }
                                  })}
                          </Row>
                        </div>
                      </Card>
                    </Col>
                  </Row>
                )}
              </Col>
              <Col
                xxl={10}
                lg={10}
                xl={10}
                xs={24}
                className="cart-sell-data cart-col"
              >
                <Card headless>
                  <div className="order-summery-main">
                    <p className="order-summry-header">
                      <span className="sp-hide-if-sm-screen">
                        <small>
                          <div className="tabel_namecurnt">
                            {localCartInfo &&
                              localCartInfo?.Status == "Unpaid" && (
                                <StopOutlined />
                              )}

                            {selectedTable
                              ? selectedTable
                              : getItem("bookingDetails") !== false &&
                                getItem("bookingDetails") !== null
                              ? getItem("bookingDetails").details.bookingDetails
                                  .booking_number
                              : "Current Sale"}
                          </div>
                          <span
                            style={{
                              marginLeft: "10px",
                            }}
                          >
                            |
                          </span>
                          <NavLink
                            to="#"
                            style={{
                              marginLeft: "10px",
                              fontSize: 13,
                              color: "#008cba",
                            }}
                            className="customer-data-btn"
                            onClick={() => {
                              onClickSearch();
                              customer === "Add Customer"
                                ? customerRef.current.showModal()
                                : CustomerData
                                ? customerRef.current.showModal()
                                : "";
                            }}
                          >
                            {spinOn ? (
                              <Spin indicator={antIcon} />
                            ) : CustomerData ? (
                              CustomerData.name ? (
                                CustomerData.name
                              ) : CustomerData.mobile ? (
                                CustomerData.mobile
                              ) : (
                                customer
                              )
                            ) : (
                              customer
                            )}
                          </NavLink>
                        </small>
                      </span>

                      <span className="pull-right sp-bill-actions">
                        <div>
                          {localCartInfo &&
                          localCartInfo.Status == "Unpaid" ? null : (
                            <Row>
                              <NavLink
                                to="#"
                                className="customer-data-btn"
                                style={{
                                  fontSize: 13,
                                }}
                              >
                                {registerData.table_numbers != "" ? (
                                  <>
                                    <span
                                      style={{
                                        color: "#008cba",
                                      }}
                                      onClick={() => {
                                        swapRef.current.showModal();
                                      }}
                                    >
                                      Swap&nbsp;
                                    </span>
                                  </>
                                ) : (
                                  <span
                                    onClick={() => {
                                      makeDraftOnHold();
                                    }}
                                    style={{
                                      color: "#008cba",
                                    }}
                                  >
                                    Hold&nbsp;
                                  </span>
                                )}
                                <DeleteOutlined
                                  style={{
                                    marginRight: 8,
                                    color: "#008cba",
                                  }}
                                  onClick={() => {
                                    setLocalDetails();
                                    setBulckDisountDetails({
                                      ...buclkDiscontDetails,
                                      type: "FLAT",
                                      value: 0,
                                    });
                                    setBulckDiscontButtonText({
                                      text: "Bulk discount",
                                      color: "#008cba",
                                      discountValue: 0,
                                    });
                                    let data = getCartInfoFromLocalKey(
                                      localCartInfo?.cartKey,
                                      registerData
                                    );
                                    if (data && data.orderTicketsData?.length) {
                                      setPopUpModel(true);
                                      setPopUpData(data);
                                    } else {
                                      // removeItem("active_cart");
                                      setSelectedProduct([]);
                                      setDiscountMoreThanTotal("Bulk Discount");
                                      setColorBulk("#1890ff");
                                      setBulkDiscount(0);
                                      emptyCart();
                                    }
                                  }}
                                />
                              </NavLink>
                            </Row>
                          )}
                        </div>
                      </span>
                    </p>
                    <Form form={form}>
                      <Form.Item name="mobile" className="w-100">
                        <Input
                          placeholder="Customer mobile number(F8)"
                          type="number"
                          onKeyPress={(event) => {
                            if (event.key.match("[0-9]+")) {
                              return true;
                            } else {
                              return event.preventDefault();
                            }
                          }}
                          onKeyDown={(e) => onSearch(e)}
                          value={customer === "Add Customer" ? "" : customer}
                          onChange={(e) => {
                            setNotChange(true);
                            setCustomer(
                              e.target.value === ""
                                ? "Add Customer"
                                : e.target.value
                            );
                            setCustomerData(false);
                          }}
                          ref={inputRef}
                        />
                        {enforceCustomer && customer === "Add Customer" ? (
                          <p className="text-danger">
                            Customer mobile number is required for this sale.
                          </p>
                        ) : (
                          ""
                        )}
                      </Form.Item>
                      <Space size="medium" />
                      <div
                        style={{
                          display: "none",
                        }}
                      >
                        {discountValue.length}
                      </div>
                      <Table
                        className="tbl_data addscroll"
                        dataSource={selectedProduct.reverse()}
                        columns={columns()}
                        size="small"
                        scroll={{ y: 350 }}
                        pagination={false}
                        summary={(pageData) => {
                          return (
                            <>
                              {/* {selectedProduct.length > 0 ? (
                                <Table.Summary.Row>
                                  {taxtotal > 0 && (
                                    <>
                                      <Table.Summary.Cell>
                                        totalcalculatedPrice
                                      </Table.Summary.Cell>
                                      <Table.Summary.Cell>
                                        <Text></Text>
                                      </Table.Summary.Cell>
                                      <Table.Summary.Cell className="center-tax">
                                        <Text
                                          style={{
                                            color: "red",
                                          }}
                                        >
                                          ₹
                                          {Number(totalcalculatedPrice).toFixed(
                                            2
                                          )}
                                        </Text>
                                      </Table.Summary.Cell>
                                      <Table.Summary.Cell>
                                        <Text></Text>
                                      </Table.Summary.Cell>
                                    </>
                                  )}
                                </Table.Summary.Row>
                              ) : (
                                ""
                              )}
                              {selectedProduct.length > 0 ? (
                                <Table.Summary.Row>
                                  {taxtotal > 0 && (
                                    <>
                                      <Table.Summary.Cell>
                                        totalcalculatedTax
                                      </Table.Summary.Cell>
                                      <Table.Summary.Cell>
                                        <Text></Text>
                                      </Table.Summary.Cell>
                                      <Table.Summary.Cell className="center-tax">
                                        <Text>
                                          ₹
                                          {Number(totalcalculatedTax).toFixed(
                                            2
                                          )}
                                        </Text>
                                      </Table.Summary.Cell>
                                      <Table.Summary.Cell>
                                        <Text></Text>
                                      </Table.Summary.Cell>
                                    </>
                                  )}
                                </Table.Summary.Row>
                              ) : (
                                ""
                              )} */}
                              {selectedProduct.length > 0 ? (
                                <Table.Summary.Row>
                                  {taxtotal > 0 && (
                                    <>
                                      <Table.Summary.Cell>
                                        Taxes
                                      </Table.Summary.Cell>
                                      <Table.Summary.Cell>
                                        <Text></Text>
                                      </Table.Summary.Cell>
                                      <Table.Summary.Cell className="center-tax">
                                        <Text>
                                          ₹
                                          {Number(totalcalculatedTax).toFixed(
                                            2
                                          )}
                                        </Text>
                                      </Table.Summary.Cell>
                                      <Table.Summary.Cell>
                                        <Text></Text>
                                      </Table.Summary.Cell>
                                    </>
                                  )}
                                </Table.Summary.Row>
                              ) : (
                                ""
                              )}
                              {getItem("doNotRoundOff") ? (
                                ""
                              ) : selectedProduct.length > 0 ? (
                                <Table.Summary.Row>
                                  {(round < 0 || round > 0) && (
                                    <>
                                      <Table.Summary.Cell>
                                        Roundoff
                                      </Table.Summary.Cell>
                                      <Table.Summary.Cell>
                                        <Text></Text>
                                      </Table.Summary.Cell>
                                      <Table.Summary.Cell className="center-tax">
                                        <Text>₹{Number(round).toFixed(2)}</Text>
                                      </Table.Summary.Cell>
                                      <Table.Summary.Cell>
                                        <Text></Text>
                                      </Table.Summary.Cell>
                                    </>
                                  )}
                                </Table.Summary.Row>
                              ) : (
                                ""
                              )}
                            </>
                          );
                        }}
                      />
                      {selectedProduct.length > 0 &&
                      window.screen.width <= 776 == false ? (
                        <>
                          <div className="discount-section">
                            <Popover
                              content={renderBulkDiscountContent()}
                              trigger="click"
                              visible={PopoverVisible}
                              onVisibleChange={(visible) =>
                                setPopoverVisible(visible)
                              }
                            >
                              <Button
                                type="link"
                                className="onhover"
                                style={{
                                  color: bulckdiscuntButtonText.color,
                                  fontSize: "13px",
                                  background: "#F4F5F7",
                                  border: "none",
                                }}
                                onClick={() => {
                                  if (
                                    localCartInfo &&
                                    localCartInfo.Status == "Unpaid"
                                  ) {
                                    setNotUpdate(true);
                                  } else {
                                    setPopoverVisible(!PopoverVisible);
                                  }
                                }}
                              >
                                {bulckdiscuntButtonText.text}
                              </Button>
                            </Popover>
                            {getItem("CouponCodeList").length > 0 && (
                              <Popover
                                content={coupanCode()}
                                trigger="click"
                                overlayClassName="coupon_popup"
                                onVisibleChange={(visible) =>
                                  setPopoverVisibleCoupon(visible)
                                }
                                PopoverVisibleCoupon={PopoverVisibleCoupon}
                              >
                                <Button
                                  type="link"
                                  // className=""
                                  style={{
                                    color: "#008cba",
                                    fontSize: "13px",
                                    background: "#F4F5F7",
                                    border: "none",
                                  }}
                                  className="onhover customer-data-btn"
                                  onClick={() => {
                                    if (
                                      localCartInfo &&
                                      localCartInfo.Status == "Unpaid"
                                    ) {
                                      setNotUpdate(true);
                                    } else {
                                      setPopoverVisibleCoupon(
                                        !PopoverVisibleCoupon
                                      );
                                    }
                                  }}
                                >
                                  {coupanText}
                                </Button>
                              </Popover>
                            )}

                            {AddtionalChargeList.length > 0 &&
                            window.screen.width <= 776 == false ? (
                              <Popover
                                content={AddAdditionalCharge()}
                                trigger="click"
                                visible={PopoverVisibleAdditional}
                                onVisibleChange={(visible) =>
                                  setPopoverVisibleAdditional(visible)
                                }
                              >
                                <Button
                                  type="link"
                                  className="onhover"
                                  style={{
                                    color: "#008cba",
                                    fontSize: "13px",
                                    background: "#F4F5F7",
                                    border: "none",
                                  }}
                                  onClick={() => {
                                    if (
                                      localCartInfo &&
                                      localCartInfo.Status == "Unpaid"
                                    ) {
                                      setNotUpdate(true);
                                    } else {
                                      setPopoverVisibleAdditional(
                                        !PopoverVisibleAdditional
                                      );
                                    }
                                  }}
                                >
                                  {TotalAddtionalChargeValue > 0 &&
                                  tickAdditionalList.length > 0
                                    ? `Addtional Charge ₹${TotalAddtionalChargeValue}`
                                    : `Addtional Charge`}
                                </Button>
                              </Popover>
                            ) : (
                              ""
                            )}
                          </div>
                          {getItem("enable_quick_billing") ? (
                            <Radio.Group
                              onChange={(e) => setPaymentType(e.target.value)}
                              value={PaymentType}
                              className="tick-radio block-center"
                            >
                              <Radio.Button
                                value="cash"
                                style={{
                                  marginRight: "10px",
                                  marginBottom: "10px",
                                }}
                              >
                                {PaymentType === "cash" ? (
                                  <img
                                    src={tickSvg}
                                    alt=""
                                    width="13px"
                                    style={{ marginRight: "3px" }}
                                  />
                                ) : (
                                  ""
                                )}
                                Cash
                              </Radio.Button>
                              <Radio.Button
                                value="card"
                                style={{
                                  marginRight: "10px",
                                  marginBottom: "10px",
                                }}
                              >
                                {PaymentType === "card" ? (
                                  <img
                                    src={tickSvg}
                                    alt=""
                                    width="13px"
                                    style={{ marginRight: "3px" }}
                                  />
                                ) : (
                                  ""
                                )}{" "}
                                Credit / Debit Card
                              </Radio.Button>
                              {PaymentTypeList.map((val, index) => {
                                return (
                                  <Radio.Button
                                    value={val.name}
                                    style={{
                                      marginRight: "10px",
                                      marginBottom: "10px",
                                    }}
                                  >
                                    {PaymentType === val.name ? (
                                      <img
                                        src={tickSvg}
                                        alt=""
                                        width="13px"
                                        style={{ marginRight: "3px" }}
                                      />
                                    ) : (
                                      ""
                                    )}
                                    {val.name}
                                  </Radio.Button>
                                );
                              })}
                            </Radio.Group>
                          ) : (
                            ""
                          )}
                        </>
                      ) : (
                        ""
                      )}

                      <div className="discount-section upper-btns orderfntbtn">
                        {getItem("orderTicketButton") ? (
                          <>
                            <Button
                              type="primary"
                              size="large"
                              id="orderTicketId"
                              style={{
                                marginRight: "5px",
                                borderRadius: "inherit",
                                opacity: selectedProduct.length > 0 ? "" : 0.65,
                                cursor:
                                  selectedProduct.length > 0
                                    ? "pointer"
                                    : "no-drop",
                                width: "50%",
                                height: "40px",
                              }}
                              onClick={() => {
                                orderTicketRef.current.showModal();
                              }}
                              ref={orderTicketClickRef}
                            >
                              Order Ticket (F9)
                            </Button>
                            <Button
                              type="success"
                              size="large"
                              style={{
                                borderRadius: "inherit",
                                width: "50%",
                                opacity: selectedProduct.length > 0 ? "" : 0.65,
                                cursor:
                                  selectedProduct.length > 0
                                    ? "pointer"
                                    : "no-drop",
                                height: "40px",
                                background: "#BD025D",
                              }}
                              onClick={() => chargeOnClick()}
                            >
                              Charge ₹{totalcalculatedPrice} (F2)
                            </Button>
                          </>
                        ) : (
                          <Button
                            type="success"
                            size="large"
                            style={{
                              borderRadius: "inherit",
                              width: "100%",
                              opacity: selectedProduct.length > 0 ? "" : 0.65,
                              cursor:
                                selectedProduct.length > 0
                                  ? "pointer"
                                  : "no-drop",
                              height: "40px",

                              background: "#BD025D",
                            }}
                            onClick={() => chargeOnClick()}
                          >
                            Charge ₹{totalcalculatedPrice} (F2)
                          </Button>
                        )}
                      </div>
                    </Form>
                  </div>
                </Card>
              </Col>
            </Row>

            {/* {window.screen.width <= 992 && (

            )} */}
            <>
              <div className={`mob-cart list-open-${listViewOnOff}`}>
                <ul className="items-view">
                  <li>
                    {" "}
                    <NavLink
                      to="#"
                      onClick={() => setListViewOnOff(!listViewOnOff)}
                      style={{
                        color: "#008cba",
                      }}
                    >
                      View Items
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="#">
                      <DeleteOutlined
                        style={{
                          color: "#008cba",
                        }}
                        onClick={() => {
                          setLocalDetails();
                          setBulckDisountDetails({
                            ...buclkDiscontDetails,
                            type: "FLAT",
                            value: 0,
                          });
                          setBulckDiscontButtonText({
                            text: "Bulk discount",
                            color: "#008cba",
                            discountValue: 0,
                          });
                          let data = getCartInfoFromLocalKey(
                            localCartInfo?.cartKey,
                            registerData
                          );
                          if (data?.orderTicketsData?.length) {
                            setPopUpModel(true);
                          } else {
                            removeItem("active_cart");
                            setSelectedProduct([]);
                            setDiscountMoreThanTotal("Bulk Discount");
                            setColorBulk("#1890ff");
                            setBulkDiscount(0);
                            emptyCart();
                          }
                        }}
                      />
                    </NavLink>
                  </li>
                </ul>
                <Input
                  type="number"
                  min={0}
                  placeholder="Customer mobile number"
                  onKeyDown={(e) => onSearch(e)}
                  value={customer === "Add Customer" ? "" : customer}
                  onChange={(e) => {
                    setNotChange(true);
                    setCustomer(
                      e.target.value === "" ? "Add Customer" : e.target.value
                    );
                    setCustomerData(false);
                  }}
                  onKeyPress={(event) => {
                    if (event.key.match("[0-9]+")) {
                      return true;
                    } else {
                      return event.preventDefault();
                    }
                  }}
                />
                <br />
                <br />

                <Input
                  suffix={suffix}
                  onChange={(e) => {
                    setsearchItems(e.target.value);
                    setOnClickList(false);
                  }}
                  value={searchItems}
                  placeholder="Search Items"
                />
                {searchItemsList.length > 0 ? (
                  <List
                    className="mobile_serlist"
                    bordered
                    dataSource={searchItemsList}
                    renderItem={(value, index) => {
                      return (
                        <div>
                          {index == 0 ? (
                            <List.Item
                              className="select_frst"
                              onClick={() => {
                                productDetails(value);
                                setsearchItems(
                                  value.Newproduct_name
                                    ? value.Newproduct_name
                                    : value.product_name
                                );
                                setOnClickList(true);
                              }}
                            >
                              <CheckCircleOutlined />
                              <tr>
                                <td>
                                  <p className="sp-product-name">
                                    {value.Newproduct_name
                                      ? value.Newproduct_name
                                      : value.product_name}{" "}
                                    <em className="text-muted">
                                      in {value.product_category.category_name}
                                    </em>
                                  </p>
                                  {/* <span className="text-muted">
                                {" "}
                                in {value.product_category.category_name}
                              </span> */}
                                </td>
                                <td>
                                  {calQty(value)}₹{value.newPrice}
                                  {value.option_addon_group?.length > 0 ||
                                  value.option_item_group?.length > 0 ||
                                  value.option_variant_group?.length > 0 ? (
                                    <div className="inlineDIv">
                                      <div className="sp-price-plus">+</div>
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                </td>
                              </tr>
                            </List.Item>
                          ) : (
                            <List.Item
                              onClick={() => {
                                productDetails(value);
                                setsearchItems(
                                  value.Newproduct_name
                                    ? value.Newproduct_name
                                    : value.product_name
                                );
                                setOnClickList(true);
                              }}
                            >
                              <tr>
                                <td>
                                  <p className="sp-product-name">
                                    {value.Newproduct_name
                                      ? value.Newproduct_name
                                      : value.product_name}{" "}
                                    <em className="text-muted">
                                      in {value.product_category.category_name}
                                    </em>
                                  </p>
                                </td>
                                <td>
                                  {calQty(value)}₹{value.newPrice}
                                  {value.option_addon_group?.length > 0 ||
                                  value.option_item_group?.length > 0 ||
                                  value.option_variant_group?.length > 0 ? (
                                    <div className="inlineDIv">
                                      <div className="sp-price-plus">+</div>
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                </td>
                              </tr>
                            </List.Item>
                          )}
                        </div>
                      );
                    }}
                  />
                ) : null}

                <br />
                <br />
                <div
                  style={{
                    display: "none",
                  }}
                >
                  {discountValue.length}
                </div>
                <Table
                  className="tbl_data addscroll"
                  dataSource={selectedProduct}
                  columns={columns()}
                  size="small"
                  scroll={{ y: 350 }}
                  pagination={false}
                  summary={(pageData) => {
                    return (
                      <>
                        {selectedProduct.length > 0 ? (
                          <Table.Summary.Row>
                            {taxtotal > 0 && (
                              <>
                                <Table.Summary.Cell>Taxes</Table.Summary.Cell>
                                <Table.Summary.Cell>
                                  <Text></Text>
                                </Table.Summary.Cell>

                                <Table.Summary.Cell>
                                  <Text>₹{Number(taxtotal).toFixed(2)}</Text>
                                </Table.Summary.Cell>

                                <Table.Summary.Cell>
                                  <Text></Text>
                                </Table.Summary.Cell>
                              </>
                            )}
                          </Table.Summary.Row>
                        ) : (
                          ""
                        )}
                        {getItem("doNotRoundOff") ? (
                          ""
                        ) : selectedProduct.length > 0 ? (
                          <Table.Summary.Row>
                            {(round < 0 || round > 0) && (
                              <>
                                <Table.Summary.Cell>
                                  Roundoff
                                </Table.Summary.Cell>
                                <Table.Summary.Cell>
                                  <Text></Text>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell>
                                  <Text>₹{Number(round).toFixed(2)}</Text>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell>
                                  <Text></Text>
                                </Table.Summary.Cell>
                              </>
                            )}
                          </Table.Summary.Row>
                        ) : (
                          ""
                        )}
                      </>
                    );
                  }}
                />
                {selectedProduct.length > 0 && window.screen.width <= 776 ? (
                  <>
                    <div className="discount-section">
                      <Popover
                        content={renderBulkDiscountContent()}
                        trigger="click"
                        visible={PopoverVisible}
                        onVisibleChange={(visible) =>
                          setPopoverVisible(visible)
                        }
                      >
                        <Button
                          type="link"
                          className="onhover"
                          style={{
                            color: colorBulk,
                            fontSize: "13px",
                            background: "#F4F5F7",
                            border: "none",
                          }}
                          onClick={() => {
                            if (
                              localCartInfo &&
                              localCartInfo.Status == "Unpaid"
                            ) {
                              setNotUpdate(true);
                            } else {
                              setPopoverVisible(!PopoverVisible);
                            }
                          }}
                        >
                          {finalCoupanCodeValue > 0
                            ? `Bulk Discount ₹${Number(
                                finalCoupanCodeValue
                              ).toFixed(2)}`
                            : `${DiscountMoreThanTotal} ${
                                bulkValue > 0 ? "₹" + bulkValue : ""
                              }`}
                        </Button>
                      </Popover>

                      {AddtionalChargeList.length > 0 &&
                      window.screen.width <= 776 ? (
                        <div>
                          <Popover
                            content={AddAdditionalCharge()}
                            trigger="click"
                            visible={PopoverVisibleAdditional}
                            onVisibleChange={(visible) =>
                              setPopoverVisibleAdditional(visible)
                            }
                          >
                            <Button
                              type="link"
                              className="onhover"
                              style={{
                                color: "#008cba",
                                fontSize: "13px",
                                background: "#F4F5F7",
                                border: "none",
                              }}
                              onClick={() => {
                                if (
                                  localCartInfo &&
                                  localCartInfo.Status == "Unpaid"
                                ) {
                                } else {
                                  setPopoverVisibleAdditional(
                                    !PopoverVisibleAdditional
                                  );
                                }
                              }}
                            >
                              {TotalAddtionalChargeValue > 0 &&
                              tickAdditionalList.length > 0
                                ? `Addtional Charge ₹${TotalAddtionalChargeValue}`
                                : `Addtional Charge`}
                            </Button>
                          </Popover>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                    {getItem("enable_quick_billing") ? (
                      <Radio.Group
                        onChange={(e) => setPaymentType(e.target.value)}
                        value={PaymentType}
                        className="tick-radio"
                      >
                        <Radio.Button
                          value="cash"
                          style={{
                            marginRight: "10px",
                            marginBottom: "10px",
                          }}
                        >
                          {PaymentType === "cash" ? (
                            <img
                              src={tickSvg}
                              alt=""
                              width="13px"
                              style={{ marginRight: "3px" }}
                            />
                          ) : (
                            ""
                          )}
                          Cash
                        </Radio.Button>
                        <Radio.Button
                          value="card"
                          style={{
                            marginRight: "10px",
                            marginBottom: "10px",
                          }}
                        >
                          {PaymentType === "card" ? (
                            <img src={tickSvg} alt="" width="13px" />
                          ) : (
                            ""
                          )}{" "}
                          Credit / Debit Card
                        </Radio.Button>
                        {PaymentTypeList.map((val, index) => {
                          return (
                            <Radio.Button
                              value={val.name}
                              style={{
                                marginRight: "10px",
                                marginBottom: "10px",
                              }}
                            >
                              {PaymentType === val.name ? (
                                <img src={tickSvg} alt="" width="13px" />
                              ) : (
                                ""
                              )}
                              {val.name}
                            </Radio.Button>
                          );
                        })}
                      </Radio.Group>
                    ) : (
                      ""
                    )}
                  </>
                ) : (
                  ""
                )}

                <div className="discount-section upper-btns">
                  {getItem("orderTicketButton") ? (
                    <>
                      <Button
                        type="primary"
                        size="large"
                        style={{
                          marginRight: "5px",
                          borderRadius: "inherit",
                          opacity: selectedProduct.length > 0 ? "" : 0.65,
                          cursor:
                            selectedProduct.length > 0 ? "pointer" : "no-drop",
                          width: "50%",
                          height: "40px",
                        }}
                        onClick={() => {
                          orderTicketRef.current.showModal();
                        }}
                      >
                        Order Ticket (F9)
                      </Button>
                      <Button
                        type="success"
                        size="large"
                        style={{
                          borderRadius: "inherit",
                          width: "50%",
                          opacity: selectedProduct.length > 0 ? "" : 0.65,
                          cursor:
                            selectedProduct.length > 0 ? "pointer" : "no-drop",
                          height: "40px",
                          background: "#BD025D",
                        }}
                        onClick={() => chargeOnClick()}

                        // onClick={() => {
                        //   if (selectedProduct.length > 0) {
                        //     if (
                        //       getItem("enforce_customer_mobile_number") &&
                        //       customer === "Add Customer"
                        //     ) {
                        //       setEnforceCustomer(true);
                        //     } else {
                        //       setCartAndCustomerDataAndNavigate();
                        //     }
                        //   }
                        // }}
                      >
                        Charge ₹{totalcalculatedPrice} (F2)
                      </Button>
                    </>
                  ) : (
                    <Button
                      type="success"
                      size="large"
                      style={{
                        borderRadius: "inherit",
                        width: "100%",
                        opacity: selectedProduct.length > 0 ? "" : 0.65,
                        cursor:
                          selectedProduct.length > 0 ? "pointer" : "no-drop",
                        height: "40px",

                        background: "#BD025D",
                      }}
                      onClick={() => chargeOnClick()}

                      // onClick={() => {
                      //   if (selectedProduct.length > 0) {
                      //     if (
                      //       getItem("enforce_customer_mobile_number") &&
                      //       customer === "Add Customer"
                      //     ) {
                      //       setEnforceCustomer(true);
                      //     } else {
                      //       setCartAndCustomerDataAndNavigate();
                      //     }
                      //   }
                      // }}
                    >
                      Charge ₹{totalcalculatedPrice} (F2)
                    </Button>
                  )}
                </div>
              </div>
              <div className={`mob-cart list-view-${listViewOnOff}`}>
                <NavLink
                  to="#"
                  onClick={() => setListViewOnOff(!listViewOnOff)}
                  className="view-bill"
                >
                  View Bill
                </NavLink>
                {filterArray.map((item) => {
                  return (
                    <>
                      <div className="container">
                        <div className="table-srd">
                          <span className="title">{item.title}</span>
                          <table className="table">
                            <tbody>
                              {item.data.map((value) => {
                                return (
                                  <>
                                    <tr onClick={() => productDetails(value)}>
                                      <td>
                                        <a className="sp-product-name">
                                          {value.Newproduct_name
                                            ? value.Newproduct_name
                                            : value.product_name}{" "}
                                        </a>
                                        <span className="text-muted">
                                          {" "}
                                          in{" "}
                                          {value.product_category.category_name}
                                        </span>
                                      </td>
                                      <td>
                                        {calQty(value)}₹{value.newPrice}
                                        {value.option_addon_group?.length > 0 ||
                                        value.option_item_group?.length > 0 ||
                                        value.option_variant_group?.length >
                                          0 ? (
                                          <div className="inlineDIv">
                                            <div className="sp-price-plus">
                                              +
                                            </div>
                                          </div>
                                        ) : (
                                          ""
                                        )}
                                      </td>
                                    </tr>
                                  </>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </>
                  );
                })}
              </div>
            </>
            <CustomerModal
              ref={customerRef}
              titleCheck={customer}
              customer_Data={CustomerData}
              onclickFun={onClickSearch}
              setCustomerData={setCustomer}
              onEnter={onSearch}
              currentData={currentcustomerData}
              localCartInfo={localCartInfo}
              setCustomerDetials={setCustomerData}
            />
            <ProductDetailModal
              ref={productDetailsRef}
              setadddiscountFlag={setadddiscountFlag}
              // productDetails={productDetailsForUpdate}
              productDetailsUpdate={productDetailsForUpdate}
              removeSelectedItems={removeSelectedItems}
              saveFromEditModal={saveFromEditModal}
              SetProductList={setSelectedProduct}
            />
            <EditTableNameModal
              ref={editTableNameModalRef}
              cartDetails={cartToEdit}
              redirectToCurrent="yes"
              setSelectedProduct={setSelectedProduct}
              finalTotal={finalPrice}
              localCartInfo={localCartInfo}
              redirectToCurrentFunction={redirectToCurrentFunc}
              selectedProduct={selectedProduct}
              modelVisible={modelNameViewer}
              modelVisibleValue={ModelView}
              registerData={registerData}
              setselectedTable={setselectedTable}
              setlocalCartInfo={setlocalCartInfo}
              setBulkDiscount={setBulkDiscount}
              setBulkValue={setBulkValue}
              setBulkDiscountType={setBulkDiscountType}
              setAddtionalChargeList={setAddtionalChargeList}
              setselectedTable={setselectedTable}
              setCustomerData={setCustomerData}
              setCustomer={setCustomer}
              setBulckDiscontButtonText={setBulckDiscontButtonText}
              setBulckDisountDetails={setBulckDisountDetails}
              fetchAllAddtionalcharge={fetchAllAddtionalChargeList}
            />
            <NewProductModal
              ref={newproductDetailsRef}
              productDetails={newProductData}
              newProductSave={newProductSaveInCart}
              selecteddiscountProducts={selecteddiscountProducts}
              setadddiscountFlag={setadddiscountFlag}
              discountAppliedProductId={discountAppliedProductId}
              adddiscountFlag={adddiscountFlag}
              selectedProduct={selectedProduct}
              setdiscountAppliedProductId={setdiscountAppliedProductId}
              SetProductList={setSelectedProduct}
            />
            <SwapTableModal
              ref={swapRef}
              table_name={selectedTable}
              swapTableNameList={swapTableNameList}
              selectedProduct={selectedProduct}
              setlocalCartInfo={setlocalCartInfo}
              setTableName={setTableName}
              localCartInfo={localCartInfo}
              customeTableList={customeTableList}
              registerData={registerData}
            />

            <OrderTicketModal
              ref={orderTicketRef}
              table_name={selectedTable}
              swapTableNameList={swapTableNameList}
              selectedProduct={selectedProduct}
              setlocalCartInfo={setlocalCartInfo}
              setTableName={setTableName}
              localCartInfo={localCartInfo}
              customeTableList={customeTableList}
              registerData={registerData}
              setCheckCurrent={setCheckCurrent}
            />

            <ReceiptPrint
              ref={componentRef}
              receiptsDetails={printDetails}
              shopDetails={shopDetails}
              registerData={registerData}
            />

            <Modal
              title="Update Not Allowed"
              visible={notUpdate}
              onCancel={() => setNotUpdate(false)}
              onOk={() => setNotUpdate(false)}
            >
              <p>You cannot update a locked receipt.</p>
            </Modal>

            <ModalPopUp
              data={popUpData}
              title="Clear Receipt"
              visible={popUpModel}
              onOk={handlePopUpModel}
              onCancel={() => {
                setPopUpModel(false);
              }}
            >
              <p>
                This will create a cancellation order ticket and cancel this
                order. Are you sure you want to proceed?
              </p>
            </ModalPopUp>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(CurrentBuilder);
