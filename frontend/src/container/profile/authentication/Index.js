import React from "react";
import { Row, Col } from "antd";
import { Aside, Content } from "./overview/style";
import Heading from "../../../components/heading/heading";
import "../profile.css";
const AuthLayout = (WraperContent) => {
  return () => {
    return (
      <Row>
        <Col xxl={8} xl={9} lg={12} md={8} xs={24}>
          <Aside className="login_lftbg">
            <div className="auth-side-content">
              <img
                src={require("../../../static/img/auth/topShape.png")}
                alt=""
                className="topShape"
              />
              <img
                src={require("../../../static/img/auth/bottomShape.png")}
                alt=""
                className="bottomShape"
              />
              <Content>
                <div className="mobile_scrlogo">
                  <img
                    style={{ width: "150px" }}
                    src={require("../../../static/img/logo_dark.png")}
                    alt=""
                  />
                  <br />
                  <Heading as="h1">
                    PosEase
                    <br />
                  </Heading>
                  
                </div>
                <h2 className="point_mobile">Point Of Sale <br/>Web Application</h2>
                <img
                  className="auth-content-figure lgn_w100"
                  src={require("../../../static/img/auth/Illustration.a7e60ade.png")}
                  alt=""
                />
              </Content>
            </div>
          </Aside>
        </Col>
        <Col xxl={16} xl={15} lg={12} md={16} xs={24}>
          <WraperContent />
        </Col>
      </Row>
    );
  };
};

export default AuthLayout;
