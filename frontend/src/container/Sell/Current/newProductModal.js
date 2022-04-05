import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
} from "react";
import "./productEditModal.css";
import { getItem, setItem } from "../../../utility/localStorageControl";
import { Modal, Button, Form, Input, Radio, Checkbox } from "antd";

const NewProductModal = forwardRef((props, ref) => {
  const { productDetails, newProductSave, SetProductList } = props;
  const exampleInput = useRef();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [calculatedprice, setcalculatedprice] = useState(0);
  const [checkedVariant1, setCheckedVariant1] = useState(false);
  const [checkedVariant2, setCheckedVariant2] = useState(false);
  const [checkedVariant3, setCheckedVariant3] = useState(false);
  const [checkedVariant4, setCheckedVariant4] = useState(false);
  const [checkedVariant5, setCheckedVariant5] = useState(false);
  const [checkedItem1, setCheckedItem1] = useState(false);
  const [checkedItem2, setCheckedItem2] = useState(false);
  const [checkedItem3, setCheckedItem3] = useState(false);
  const [checkedItem4, setCheckedItem4] = useState(false);
  const [checkedItem5, setCheckedItem5] = useState(false);

  useEffect(() => {
    setCheckedItem4(false);
    setCheckedItem1(false);
    setCheckedItem2(false);
    setCheckedItem3(false);
    setCheckedItem5(false);
    setCheckedVariant1(false);
    setCheckedVariant2(false);
    setCheckedVariant3(false);
    setCheckedVariant4(false);
    setCheckedVariant5(false);
  }, [isModalVisible]);

  productDetails
    ? form.setFieldsValue({
        quantity: productDetails.quantity ? productDetails.quantity : "",
      })
    : "";

  useImperativeHandle(ref, () => ({
    showModal() {
      setIsModalVisible(true);
    },
    hideModal() {
      setIsModalVisible(false);
    },
  }));

  const handleCancel = () => {
    SetProductList(getItem("product_Details"));
    form.resetFields();
    setIsModalVisible(false);
  };

  function addOneQuantityInDetails(ops) {
    if (ops === "ADD") {
      productDetails.quantity += 1;
      setQuantity(productDetails.quantity);
    } else if (ops === "SUBTRACT") {
      productDetails.quantity -= 1;
      setQuantity(productDetails.quantity);
      if (productDetails.quantity < 1) {
        productDetails.quantity = 1;
        setQuantity(productDetails.quantity);
      }
    }
    setProductKeyAndCalculateTotalAndDisplayName(productDetails);
    setcalculatedprice(productDetails.calculatedprice);
  }
  /*
 item Group Calculation
 */

  function setProductItem1(e) {
    const id = e.target.value.split(" ");
    setCheckedItem1(id[0]);
    if (id[1] === "product") {
      productDetails.option_item_group[0].products.forEach(function(
        item,
        index
      ) {
        if (item._id == id[0]) {
          productDetails.option_item_group[0].products[index].isSelected = true;
          productDetails.option_item_group[0].selecet = "product";
        } else {
          productDetails.option_item_group[0].products[
            index
          ].isSelected = false;
          productDetails.option_item_group[0].selecet = "product";
        }
      });
    } else {
      productDetails.option_item_group[0].product_variants.forEach(function(
        item,
        index
      ) {
        if (item.variant_id._id == id[0]) {
          productDetails.option_item_group[0].product_variants[
            index
          ].isSelected = true;
          productDetails.option_item_group[0].selecet = "variant";
        } else {
          productDetails.option_item_group[0].product_variants[
            index
          ].isSelected = false;
          productDetails.option_item_group[0].selecet = "variant";
        }
        setcalculatedprice(productDetails.calculatedprice);
      });
    }
    setProductKeyAndCalculateTotalAndDisplayName(
      productDetails,
      productDetails.option_item_group
    );
  }

  function setProductItem2(e) {
    const id = e.target.value.split(" ");
    setCheckedItem2(id[0]);
    if (id[1] === "product") {
      productDetails.option_item_group[1].products.forEach(function(
        item,
        index
      ) {
        if (item._id == id[0]) {
          productDetails.option_item_group[1].products[index].isSelected = true;
          productDetails.option_item_group[1].selecet = "product";
        }
      });
    } else {
      productDetails.option_item_group[1].product_variants.forEach(function(
        item,
        index
      ) {
        if (item.variant_id._id == id[0]) {
          productDetails.option_item_group[1].product_variants[
            index
          ].isSelected = true;
          productDetails.option_item_group[1].selecet = "variant";
        } else {
          productDetails.option_item_group[1].product_variants[
            index
          ].isSelected = false;
        }

        setcalculatedprice(productDetails.calculatedprice);
      });
    }
    setProductKeyAndCalculateTotalAndDisplayName(productDetails);
  }

  function setProductItem3(e) {
    const id = e.target.value.split(" ");
    setCheckedItem3(id[0]);
    if (id[1] === "product") {
      productDetails.option_item_group[2].products.forEach(function(
        item,
        index
      ) {
        if (item._id == id[0]) {
          productDetails.option_item_group[2].products[index].isSelected = true;
          productDetails.option_item_group[2].selecet = "product";
        }
      });
    } else {
      productDetails.option_item_group[2].product_variants.forEach(function(
        item,
        index
      ) {
        if (item.variant_id._id == id[0]) {
          productDetails.option_item_group[2].product_variants[
            index
          ].isSelected = true;
          productDetails.option_item_group[2].selecet = "variant";
        } else {
          productDetails.option_item_group[2].product_variants[
            index
          ].isSelected = false;
        }

        setcalculatedprice(productDetails.calculatedprice);
      });
    }
    setProductKeyAndCalculateTotalAndDisplayName(productDetails);
  }

  function setProductItem4(e) {
    const id = e.target.value.split(" ");
    setCheckedItem4(id[0]);
    if (id[1] === "product") {
      productDetails.option_item_group[3].products.forEach(function(
        item,
        index
      ) {
        if (item._id == id[0]) {
          productDetails.option_item_group[3].products[index].isSelected = true;
          productDetails.option_item_group[3].selecet = "product";
        }
      });
    } else {
      productDetails.option_item_group[3].product_variants.forEach(function(
        item,
        index
      ) {
        if (item.variant_id._id == id[0]) {
          productDetails.option_item_group[3].product_variants[
            index
          ].isSelected = true;
          productDetails.option_item_group[3].selecet = "variant";
        } else {
          productDetails.option_item_group[3].product_variants[
            index
          ].isSelected = false;
        }

        setcalculatedprice(productDetails.calculatedprice);
      });
    }

    setProductKeyAndCalculateTotalAndDisplayName(productDetails);
  }

  function setProductItem5(e) {
    const id = e.target.value.split(" ");
    setCheckedItem5(id[0]);
    if (id[1] === "product") {
      productDetails.option_item_group[4].products.forEach(function(
        item,
        index
      ) {
        if (item._id == id[0]) {
          productDetails.option_item_group[4].products[index].isSelected = true;
          productDetails.option_item_group[4].selecet = "product";
        }
      });
    } else {
      productDetails.option_item_group[4].product_variants.forEach(function(
        item,
        index
      ) {
        if (item.variant_id._id == id[0]) {
          productDetails.option_item_group[4].product_variants[
            index
          ].isSelected = true;
          productDetails.option_item_group[4].selecet = "variant";
        } else {
          productDetails.option_item_group[4].product_variants[
            index
          ].isSelected = false;
        }

        setcalculatedprice(productDetails.calculatedprice);
      });
    }

    setProductKeyAndCalculateTotalAndDisplayName(productDetails);
  }

  /*
  varints Group calculation
  */

  function setProductVarience(e) {
    const filteredObject = productDetails.option_variant_group[0].product_variants.filter(
      function(itm) {
        return itm._id == e.target.value;
      }
    )[0];

    productDetails.variance_price = filteredObject.price;

    //productDetails.option_variant_group[0].product_variants[indexVarient].isSelected = e.target.checked;
    productDetails.option_variant_group[0].product_variants.forEach(function(
      item,
      index
    ) {
      if (item._id == e.target.value) {
        productDetails.option_variant_group[0].product_variants[
          index
        ].isSelected = true;
      } else {
        productDetails.option_variant_group[0].product_variants[
          index
        ].isSelected = false;
      }
    });

    setProductKeyAndCalculateTotalAndDisplayName(productDetails);
    setcalculatedprice(productDetails.calculatedprice);
  }

  function setProductVarience1(e) {
    const filteredObject = productDetails.option_variant_group[1].product_variants.filter(
      function(itm) {
        return itm._id == e.target.value;
      }
    )[0];

    productDetails.variance_price = filteredObject.price;

    //productDetails.option_variant_group[0].product_variants[indexVarient].isSelected = e.target.checked;
    productDetails.option_variant_group[1].product_variants.forEach(function(
      item,
      index
    ) {
      if (item._id == e.target.value) {
        productDetails.option_variant_group[1].product_variants[
          index
        ].isSelected = true;
      } else {
        productDetails.option_variant_group[1].product_variants[
          index
        ].isSelected = false;
      }
    });

    setProductKeyAndCalculateTotalAndDisplayName(productDetails);
    setcalculatedprice(productDetails.calculatedprice);
  }

  function setProductVarience2(e) {
    const filteredObject = productDetails.option_variant_group[2].product_variants.filter(
      function(itm) {
        return itm._id == e.target.value;
      }
    )[0];

    productDetails.variance_price = filteredObject.price;

    //productDetails.option_variant_group[0].product_variants[indexVarient].isSelected = e.target.checked;
    productDetails.option_variant_group[2].product_variants.forEach(function(
      item,
      index
    ) {
      if (item._id == e.target.value) {
        productDetails.option_variant_group[2].product_variants[
          index
        ].isSelected = true;
      } else {
        productDetails.option_variant_group[2].product_variants[
          index
        ].isSelected = false;
      }
    });

    setProductKeyAndCalculateTotalAndDisplayName(productDetails);
    setcalculatedprice(productDetails.calculatedprice);
  }

  function setProductVarience3(e) {
    const filteredObject = productDetails.option_variant_group[3].product_variants.filter(
      function(itm) {
        return itm._id == e.target.value;
      }
    )[0];
    productDetails.variance_price = filteredObject.price;
    productDetails.option_variant_group[3].product_variants.forEach(function(
      item,
      index
    ) {
      if (item._id == e.target.value) {
        productDetails.option_variant_group[3].product_variants[
          index
        ].isSelected = true;
      } else {
        productDetails.option_variant_group[3].product_variants[
          index
        ].isSelected = false;
      }
    });
    setProductKeyAndCalculateTotalAndDisplayName(productDetails);
    setcalculatedprice(productDetails.calculatedprice);
  }
  function setProductVarience4(e) {
    const filteredObject = productDetails.option_variant_group[4].product_variants.filter(
      function(itm) {
        return itm._id == e.target.value;
      }
    )[0];
    productDetails.variance_price = filteredObject.price;
    productDetails.option_variant_group[4].product_variants.forEach(function(
      item,
      index
    ) {
      if (item._id == e.target.value) {
        productDetails.option_variant_group[4].product_variants[
          index
        ].isSelected = true;
      } else {
        productDetails.option_variant_group[4].product_variants[
          index
        ].isSelected = false;
      }
    });
    setProductKeyAndCalculateTotalAndDisplayName(productDetails);
    setcalculatedprice(productDetails.calculatedprice);
  }

  /*
  item Group Calculation
  */
  function setProductAddons(e) {
    if (
      productDetails.option_addon_group &&
      productDetails.option_addon_group[0] !== undefined
    ) {
      productDetails.option_addon_group[0].product_addons.forEach(function(
        item,
        index
      ) {
        if (item._id == e.target.value) {
          item.isSelected = e.target.checked;
        }
      });
    }
    setProductKeyAndCalculateTotalAndDisplayName(productDetails);
    setcalculatedprice(productDetails.calculatedprice);
  }

  function setProductAddons1(e) {
    let AddonOptions = productDetails.AddonOptions;
    let selectedAddonItem = AddonOptions.filter(function(itm) {
      return itm._id == e.target.value;
    });

    if (
      productDetails.option_addon_group &&
      productDetails.option_addon_group[1] !== undefined
    ) {
      productDetails.option_addon_group[1].product_addons.forEach(function(
        item,
        index
      ) {
        if (item._id == e.target.value) {
          item.isSelected = e.target.checked;
        }
      });
    }
    setProductKeyAndCalculateTotalAndDisplayName(productDetails);
    setcalculatedprice(productDetails.calculatedprice);
  }

  function setProductAddons2(e) {
    let AddonOptions = productDetails.AddonOptions;
    let selectedAddonItem = AddonOptions.filter(function(itm) {
      return itm._id == e.target.value;
    });

    if (
      productDetails.option_addon_group &&
      productDetails.option_addon_group[2] !== undefined
    ) {
      productDetails.option_addon_group[2].product_addons.forEach(function(
        item,
        index
      ) {
        if (item._id == e.target.value) {
          item.isSelected = e.target.checked;
        }
      });
    }

    // let indexAddone = AddonOptions.findIndex(function(item) {
    //   return item._id == e.target.value;
    // });
    // AddonOptions[indexAddone].isSelected = e.target.checked;
    // productDetails.AddonOptions = AddonOptions;
    setProductKeyAndCalculateTotalAndDisplayName(productDetails);
    setcalculatedprice(productDetails.calculatedprice);
  }

  function setProductAddons3(e) {
    let AddonOptions = productDetails.AddonOptions;
    let selectedAddonItem = AddonOptions.filter(function(itm) {
      return itm._id == e.target.value;
    });

    if (
      productDetails.option_addon_group &&
      productDetails.option_addon_group[3] !== undefined
    ) {
      productDetails.option_addon_group[3].product_addons.forEach(function(
        item,
        index
      ) {
        if (item._id == e.target.value) {
          item.isSelected = e.target.checked;
        }
      });
    }

    setProductKeyAndCalculateTotalAndDisplayName(productDetails);
    setcalculatedprice(productDetails.calculatedprice);
  }

  function setProductAddons4(e) {
    let AddonOptions = productDetails.AddonOptions;
    let selectedAddonItem = AddonOptions.filter(function(itm) {
      return itm._id == e.target.value;
    });

    if (
      productDetails.option_addon_group &&
      productDetails.option_addon_group[4] !== undefined
    ) {
      productDetails.option_addon_group[4].product_addons.forEach(function(
        item,
        index
      ) {
        if (item._id == e.target.value) {
          item.isSelected = e.target.checked;
        }
      });
    }

    setProductKeyAndCalculateTotalAndDisplayName(productDetails);
    setcalculatedprice(productDetails.calculatedprice);
  }

  /*
  total Calculation
  */
  function setProductKeyAndCalculateTotalAndDisplayName(productDetails) {
    let keyNames = [productDetails.item];
    let KeyIds = [productDetails.id];

    let selecetdItem1 = [];

    if (productDetails.option_item_group != undefined) {
      if (productDetails.option_item_group[0] != undefined) {
        if (productDetails.option_item_group[0].selecet == "product") {
          selecetdItem1 = productDetails.option_item_group[0].products.filter(
            (itm) => itm.isSelected == true
          );
        } else {
          selecetdItem1 = productDetails.option_item_group[0].product_variants.filter(
            (itm) => itm.isSelected == true
          );
        }
      }
    }

    let selecetdItem2 = [];

    if (productDetails.option_item_group !== undefined) {
      if (productDetails.option_item_group[1] !== undefined) {
        if (productDetails.option_item_group[1].selecet == "product") {
          selecetdItem2 = productDetails.option_item_group[1].products.filter(
            (itm) => itm.isSelected == true
          );
        } else {
          selecetdItem2 = productDetails.option_item_group[1].product_variants.filter(
            (itm) => itm.isSelected == true
          );
        }
      }
    }

    let selecetdItem3 = [];

    if (productDetails.option_item_group != undefined) {
      if (productDetails.option_item_group[2] != undefined) {
        if (productDetails.option_item_group[2].selecet == "product") {
          selecetdItem3 = productDetails.option_item_group[2].products.filter(
            (itm) => itm.isSelected == true
          );
        } else {
          selecetdItem3 = productDetails.option_item_group[2].product_variants.filter(
            (itm) => itm.isSelected == true
          );
        }
      }
    }

    let selecetdItem4 = [];

    if (productDetails.option_item_group != undefined) {
      if (productDetails.option_item_group[3] != undefined) {
        if (productDetails.option_item_group[3].selecet == "product") {
          selecetdItem4 = productDetails.option_item_group[3].products.filter(
            (itm) => itm.isSelected == true
          );
        } else {
          selecetdItem4 = productDetails.option_item_group[3].product_variants.filter(
            (itm) => itm.isSelected == true
          );
        }
      }
    }

    let selecetdItem5 = [];

    if (productDetails.option_item_group != undefined) {
      if (productDetails.option_item_group[4] != undefined) {
        if (productDetails.option_item_group[4].selecet == "product") {
          selecetdItem5 = productDetails.option_item_group[4].products.filter(
            (itm) => itm.isSelected == true
          );
        } else {
          selecetdItem5 = productDetails.option_item_group[4].product_variants.filter(
            (itm) => itm.isSelected == true
          );
        }
      }
    }

    let selectedVarient = [];
    if (productDetails.option_variant_group[0] !== undefined) {
      selectedVarient = productDetails.option_variant_group[0].product_variants.filter(
        function(itm) {
          return itm.isSelected == true;
        }
      );
    }

    let selectedVarient1 = [];

    if (productDetails.option_variant_group[1] !== undefined) {
      selectedVarient1 = productDetails.option_variant_group[1].product_variants.filter(
        function(itm) {
          return itm.isSelected == true;
        }
      );
    }

    let selectedVarient2 = [];

    if (productDetails.option_variant_group[2] !== undefined) {
      selectedVarient2 = productDetails.option_variant_group[2].product_variants.filter(
        function(itm) {
          return itm.isSelected == true;
        }
      );
    }

    let selectedVarient3 = [];

    if (productDetails.option_variant_group[3] !== undefined) {
      selectedVarient3 = productDetails.option_variant_group[3].product_variants.filter(
        function(itm) {
          return itm.isSelected == true;
        }
      );
    }

    let selectedVarient4 = [];
    if (productDetails.option_variant_group[4] !== undefined) {
      selectedVarient4 = productDetails.option_variant_group[4].product_variants.filter(
        function(itm) {
          return itm.isSelected == true;
        }
      );
    }

    // step 2 set final price in case of product is varient or not
    if (selectedVarient.length > 0) {
      productDetails.key_price =
        productDetails.price + selectedVarient[0].price;

      selectedVarient.forEach(function(item, index) {
        keyNames.push(` / ${item.variant_name}`);
        KeyIds.push("-varient-" + item._id);
      });
    } else {
      productDetails.key_price = productDetails.price;
      //productDetails.calculatedprice = quantity*productDetails.price;
    }
    // step 2.1
    if (selectedVarient1.length > 0) {
      productDetails.key_price =
        productDetails.key_price + selectedVarient1[0].price;
      selectedVarient1.forEach(function(item, index) {
        keyNames.push(` / ${item.variant_name}`);
        KeyIds.push("-varient-" + item._id);
      });
    }

    // step 2.2
    if (selectedVarient2.length > 0) {
      //productDetails.calculatedprice = quantity*selectedVarient[0].price;

      productDetails.key_price =
        productDetails.key_price + selectedVarient2[0].price;

      selectedVarient2.forEach(function(item, index) {
        keyNames.push(` / ${item.variant_name}`);
        KeyIds.push("-varient-" + item._id);
      });
    }

    // step 2.3
    if (selectedVarient3.length > 0) {
      //productDetails.calculatedprice = quantity*selectedVarient[0].price;
      productDetails.key_price =
        productDetails.key_price + selectedVarient3[0].price;

      selectedVarient3.forEach(function(item, index) {
        keyNames.push(` / ${item.variant_name}`);
        KeyIds.push("-varient-" + item._id);
      });
    }
    // step 2.4
    if (selectedVarient4.length > 0) {
      productDetails.key_price =
        productDetails.key_price + selectedVarient4[0].price;
      selectedVarient4.forEach(function(item, index) {
        keyNames.push(` / ${item.variant_name}`);
        KeyIds.push("-varient-" + item._id);
      });
    }

    // step 3.1 item
    if (selecetdItem1.length > 0) {
      if (selecetdItem1[0].variant_id) {
        productDetails.key_price =
          productDetails.key_price +
          selecetdItem1[0].product_id.price +
          selecetdItem1[0].variant_id.price;
      } else {
        productDetails.key_price =
          productDetails.key_price + selecetdItem1[0].price;
      }
      selecetdItem1.forEach(function(item, index) {
        if (item.variant_id) {
          keyNames.push(
            ` - ${item.product_id.product_name} / ${item.variant_id.variant_name}`
          );
          KeyIds.push("-item-" + item._id);
        } else {
          keyNames.push(` - ${item.product_name}`);
          KeyIds.push("-item-" + item._id);
        }
      });
    }
    if (selecetdItem2.length > 0) {
      if (selecetdItem2[0].variant_id) {
        productDetails.key_price =
          productDetails.key_price +
          selecetdItem2[0].product_id.price +
          selecetdItem2[0].variant_id.price;
      } else {
        productDetails.key_price =
          productDetails.key_price + selecetdItem2[0].price;
      }
      selecetdItem2.forEach(function(item, index) {
        if (item.variant_id) {
          keyNames.push(
            ` - ${item.product_id.product_name} / ${item.variant_id.variant_name}`
          );
          KeyIds.push("-item-" + item._id);
        } else {
          keyNames.push(` - ${item.product_name}`);
          KeyIds.push("-item-" + item._id);
        }
      });
    }

    if (selecetdItem3.length > 0) {
      if (selecetdItem3[0].variant_id) {
        productDetails.key_price =
          productDetails.key_price +
          selecetdItem3[0].product_id.price +
          selecetdItem3[0].variant_id.price;
      } else {
        productDetails.key_price =
          productDetails.key_price + selecetdItem3[0].price;
      }
      selecetdItem3.forEach(function(item, index) {
        if (item.variant_id) {
          keyNames.push(
            ` - ${item.product_id.product_name} / ${item.variant_id.variant_name}`
          );
          KeyIds.push("-item-" + item._id);
        } else {
          keyNames.push(` - ${item.product_name}`);
          KeyIds.push("-item-" + item._id);
        }
      });
    }

    if (selecetdItem4.length > 0) {
      if (selecetdItem4[0].variant_id) {
        productDetails.key_price =
          productDetails.key_price +
          selecetdItem4[0].product_id.price +
          selecetdItem4[0].variant_id.price;
      } else {
        productDetails.key_price =
          productDetails.key_price + selecetdItem4[0].price;
      }
      selecetdItem4.forEach(function(item, index) {
        if (item.variant_id) {
          keyNames.push(
            ` / ${item.product_id.product_name} / ${item.variant_id.variant_name}`
          );
          KeyIds.push("-item-" + item._id);
        } else {
          keyNames.push(` - ${item.product_name}`);
          KeyIds.push("-item-" + item._id);
        }
      });
    }

    if (selecetdItem5.length > 0) {
      if (selecetdItem5[0].variant_id) {
        productDetails.key_price =
          productDetails.key_price +
          selecetdItem5[0].product_id.price +
          selecetdItem5[0].variant_id.price;
      } else {
        productDetails.key_price =
          productDetails.key_price + selecetdItem5[0].price;
      }
      selecetdItem5.forEach(function(item, index) {
        if (item.variant_id) {
          keyNames.push(
            ` - ${item.product_id.product_name} / ${item.variant_id.variant_name}`
          );
          KeyIds.push("-item-" + item._id);
        } else {
          keyNames.push(` - ${item.product_name}`);
          KeyIds.push("-item-" + item._id);
        }
      });
    }

    if (
      productDetails.option_addon_group &&
      productDetails.option_addon_group[0] !== undefined
    ) {
      productDetails.option_addon_group[0].product_addons.forEach(function(
        item,
        index
      ) {
        if (item.isSelected) {
          productDetails.key_price = productDetails.key_price + item.price;
          keyNames.push(`+${item.addon_name}`);
          KeyIds.push("-addon-" + item._id);
        }
      });
    }

    if (
      productDetails.option_addon_group &&
      productDetails.option_addon_group[1] !== undefined
    ) {
      productDetails.option_addon_group[1].product_addons.forEach(function(
        item,
        index
      ) {
        if (item.isSelected) {
          productDetails.key_price = productDetails.key_price + item.price;
          keyNames.push(`+${item.addon_name}`);
          KeyIds.push("-addon-" + item._id);
        }
      });
    }
    if (
      productDetails.option_addon_group &&
      productDetails.option_addon_group[2] !== undefined
    ) {
      productDetails.option_addon_group[2].product_addons.forEach(function(
        item,
        index
      ) {
        if (item.isSelected) {
          productDetails.key_price = productDetails.key_price + item.price;
          keyNames.push(`+${item.addon_name}`);
          KeyIds.push("-addon-" + item._id);
        }
      });
    }

    if (
      productDetails.option_addon_group &&
      productDetails.option_addon_group[3] !== undefined
    ) {
      productDetails.option_addon_group[3].product_addons.forEach(function(
        item,
        index
      ) {
        if (item.isSelected) {
          productDetails.key_price = productDetails.key_price + item.price;
          keyNames.push(`+${item.addon_name}`);
          KeyIds.push("-addon-" + item._id);
        }
      });
    }
    if (
      productDetails.option_addon_group &&
      productDetails.option_addon_group[4] !== undefined
    ) {
      productDetails.option_addon_group[4].product_addons.forEach(function(
        item,
        index
      ) {
        if (item.isSelected) {
          productDetails.key_price = productDetails.key_price + item.price;
          keyNames.push(`+${item.addon_name}`);
          KeyIds.push("-addon-" + item._id);
        }
      });
    }
    productDetails.calculatedprice =
      productDetails.quantity * productDetails.key_price;
    productDetails.display_name = keyNames;
    productDetails.key = KeyIds.join("-");
    return productDetails;
  }

  const getChangedQuantity = (event) => {
    productDetails.quantity = Number(event.target.value);
    setQuantity(productDetails.quantity);
    setProductKeyAndCalculateTotalAndDisplayName(productDetails);
    setcalculatedprice(productDetails.calculatedprice);
  };

  const onSubmit = (formData) => {
    newProductSave(formData, productDetails, null);
    form.resetFields();
  };

  return (
    <>
      <Modal
        className="selectmod"
        title={
          productDetails.option_status == "combo"
            ? "Select Combo Items"
            : "Select Options"
        }
        visible={isModalVisible}
        bodyStyle={{ paddingTop: 0 }}
        onCancel={() => {
          handleCancel();
        }}
        footer={[
          <Button
            key="back"
            onClick={() => {
              handleCancel();
            }}
          >
            Cancel
          </Button>,
          <Button
            type="primary"
            onClick={form.submit}
            style={{ background: "#BD025D", border: "#BD025D" }}
          >
            Add
          </Button>,
        ]}
      >
        <Form
          autoComplete="off"
          style={{ width: "100%" }}
          form={form}
          onFinish={onSubmit}
          name="editProduct"
        >
          {productDetails.option_item_group != undefined &&
            productDetails.option_item_group.length >= 1 &&
            productDetails.option_status == "combo" && (
              <Form.Item
                label={
                  <div className="varints-Addon-name">
                    {productDetails.option_item_group[0].item_group_name}
                    <span className="text-muted"> Choose 1</span>
                  </div>
                }
                name="item_group_id_1"
                rules={[
                  {
                    required: true,
                    message: "Select a items",
                  },
                ]}
              >
                <Radio.Group
                  style={{ marginBottom: "10px" }}
                  buttonStyle="solid"
                  value={checkedItem1}
                  onChange={(e) => setProductItem1(e)}
                  className="tick-radio"
                >
                  {productDetails.option_item_group[0].products.map(
                    (item, index) => {
                      let FilterVarints = productDetails.option_item_group[0].product_variants.filter(
                        (data) => data.product_id._id === item._id
                      );

                      return (
                        <>
                          {FilterVarints.length > 0 ? (
                            FilterVarints.map((data1, index1) => {
                              return (
                                <>
                                  <Radio.Button
                                    value={`${data1.variant_id._id} varint`}
                                    className="sagar15"
                                  >
                                    {checkedItem1 === data1.variant_id._id ? (
                                      <i
                                        class="fas fa-check"
                                        style={{ color: "#BD025D" }}
                                      ></i>
                                    ) : (
                                      ""
                                    )}
                                    {`${data1.product_id.product_name} / ${data1.variant_id.variant_name}`}
                                  </Radio.Button>
                                </>
                              );
                            })
                          ) : (
                            <>
                              <Radio.Button
                                value={`${item._id} product`}
                                style={{
                                  marginRight: "10px",
                                  marginBottom: "10px",
                                }}
                              >
                                {checkedItem1 === item._id ? (
                                  <i
                                    class="fas fa-check"
                                    style={{ color: "#BD025D" }}
                                  ></i>
                                ) : (
                                  ""
                                )}{" "}
                                {item.product_name}
                              </Radio.Button>
                            </>
                          )}
                        </>
                      );
                    }
                  )}
                </Radio.Group>
              </Form.Item>
            )}
          {productDetails.option_item_group != undefined &&
            productDetails.option_item_group.length >= 2 &&
            productDetails.option_status == "combo" && (
              <Form.Item
                label={
                  <div className="varints-Addon-name">
                    {productDetails.option_item_group[1].item_group_name}
                    <span className="text-muted"> Choose 1</span>
                  </div>
                }
                name="item_group_id_2"
                rules={[
                  {
                    required: true,
                    message: "Select a items",
                  },
                ]}
              >
                <Radio.Group
                  style={{ marginBottom: "10px" }}
                  buttonStyle="solid"
                  value={checkedItem2}
                  onChange={(e) => setProductItem2(e)}
                  className="tick-radio"
                >
                  {productDetails.option_item_group[1].products.map(
                    (item, index) => {
                      let FilterVarints = productDetails.option_item_group[1].product_variants.filter(
                        (data) => data.product_id._id === item._id
                      );

                      return (
                        <>
                          {FilterVarints.length > 0 ? (
                            FilterVarints.map((data1, index1) => {
                              return (
                                <>
                                  <Radio.Button
                                    value={`${data1.variant_id._id} varint`}
                                    style={{
                                      marginRight: "10px",
                                      marginBottom: "10px",
                                    }}
                                  >
                                    {checkedItem2 === data1.variant_id._id ? (
                                      <i
                                        class="fas fa-check"
                                        style={{ color: "#BD025D" }}
                                      ></i>
                                    ) : (
                                      ""
                                    )}
                                    {`${data1.product_id.product_name} / ${data1.variant_id.variant_name}`}
                                  </Radio.Button>
                                </>
                              );
                            })
                          ) : (
                            <>
                              <Radio.Button
                                value={`${item._id} product`}
                                style={{
                                  marginRight: "10px",
                                  marginBottom: "10px",
                                }}
                              >
                                {checkedItem2 === item._id ? (
                                  <i
                                    class="fas fa-check"
                                    style={{ color: "#BD025D" }}
                                  ></i>
                                ) : (
                                  ""
                                )}{" "}
                                {item.product_name}
                              </Radio.Button>
                            </>
                          )}
                        </>
                      );
                    }
                  )}
                </Radio.Group>
              </Form.Item>
            )}
          {productDetails.option_item_group != undefined &&
            productDetails.option_item_group.length >= 3 &&
            productDetails.option_status == "combo" && (
              <Form.Item
                label={
                  <div className="varints-Addon-name">
                    {productDetails.option_item_group[2].item_group_name}
                    <span className="text-muted"> Choose 1</span>
                  </div>
                }
                name="item_group_id_3"
                rules={[
                  {
                    required: true,
                    message: "Select a items",
                  },
                ]}
              >
                <Radio.Group
                  style={{ marginBottom: "10px" }}
                  buttonStyle="solid"
                  value={checkedItem3}
                  onChange={(e) => setProductItem3(e)}
                  className="tick-radio"
                >
                  {productDetails.option_item_group[2].products.map(
                    (item, index) => {
                      let FilterVarints = productDetails.option_item_group[2].product_variants.filter(
                        (data) => data.product_id._id === item._id
                      );

                      return (
                        <>
                          {FilterVarints.length > 0 ? (
                            FilterVarints.map((data1, index1) => {
                              return (
                                <>
                                  <Radio.Button
                                    value={`${data1.variant_id._id} varint`}
                                    style={{
                                      marginRight: "10px",
                                      marginBottom: "10px",
                                    }}
                                  >
                                    {checkedItem3 === data1.variant_id._id ? (
                                      <i
                                        class="fas fa-check"
                                        style={{ color: "#BD025D" }}
                                      ></i>
                                    ) : (
                                      ""
                                    )}
                                    {`${data1.product_id.product_name} / ${data1.variant_id.variant_name}`}
                                  </Radio.Button>
                                </>
                              );
                            })
                          ) : (
                            <>
                              <Radio.Button
                                value={`${item._id} product`}
                                style={{
                                  marginRight: "10px",
                                  marginBottom: "10px",
                                }}
                              >
                                {checkedItem3 === item._id ? (
                                  <i
                                    class="fas fa-check"
                                    style={{ color: "#BD025D" }}
                                  ></i>
                                ) : (
                                  ""
                                )}{" "}
                                {item.product_name}
                              </Radio.Button>
                            </>
                          )}
                        </>
                      );
                    }
                  )}
                </Radio.Group>
              </Form.Item>
            )}
          {productDetails.option_item_group != undefined &&
            productDetails.option_item_group.length >= 4 &&
            productDetails.option_status == "combo" && (
              <Form.Item
                label={
                  <div className="varints-Addon-name">
                    {productDetails.option_item_group[3].item_group_name}
                    <span className="text-muted"> Choose 1</span>
                  </div>
                }
                name="item_group_id_4"
                rules={[
                  {
                    required: true,
                    message: "Select a items",
                  },
                ]}
              >
                <Radio.Group
                  style={{ marginBottom: "10px" }}
                  buttonStyle="solid"
                  value={checkedItem4}
                  onChange={(e) => setProductItem4(e)}
                  className="tick-radio"
                >
                  {productDetails.option_item_group[3].products.map(
                    (item, index) => {
                      let FilterVarints = productDetails.option_item_group[3].product_variants.filter(
                        (data) => data.product_id._id === item._id
                      );

                      return (
                        <>
                          {FilterVarints.length > 0 ? (
                            FilterVarints.map((data1, index1) => {
                              return (
                                <>
                                  <Radio.Button
                                    value={`${data1.variant_id._id} varint`}
                                    style={{
                                      marginRight: "10px",
                                      marginBottom: "10px",
                                    }}
                                  >
                                    {checkedItem4 === data1.variant_id._id ? (
                                      <i
                                        class="fas fa-check"
                                        style={{ color: "#BD025D" }}
                                      ></i>
                                    ) : (
                                      ""
                                    )}
                                    {`${data1.product_id.product_name} / ${data1.variant_id.variant_name}`}
                                  </Radio.Button>
                                </>
                              );
                            })
                          ) : (
                            <>
                              <Radio.Button
                                value={`${item._id} product`}
                                style={{
                                  marginRight: "10px",
                                  marginBottom: "10px",
                                }}
                              >
                                {checkedItem4 === item._id ? (
                                  <i
                                    class="fas fa-check"
                                    style={{ color: "#BD025D" }}
                                  ></i>
                                ) : (
                                  ""
                                )}{" "}
                                {item.product_name}
                              </Radio.Button>
                            </>
                          )}
                        </>
                      );
                    }
                  )}
                </Radio.Group>
              </Form.Item>
            )}
          {productDetails.option_item_group != undefined &&
            productDetails.option_item_group.length >= 5 &&
            productDetails.option_status == "combo" && (
              <Radio.Group
                style={{ marginBottom: "10px" }}
                buttonStyle="solid"
                value={checkedItem5}
                onChange={(e) => setProductItem5(e)}
                className="tick-radio"
              >
                {productDetails.option_item_group[4].products.map(
                  (item, index) => {
                    let FilterVarints = productDetails.option_item_group[4].product_variants.filter(
                      (data) => data.product_id._id === item._id
                    );

                    return (
                      <>
                        {FilterVarints.length > 0 ? (
                          FilterVarints.map((data1, index1) => {
                            return (
                              <>
                                <Radio.Button
                                  value={`${data1.variant_id._id} varint`}
                                  style={{
                                    marginRight: "10px",
                                    marginBottom: "10px",
                                  }}
                                >
                                  {checkedItem5 === data1.variant_id._id ? (
                                    <i
                                      class="fas fa-check"
                                      style={{ color: "#BD025D" }}
                                    ></i>
                                  ) : (
                                    ""
                                  )}
                                  {`${data1.product_id.product_name} / ${data1.variant_id.variant_name}`}
                                </Radio.Button>
                              </>
                            );
                          })
                        ) : (
                          <>
                            <Radio.Button value={`${item._id} product`}>
                              {checkedItem5 === item._id ? (
                                <i
                                  class="fas fa-check"
                                  style={{ color: "#BD025D" }}
                                ></i>
                              ) : (
                                ""
                              )}{" "}
                              {item.product_name}
                            </Radio.Button>
                          </>
                        )}
                      </>
                    );
                  }
                )}
              </Radio.Group>
            )}

          {productDetails.isVarience == true && (
            <Form.Item
              onChange={(e) => setProductVarience(e)}
              label={
                <div className="varints-Addon-name">
                  {productDetails.option_variant_group[0].variant_group_name}
                  <span className="text-muted"> Choose 1</span>
                </div>
              }
              name="varient_id"
              rules={[
                {
                  required: true,
                  message: "Select a variant1",
                },
              ]}
            >
              <Radio.Group
                style={{ marginBottom: "0px" }}
                value={checkedVariant1}
                buttonStyle="solid"
                onChange={(e) => {
                  setCheckedVariant1(e.target.value);
                }}
                className="tick-radio"
              >
                {productDetails.option_variant_group[0].product_variants.map(
                  (item, index) => {
                    return (
                      <Radio.Button
                        value={item._id}
                        style={{
                          marginRight: "10px",
                          marginBottom: "10px",
                        }}
                      >
                        {checkedVariant1 == item._id && (
                          <>
                            <i
                              class="fas fa-check"
                              style={{ color: "#BD025D" }}
                            ></i>
                            &nbsp;
                          </>
                        )}
                        {item.variant_name}
                      </Radio.Button>
                    );
                  }
                )}
              </Radio.Group>
            </Form.Item>
          )}
          {productDetails.isVarience == true &&
            productDetails.option_variant_group.length >= 2 && (
              <Form.Item
                onChange={(e) => setProductVarience1(e)}
                label={
                  <div className="varints-Addon-name">
                    {productDetails.option_variant_group[1].variant_group_name}
                    <span className="text-muted"> Choose 1</span>
                  </div>
                }
                name="varient_id1"
                rules={[
                  {
                    required: true,
                    message: "Select a variant",
                  },
                ]}
              >
                <Radio.Group
                  style={{ marginBottom: "10px" }}
                  value={checkedVariant2}
                  buttonStyle="solid"
                  onChange={(e) => setCheckedVariant2(e.target.value)}
                  className="tick-radio"
                >
                  {productDetails.option_variant_group[1].product_variants.map(
                    (item, index) => {
                      return (
                        <Radio.Button
                          style={{
                            marginRight: "10px",
                            marginBottom: "10px",
                          }}
                          value={item._id}
                        >
                          {checkedVariant2 == item._id && (
                            <>
                              <i
                                class="fas fa-check"
                                style={{ color: "#BD025D" }}
                              ></i>
                              &nbsp;
                            </>
                          )}{" "}
                          {item.variant_name}
                        </Radio.Button>
                      );
                    }
                  )}
                </Radio.Group>
              </Form.Item>
            )}
          {productDetails.isVarience == true &&
            productDetails.option_variant_group.length >= 3 && (
              <Form.Item
                onChange={(e) => setProductVarience2(e)}
                label={
                  <div className="varints-Addon-name">
                    {productDetails.option_variant_group[2].variant_group_name}
                    <span className="text-muted"> Choose 1</span>
                  </div>
                }
                name="varient_id2"
                rules={[
                  {
                    required: true,
                    message: "Select a variant",
                  },
                ]}
              >
                <Radio.Group
                  style={{ marginBottom: "10px" }}
                  value={checkedVariant3}
                  buttonStyle="solid"
                  onChange={(e) => setCheckedVariant3(e.target.value)}
                  className="tick-radio"
                >
                  {productDetails.option_variant_group[2].product_variants.map(
                    (item, index) => {
                      return (
                        <Radio.Button
                          style={{
                            marginRight: "10px",
                            marginBottom: "10px",
                          }}
                          value={item._id}
                        >
                          {checkedVariant3 == item._id && (
                            <>
                              <i
                                class="fas fa-check"
                                style={{ color: "#BD025D" }}
                              ></i>
                              &nbsp;
                            </>
                          )}{" "}
                          {item.variant_name}
                        </Radio.Button>
                      );
                    }
                  )}
                </Radio.Group>
              </Form.Item>
            )}
          {productDetails.isVarience == true &&
            productDetails.option_variant_group.length >= 4 && (
              <Form.Item
                onChange={(e) => setProductVarience3(e)}
                label={
                  <div className="varints-Addon-name">
                    {productDetails.option_variant_group[3].variant_group_name}
                    <span className="text-muted"> Choose 1</span>
                  </div>
                }
                name="varient_id3"
                rules={[
                  {
                    required: true,
                    message: "Select a variant",
                  },
                ]}
              >
                <Radio.Group
                  buttonStyle="solid"
                  style={{ marginBottom: "10px" }}
                  value={checkedVariant4}
                  onChange={(e) => setCheckedVariant4(e.target.value)}
                  className="tick-radio"
                >
                  {productDetails.option_variant_group[3].product_variants.map(
                    (item, index) => {
                      return (
                        <Radio.Button
                          style={{
                            marginRight: "10px",
                            marginBottom: "10px",
                          }}
                          value={item._id}
                        >
                          {checkedVariant4 === item._id ? (
                            <>
                              <i
                                class="fas fa-check"
                                style={{ color: "#BD025D" }}
                              ></i>
                              &nbsp;
                            </>
                          ) : (
                            ""
                          )}{" "}
                          {item.variant_name}
                        </Radio.Button>
                      );
                    }
                  )}
                </Radio.Group>
              </Form.Item>
            )}
          {productDetails.isVarience == true &&
            productDetails.option_variant_group.length >= 5 && (
              <Form.Item
                onChange={(e) => setProductVarience4(e)}
                label={
                  <div className="varints-Addon-name">
                    {productDetails.option_variant_group[4].variant_group_name}
                    <span className="text-muted"> Choose 1</span>
                  </div>
                }
                name="varient_id4"
                rules={[
                  {
                    required: true,
                    message: "Select a variant",
                  },
                ]}
              >
                <Radio.Group
                  buttonStyle="solid"
                  style={{ marginBottom: "10px" }}
                  value={checkedVariant5}
                  onChange={(e) => setCheckedVariant5(e.target.value)}
                  className="tick-radio"
                >
                  {productDetails.option_variant_group[4].product_variants.map(
                    (item, index) => {
                      return (
                        <Radio.Button
                          style={{
                            marginRight: "10px",
                            marginBottom: "10px",
                          }}
                          value={item._id}
                        >
                          {checkedVariant5 === item._id ? (
                            <>
                              <i
                                class="fas fa-check"
                                style={{ color: "#BD025D" }}
                              ></i>
                              &nbsp;
                            </>
                          ) : (
                            ""
                          )}{" "}
                          {item.variant_name}
                        </Radio.Button>
                      );
                    }
                  )}
                </Radio.Group>
              </Form.Item>
            )}
          {productDetails.isAddon1st == true && (
            <>
              <Form.Item
                onChange={(e) => setProductAddons(e)}
                label={
                  <div className="varints-Addon-name">
                    {productDetails.option_addon_group[0].addon_group_name}
                    <span className="text-muted">
                      {productDetails.option_addon_group[0]
                        .minimum_selectable === 0
                        ? null
                        : ` (Addons) Choose atleast ${productDetails.option_addon_group[0].minimum_selectable}`}
                      {productDetails.option_addon_group[0]
                        .maximum_selectable === 0
                        ? ""
                        : ` Max ${productDetails.option_addon_group[0].maximum_selectable}`}
                    </span>
                  </div>
                }
                rules={[
                  {
                    validator: (_, value) => {
                      let value1 = value == undefined ? [] : value;
                      if (
                        productDetails.option_addon_group[0]
                          .minimum_selectable === 0 &&
                        productDetails.option_addon_group[0]
                          .maximum_selectable === 0
                      ) {
                        return Promise.resolve();
                      } else {
                        if (
                          productDetails.option_addon_group[0]
                            .minimum_selectable > 0 &&
                          value1.length <
                            productDetails.option_addon_group[0]
                              .minimum_selectable
                        ) {
                          return Promise.reject(
                            "Less than the min selectable limit."
                          );
                        } else if (
                          value1.length >
                          productDetails.option_addon_group[0]
                            .maximum_selectable
                        ) {
                          return Promise.reject(
                            "Exceeds the max selectable limit"
                          );
                        } else {
                          return Promise.resolve();
                        }
                      }
                    },
                  },
                ]}
                name="addon_id"
              >
                <Checkbox.Group>
                  {productDetails.option_addon_group[0].product_addons.map(
                    (item, index) => {
                      return (
                        <Checkbox
                          checked={item.isSelected}
                          value={item._id}
                          className="varints-Addon-name tick-checkbox"
                        >
                          {item.isSelected ? (
                            <>
                              <i
                                class="fas fa-check"
                                style={{ color: "#BD025D" }}
                              ></i>
                              &nbsp;
                            </>
                          ) : null}{" "}
                          {item.addon_name}
                        </Checkbox>
                      );
                    }
                  )}
                </Checkbox.Group>
              </Form.Item>
            </>
          )}
          {productDetails.isAddon2nd == true && (
            <Form.Item
              onChange={(e) => setProductAddons1(e)}
              name="addon_id1"
              label={
                <div className="varints-Addon-name">
                  {productDetails.option_addon_group[1].addon_group_name}
                  <span className="text-muted">
                    {productDetails.option_addon_group[1].minimum_selectable ===
                    0
                      ? null
                      : ` (Addons) Choose atleast ${productDetails.option_addon_group[1].minimum_selectable}`}
                    {productDetails.option_addon_group[1].maximum_selectable ===
                    0
                      ? ""
                      : ` Max ${productDetails.option_addon_group[1].maximum_selectable}`}
                  </span>
                </div>
              }
              rules={[
                {
                  validator: (_, data) => {
                    let value = data == undefined ? [] : data;

                    if (
                      productDetails.option_addon_group[1]
                        .minimum_selectable === 0 &&
                      productDetails.option_addon_group[1]
                        .maximum_selectable === 0
                    ) {
                      return Promise.resolve();
                    } else {
                      if (
                        productDetails.option_addon_group[1]
                          .minimum_selectable > 0 &&
                        value.length <
                          productDetails.option_addon_group[1]
                            .minimum_selectable
                      ) {
                        return Promise.reject(
                          "Less than the min selectable limit."
                        );
                      } else if (
                        value.length >
                        productDetails.option_addon_group[1].maximum_selectable
                      ) {
                        return Promise.reject(
                          "Exceeds the max selectable limit"
                        );
                      } else {
                        return Promise.resolve();
                      }
                    }
                  },
                },
              ]}
            >
              <Checkbox.Group>
                {productDetails.option_addon_group[1].product_addons.map(
                  (item, index) => {
                    return (
                      <Checkbox
                        checked={item.isSelected}
                        value={item._id}
                        className="varints-Addon-name tick-checkbox"
                      >
                        {item.isSelected ? (
                          <>
                            <i
                              class="fas fa-check"
                              style={{ color: "#BD025D" }}
                            ></i>
                            &nbsp;
                          </>
                        ) : null}{" "}
                        {item.addon_name}
                      </Checkbox>
                    );
                  }
                )}
              </Checkbox.Group>
            </Form.Item>
          )}
          {productDetails.isAddon3rd == true && (
            <Form.Item
              onChange={(e) => setProductAddons2(e)}
              label={
                <div className="varints-Addon-name">
                  {productDetails.option_addon_group[2].addon_group_name}
                  <span className="text-muted">
                    {productDetails.option_addon_group[2].minimum_selectable ===
                    0
                      ? null
                      : ` (Addons) Choose atleast ${productDetails.option_addon_group[2].minimum_selectable}`}
                    {productDetails.option_addon_group[2].maximum_selectable ===
                    0
                      ? ""
                      : ` Max ${productDetails.option_addon_group[2].maximum_selectable}`}
                  </span>
                </div>
              }
              rules={[
                {
                  validator: (_, data) => {
                    let value = data == undefined ? [] : data;
                    if (
                      productDetails.option_addon_group[2]
                        .minimum_selectable === 0 &&
                      productDetails.option_addon_group[2]
                        .maximum_selectable === 0
                    ) {
                      return Promise.resolve();
                    } else {
                      if (
                        value.length <
                        productDetails.option_addon_group[2].minimum_selectable
                      ) {
                        return Promise.reject(
                          "Less than the min selectable limit."
                        );
                      } else if (
                        value.length >
                        productDetails.option_addon_group[2].maximum_selectable
                      ) {
                        return Promise.reject(
                          "Exceeds the max selectable limit"
                        );
                      } else {
                        return Promise.resolve();
                      }
                    }
                  },
                },
              ]}
              name="addon_id2"
            >
              <Checkbox.Group>
                {productDetails.option_addon_group[2].product_addons.map(
                  (item, index) => {
                    return (
                      <Checkbox
                        checked={item.isSelected}
                        value={item._id}
                        className="varints-Addon-name tick-checkbox"
                      >
                        {item.isSelected ? (
                          <>
                            <i
                              class="fas fa-check"
                              style={{ color: "#BD025D" }}
                            ></i>
                            &nbsp;
                          </>
                        ) : null}{" "}
                        {item.addon_name}
                      </Checkbox>
                    );
                  }
                )}
              </Checkbox.Group>
            </Form.Item>
          )}

          {productDetails.option_addon_group &&
            productDetails.option_addon_group[3] !== undefined && (
              <Form.Item
                onChange={(e) => setProductAddons3(e)}
                label={
                  <div className="varints-Addon-name">
                    {productDetails.option_addon_group[3].addon_group_name}
                    <span className="text-muted">
                      {productDetails.option_addon_group[3]
                        .minimum_selectable === 0
                        ? null
                        : ` (Addons) Choose atleast ${productDetails.option_addon_group[3].minimum_selectable}`}
                      {productDetails.option_addon_group[3]
                        .maximum_selectable === 0
                        ? ""
                        : ` Max ${productDetails.option_addon_group[3].maximum_selectable}`}
                    </span>
                  </div>
                }
                rules={[
                  {
                    validator: (_, data) => {
                      let value = data == undefined ? [] : data;
                      if (
                        productDetails.option_addon_group[3]
                          .minimum_selectable === 0 &&
                        productDetails.option_addon_group[3]
                          .maximum_selectable === 0
                      ) {
                        return Promise.resolve();
                      } else {
                        if (
                          value.length <
                          productDetails.option_addon_group[3]
                            .minimum_selectable
                        ) {
                          return Promise.reject(
                            "Less than the min selectable limit."
                          );
                        } else if (
                          value.length >
                          productDetails.option_addon_group[3]
                            .maximum_selectable
                        ) {
                          return Promise.reject(
                            "Exceeds the max selectable limit"
                          );
                        } else {
                          return Promise.resolve();
                        }
                      }
                    },
                  },
                ]}
                name="addon_id3"
              >
                <Checkbox.Group>
                  {productDetails.option_addon_group[3].product_addons.map(
                    (item, index) => {
                      return (
                        <Checkbox
                          checked={item.isSelected}
                          value={item._id}
                          className="varints-Addon-name tick-checkbox"
                        >
                          {item.isSelected ? (
                            <>
                              <i
                                class="fas fa-check"
                                style={{ color: "#BD025D" }}
                              ></i>
                              &nbsp;
                            </>
                          ) : null}{" "}
                          {item.addon_name}
                        </Checkbox>
                      );
                    }
                  )}
                </Checkbox.Group>
              </Form.Item>
            )}
          {productDetails.option_addon_group &&
            productDetails.option_addon_group[4] !== undefined && (
              <Form.Item
                onChange={(e) => setProductAddons4(e)}
                label={
                  <div className="varints-Addon-name">
                    {productDetails.option_addon_group[4].addon_group_name}
                    <span className="text-muted">
                      {productDetails.option_addon_group[4]
                        .minimum_selectable === 0
                        ? null
                        : ` (Addons) Choose atleast ${productDetails.option_addon_group[4].minimum_selectable}`}
                      {productDetails.option_addon_group[4]
                        .maximum_selectable === 0
                        ? ""
                        : ` Max ${productDetails.option_addon_group[4].maximum_selectable}`}
                    </span>
                  </div>
                }
                rules={[
                  {
                    validator: (_, data) => {
                      let value = data == undefined ? [] : data;
                      if (
                        productDetails.option_addon_group[4]
                          .minimum_selectable === 0 &&
                        productDetails.option_addon_group[4]
                          .maximum_selectable === 0
                      ) {
                        return Promise.resolve();
                      } else {
                        if (
                          value.length <
                          productDetails.option_addon_group[4]
                            .minimum_selectable
                        ) {
                          return Promise.reject(
                            "Less than the min selectable limit."
                          );
                        } else if (
                          value.length >
                          productDetails.option_addon_group[4]
                            .maximum_selectable
                        ) {
                          return Promise.reject(
                            "Exceeds the max selectable limit"
                          );
                        } else {
                          return Promise.resolve();
                        }
                      }
                    },
                  },
                ]}
                name="addon_id4"
              >
                <Checkbox.Group>
                  {productDetails.option_addon_group[4].product_addons.map(
                    (item, index) => {
                      return (
                        <Checkbox
                          checked={item.isSelected}
                          value={item._id}
                          className="varints-Addon-name tick-checkbox"
                        >
                          {item.isSelected ? (
                            <>
                              <i
                                class="fas fa-check"
                                style={{ color: "#BD025D" }}
                              ></i>
                              &nbsp;
                            </>
                          ) : null}{" "}
                          {item.addon_name}
                        </Checkbox>
                      );
                    }
                  )}
                </Checkbox.Group>
              </Form.Item>
            )}

          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[
              {
                validator: (_, value) => {
                  if (value == 0 || value == "") {
                    return Promise.reject("qty not 0 and empty");
                  } else {
                    return Promise.resolve();
                  }
                },
              },
            ]}
          >
            <Input
              type="number"
              style={{ margin: "6px 0" }}
              placeholder="Enter item quantity"
              ref={exampleInput}
              value={parseInt(quantity)}
              onChange={getChangedQuantity}
              onKeyPress={(event) => {
                if (event.key.match("[0-9]+")) {
                  return true;
                } else {
                  return event.preventDefault();
                }
              }}
            />
          </Form.Item>
          {getItem("hide_quantity_increase_decrease_buttons") ? (
            ""
          ) : (
            <Form.Item>
              <div className="quantityies">
                <>
                  <span
                    class="qunatity-adjust"
                    onClick={() => addOneQuantityInDetails("SUBTRACT")}
                  >
                    −
                  </span>
                </>

                <>
                  <span
                    class="qunatity-adjust"
                    onClick={() => addOneQuantityInDetails("ADD")}
                  >
                    +
                  </span>
                </>
              </div>
            </Form.Item>
          )}
          <Form.Item>
            <div>
              Total Price ₹
              {`${
                productDetails.calculatedprice
                  ? Number(productDetails.calculatedprice).toFixed(2)
                  : Number(productDetails.price).toFixed(2)
              }`}
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
});

export { NewProductModal };
