import React from "react";

import { Input, Card, List, Typography } from "antd";

import "../sell.css";
const { Meta } = Card;
import { ShoppingCartOutlined } from "@ant-design/icons";
import { Main } from "../../styled";

const { Search } = Input;

const data = [
  "All",
  "Top",
  "Soup",
  "Sandwitches & Pizza",
  "Oriental Starter",
  "Tandoori Starter",
  "Continental Starter",
  "Salad & Raita",
];

const ItemCategoryList = (props) => {
  return (
    <>
      <List
        header={<div>Category</div>}
        bordered
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <Typography.Text mark></Typography.Text> {item}
          </List.Item>
        )}
      />
    </>
  );
};

export { ItemCategoryList };
