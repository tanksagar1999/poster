import React from "react";
import { Row, Col, Card } from "antd";
import { Main } from "../styled";
import { PageHeader } from "../../components/page-headers/page-headers";
import {
  EllipsisOutlined,
  ShoppingCartOutlined,
  GroupOutlined,
  FileAddOutlined,
  PlusSquareOutlined,
  ImportOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { NavLink } from "react-router-dom";

const { Meta } = Card;

const ProductOptionGrid = () => {
  return (
    <>
      <PageHeader title="Product Options" />
      <Main>
        <Row gutter={[16, 16]}>
          <Col className="gutter-row" span={8}>
            <NavLink to={"/admin/product-options/variant"}>
              <Card
                hoverable
                actions={[
                  <NavLink to="/admin/product-options/variant/add">
                    <FileAddOutlined key="add" />
                  </NavLink>,
                  <NavLink to="/admin/product-options/variant">
                    <EllipsisOutlined key="list" />
                  </NavLink>,
                  <NavLink to="/admin/product-options/variant/import">
                    <ImportOutlined key="import" />
                  </NavLink>,
                ]}
              >
                <Meta
                  avatar={
                    <ShoppingCartOutlined
                      key="ellipsis"
                      style={{ fontSize: "50px" }}
                    />
                  }
                  title="119"
                  description="Variants"
                  hoverable="true"
                />
              </Card>
            </NavLink>
          </Col>

          <Col className="gutter-row" span={8}>
            <NavLink to={"/admin/product-options/variantgroup"}>
              <Card
                actions={[
                  <NavLink to="/admin/product-options/variantgroup/add">
                    <FileAddOutlined key="add" />
                  </NavLink>,
                  <NavLink to="/admin/product-options/variantgroup">
                    <EllipsisOutlined key="list" />
                  </NavLink>,
                  <NavLink to="/admin/product-options/variantgroup/import">
                    <ImportOutlined key="import" />
                  </NavLink>,
                ]}
              >
                <Meta
                  avatar={
                    <GroupOutlined
                      key="ellipsis"
                      style={{ fontSize: "50px" }}
                    />
                  }
                  title="120"
                  description="Variant Group"
                  hoverable="true"
                />
              </Card>
            </NavLink>
          </Col>
          <Col className="gutter-row" span={8}>
            <NavLink to={"/admin/product-options/addon"}>
              <Card
                actions={[
                  <NavLink to="/admin/product-options/addon/add">
                    <FileAddOutlined key="add" />
                  </NavLink>,
                  <NavLink to="/admin/product-options/addon">
                    <EllipsisOutlined key="list" />
                  </NavLink>,
                  <NavLink to="/admin/product-options/addon/import">
                    <ImportOutlined key="import" />
                  </NavLink>,
                ]}
              >
                <Meta
                  avatar={
                    <PlusSquareOutlined
                      key="ellipsis"
                      style={{ fontSize: "50px" }}
                    />
                  }
                  title="20"
                  description="Addons"
                  hoverable="true"
                />
              </Card>
            </NavLink>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col className="gutter-row" span={8}>
            <NavLink to={"/admin/product-options/addongroup"}>
              <Card
                actions={[
                  <NavLink to="/admin/product-options/addongroup/add">
                    <FileAddOutlined key="add" />
                  </NavLink>,
                  <NavLink to="/admin/product-options/addongroup">
                    <EllipsisOutlined key="list" />
                  </NavLink>,
                  <NavLink to="/admin/product-options/addongroup/import">
                    <ImportOutlined key="import" />
                  </NavLink>,
                ]}
              >
                <Meta
                  avatar={
                    <GroupOutlined key="add" style={{ fontSize: "50px" }} />
                  }
                  title="2"
                  description="Addon Groups"
                  hoverable="true"
                />
              </Card>
            </NavLink>
          </Col>
          <Col className="gutter-row" span={8}>
            <NavLink to={"/admin/product-options/itemgroup"}>
              <Card
                actions={[
                  <NavLink to="/admin/product-options/itemgroup/add">
                    <FileAddOutlined key="add" />
                  </NavLink>,
                  <NavLink to="/admin/product-options/itemgroup">
                    <EllipsisOutlined key="list" />
                  </NavLink>,
                  <NavLink to="/admin/product-options/itemgroup/import">
                    <ImportOutlined key="import" />
                  </NavLink>,
                ]}
              >
                <Meta
                  avatar={
                    <UnorderedListOutlined
                      key="group"
                      style={{ fontSize: "50px" }}
                    />
                  }
                  title="12"
                  description="Item Groups"
                  hoverable="true"
                />
              </Card>
            </NavLink>
          </Col>
        </Row>
      </Main>
    </>
  );
};

export default ProductOptionGrid;
