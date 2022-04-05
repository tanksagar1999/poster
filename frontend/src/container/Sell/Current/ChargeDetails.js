import React, { useState, useEffect, useRef } from "react";
import {
  Row,
  Col,
  Tabs,
  Form,
  Input,
  Radio,
  Button,
  Tag,
  Checkbox,
  DatePicker,
  TimePicker,
  Modal,
  Tooltip,
} from "antd";
import moment from "moment";
import ReactDOMServer from "react-dom/server";
import { useDispatch } from "react-redux";
import {
  getAllAddtionalList,
  getAllTagList,
} from "../../../redux/customField/actionCreator";
import {
  CreateOrder,
  AddAndUpdateBooking,
} from "../../../redux/sell/actionCreator";
import { CloseOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import {
  getItem,
  setItem,
  removeCartFromLocalStorage,
  storeOtherData,
  getCartInfoFromLocalKey,
  setOrderTickets,
  tableStatusChange,
} from "../../../utility/localStorageControl";
import "../sell.css";
import { useReactToPrint } from "react-to-print";
import { SplitBookingAdvance } from "./SplitBookingAdvance";
import { ReceiptPrint } from "../Print/ReceiptPrint";
import Print from "../Print/DemoPrint";

import { OrderTicketPrint } from "./OrderTicketPrint";
import tickSvg from "../../../static/img/tick.svg";
import {
  generate_random_number,
  generate_random_string,
} from "../../../utility/utility";

const ChargeDetails = (props) => {
  let {
    tabChangeToCurrent,
    orderCartData,
    chargeClick,
    setCustomer,
    onclickFun,
    localCartInfo,
    searchApi,
    setNotSarchApi,
    checkClick,
    shopDetails,
    registerData,
    selectedProduct,
    emptyCart,
    table_name,
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

  const [form] = Form.useForm();
  const [spiltForm] = Form.useForm();
  const { TextArea } = Input;
  let isMounted = useRef(true);
  const splitBookingAdvance = useRef();

  const formref = useRef();

  const [DateString, setDateString] = useState(moment().format("LL"));
  const [bookingAdvance, setBookingAdvance] = useState(
    getItem("bookingDetails")
      ? getItem("bookingDetails").details.bookingDetails?.booking_advance
        ? getItem("bookingDetails").details.bookingDetails?.booking_advance
        : false
      : localCartInfo?.otherDetails
      ? localCartInfo?.otherDetails?.details?.bookingDetails?.booking_advance !=
        ""
        ? Number(
            localCartInfo?.otherDetails?.details?.bookingDetails
              ?.booking_advance
          )
        : false
      : false
  );

  const [modalSpiltVisible, setModelSpiltVisible] = useState(false);

  const [splitCustomerEqually, setSplitCustomerEqually] = useState(false);
  const [DeliveryDoor, setDeliveryDoor] = useState(false);
  console.log("localCartInfolocalCartInfo1223", orderCartData);
  const [totalPrice, setTotalPrice] = useState(
    getItem("bookingDetails") != false && getItem("bookingDetails") != null
      ? getItem("bookingDetails").details.bookingDetails?.booking_advance
        ? orderCartData.totalPrice -
          getItem("bookingDetails").details.bookingDetails?.booking_advance
        : orderCartData.totalPrice
      : orderCartData.totalPrice
  );

  const [immediateSubmitButtonText, setimmediateSubmitButtonText] = useState(
    localCartInfo && localCartInfo.Status == "Unpaid"
      ? "Received"
      : getItem("bookingDetails") != false && getItem("bookingDetails") != null
      ? "Fullfill, Pending"
      : getItem("print_receipt_first") != null &&
        getItem("print_receipt_first") == true
      ? "Print receipt for"
      : "Received"
  );
  let [submitbutonDisabled, setsubmitbuttondisabled] = useState(false);
  const [printFirst, setPrintFirst] = useState(
    localCartInfo && localCartInfo.Status == "Unpaid"
      ? false
      : getItem("print_receipt_first") != null &&
        getItem("print_receipt_first") == true
      ? true
      : false
  );
  const [bookingSubmitButtonText, setBookingSubmitButtonText] = useState(
    getItem("bookingDetails") != false && getItem("bookingDetails") != null
      ? "Fullfill, Pending"
      : getItem("print_receipt_first") && getItem("print_receipt_first") != null
      ? `Print receipt for ₹${0.0}/`
      : `Received ₹${0} of`
  );

  const { TabPane } = Tabs;
  const { CheckableTag } = Tag;
  const dispatch = useDispatch();
  const [activeSplitTab, setActiveSplitTab] = useState("payment_type");
  function callback(key) {}
  const [PaymentType, setPaymentType] = useState(false);
  const [bookingAdvancePaymnetType, setBookingAdvancePaymnetType] = useState(
    false
  );

  const [paymentMethod, setPaymentMethod] = useState(
    getItem("bookingDetails") != false && getItem("bookingDetails") != null
      ? "booking"
      : localCartInfo &&
        localCartInfo.otherDetails &&
        localCartInfo.details &&
        localCartInfo.details.saleType
      ? console.log(
          "localCartInfo.details.saleType",
          localCartInfo.details.saleType
        )
      : "immediate"
  );
  let [AddtionalList, setAddtionalList] = useState([]);
  const [DeliveryTime, setDeliveryTime] = useState(moment().format("LT"));
  const [customerMobialNumber, setCustomerMobaialNumer] = useState(
    localCartInfo?.otherDetails
      ? localCartInfo?.otherDetails.customer.mobile
      : null
  );
  const [customerName, setCustomerName] = useState(
    localCartInfo?.otherDetails
      ? localCartInfo?.otherDetails.customer.name
      : null
  );
  const [customerEmail, setCustomerEmail] = useState(
    localCartInfo?.otherDetails
      ? localCartInfo?.otherDetails.customer.email
      : null
  );
  const [zipCode, setZipCode] = useState(
    localCartInfo?.otherDetails
      ? localCartInfo?.otherDetails.customer.zipcode
      : null
  );
  const [city, setCity] = useState(
    localCartInfo?.otherDetails
      ? localCartInfo?.otherDetails.customer.city
      : null
  );
  const [shippingAddress, setShippingAddress] = useState(
    localCartInfo?.otherDetails
      ? localCartInfo?.otherDetails.customer.shipping_address
      : null
  );
  const [selectedTags, setselectedTags] = useState([]);
  const [change, setNotChange] = useState(true);
  const [modelVisibleColse, setModelVisibleColse] = useState(false);
  const [paymentstatus, setPaymentStatus] = useState("paid");
  const [pendingPaymnets, setPendingPayments] = useState(0);
  const [splitCustomerType, setSplitCustomerType] = useState("equally");
  const [numberOfSplitCustomer, setNumberOfSplitCustomer] = useState([]);
  const [splitCustomerNo, setSplitCustomerNo] = useState();
  const [checkSearchApiCall, setSearchApiCall] = useState(false);
  const [balanceToCustomer, setBalanceToCustomer] = useState();
  let [
    splitCustomerNextButtonCliked,
    setSplitCustomerNextButtonCliked,
  ] = useState(false);
  const [orderTicketsNotes, setOrderTicketNotes] = useState("");
  const [occupantsSeat, setOccupantsSeat] = useState("");
  const [cashTender, setCashTender] = useState("");
  const [cardDetails, setCardDetails] = useState("");
  const [paymentNotes, setPaymnetsNotes] = useState("");
  const [bookingNotes, setBookingNotes] = useState(
    localCartInfo?.otherDetails
      ? localCartInfo?.otherDetails?.details?.bookingDetails?.booking_notes !=
        ""
        ? localCartInfo?.otherDetails?.details?.bookingDetails?.booking_notes
        : ""
      : ""
  );
  let [
    splitCustomerNext2ButtonCliked,
    setSplitCustomerNext2ButtonCliked,
  ] = useState(false);
  let [disabledImmedateAndBooking, setdisabledImmedateAndBooking] = useState(
    localCartInfo && localCartInfo.Status == "Unpaid" ? true : false
  );
  let [splitErr, setSplitErr] = useState(false);
  let [avialableItems, setAvialableItems] = useState();
  const [
    splitByItemsCurrentCustomer,
    setSplitByItemsCurrentCustomer,
  ] = useState(1);
  const [printDetails, setPrintDetails] = useState();

  useEffect(() => {
    let totalItems = getItem("product_Details");

    if (totalItems) {
      totalItems.map((product) => {
        product.oldCalculatedPrice = product.calculatedprice;
        product.calculatedprice =
          (product.calculatedprice * product.productTaxes) / 100 +
          product.calculatedprice;
      });
      setAvialableItems(totalItems);
    }
  }, [splitCustomerNo]);
  useEffect(() => {
    if (
      orderCartData.customer &&
      orderCartData.customer.mobile &&
      orderCartData.customer.mobile != "Add Customer"
    ) {
      console.log("orderCartData.customer", orderCartData.customer);
      setCustomerMobaialNumer(orderCartData.customer.mobile);
      form.setFieldsValue({
        name: orderCartData.customer.name
          ? orderCartData.customer.name
          : customerName,
        mobile: orderCartData.customer.mobile,
      });

      orderCartData.customer.name &&
        setCustomerName(orderCartData.customer.name);
      orderCartData.customer.email &&
        setCustomerEmail(orderCartData.customer.email);
      orderCartData.customer.city && setCity(orderCartData.customer.city);
      orderCartData.customer.zipcode &&
        setZipCode(orderCartData.customer.zipcode);
      orderCartData.customer.shipping_address &&
        setShippingAddress(orderCartData.customer.shipping_address);
    } else {
      if (
        localCartInfo?.otherDetails &&
        localCartInfo?.otherDetails.customer &&
        localCartInfo?.otherDetails.customer.mobile != "Add Customer"
      ) {
        form.setFieldsValue({
          name: localCartInfo?.otherDetails.customer.name,
          mobile:
            localCartInfo?.otherDetails.customer.mobile != null &&
            localCartInfo?.otherDetails.customer.mobile != 0
              ? Number(localCartInfo?.otherDetails.customer.mobile)
              : undefined,
        });
      }
    }
  }, [orderCartData.customer]);

  useEffect(() => {
    if (orderCartData.totalPrice) {
      setTotalPrice(orderCartData.totalPrice);
    }
  }, [orderCartData.totalPrice]);
  useEffect(() => {
    if (localCartInfo?.details) {
      console.log("localCartInfo?.details", localCartInfo?.details);
      setPaymentMethod(localCartInfo?.details.saleType);
    }
  }, []);
  useEffect(() => {
    async function fetchAddtionalList() {
      let CustomArray = [];
      const getAddtionalList = await dispatch(getAllAddtionalList("sell"));

      if (
        isMounted.current &&
        getAddtionalList &&
        getAddtionalList.AddtionalList
      )
        getAddtionalList.AddtionalList.map((val) => {
          if (val.sub_type === "customer") {
            CustomArray.push(val);
          }
        });

      if (orderCartData.customer?.custom_fields) {
        orderCartData.customer?.custom_fields.map((val) => {
          if (val.type == "additional_detail") {
            CustomArray.map((data) => {
              if (data.name == val.name) {
                data.value = val.value;
              }
            });
          }
        });
      }

      setAddtionalList(CustomArray);
    }
    fetchAddtionalList();
  }, [orderCartData.customer?.custom_fields]);

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

  useEffect(() => {
    if (orderCartData.customer?.custom_fields) {
      const array = [];

      orderCartData.customer?.custom_fields.map((field, index) => {
        if (field.type === "tag") {
          return field.value === true
            ? array.push(field.name)
            : selectedTags.filter((t) => t !== field.name);
        }
      });

      setselectedTags(array);
    }
  }, [orderCartData.customer?.custom_fields]);

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
        obj2.push({ key: prop, newqty: holder[prop] });
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
    arrayData = arrayData.filter((val) => val.categoryName);
    setListOfUpdatedProduts([...arrayData]);
    // setStatus(status);
  }, []);

  const onSubmit = () => {
    listOfUpdatedproducts.length > 0 &&
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
          table_name: table_name,
        };
        setCategoryData(object);
        if (registerData.print_receipts) {
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
        }

        if (
          getItem("print_server_copy") !== null &&
          getItem("print_server_copy") == true
        ) {
          if (registerData.print_receipts) {
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
        }
        setListOfUpdatedProduts([]);
        setOrderTickets(localCartInfo?.cartKey, val.data, object);
      });
  };

  const handleChange = (tag, checked) => {
    const nextSelectedTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter((t) => t !== tag);

    setselectedTags(nextSelectedTags);
  };

  const checkOutOrder = async (value, val) => {
    if (
      getItem("orderTicketButton") != null &&
      getItem("orderTicketButton") == true
    ) {
      onSubmit();
    }
    console.log("sagarsearchapi", checkSearchApiCall);

    let orderData = {};

    let ReceiptNumber = getItem(`Bill-${registerData.receipt_number_prefix}`);

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
    // orderData.ReceiptNumber = "this String";
    orderData.customer = {
      mobile: Number(customerMobialNumber),
      email: customerEmail,
      name: value.name,
      shipping_address: shippingAddress,
      zipcode: zipCode,
      city: city,
    };
    orderData.actual_time = new Date();
    orderData.details = {
      source: "web",
      sourceVersion: "5.2",
      saleType: paymentMethod,
      paymentStatus: paymentstatus,
      itemsSold: orderCartData.itemsSold,
      order_tickets_notes: value.order_tickets_notes,
      occupants: value.occupants,
      tableName: orderCartData.tableName,
      order_by_name: orderCartData.order_by,
      fulfillmentStatus: "Fulfilled",
      date: new Date(),

      priceSummery: {
        total: totalPrice,
        totalTaxes: orderCartData.totalTaxes,
        sub_total: orderCartData.sub_total,
      },
    };
    if (
      localCartInfo &&
      Number(localCartInfo.otherDetails?.bulkDiscountDetails?.bulkValue) > 0
    ) {
      orderData.details.bulckDiscountValue = Number(
        localCartInfo.otherDetails.bulkDiscountDetails.bulkValue
      );
    }

    if (
      localCartInfo &&
      localCartInfo.otherDetails.TotalAddtionalChargeValue > 0
    ) {
      orderData.details.AddtionChargeValue =
        localCartInfo.otherDetails.AddtionalChargeList;
    }
    orderCartData.round_off_value != 0
      ? (orderData.details.priceSummery.round_off_value =
          orderCartData.round_off_value)
      : null;

    if (paymentMethod === "immediate") {
      orderData.details.immediate_sale = {
        cash_tender: value.cash_tender,
        balance_to_customer: balanceToCustomer,
        card_Details: value.card_details,
        payment_notes: value.payment_notes,
      };

      filterSplitArray.map((i) => {
        if (i.name == "Cash") {
          i.name = "cash";
          i.paymentDate = new Date();
        } else if (i.name == "Credit / Debit Card") {
          i.name = "card";
          i.paymentDate = new Date();
        } else if (i.name == "Other") {
          i.name = "other";
          i.paymentDate = new Date();
        } else {
          i.name = i.name;
          i.paymentDate = new Date();
        }
      });
      numberOfSplitCustomer.map((val) => {
        val.payment_type_list.map((i) => {
          if (i.tick == true) {
            if (i.name == "Cash") {
              i.name = "cash";
              i.paymentDate = new Date();
            } else if (i.name == "Credit / Debit Card") {
              i.name = "card";
              i.paymentDate = new Date();
            } else if (i.name == "Other") {
              i.name = "other";
              i.paymentDate = new Date();
            } else {
              i.name = i.name;
              i.paymentDate = new Date();
            }
          }
        });
      });

      numberOfSplitCustomer.map((val) => {
        val.payment_type_list.map((i) => {
          if (i.tick == true) {
            i.price = val.value;
          }
        });
      });

      filterSplitArray.length > 1
        ? splitCustomerEqually
          ? (orderData.details.immediate_sale.multiple_payments_type = numberOfSplitCustomer)
          : (orderData.details.immediate_sale.multiple_payments_type = filterSplitArray)
        : (orderData.details.immediate_sale.multiple_payments_type = [
            { name: PaymentType, value: totalPrice, paymentDate: new Date() },
          ]);
      pendingPaymnets > 0
        ? (orderData.details.immediate_sale.pending_payments = pendingPaymnets)
        : null;
    } else {
      filterBookingSplitArray.map((i) => {
        if (i.name == "Cash") {
          i.name = "cash";
          i.bookingDate = new Date();
        } else if (i.name == "Credit / Debit Card") {
          i.name = "card";
          i.bookingDate = new Date();
        } else if (i.name == "Other") {
          i.name = "other";
          i.bookingDate = new Date();
        } else {
          i.name = i.name;
          i.bookingDate = new Date();
        }
      });

      orderData.details.bookingDetails = {
        delivery_date: DateString,
        delivery_time: DeliveryTime,
        is_door_delivery: DeliveryDoor,
        booking_notes: value.booking_notes,
        booking_advance: value.booking_advance,

        booking_advance_payment_card_details: value.card_details,
      };
      filterBookingSplitArray.length > 1
        ? (orderData.details.bookingDetails.booking_advance_payment_type = filterBookingSplitArray)
        : (orderData.details.bookingDetails.booking_advance_payment_type = [
            {
              name: bookingAdvancePaymnetType,
              value: bookingAdvance,
              bookingDate: new Date(),
            },
          ]);
    }

    var arr = [];
    let totalTagList = [];
    if (selectedTags.length > 0) {
      TagList.map((field) => {
        if (selectedTags.indexOf(field.name) > -1) {
          arr.push(field);
          totalTagList.push({
            ...field,
            value: true,
          });
        } else {
          totalTagList.push(field);
        }
      });
    }

    orderData.details.custom_fields = arr;
    let checkValueIsOrNot = AddtionalList.find((val) => {
      if (val.value) {
        return true;
      }
    });
    if (checkValueIsOrNot != undefined) {
      orderData.details.customer_custom_fields = AddtionalList;
    }
    orderData.customer.custom_fields = [...totalTagList, ...AddtionalList];
    if (
      getItem("booking_tab") &&
      paymentMethod == "booking" &&
      getItem("bookingDetails") == false
    ) {
      orderData.details.paymentStatus = "unpaid";
      orderData.details.bookingDetails.booking_number = orderData.ReceiptNumber;
      orderData.draftList = true;
      const bookingData = await dispatch(AddAndUpdateBooking(orderData));
      if (bookingData) {
        if (registerData.print_receipts) {
          window.frames[
            "print_frame"
          ].document.body.innerHTML = ReactDOMServer.renderToStaticMarkup(
            <ReceiptPrint
              receiptsDetails={bookingData.bookingData}
              shopDetails={shopDetails}
              registerData={registerData}
            />
          );
          window.frames["print_frame"].window.focus();
          window.frames["print_frame"].window.print();
        }

        emptyCart();
      }
    } else {
      if (getItem("bookingDetails")) {
        orderData.details.bookingDetails = getItem(
          "bookingDetails"
        ).details.bookingDetails;
        orderData.draftList = false;

        const getOrder = await dispatch(CreateOrder(orderData));
        if (getOrder) {
          if (registerData.print_receipts) {
            window.frames[
              "print_frame"
            ].document.body.innerHTML = ReactDOMServer.renderToStaticMarkup(
              <ReceiptPrint
                receiptsDetails={getOrder.orderData}
                shopDetails={shopDetails}
                registerData={registerData}
              />
            );
            window.frames["print_frame"].window.focus();
            window.frames["print_frame"].window.print();
          }

          emptyCart();
        }
      } else {
        if (
          Number(bookingAdvance) == Number(totalPrice) &&
          paymentMethod == "booking"
        ) {
          orderData.details.fulfillmentStatus = "Unfulfilled";
          orderData.details.paymentStatus = "paid";
        } else if (paymentMethod == "booking") {
          orderData.details.bookingDetails.pending_payments =
            Number(totalPrice) - Number(bookingAdvance);
          orderData.details.paymentStatus = "unpaid";
          orderData.details.fulfillmentStatus = "Unfulfilled";
        }

        if (
          getItem("orderTicketButton") != null &&
          getItem("orderTicketButton") == true
        ) {
          let localData = getCartInfoFromLocalKey(
            localCartInfo?.cartKey,
            registerData
          );

          orderData.details.orderTiketsDetails = localData;
        }
        if (printFirst) {
          if (registerData.print_receipts) {
            window.frames[
              "print_frame"
            ].document.body.innerHTML = ReactDOMServer.renderToStaticMarkup(
              <ReceiptPrint
                receiptsDetails={orderData}
                shopDetails={shopDetails}
                registerData={registerData}
              />
            );
            window.frames["print_frame"].window.focus();
            window.frames["print_frame"].window.print();
          }

          setPrintFirst(false);
          setdisabledImmedateAndBooking(true);
          setimmediateSubmitButtonText("Recevied");
          tableStatusChange(localCartInfo?.cartKey, "Unpaid");
        } else {
          const getOrder = await dispatch(CreateOrder(orderData));
          setItem("receiptDetails", getOrder.orderData);

          if (getOrder) {
            if (
              getOrder.orderData.details.immediate_sale &&
              getOrder.orderData.details.immediate_sale.multiple_payments_type
                .length
            ) {
              getOrder.orderData.details.immediate_sale.multiple_payments_type.map(
                (i, idx) => {
                  if (i.name == "") {
                    i.name = `Customer ${idx + 1}`;
                  }
                }
              );
            }

            // getOrder.orderData.details.immediate_sale.multiple_payments_type[0].name="c1"

            let printFirst =
              getItem("print_receipt_first") == null
                ? false
                : getItem("print_receipt_first");
            let printSettlement =
              getItem("print_settlement_paymnet") == null
                ? false
                : getItem("print_settlement_paymnet");

            if (printFirst == false) {
              setPrintDetails(getOrder.orderData);
              if (
                getOrder.orderData.details.immediate_sale &&
                getOrder.orderData.details.immediate_sale.multiple_payments_type
                  .length
              ) {
                if (
                  getOrder.orderData.details.immediate_sale
                    .multiple_payments_type[0].customer_type == "by_items"
                ) {
                  for (
                    let i = 0;
                    i <
                    getOrder.orderData.details.immediate_sale
                      .multiple_payments_type.length;
                    i++
                  ) {
                    getOrder.orderData.details.itemsSold = [
                      ...getOrder.orderData.details.immediate_sale
                        .multiple_payments_type[i].product_List,
                    ];
                    // let price;
                    let tax = 0;
                    let price = 0;
                    getOrder.orderData.details.itemsSold.map((i) => {
                      price = price + i.price;
                      tax =
                        Number(tax) + Number((price / 100) * i.productTaxes);
                    });

                    getOrder.orderData.details.priceSummery = {
                      total: price + tax,
                      totalTaxes: tax,
                    };
                    if (registerData.print_receipts) {
                      window.frames[
                        "print_frame"
                      ].document.body.innerHTML = ReactDOMServer.renderToStaticMarkup(
                        <ReceiptPrint
                          receiptsDetails={getOrder.orderData}
                          shopDetails={shopDetails}
                          registerData={registerData}
                          partnerData={
                            getOrder.orderData.details.immediate_sale
                              .multiple_payments_type[i]
                          }
                        />
                      );
                      window.frames["print_frame"].window.focus();
                      window.frames["print_frame"].window.print();
                    }
                  }
                } else {
                  let price = (
                    Number(getOrder.orderData.details.priceSummery.total) /
                    getOrder.orderData.details.immediate_sale
                      .multiple_payments_type.length
                  ).toFixed(2);
                  for (
                    let i = 0;
                    i <
                    getOrder.orderData.details.immediate_sale
                      .multiple_payments_type.length;
                    i++
                  ) {
                    if (registerData.print_receipts) {
                      window.frames[
                        "print_frame"
                      ].document.body.innerHTML = ReactDOMServer.renderToStaticMarkup(
                        <ReceiptPrint
                          receiptsDetails={getOrder.orderData}
                          shopDetails={shopDetails}
                          registerData={registerData}
                          partnerData={
                            getOrder.orderData.details.immediate_sale
                              .multiple_payments_type[i]
                          }
                          price={price}
                        />
                      );
                      window.frames["print_frame"].window.focus();
                      window.frames["print_frame"].window.print();
                    }
                  }
                }
              } else {
                if (registerData.print_receipts) {
                  window.frames[
                    "print_frame"
                  ].document.body.innerHTML = ReactDOMServer.renderToStaticMarkup(
                    <ReceiptPrint
                      receiptsDetails={getOrder.orderData}
                      shopDetails={shopDetails}
                      registerData={registerData}
                    />
                  );
                  window.frames["print_frame"].window.focus();
                  window.frames["print_frame"].window.print();
                }
              }
            } else if (printFirst && printSettlement) {
              setPrintDetails(getOrder.orderData);
              if (
                getOrder.orderData.details.immediate_sale &&
                getOrder.orderData.details.immediate_sale.multiple_payments_type
                  .length
              ) {
                if (
                  getOrder.orderData.details.immediate_sale
                    .multiple_payments_type[0].customer_type == "by_items"
                ) {
                  for (
                    let i = 0;
                    i <
                    getOrder.orderData.details.immediate_sale
                      .multiple_payments_type.length;
                    i++
                  ) {
                    getOrder.orderData.details.itemsSold = [
                      getOrder.orderData.details.immediate_sale
                        .multiple_payments_type[i].product_List,
                    ];
                    if (registerData.print_receipts) {
                      window.frames[
                        "print_frame"
                      ].document.body.innerHTML = ReactDOMServer.renderToStaticMarkup(
                        <ReceiptPrint
                          receiptsDetails={getOrder.orderData}
                          shopDetails={shopDetails}
                          registerData={registerData}
                          partnerData={
                            getOrder.orderData.details.immediate_sale
                              .multiple_payments_type[i]
                          }
                        />
                      );
                      window.frames["print_frame"].window.focus();
                      window.frames["print_frame"].window.print();
                    }
                  }
                } else {
                  let price = (
                    Number(getOrder.orderData.details.priceSummery.total) /
                    getOrder.orderData.details.immediate_sale
                      .multiple_payments_type.length
                  ).toFixed(2);
                  for (
                    let i = 0;
                    i <
                    getOrder.orderData.details.immediate_sale
                      .multiple_payments_type.length;
                    i++
                  ) {
                    if (registerData.print_receipts) {
                      window.frames[
                        "print_frame"
                      ].document.body.innerHTML = ReactDOMServer.renderToStaticMarkup(
                        <ReceiptPrint
                          receiptsDetails={getOrder.orderData}
                          shopDetails={shopDetails}
                          registerData={registerData}
                          partnerData={
                            getOrder.orderData.details.immediate_sale
                              .multiple_payments_type[i]
                          }
                          price={price}
                        />
                      );
                      window.frames["print_frame"].window.focus();
                      window.frames["print_frame"].window.print();
                    }
                  }
                }
              } else {
                if (registerData.print_receipts) {
                  window.frames[
                    "print_frame"
                  ].document.body.innerHTML = ReactDOMServer.renderToStaticMarkup(
                    <ReceiptPrint
                      receiptsDetails={getOrder.orderData}
                      shopDetails={shopDetails}
                      registerData={registerData}
                    />
                  );
                  window.frames["print_frame"].window.focus();
                  window.frames["print_frame"].window.print();
                }
              }
            }

            emptyCart();
          }
        }
      }
    }
  };

  //completeButton
  const CompleteButtonFunction = () => {
    if (getItem("bookingDetails")) {
      setModelVisibleColse(true);
    } else {
      emptyCart();
    }
  };

  //BookingUpdate
  const BookingUpdate = () => {
    form.validateFields().then(async (value) => {
      let orderData = {};

      let ReceiptNumber = getItem(`Bill-${registerData.receipt_number_prefix}`);

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

      // orderData.ReceiptNumber = "this String";
      orderData.customer = {
        mobile: Number(value.mobile),
        email: value.email,
        name: value.name,
        shipping_address: shippingAddress,
        zipcode: zipCode,
        city: city,
      };
      orderData.details = {
        source: "web",
        sourceVersion: "5.2",
        saleType: paymentMethod,
        paymentStatus: "paid",
        itemsSold: orderCartData.itemsSold,
        order_tickets_notes: value.order_tickets_notes,
        occupants: value.occupants,
        tableName: orderCartData.tableName,
        order_by_name: orderCartData.order_by,
        priceSummery: {
          total: totalPrice,
          totalTaxes: orderCartData.totalTaxes,
          sub_total: orderCartData.sub_total,
          round_off_value: orderCartData.round_off_value,
        },
      };
      if (
        localCartInfo &&
        Number(localCartInfo.otherDetails?.bulkDiscountDetails?.bulkValue) > 0
      ) {
        orderData.details.bulckDiscountValue = Number(
          localCartInfo.otherDetails.bulkDiscountDetails.bulkValue
        );
      }
      if (
        localCartInfo &&
        localCartInfo.otherDetails.TotalAddtionalChargeValue > 0
      ) {
        orderData.details.AddtionChargeValue =
          localCartInfo.otherDetails.TotalAddtionalChargeValue;
      }
      paymentMethod === "immediate"
        ? (orderData.details.immediate_sale = {
            cash_tender: value.cash_tender,
            payment_type: PaymentType,
            balance_to_customer: balanceToCustomer,
            card_Details: value.card_details,
          })
        : (orderData.details.bookingDetails = {
            delivery_date: DateString,
            delivery_time: DeliveryTime,
            is_door_delivery: DeliveryDoor,
            booking_notes: value.booking_notes,
            booking_advance: value.booking_advance,
            booking_advance_payment_type: PaymentType,
            booking_advance_payment_card_details: value.card_details,
          });
      var arr = [];
      if (selectedTags.length > 0) {
        TagList.map((field) => {
          if (selectedTags.indexOf(field.name) > -1) {
            arr.push(field);
          }
        });
      }

      orderData.details.custom_fields = arr;
      let checkValueIsOrNot = AddtionalList.find((val) => {
        if (val.value) {
          return true;
        }
      });
      if (checkValueIsOrNot != undefined) {
        orderData.details.customer_custom_fields = AddtionalList;
      }
      orderData.details.paymentStatus = "unpaid";
      orderData.details.bookingDetails.booking_number = getItem(
        "bookingDetails"
      ).details.bookingDetails.booking_number;

      const bookingData = await dispatch(
        AddAndUpdateBooking(orderData, getItem("bookingDetails")._id)
      );

      if (bookingData) {
        emptyCart();
      }
    });
  };

  const DiscardChanges = () => {
    tabChangeToCurrent("ORDER");
    setModelVisibleColse(false);
  };

  function disabledDate(current) {
    return current && current < moment().subtract(1, "days");
  }

  //spilt work

  let [pyamnetTypeArrayList, setPaymnetTypeArrayList] = useState([
    {
      name: "Cash",
      value: 0,
    },
    { name: "Credit / Debit Card", value: 0 },
    ...orderCartData.PaymentTypeList,
    { name: "Other", value: 0 },
    { name: "Credit Sales (Pending)", value: 0 },
  ]);
  const [splitPaymnetsIs, setSplitPaymnetsIs] = useState(false);
  const [splitUpdateButoonDisbled, setSplitUpdateButtonDisbled] = useState(
    true
  );

  const [excess, setExcess] = useState(0);
  const [pending, setPending] = useState(totalPrice);

  const [filterSplitArray, setFilterSplitArray] = useState([]);
  const [filterBookingSplitArray, setFilterbookingSplitArray] = useState([]);

  useEffect(() => {
    let paymnetType;
    if (PaymentType == "cash") {
      paymnetType = "Cash";
    } else if (PaymentType == "card") {
      paymnetType = "Credit / Debit Card";
    } else if (PaymentType == "other") {
      paymnetType = "Other";
    } else if (PaymentType == "pending") {
      paymnetType = "Credit Sales (Pending)";
    } else {
      paymnetType = PaymentType;
    }
    pyamnetTypeArrayList.map((data) => {
      if (data.name == paymnetType) {
        data.value = totalPrice;
      } else {
        data.value = 0;
      }
    });
    var sum = pyamnetTypeArrayList.reduce(function(acc, obj) {
      return acc + Number(obj.value);
    }, 0);

    if (sum == totalPrice) {
      setSplitUpdateButtonDisbled(false);
    }
    if (PaymentType == "pending" && paymentMethod == "immediate") {
      setimmediateSubmitButtonText("Pending Payment");
      setPaymentStatus("unpaid");
      setPendingPayments(totalPrice);
    } else if (
      paymentMethod == "immediate" &&
      printFirst != null &&
      printFirst == false
    ) {
      setimmediateSubmitButtonText("Received");
      setPaymentStatus("paid");

      setPendingPayments(0);
    }
  }, [PaymentType]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const SubmitSplitPaymentType = () => {
    let filterSplitArray = pyamnetTypeArrayList.filter((item) => {
      if (
        item.name == "Credit Sales (Pending)" &&
        item.value > 0 &&
        item.value != ""
      ) {
        setPaymentStatus("unpaid");
        setPendingPayments(item.value);
        setimmediateSubmitButtonText(`Received ₹${totalPrice - item.value} of`);
      } else {
        setPendingPayments(0);
        setimmediateSubmitButtonText("Received");
        setPaymentStatus("paid");
      }

      return item.value > 0 && item.value != "";
    });

    setFilterSplitArray(filterSplitArray);
    setModelSpiltVisible(false);
  };

  const SubmitSplitBookingAdvancePaymentType = (pyamnetTypeArray) => {
    let filterSplitArray = pyamnetTypeArray.filter((item) => {
      return item.value > 0 && item.value != "";
    });
    setFilterbookingSplitArray(filterSplitArray);
    setPaymentStatus("unpaid");
    splitBookingAdvance.current.hideModal();
  };

  const handleCancel = (e) => {
    setModelSpiltVisible(false);
    setFilterSplitArray([]);
    setimmediateSubmitButtonText("Received");
  };

  let arr56 = [];

  let activeTabPayment_type = [
    <Button onClick={() => handleCancel()}>Cancel</Button>,
    <Button
      type="primary"
      onClick={() => SubmitSplitPaymentType()}
      disabled={splitUpdateButoonDisbled}
    >
      Update
    </Button>,
  ];

  let otherDetails = { ...localCartInfo?.otherDetails };
  otherDetails.customer = {
    mobile: Number(customerMobialNumber),
    email: customerEmail,
    name: customerName,
    shipping_address: shippingAddress,
    zipcode: zipCode,
    city: city,
  };
  otherDetails.details = {
    saleType: paymentMethod,
    paymentStatus: paymentstatus,
    order_tickets_notes: orderTicketsNotes,
    occupants: occupantsSeat,
    priceSummery: {
      total: totalPrice,
      totalTaxes: orderCartData.totalTaxes,
      sub_total: orderCartData.sub_total,
    },
  };

  if (paymentMethod === "immediate") {
    otherDetails.details.immediate_sale = {
      cash_tender: cashTender,
      balance_to_customer: balanceToCustomer,
      card_Details: cardDetails,
      payment_notes: paymentNotes,
    };

    filterSplitArray.length > 1
      ? splitCustomerEqually
        ? (otherDetails.details.immediate_sale.multiple_payments_type = numberOfSplitCustomer)
        : (otherDetails.details.immediate_sale.multiple_payments_type = filterSplitArray)
      : (otherDetails.details.immediate_sale.multiple_payments_type = [
          { name: PaymentType, value: totalPrice, paymentDate: new Date() },
        ]);
    pendingPaymnets > 0
      ? (otherDetails.details.immediate_sale.pending_payments = pendingPaymnets)
      : null;
  } else {
    otherDetails.details.bookingDetails = {
      delivery_date: DateString,
      delivery_time: DeliveryTime,
      is_door_delivery: DeliveryDoor,
      booking_notes: bookingNotes,
      booking_advance: bookingAdvance,
      booking_advance_payment_card_details: cardDetails,
    };
    filterBookingSplitArray.length > 1
      ? (otherDetails.details.bookingDetails.booking_advance_payment_type = filterBookingSplitArray)
      : (otherDetails.details.bookingDetails.booking_advance_payment_type = [
          {
            name: bookingAdvancePaymnetType,
            value: bookingAdvance,
            bookingDate: new Date(),
          },
        ]);
  }

  var arr = [];
  if (selectedTags.length > 0) {
    TagList.map((field) => {
      if (selectedTags.indexOf(field.name) > -1) {
        arr.push(field);
      }
    });
  }

  otherDetails.details.custom_fields = arr;
  let checkValueIsOrNot = AddtionalList.find((val) => {
    if (val.value) {
      return true;
    }
  });
  if (checkValueIsOrNot != undefined) {
    otherDetails.details.customer_custom_fields = AddtionalList;
  }
  otherDetails.chargeClick = checkClick;
  otherDetails.saleType = paymentMethod;
  setItem("active_cart_details", otherDetails);
  if (localCartInfo) {
    console.log("otherDetailsotherDetailsotherDetails323232", otherDetails);
    storeOtherData(localCartInfo.cartKey, otherDetails);
  }

  //OrderTikets related

  // let [listOfUpdatedproducts, setListOfUpdatedProduts] = useState([]);
  const [categoryData, setCategoryData] = useState();

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

  const handleKeyDown = (event) => {
    if (event.keyCode == 113) {
      formref.current.submit();
    }
  };

  return (
    <div
      style={{ background: "#fff", padding: "25px" }}
      onClick={() => {
        if (change) {
          onclickFun();
          setNotChange(false);
        }
      }}
    >
      <Form
        form={form}
        onFinish={checkOutOrder}
        onKeyDown={handleKeyDown}
        ref={formref}
        // onKeyDown={(e) => {s
        //   e.key == "enter" ? "" : "";
        // }}
      >
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col xxl={12} md={12} sm={24} xs={24}>
            <Form.Item>
              <Radio.Group
                style={{ marginBottom: 6 }}
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <Radio
                  value="immediate"
                  disabled={
                    getItem("bookingDetails") || disabledImmedateAndBooking
                      ? true
                      : false
                  }
                >
                  Immediate Sale
                </Radio>
                <Radio
                  value="booking"
                  disabled={disabledImmedateAndBooking ? true : false}
                >
                  Booking
                </Radio>
              </Radio.Group>{" "}
            </Form.Item>
            {getItem("orderTicketButton") &&
            listOfUpdatedproducts.length != 0 ? (
              <Form.Item label="Order Ticket Notes" name="order_tickets_notes">
                <TextArea
                  rows={1}
                  style={{ marginBottom: 6 }}
                  placeholder="Order ticket notes (optional)"
                  value={orderTicketsNotes}
                  onChange={(e) => setOrderTicketNotes(e.target.value)}
                />
              </Form.Item>
            ) : null}
            {paymentMethod === "booking" ? (
              <div>
                <Row>
                  <Col xxl={12} md={12} sm={24} xs={24}>
                    <Form.Item label="Delivery Date & Time">
                      <DatePicker
                        className="book_picker"
                        defaultValue={moment(DateString, "LL")}
                        size="large"
                        disabledDate={disabledDate}
                        onChange={(date, string) => {
                          setDateString(string);
                        }}
                        format="LL"
                      />
                    </Form.Item>
                  </Col>{" "}
                  <Col xxl={12} md={12} sm={24} xs={24}>
                    <Form.Item label={`${DateString},${DeliveryTime}`}>
                      <TimePicker
                        className="book_picker"
                        use12Hours
                        format="h:mm A"
                        defaultValue={moment(moment().format("LT"), "h:mm A")}
                        size="large"
                        onChange={(time, timeString) =>
                          setDeliveryTime(timeString)
                        }
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item name="is_door">
                  <Checkbox
                    onChange={(e) => setDeliveryDoor(e.target.checked)}
                    className="is_debvs"
                  >
                    Is Door Delivery?
                  </Checkbox>
                </Form.Item>

                <Form.Item label="Booking Notes" name="booking_notes">
                  <TextArea
                    rows={1}
                    placeholder=" Type instructions or notes here (optional)"
                    onChange={(e) => setBookingNotes(e.target.value)}
                    value={bookingNotes}
                  >
                    {" "}
                  </TextArea>
                </Form.Item>

                <Form.Item
                  label="Booking Advance"
                  name="booking_advance"
                  initialValue={bookingAdvance}
                  rules={[
                    {
                      validator: (_, value) => {
                        if (Number(value) > totalPrice) {
                          return Promise.reject(
                            "Booking amount cannot be more than the total."
                          );
                        } else {
                          return Promise.resolve();
                        }
                      },
                    },
                  ]}
                >
                  <Input
                    type="number"
                    onKeyPress={(event) => {
                      if (event.key.match("[0-9,.]+")) {
                        return true;
                      } else {
                        return event.preventDefault();
                      }
                    }}
                    value={bookingAdvance}
                    onChange={(e) => {
                      if (e.target.value === "") {
                        setBookingAdvance(false);
                        setBookingSubmitButtonText(`Received ₹${0} of `);
                      } else {
                        setBookingSubmitButtonText(
                          `Received ₹${e.target.value} of `
                        );
                        setBookingAdvance(e.target.value);
                      }
                    }}
                    placeholder="Booking advance payment (optional)"
                    disabled={getItem("bookingDetails") ? true : false}
                  />
                </Form.Item>

                {bookingAdvance > 0 &&
                getItem("bookingDetails") == false &&
                printFirst != true ? (
                  <div>
                    {filterBookingSplitArray.length > 1 ? (
                      <Form.Item name="filterSplit" label="Payment Type">
                        <Radio.Group className="tick-radio">
                          {filterBookingSplitArray.map((item) => {
                            return (
                              <Radio.Button
                                style={{
                                  marginRight: "10px",
                                  marginBottom: "10px",
                                }}
                              >
                                <img
                                  src={tickSvg}
                                  alt=""
                                  width="13px"
                                  style={{ marginRight: "2px" }}
                                />
                                {item.name} -{item.value}
                              </Radio.Button>
                            );
                          })}

                          <Button
                            onClick={() =>
                              splitBookingAdvance.current.showModal()
                            }
                            className="splits-button"
                          >
                            Spilts2
                          </Button>
                        </Radio.Group>
                      </Form.Item>
                    ) : (
                      <Form.Item name="Payment Type1" label="Payment Type">
                        <Radio.Group
                          onChange={(e) =>
                            setBookingAdvancePaymnetType(e.target.value)
                          }
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
                            {bookingAdvancePaymnetType === "cash" ? (
                              <img
                                src={tickSvg}
                                alt=""
                                width="13px"
                                style={{ marginRight: "2px" }}
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
                            {bookingAdvancePaymnetType === "card" ? (
                              <img
                                src={tickSvg}
                                alt=""
                                width="13px"
                                style={{ marginRight: "2px" }}
                              />
                            ) : (
                              ""
                            )}{" "}
                            Credit / Debit Card
                          </Radio.Button>
                          {orderCartData.PaymentTypeList.map((val, index) => {
                            return (
                              <Radio.Button
                                value={val.name}
                                style={{
                                  marginRight: "10px",
                                  marginBottom: "10px",
                                }}
                              >
                                {bookingAdvancePaymnetType === val.name ? (
                                  <img
                                    src={tickSvg}
                                    alt=""
                                    width="13px"
                                    style={{ marginRight: "2px" }}
                                  />
                                ) : (
                                  ""
                                )}
                                {val.name}
                              </Radio.Button>
                            );
                          })}
                          <Radio.Button
                            value="other"
                            style={{
                              marginRight: "10px",
                              marginBottom: "10px",
                            }}
                          >
                            {bookingAdvancePaymnetType === "other" ? (
                              <img
                                src={tickSvg}
                                alt=""
                                width="13px"
                                style={{ marginRight: "2px" }}
                              />
                            ) : (
                              ""
                            )}
                            Other
                          </Radio.Button>

                          <Button
                            onClick={() => {
                              splitBookingAdvance.current.showModal();
                            }}
                            className="splits-button"
                          >
                            Spilt
                          </Button>
                        </Radio.Group>
                      </Form.Item>
                    )}

                    <SplitBookingAdvance
                      ref={splitBookingAdvance}
                      paymnetsList={orderCartData.PaymentTypeList}
                      bookingAdvance={bookingAdvance}
                      bookingAdvancePaymnetType={bookingAdvancePaymnetType}
                      SubmitSplitBookingAdvancePaymentType={
                        SubmitSplitBookingAdvancePaymentType
                      }
                    />

                    {bookingAdvancePaymnetType === "card" ? (
                      <>
                        <Form.Item label="Card Details " name="card_details">
                          <Input
                            placeholder="Card details (optional)"
                            onChange={(e) => setCardDetails(e.target.value)}
                            value={cardDetails}
                          ></Input>
                        </Form.Item>
                      </>
                    ) : (
                      ""
                    )}

                    {bookingAdvancePaymnetType === "other" ||
                    PaymentType ===
                      orderCartData.PaymentTypeList.find(
                        (data) => data.name === PaymentType
                      )?.name ? (
                      <>
                        <Form.Item label="Payment Notes" name="payment_notes">
                          <TextArea
                            rows={1}
                            placeholder="Notes (optional)"
                            onChange={(e) => setPaymnetsNotes(e.target.value)}
                            value={paymentNotes}
                          ></TextArea>
                        </Form.Item>
                      </>
                    ) : (
                      ""
                    )}
                  </div>
                ) : (
                  <>
                    {" "}
                    {getItem("bookingDetails") && (
                      <div>
                        {getItem("bookingDetails").details.bookingDetails
                          .booking_advance && (
                          <Form.Item label="Advance Payment Details">
                            <span className="advance-payment">
                              <img
                                src={tickSvg}
                                alt=""
                                width="13px"
                                style={{ marginRight: "2px" }}
                              />
                              &nbsp;{" "}
                              {
                                getItem("bookingDetails").details.bookingDetails
                                  .booking_advance_payment_type
                              }
                              -
                              {
                                getItem("bookingDetails").details.bookingDetails
                                  .booking_advance
                              }
                            </span>
                          </Form.Item>
                        )}

                        <Form.Item
                          name="Payment Type"
                          label="Payment Type"
                          rules={[
                            {
                              required: modelVisibleColse ? false : true,
                              message: "Choose a payment type to proceed",
                            },
                          ]}
                        >
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
                                  style={{ marginRight: "2px" }}
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
                                  style={{ marginRight: "2px" }}
                                />
                              ) : (
                                ""
                              )}{" "}
                              Credit / Debit Card
                            </Radio.Button>
                            {orderCartData.PaymentTypeList.map((val, index) => {
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
                                      style={{ marginRight: "2px" }}
                                    />
                                  ) : (
                                    ""
                                  )}
                                  {val.name}
                                </Radio.Button>
                              );
                            })}
                            <Radio.Button
                              value="other"
                              style={{
                                marginRight: "10px",
                                marginBottom: "10px",
                              }}
                            >
                              {PaymentType === "other" ? (
                                <img
                                  src={tickSvg}
                                  alt=""
                                  width="13px"
                                  style={{ marginRight: "2px" }}
                                />
                              ) : (
                                ""
                              )}
                              Other
                            </Radio.Button>
                            {/* <Radio.Button
                              value="pending"
                              style={{
                                marginRight: "10px",
                                marginBottom: "10px",
                              }}
                            >
                              {PaymentType === "pending" ? (
                                <img
                                  src={tickSvg}
                                  alt=""
                                  width="13px"
                                  style={{ marginRight: "2px" }}
                                />
                              ) : (
                                ""
                              )}
                              Credit Sales (Pending)
                            </Radio.Button> */}
                          </Radio.Group>
                        </Form.Item>
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div>
                {console.log("filterSplitArray", filterSplitArray)}
                {filterSplitArray.length > 1 ? (
                  <Form.Item name="filterSplit" label="Payment Type">
                    <Radio.Group className="tick-radio">
                      {filterSplitArray.map((item) => {
                        return (
                          <Radio.Button
                            style={{
                              marginRight: "10px",
                              marginBottom: "10px",
                            }}
                          >
                            <img
                              src={tickSvg}
                              alt=""
                              width="13px"
                              style={{ marginRight: "2px" }}
                            />
                            {item.name} -{item.value}
                          </Radio.Button>
                        );
                      })}

                      <Button
                        onClick={() => setModelSpiltVisible(true)}
                        className="splits-button"
                      >
                        Spilts3
                      </Button>
                    </Radio.Group>
                  </Form.Item>
                ) : (
                  <div>
                    {printFirst != null && printFirst == true ? null : (
                      <Form.Item
                        name="Payment Type"
                        label="Payment Type"
                        rules={[
                          {
                            required: true,
                            message: "Choose a payment type to proceed",
                          },
                        ]}
                      >
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
                                style={{ marginRight: "2px" }}
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
                                style={{ marginRight: "2px" }}
                              />
                            ) : (
                              ""
                            )}{" "}
                            Credit / Debit Card
                          </Radio.Button>
                          {orderCartData.PaymentTypeList.map((val, index) => {
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
                                    style={{ marginRight: "2px" }}
                                  />
                                ) : (
                                  ""
                                )}
                                {val.name}
                              </Radio.Button>
                            );
                          })}
                          <Radio.Button
                            value="other"
                            style={{
                              marginRight: "10px",
                              marginBottom: "10px",
                            }}
                          >
                            {PaymentType === "other" ? (
                              <img
                                src={tickSvg}
                                alt=""
                                width="13px"
                                style={{ marginRight: "2px" }}
                              />
                            ) : (
                              ""
                            )}
                            Other
                          </Radio.Button>
                          <Radio.Button
                            value="pending"
                            style={{
                              marginRight: "10px",
                              marginBottom: "10px",
                            }}
                          >
                            {PaymentType === "pending" ? (
                              <img
                                src={tickSvg}
                                alt=""
                                width="13px"
                                style={{ marginRight: "2px" }}
                              />
                            ) : (
                              ""
                            )}
                            Credit Sales (Pending)
                          </Radio.Button>

                          <Button
                            onClick={() => setModelSpiltVisible(true)}
                            className="splits-button"
                          >
                            Splits1
                          </Button>
                        </Radio.Group>
                      </Form.Item>
                    )}
                  </div>
                )}

                <Modal
                  title="Split Payments / Bill"
                  okText="Spilt"
                  visible={modalSpiltVisible}
                  closable={activeSplitTab == "payment_type" ? true : false}
                  closeIcon={
                    <CloseOutlined
                      onClick={() => setModelSpiltVisible(false)}
                    />
                  }
                  footer={
                    activeSplitTab == "payment_type"
                      ? activeTabPayment_type
                      : splitCustomerNextButtonCliked
                      ? splitCustomerType == "by_items"
                        ? [
                            <div>
                              <Button
                                onClick={() =>
                                  setSplitCustomerNextButtonCliked(false)
                                }
                              >
                                Go Back
                              </Button>
                              <Button
                                type="primary"
                                disabled={
                                  numberOfSplitCustomer.find((val) => {
                                    if (
                                      val.product_List.length == 0 ||
                                      avialableItems.length != 0
                                    ) {
                                      return true;
                                    }
                                  }) != undefined
                                }
                                onClick={() => {
                                  numberOfSplitCustomer.map((val) => {
                                    val.value = val.product_List.reduce(
                                      function(acc, obj) {
                                        return (
                                          acc + Number(obj.calculatedprice)
                                        );
                                      },
                                      0
                                    );
                                  });
                                  setNumberOfSplitCustomer([
                                    ...numberOfSplitCustomer,
                                  ]);
                                  setSplitCustomerNext2ButtonCliked(true);
                                  setSplitCustomerNextButtonCliked(false);
                                }}
                              >
                                Next
                              </Button>
                              {numberOfSplitCustomer.find((val) => {
                                if (
                                  val.product_List.length == 0 ||
                                  avialableItems.length != 0
                                ) {
                                  return true;
                                }
                              }) != undefined && (
                                <>
                                  <br></br>
                                  <small>
                                    All available items must be assigned to
                                    customers.
                                  </small>
                                </>
                              )}
                            </div>,
                          ]
                        : [
                            <Button
                              onClick={() =>
                                setSplitCustomerNextButtonCliked(false)
                              }
                            >
                              Go Back
                            </Button>,

                            <Button
                              type="primary"
                              disabled={
                                numberOfSplitCustomer.find((val) => {
                                  val.payment_type_list.map((item) => {
                                    if (item.tick == true) {
                                      arr56.push(item);
                                    }
                                  });
                                  if (
                                    arr56.length == numberOfSplitCustomer.length
                                  ) {
                                    return true;
                                  } else {
                                    return false;
                                  }
                                }) != undefined
                                  ? false
                                  : true
                              }
                              onClick={() => {
                                let ArrSplitFilter = [];
                                numberOfSplitCustomer.map((val) => {
                                  val.payment_type_list.map((data) => {
                                    if (data.tick == true) {
                                      ArrSplitFilter.push({
                                        name: data.name,
                                        value: val.value,
                                      });
                                    }
                                  });
                                });
                                setFilterSplitArray(ArrSplitFilter);
                                setModelSpiltVisible(false);
                                setSplitCustomerEqually(true);
                                setSplitCustomerNextButtonCliked(false);
                                setSplitCustomerNext2ButtonCliked(false);
                              }}
                            >
                              Update
                            </Button>,
                          ]
                      : splitCustomerNext2ButtonCliked == true &&
                        splitCustomerNextButtonCliked == false
                      ? [
                          <Button
                            onClick={() => {
                              setSplitCustomerNext2ButtonCliked(false);
                              setSplitCustomerNextButtonCliked(true);
                            }}
                          >
                            Go Back
                          </Button>,
                          <Button
                            type="primary"
                            disabled={
                              numberOfSplitCustomer.find((val) => {
                                val.payment_type_list.map((item) => {
                                  if (item.tick == true) {
                                    arr56.push(item);
                                  }
                                });
                                if (
                                  arr56.length == numberOfSplitCustomer.length
                                ) {
                                  return true;
                                } else {
                                  return false;
                                }
                              }) != undefined
                                ? false
                                : true
                            }
                            onClick={() => {
                              let ArrSplitFilter = [];
                              numberOfSplitCustomer.map((val) => {
                                val.payment_type_list.map((data) => {
                                  if (data.tick == true) {
                                    ArrSplitFilter.push({
                                      name: data.name,
                                      value: val.value,
                                    });
                                  }
                                });
                              });
                              setFilterSplitArray(ArrSplitFilter);
                              setModelSpiltVisible(false);
                              setSplitCustomerEqually(true);
                              setSplitCustomerNextButtonCliked(false);
                              setSplitCustomerNext2ButtonCliked(false);
                            }}
                          >
                            Update
                          </Button>,
                        ]
                      : [
                          <div>
                            <Button
                              onClick={() => {
                                handleCancel();
                                setSplitCustomerEqually(false);
                                setFilterSplitArray([]);
                                setSplitCustomerNo();
                                setActiveSplitTab("payment_type");
                                setNumberOfSplitCustomer([]);
                                setSplitCustomerType("equally");
                                setSplitCustomerNextButtonCliked(false);
                                setSplitCustomerNext2ButtonCliked(false);
                              }}
                            >
                              Clear Splits
                            </Button>

                            <Button
                              type="primary"
                              disabled={
                                numberOfSplitCustomer.length <= 1 ? true : false
                              }
                              onClick={() => {
                                numberOfSplitCustomer.map(
                                  (val) =>
                                    (val.value = totalPrice / splitCustomerNo)
                                );
                                setSplitCustomerNextButtonCliked(true);
                                setSplitCustomerNext2ButtonCliked(false);
                              }}
                            >
                              Next
                            </Button>

                            {numberOfSplitCustomer.length <= 1 ? (
                              <>
                                {" "}
                                <br></br>
                                <small></small>
                              </>
                            ) : (
                              false
                            )}
                          </div>,
                        ]
                  }
                  width={600}
                >
                  <Tabs activeKey={activeSplitTab} onChange={setActiveSplitTab}>
                    <TabPane tab="By Payment Type" key="payment_type">
                      {splitUpdateButoonDisbled && (
                        <small style={{ paddingBottom: "10px" }}>
                          {pending > 0 && excess == 0 && (
                            <span className="span-center">
                              ₹{pending} pending
                            </span>
                          )}
                          {excess > 0 && pending == 0 && (
                            <span className="span-center">
                              ₹{excess} excess
                            </span>
                          )}
                        </small>
                      )}

                      <Form
                        style={{ width: "100%" }}
                        name="export"
                        form={spiltForm}
                        labelCol={{ span: 10 }}
                      >
                        {pyamnetTypeArrayList.map((val, index) => {
                          return (
                            <Form.Item label={val.name} name={val.name}>
                              <div style={{ display: "none" }}>{val.value}</div>
                              <Input
                                placeholder="0"
                                type="number"
                                value={val.value}
                                style={{ marginBottom: 6 }}
                                a-key={index}
                                onChange={(e) => {
                                  pyamnetTypeArrayList[
                                    e.target.getAttribute("a-key")
                                  ] = {
                                    name: val.name,
                                    value: e.target.value,
                                  };
                                  setPaymnetTypeArrayList([
                                    ...pyamnetTypeArrayList,
                                  ]);
                                  var sum = pyamnetTypeArrayList.reduce(
                                    function(acc, obj) {
                                      return acc + Number(obj.value);
                                    },
                                    0
                                  );

                                  if (sum == totalPrice) {
                                    setSplitUpdateButtonDisbled(false);
                                    setPending(0);
                                    setExcess(0);
                                  } else if (sum > totalPrice) {
                                    setSplitUpdateButtonDisbled(true);
                                    setPending(0);
                                    setExcess(sum - totalPrice);
                                  } else if (totalPrice > sum) {
                                    setSplitUpdateButtonDisbled(true);
                                    setExcess(0);
                                    setPending(totalPrice - sum);
                                  } else {
                                    setSplitUpdateButtonDisbled(true);
                                  }
                                }}
                              />
                            </Form.Item>
                          );
                        })}
                      </Form>
                    </TabPane>

                    <TabPane tab="Between Customers" key="multiple_customer">
                      {splitCustomerNext2ButtonCliked == false &&
                      splitCustomerNextButtonCliked == true ? (
                        splitCustomerType == "by_items" ? (
                          <div>
                            <Radio.Group
                              style={{ marginBottom: "25px" }}
                              value={splitByItemsCurrentCustomer}
                              onChange={(e) =>
                                setSplitByItemsCurrentCustomer(e.target.value)
                              }
                            >
                              {numberOfSplitCustomer.map((val) => {
                                return (
                                  <>
                                    <Radio value={val.no}>
                                      {val.name != ""
                                        ? val.name
                                        : `Customer ${val.no}`}
                                    </Radio>
                                  </>
                                );
                              })}
                            </Radio.Group>
                            <Row xxl={24} md={24} sm={24} xs={24}>
                              <Col
                                xxl={12}
                                md={12}
                                sm={24}
                                xs={24}
                                style={{ paddingRight: "10px" }}
                              >
                                <Col
                                  xxl={18}
                                  md={18}
                                  sm={18}
                                  xs={18}
                                  style={{ marginBottom: 10 }}
                                >
                                  <label>Available Items</label>
                                </Col>
                                <Col
                                  xxl={24}
                                  md={24}
                                  sm={24}
                                  xs={24}
                                  style={{ marginBottom: 10 }}
                                >
                                  <div className="product-list">
                                    <p
                                      onClick={() => {
                                        if (avialableItems.length != 0) {
                                          numberOfSplitCustomer[
                                            splitByItemsCurrentCustomer - 1
                                          ].product_List = [
                                            ...numberOfSplitCustomer[
                                              splitByItemsCurrentCustomer - 1
                                            ].product_List,
                                            ...avialableItems,
                                          ];

                                          setAvialableItems([]);

                                          setNumberOfSplitCustomer([
                                            ...numberOfSplitCustomer,
                                          ]);
                                        }
                                      }}
                                    >
                                      {">>"}
                                    </p>
                                    <ul className="ul-list">
                                      {avialableItems.map(
                                        (product, keyIndex) => {
                                          let text2 = product.display_name.toString();
                                          let newSpilitArray = text2.split(
                                            /[+]/
                                          );
                                          let newSpilitArray1 = text2.split(
                                            /[,]/
                                          );
                                          let finalArray = [];
                                          newSpilitArray.map((value) => {
                                            finalArray.push(
                                              value.replace(/,/gi, "")
                                            );
                                          });
                                          return (
                                            <>
                                              <li
                                                className="li-list"
                                                onClick={() => {
                                                  numberOfSplitCustomer[
                                                    splitByItemsCurrentCustomer -
                                                      1
                                                  ].product_List.push(product);

                                                  avialableItems.splice(
                                                    keyIndex,
                                                    1
                                                  );
                                                  setAvialableItems([
                                                    ...avialableItems,
                                                  ]);
                                                  setNumberOfSplitCustomer([
                                                    ...numberOfSplitCustomer,
                                                  ]);
                                                }}
                                              >
                                                <>
                                                  {text2.includes("-") ? (
                                                    newSpilitArray1.map(
                                                      (val) => (
                                                        <div>{`${val} - ₹${Number(
                                                          product.calculatedprice
                                                        ).toFixed(2)}`}</div>
                                                      )
                                                    )
                                                  ) : (
                                                    <div>
                                                      {finalArray.length > 1 ? (
                                                        <div>
                                                          {finalArray.map(
                                                            (value, index) => {
                                                              return (
                                                                <div>
                                                                  {index > 0
                                                                    ? "+"
                                                                    : null}
                                                                  {value}
                                                                </div>
                                                              );
                                                            }
                                                          )}{" "}
                                                          {` - ₹${Number(
                                                            product.calculatedprice
                                                          ).toFixed(2)} `}
                                                        </div>
                                                      ) : (
                                                        <div>
                                                          {`${
                                                            product.display_name
                                                          } - ₹${Number(
                                                            product.calculatedprice
                                                          ).toFixed(2)}`}
                                                        </div>
                                                      )}
                                                    </div>
                                                  )}
                                                </>
                                              </li>
                                            </>
                                          );
                                        }
                                      )}
                                    </ul>
                                  </div>
                                </Col>
                              </Col>
                              <Col
                                xxl={12}
                                md={12}
                                sm={24}
                                xs={24}
                                style={{ paddingRight: "10px" }}
                              >
                                <Col
                                  xxl={18}
                                  md={18}
                                  sm={18}
                                  xs={18}
                                  style={{ marginBottom: 10 }}
                                >
                                  <label>
                                    {" "}
                                    {numberOfSplitCustomer[
                                      splitByItemsCurrentCustomer - 1
                                    ].name != ""
                                      ? numberOfSplitCustomer[
                                          splitByItemsCurrentCustomer - 1
                                        ].name
                                      : `Customer ${splitByItemsCurrentCustomer}`}{" "}
                                    - Assigned Items
                                  </label>
                                </Col>
                                <Col
                                  xxl={24}
                                  md={24}
                                  sm={24}
                                  xs={24}
                                  style={{ marginBottom: 10 }}
                                >
                                  <div className="product-list">
                                    <p
                                      onClick={() => {
                                        if (
                                          numberOfSplitCustomer[
                                            splitByItemsCurrentCustomer - 1
                                          ].product_List.length != 0
                                        ) {
                                          avialableItems = [
                                            ...avialableItems,
                                            ...numberOfSplitCustomer[
                                              splitByItemsCurrentCustomer - 1
                                            ].product_List,
                                          ];
                                          setAvialableItems([
                                            ...avialableItems,
                                          ]);
                                          numberOfSplitCustomer[
                                            splitByItemsCurrentCustomer - 1
                                          ].product_List = [];
                                          setNumberOfSplitCustomer([
                                            ...numberOfSplitCustomer,
                                          ]);
                                        }
                                      }}
                                    >
                                      {"<<"}
                                    </p>

                                    <ul className="ul-list">
                                      {numberOfSplitCustomer[
                                        splitByItemsCurrentCustomer - 1
                                      ].product_List.map(
                                        (product, key_index) => {
                                          let text2 = product.display_name.toString();
                                          let newSpilitArray = text2.split(
                                            /[+]/
                                          );
                                          let newSpilitArray1 = text2.split(
                                            /[,]/
                                          );
                                          let finalArray = [];
                                          newSpilitArray.map((value) => {
                                            finalArray.push(
                                              value.replace(/,/gi, "")
                                            );
                                          });
                                          return (
                                            <>
                                              <li
                                                className="li-list"
                                                onClick={() => {
                                                  avialableItems.push(product);

                                                  numberOfSplitCustomer[
                                                    splitByItemsCurrentCustomer -
                                                      1
                                                  ].product_List.splice(
                                                    key_index,
                                                    1
                                                  );
                                                  setAvialableItems([
                                                    ...avialableItems,
                                                  ]);
                                                  setNumberOfSplitCustomer([
                                                    ...numberOfSplitCustomer,
                                                  ]);
                                                }}
                                              >
                                                <>
                                                  {text2.includes("-") ? (
                                                    newSpilitArray1.map(
                                                      (val) => (
                                                        <div>{`${val} - ₹${Number(
                                                          product.calculatedprice
                                                        ).toFixed(2)}`}</div>
                                                      )
                                                    )
                                                  ) : (
                                                    <div>
                                                      {finalArray.length > 1 ? (
                                                        <div>
                                                          {finalArray.map(
                                                            (value, index) => {
                                                              return (
                                                                <div>
                                                                  {index > 0
                                                                    ? "+"
                                                                    : null}
                                                                  {value}
                                                                </div>
                                                              );
                                                            }
                                                          )}{" "}
                                                          {` - ₹${Number(
                                                            product.calculatedprice
                                                          ).toFixed(2)} `}
                                                        </div>
                                                      ) : (
                                                        <div>
                                                          {`${
                                                            product.display_name
                                                          } - ₹${Number(
                                                            product.calculatedprice
                                                          ).toFixed(2)}`}
                                                        </div>
                                                      )}
                                                    </div>
                                                  )}
                                                </>
                                              </li>
                                            </>
                                          );
                                        }
                                      )}
                                    </ul>
                                  </div>
                                </Col>
                              </Col>
                            </Row>

                            {splitErr && (
                              <span style={{ color: "red" }}>
                                All available items must be assigned to
                                customers
                              </span>
                            )}
                          </div>
                        ) : (
                          <div
                            style={{ overflowY: "scroll", maxHeight: "400px" }}
                          >
                            {numberOfSplitCustomer.map((item, index1) => {
                              return (
                                <>
                                  <Form.Item
                                    name="Payment Type1"
                                    label={
                                      item.name != ""
                                        ? `Payment Type for ${
                                            item.name
                                          } - ₹${Number(item.value).toFixed(2)}`
                                        : `Payment Type for Customer ${
                                            item.no
                                          } - ₹${Number(item.value).toFixed(2)}`
                                    }
                                  >
                                    <div style={{ display: "none" }}>
                                      {item.product_List.length}
                                    </div>
                                    <Radio.Group
                                      className="tick-radio"
                                      onChange={(e) => {
                                        numberOfSplitCustomer.map(
                                          (val, index) => {
                                            if (index == item.no - 1) {
                                              val.payment_type_list.map(
                                                (data, key) => {
                                                  if (key == e.target.value) {
                                                    data.tick =
                                                      e.target.checked;
                                                  } else {
                                                    data.tick = false;
                                                  }
                                                }
                                              );
                                            }
                                          }
                                        );
                                        setNumberOfSplitCustomer([
                                          ...numberOfSplitCustomer,
                                        ]);
                                      }}
                                    >
                                      {item.payment_type_list.map(
                                        (val, index) => {
                                          return (
                                            <>
                                              <Radio.Button
                                                style={{
                                                  marginRight: "10px",
                                                  marginBottom: "10px",
                                                }}
                                                value={index}
                                              >
                                                {val.tick == true && (
                                                  <img
                                                    src={tickSvg}
                                                    alt=""
                                                    width="13px"
                                                  />
                                                )}

                                                {val.name}
                                              </Radio.Button>
                                            </>
                                          );
                                        }
                                      )}
                                    </Radio.Group>
                                  </Form.Item>
                                </>
                              );
                            })}
                          </div>
                        )
                      ) : (
                        <>
                          {splitCustomerNext2ButtonCliked == true &&
                          splitCustomerNextButtonCliked == false ? (
                            <>
                              <div
                                style={{
                                  overflowY: "scroll",
                                  maxHeight: "400px",
                                }}
                              >
                                {numberOfSplitCustomer.map((item) => {
                                  return (
                                    <>
                                      <Form.Item
                                        name="Payment Type1"
                                        label={
                                          item.name != ""
                                            ? `Payment Type for ${
                                                item.name
                                              } - ₹${Number(item.value).toFixed(
                                                2
                                              )}`
                                            : `Payment Type for Customer ${
                                                item.no
                                              } - ₹${Number(item.value).toFixed(
                                                2
                                              )}`
                                        }
                                      >
                                        <div style={{ display: "none" }}>
                                          {item.product_List.length}
                                        </div>
                                        <Radio.Group
                                          className="tick-radio"
                                          onChange={(e) => {
                                            numberOfSplitCustomer.map(
                                              (val, index) => {
                                                if (index == item.no - 1) {
                                                  val.payment_type_list.map(
                                                    (data, key) => {
                                                      if (
                                                        key == e.target.value
                                                      ) {
                                                        data.tick =
                                                          e.target.checked;
                                                      } else {
                                                        data.tick = false;
                                                      }
                                                    }
                                                  );
                                                }
                                              }
                                            );
                                            setNumberOfSplitCustomer([
                                              ...numberOfSplitCustomer,
                                            ]);
                                          }}
                                        >
                                          {item.payment_type_list.map(
                                            (val, index) => {
                                              return (
                                                <>
                                                  <Radio.Button
                                                    style={{
                                                      marginRight: "10px",
                                                      marginBottom: "10px",
                                                    }}
                                                    value={index}
                                                  >
                                                    {val.tick == true && (
                                                      <img
                                                        src={tickSvg}
                                                        alt=""
                                                        width="13px"
                                                      />
                                                    )}

                                                    {val.name}
                                                  </Radio.Button>
                                                </>
                                              );
                                            }
                                          )}
                                        </Radio.Group>
                                      </Form.Item>
                                    </>
                                  );
                                })}
                              </div>
                            </>
                          ) : (
                            <>
                              <Row gutter={25} style={{ marginBottom: 10 }}>
                                <Col
                                  xxl={18}
                                  md={18}
                                  sm={18}
                                  xs={18}
                                  style={{ marginBottom: 10 }}
                                >
                                  <label>How do you want to split?</label>
                                </Col>
                                <Col
                                  xxl={18}
                                  md={18}
                                  sm={18}
                                  xs={18}
                                  style={{ marginBottom: 20 }}
                                >
                                  <Radio.Group
                                    value={splitCustomerType}
                                    onChange={(e) =>
                                      setSplitCustomerType(e.target.value)
                                    }
                                  >
                                    <Radio value="equally">Equally</Radio>
                                    <Radio value="by_items">By Items</Radio>
                                  </Radio.Group>
                                </Col>
                                <Col
                                  xxl={18}
                                  md={18}
                                  sm={18}
                                  xs={18}
                                  style={{ marginBottom: 10 }}
                                >
                                  <label>
                                    Number of Customers{" "}
                                    <Tooltip title="Number of customers can be minimum 2 and maximum 10.">
                                      <QuestionCircleOutlined
                                        style={{ cursor: "pointer" }}
                                      />
                                    </Tooltip>
                                  </label>
                                </Col>
                                <Col
                                  xxl={24}
                                  md={24}
                                  sm={24}
                                  xs={24}
                                  style={{ marginBottom: 10 }}
                                >
                                  <div style={{ display: "none" }}>
                                    {splitCustomerNo}
                                  </div>
                                  <Input
                                    placeholder="Number of Customers"
                                    type="number"
                                    value={splitCustomerNo}
                                    onChange={(e) => {
                                      setSplitCustomerNo(e.target.value);
                                      if (
                                        e.target.value != "" &&
                                        e.target.value != 0 &&
                                        e.target.value <= 10
                                      ) {
                                        setNumberOfSplitCustomer(
                                          Array.from(
                                            { length: e.target.value },
                                            (_, i) => {
                                              let newPaymnetList = orderCartData.PaymentTypeList.map(
                                                (val) => {
                                                  return {
                                                    name: val.name,
                                                    tick: false,
                                                  };
                                                }
                                              );
                                              return {
                                                no: i + 1,
                                                name: "",
                                                mobial: "",
                                                value:
                                                  totalPrice / e.target.value,
                                                payment_type_list: [
                                                  {
                                                    name: "Cash",
                                                    tick: false,
                                                  },
                                                  {
                                                    name: "Credit / Debit Card",
                                                    tick: false,
                                                  },
                                                  ...newPaymnetList,
                                                  {
                                                    name: "Other",
                                                    tick: false,
                                                  },
                                                ],
                                                product_List: [],
                                                customer_type: splitCustomerType,
                                              };
                                            }
                                          )
                                        );
                                      } else {
                                        setNumberOfSplitCustomer([]);
                                      }
                                    }}
                                  />
                                  {numberOfSplitCustomer.length > 0 &&
                                    numberOfSplitCustomer.length < 2 && (
                                      <p style={{ color: "red" }}>
                                        Number of customers must be greater than
                                        1.
                                      </p>
                                    )}
                                </Col>
                              </Row>
                              {numberOfSplitCustomer.length > 0 && (
                                <>
                                  {numberOfSplitCustomer.map((val) => {
                                    return (
                                      <>
                                        <Row xxl={24} md={24} sm={24} xs={24}>
                                          <Col
                                            xxl={12}
                                            md={12}
                                            sm={24}
                                            xs={24}
                                            style={{ paddingRight: "10px" }}
                                          >
                                            <Col
                                              xxl={18}
                                              md={18}
                                              sm={18}
                                              xs={18}
                                              style={{ marginBottom: 10 }}
                                            >
                                              <label>
                                                Customer {val.no} Name
                                              </label>
                                            </Col>
                                            <Col
                                              xxl={24}
                                              md={24}
                                              sm={24}
                                              xs={24}
                                              style={{ marginBottom: 10 }}
                                            >
                                              <div style={{ display: "none" }}>
                                                {numberOfSplitCustomer.length}
                                              </div>
                                              <Input
                                                placeholder="Customer name (Optional)"
                                                value={val.name}
                                                onChange={(e) => {
                                                  numberOfSplitCustomer[
                                                    val.no - 1
                                                  ].name = e.target.value;
                                                  setNumberOfSplitCustomer([
                                                    ...numberOfSplitCustomer,
                                                  ]);
                                                }}
                                              />
                                            </Col>
                                          </Col>
                                          <Col
                                            xxl={12}
                                            md={12}
                                            sm={24}
                                            xs={24}
                                            style={{ paddingRight: "10px" }}
                                          >
                                            <Col
                                              xxl={18}
                                              md={18}
                                              sm={18}
                                              xs={18}
                                              style={{ marginBottom: 10 }}
                                            >
                                              <label>
                                                Customer {val.no} Phone
                                              </label>
                                            </Col>
                                            <Col
                                              xxl={24}
                                              md={24}
                                              sm={24}
                                              xs={24}
                                              style={{ marginBottom: 10 }}
                                            >
                                              <div style={{ display: "none" }}>
                                                {numberOfSplitCustomer.length}
                                              </div>
                                              <Input
                                                placeholder="Customer mobile (Optional)"
                                                type="number"
                                                value={val.mobial}
                                                onChange={(e) => {
                                                  numberOfSplitCustomer[
                                                    val.no - 1
                                                  ].mobial = e.target.value;
                                                  setNumberOfSplitCustomer([
                                                    ...numberOfSplitCustomer,
                                                  ]);
                                                }}
                                              />
                                            </Col>
                                          </Col>
                                        </Row>
                                      </>
                                    );
                                  })}
                                </>
                              )}
                            </>
                          )}
                        </>
                      )}
                    </TabPane>
                  </Tabs>
                </Modal>
                {PaymentType === "cash" ? (
                  <>
                    <Form.Item
                      label="Cash Tendered"
                      name="cash_tender"
                      rules={[
                        {
                          validator: (_, value) => {
                            if (Number(value) < totalPrice && value != "") {
                              return Promise.reject(
                                "Cash tendered cannot be lower than the total."
                              );
                            } else {
                              return Promise.resolve();
                            }
                          },
                        },
                      ]}
                    >
                      <Input
                        type="number"
                        placeholder="Cash tendered"
                        min={0}
                        value={cashTender}
                        onKeyPress={(event) => {
                          if (event.key.match("[0-9,.]+")) {
                            return true;
                          } else {
                            return event.preventDefault();
                          }
                        }}
                        onChange={(e) => {
                          if (e.target.value != "") {
                            setBalanceToCustomer(
                              Number(
                                Number(e.target.value) - totalPrice
                              ).toFixed(2)
                            );
                            setCashTender(e.target.value);
                          } else {
                            setBalanceToCustomer();
                          }
                        }}
                      />
                    </Form.Item>
                    <Form.Item label="Balance to Customer">
                      {console.log("sss6363", balanceToCustomer)}
                      <Input
                        type="text"
                        readonly
                        disabled
                        style={{
                          backgroundColor: "hsla(0,0%,93%,.27058823529411763)",
                          color: "black",
                        }}
                        value={
                          balanceToCustomer && balanceToCustomer != NaN
                            ? balanceToCustomer
                            : ""
                        }
                        placeholder="Balance to customer"
                      />
                    </Form.Item>
                  </>
                ) : (
                  ""
                )}
                {PaymentType === "card" ? (
                  <>
                    <Form.Item label="Card Details" name="card_details">
                      <Input placeholder="Card details (optional)"></Input>
                    </Form.Item>
                  </>
                ) : (
                  ""
                )}

                {PaymentType === "other" ||
                PaymentType ===
                  orderCartData.PaymentTypeList.find(
                    (data) => data.name === PaymentType
                  )?.name ? (
                  <>
                    <Form.Item label="Payment Notes" name="payment_notes">
                      <TextArea
                        placeholder="Notes (optional)"
                        rows={1}
                      ></TextArea>
                    </Form.Item>
                  </>
                ) : (
                  ""
                )}
              </div>
            )}
            <Modal
              title="Close Booking"
              okText="Save & Close"
              visible={modelVisibleColse}
              onOk={() => BookingUpdate(true)}
              onCancel={() => DiscardChanges()}
              cancelText="Discard Changes"
              width={600}
            >
              <p>Are you sure you want to save updates?</p>
            </Modal>
            <Form.Item style={{ marginTop: "15px" }}>
              <Button
                size="medium"
                className="mb_btnd"
                style={{ marginRight: 0, marginLeft: 5 }}
                onClick={() => chargeClick(false)}
              >
                Back
              </Button>
              {getItem("bookingDetails") ? (
                <Button
                  size="medium"
                  className="mb_btnd"
                  style={{ marginRight: 0, marginLeft: 6 }}
                  size="medium"
                  onClick={() => CompleteButtonFunction()}
                >
                  Close
                </Button>
              ) : (
                <>
                  {paymentMethod == "booking" ? (
                    <Button
                      size="medium"
                      className="mb_btnd"
                      style={
                        bookingAdvance > 0 && bookingAdvancePaymnetType == false
                          ? filterBookingSplitArray.length > 1
                            ? { marginRight: 0, marginLeft: 6 }
                            : { marginRight: 0, marginLeft: 6, color: "black" }
                          : { marginRight: 0, marginLeft: 6 }
                      }
                      disabled={
                        bookingAdvance > 0 && bookingAdvancePaymnetType == false
                          ? filterBookingSplitArray.length > 1
                            ? false
                            : true
                          : false
                      }
                      htmlType="submit"
                    >
                      Complete
                    </Button>
                  ) : (
                    <Button
                      size="medium"
                      className="mb_btnd"
                      style={
                        PaymentType || filterSplitArray.length > 1
                          ? { marginRight: 0, marginLeft: 6 }
                          : { marginRight: 0, marginLeft: 6, color: "black" }
                      }
                      disabled={
                        PaymentType || filterSplitArray.length > 1
                          ? false
                          : true
                      }
                      htmlType="submit"
                    >
                      Complete
                    </Button>
                  )}
                </>
              )}

              {paymentMethod == "booking" ? (
                <>
                  <Button
                    type="primary"
                    size="medium"
                    htmlType="submit"
                    className="mb_btnd btn_class"
                    disabled={
                      bookingAdvance > 0 && bookingAdvancePaymnetType == false
                        ? filterBookingSplitArray.length > 1 ||
                          (printFirst != null && printFirst == true)
                          ? false
                          : true
                        : false
                    }
                    style={
                      bookingAdvance > 0 && bookingAdvancePaymnetType == false
                        ? filterBookingSplitArray.length > 1 ||
                          (printFirst != null && printFirst == true)
                          ? { margin: 6 }
                          : { margin: 6, color: "black" }
                        : { margin: 6 }
                    }
                  >
                    {console.log("2890", bookingSubmitButtonText)}
                    {bookingSubmitButtonText}&nbsp;₹{totalPrice}
                  </Button>
                </>
              ) : (
                <Button
                  type="primary"
                  size="medium"
                  htmlType="submit"
                  className="mb_btnd btn_class"
                  disabled={
                    PaymentType ||
                    filterSplitArray.length > 1 ||
                    (printFirst != null && printFirst == true)
                      ? false
                      : true
                  }
                  style={{ margin: 6 }}
                  onClick={{ onSubmit }}
                >
                  {immediateSubmitButtonText}&nbsp;₹{totalPrice} (F2)
                </Button>
              )}
            </Form.Item>{" "}
          </Col>
          <Col xxl={12} md={12} sm={24} xs={24}>
            <Tabs defaultActiveKey="1" onChange={callback}>
              <TabPane tab="General" key="1">
                <Form.Item
                  name="mobile"
                  label="Customer Mobile"
                  rules={[
                    {
                      required:
                        paymentMethod == "booking" ||
                        PaymentType == "pending" ||
                        pendingPaymnets > 0
                          ? true
                          : false,
                      message:
                        "Customer mobile number is required for this sale.",
                    },
                  ]}
                >
                  <Input
                    type="number"
                    style={{ marginBottom: 6 }}
                    placeholder="Customer Number"
                    onChange={(e) => {
                      setCustomer(e.target.value);
                      setNotChange(true);
                      setCustomerMobaialNumer(e.target.value);
                    }}
                    onKeyDown={(e) =>
                      orderCartData.onMobialNumberFiledEnterClick(e)
                    }
                    onKeyPress={(event) => {
                      if (event.key.match("[0-9]+")) {
                        return true;
                      } else {
                        return event.preventDefault();
                      }
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name="name"
                  label="Cutomer Name"
                  rules={[
                    {
                      required:
                        paymentMethod == "booking" ||
                        PaymentType == "pending" ||
                        pendingPaymnets > 0
                          ? true
                          : false,
                      message: "Customer name is required for this sale.",
                    },
                  ]}
                >
                  <Input
                    style={{ marginBottom: 6 }}
                    placeholder="Customer Name"
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </Form.Item>

                <Form.Item
                  name="email"
                  label="Customer Email"
                  rules={[
                    {
                      message: "Please enter valid email",
                      type: "email",
                    },
                  ]}
                >
                  <div className="hide-customerdata">{customerEmail}</div>
                  <Input
                    style={{ marginBottom: 6 }}
                    placeholder="Customer Email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                  />
                </Form.Item>
                <Form.Item name="occupants" label="Occupants">
                  <Input
                    style={{ marginBottom: 6 }}
                    placeholder="Number of seats occupied(optional)"
                    value={occupantsSeat}
                    onChange={(e) => setOccupantsSeat(e.target.value)}
                  />
                </Form.Item>
                <div style={{ display: "flex" }}>
                  {TagList.map((field, index, i) =>
                    field.sub_type === "customer" ? (
                      <>
                        <Form.Item>
                          <CheckableTag
                            className={field.tag_color}
                            style={{
                              border: "1px solid " + field.tag_color,
                              color: field.tag_color,
                            }}
                            key={field.name}
                            checked={selectedTags.indexOf(field.name) > -1}
                            onChange={(checked) =>
                              handleChange(field.name, checked)
                            }
                          >
                            {field.name}
                          </CheckableTag>
                        </Form.Item>
                      </>
                    ) : (
                      ""
                    )
                  )}
                </div>
              </TabPane>
              <TabPane tab="Delivery" key="2">
                <Form.Item name="shipping_address" label="Shipping Address">
                  <div className="hide-customerdata">{shippingAddress}</div>
                  <Input
                    style={{ marginBottom: 6 }}
                    placeholder="Street Address"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                  />
                </Form.Item>

                <Form.Item
                  name="city"
                  style={{
                    display: "inline-block",
                    width: "calc(50% - 12px)",
                  }}
                  label="City"
                >
                  <div className="hide-customerdata">{city}</div>
                  <Input
                    style={{ marginBottom: 6 }}
                    placeholder="City"
                    onChange={(e) => setCity(e.target.value)}
                    value={city}
                  />
                </Form.Item>
                <span
                  style={{
                    display: "inline-block",
                    width: "24px",
                    lineHeight: "32px",
                    textAlign: "center",
                  }}
                ></span>

                <Form.Item
                  name="zipcode"
                  style={{
                    display: "inline-block",
                    width: "calc(50% - 12px)",
                  }}
                  label="Zipcode"
                >
                  <div className="hide-customerdata">{zipCode}</div>
                  <Input
                    type="number"
                    style={{ marginBottom: 6 }}
                    placeholder="Zipcode"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    onKeyPress={(event) => {
                      if (event.key.match("[0-9]+")) {
                        return true;
                      } else {
                        return event.preventDefault();
                      }
                    }}
                  />
                </Form.Item>
              </TabPane>
              {AddtionalList.length > 0 && (
                <TabPane tab="Custom" key="3">
                  {AddtionalList.map((field, index, i) => (
                    <>
                      <Form.Item name={field.name} label={field.name}>
                        <div className="hide-customerdata">{field.value}</div>
                        <Input
                          value={field.value ? field.value : ""}
                          style={{ marginBottom: 6 }}
                          placeholder={field.name}
                          a-key={index}
                          onChange={(e) => {
                            AddtionalList[e.target.getAttribute("a-key")] = {
                              ...field,
                              value: e.target.value,
                            };
                            setAddtionalList([...AddtionalList]);
                          }}
                        />
                      </Form.Item>
                    </>
                  ))}
                </TabPane>
              )}
            </Tabs>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export { ChargeDetails };
