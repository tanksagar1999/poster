import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Row,
  Col,
  Input,
  Modal,
  Avatar,
  List,
  Menu,
  Dropdown,
  Table,
  AutoComplete,
} from "antd";
import "../sell.css";
import { useDispatch } from "react-redux";
import {
  getAllProductList,
  getCategoryWiseAllProductList,
  getAllCategoriesList,
} from "../../../redux/products/actionCreator";
import {
  addOrUpdatePrefernce,
  getPrefernceById,
} from "../../../redux/preference/actionCreator";
import { getItem, setItem } from "../../../utility/localStorageControl";

import "./GridView.css";
import { DownOutlined } from "@ant-design/icons";

const GridViewCurrent = (props) => {
  let { addToCart, selectedAllProduct, categoryFilter, calculationQty } = props;
  const [ProductList, setProductList] = useState([]);
  const dispatch = useDispatch();
  let isMounted = useRef(true);
  const [filterArray, setFilterArray] = useState([]);
  const [currentCategory, setCurrentCategory] = useState("All");
  let [allCategoryList, setAllCategoryList] = useState([]);
  let [allProductList, setAllProductList] = useState([]);
  let [FirstCategoryId, setFirstCategoryId] = useState();

  useEffect(() => {
    async function fetchAllCategoryList() {
      const allCategoryList = await dispatch(getAllCategoriesList());
      if (isMounted.current && allCategoryList && allCategoryList.categoryList)
        if (getItem("hideAllAndTop")) {
          const getProductList = await dispatch(
            getCategoryWiseAllProductList(
              allCategoryList.categoryList[0]._id,
              1
            )
          );
          setCurrentCategory(allCategoryList.categoryList[0].category_name);
          if (isMounted.current && getProductList && getProductList.productList)
            getProductList.productList.map((value, index) => {
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
                  value.newPrice = (value.price + itemPrice).toFixed(2);
                } else {
                  value.newPrice = value.price.toFixed(2);
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
                  value.newPrice = (value.price + varintsPrice).toFixed(2);
                } else {
                  value.newPrice = value.price.toFixed(2);
                }
              }

              if (value.product_name.length > 30) {
                let divideArray = value.product_name.match(/.{1,30}/g);
                value.Newproduct_name = value.product_name.replace(
                  divideArray[1],
                  ".."
                );
              }
              value.tax_group.taxes.map(
                (tax) => (totalTax += tax.tax_percentage)
              );
              value.tax_group.Totaltax = totalTax;
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
                    price3 = (value.price - price2).toFixed(2);
                    value.price = Number(price3);
                  }
                }
              }
            });
          setProductList(getProductList.productList);
          setAllProductList(getProductList.productList);
        }
      setFirstCategoryId(allCategoryList.categoryList[0].category_name);
      setAllCategoryList(allCategoryList.categoryList);
    }
    async function fetchProductList() {
      const getProductList = await dispatch(
        getCategoryWiseAllProductList(null, 1)
      );

      if (isMounted.current && getProductList && getProductList.productList)
        getProductList.productList.map((value, index) => {
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
              value.newPrice = (value.price + itemPrice).toFixed(2);
            } else {
              value.newPrice = value.price.toFixed(2);
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
              value.newPrice = (value.price + varintsPrice).toFixed(2);
            } else {
              value.newPrice = value.price.toFixed(2);
            }
          }

          if (value.product_name.length > 30) {
            let divideArray = value.product_name.match(/.{1,30}/g);
            value.Newproduct_name = value.product_name.replace(
              divideArray[1],
              ".."
            );
          }
          value.tax_group.taxes.map((tax) => (totalTax += tax.tax_percentage));
          value.tax_group.Totaltax = totalTax;
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
                price3 = (value.price - price2).toFixed(2);
                value.price = Number(price3);
              }
            }
          }
        });
      if (!getItem("hideAllAndTop")) {
        setProductList(getProductList.productList);
        setAllProductList(getProductList.productList);
      }
    }
    if (isMounted.current) {
      fetchProductList();
      fetchAllCategoryList();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);
  const getCategoryById = async (category_id) => {
    let getProductList = await dispatch(
      getCategoryWiseAllProductList(category_id, 1)
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
          value.newPrice = (value.price + variantMinPrice).toFixed(2);
        } else {
          value.newPrice = value.price.toFixed(2);
        }
        if (value.product_name.length > 30) {
          let divideArray = value.product_name.match(/.{1,30}/g);
          value.Newproduct_name = value.product_name.replace(
            divideArray[1],
            ".."
          );
        }
        value.tax_group.taxes.map((tax) => (totalTax += tax.tax_percentage));
        value.tax_group.Totaltax = totalTax;
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
              price3 = (value.price - price2).toFixed(2);
              value.price = Number(price3);
            }
          }
        }
      });
      setProductList(getProductList.productList);
    }
  };

  const SearchHandle = (data) => {
    let searchArr = allProductList.filter((value) => {
      return value.product_name.toLowerCase().includes(data);
    });
    setProductList(searchArr);
  };
  useEffect(() => {
    if (ProductList.length > 0) {
      const getSections = () => {
        if (ProductList.length === 0) {
          return [];
        }
        let filterdArray = ProductList.sort((a, b) =>
          a.product_name.localeCompare(b.product_name)
        );
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
  }, [ProductList]);

  const menu = (
    <Menu style={{ height: "400px", overflowY: "scroll" }}>
      {getItem("hideAllAndTop") > 0 ? (
        ""
      ) : (
        <Menu.Item
          key="1"
          className="menu-item"
          onClick={() => {
            getCategoryById(null);
            setCurrentCategory("All");
          }}
        >
          All
        </Menu.Item>
      )}

      {allCategoryList.map((value, key) => {
        return (
          <>
            <Menu.Item
              key={key}
              className="menu-item"
              onClick={() => {
                getCategoryById(value._id);
                setCurrentCategory(value.category_name);
              }}
            >
              {value.category_name}
            </Menu.Item>
          </>
        );
      })}
    </Menu>
  );
  return (
    <>
      <Dropdown overlay={menu} trigger={["click"]}>
        <a
          className="ant-dropdown-link"
          onClick={(e) => e.preventDefault()}
          style={{ marginLeft: 20 }}
        >
          {currentCategory}
          <DownOutlined />
        </a>
      </Dropdown>
      <Input
        placeholder="Search item (F7) Clear (Esc)"
        onChange={(e) => SearchHandle(e.target.value)}
        style={{ margin: 10 }}
      />
      <div className="view-items">
        <ul>
          <li>view items</li>
        </ul>
      </div>
      <div
        // style={{ overflow: "auto", height: "500px", width: "900px" }}
        className="item-list gridl_lstscrl"
      >
        <div style={{ marginLeft: 10, marginTop: 10 }}>
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
                              <tr onClick={() => addToCart(value)}>
                                <td>
                                  <a className="sp-product-name">
                                    {value.Newproduct_name
                                      ? value.Newproduct_name
                                      : value.product_name}{" "}
                                  </a>
                                  <span className="text-muted">
                                    {" "}
                                    in {value.product_category.category_name}
                                  </span>
                                </td>
                                <td>
                                  {calculationQty(value)}₹{value.newPrice}
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
      </div>
    </>
  );
};

export { GridViewCurrent };
