import React, { useState, useEffect, useRef, useCallback } from "react";
import { Figure2, BannerWrapper } from "./Style";
import { Row, Col } from "antd";
import { Main } from "../styled";
import { Button } from "../../components/buttons/buttons";
import { Cards } from "../../components/cards/frame/cards-frame";
import { PageHeader } from "../../components/page-headers/page-headers";

const Application = (props) => {
  const style = {
    opacity: 0.7,
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginTop: 30,
  };

  return (
    <>
      <Main>
        <PageHeader ghost title="Enhance your POS capabilities with PosEase Apps." />
        <Cards
          headless
        
        >
          <Row gutter={25}>
           <Col xxl={6} xl={8} lg={8} sm={12} xs={24} className="appstr_crd">
              <BannerWrapper>
                <Cards
                  className="mb-70"
                  bodyStyle={{
                    background: "#5F63F2",
                    borderRadius: "10px",
                    Height: "200px",
                  }}
                  headless
                >
                  <Figure2>
                    <img
                      src={require(`../../static/img/app/analytic.png`)}
                      alt=""
                      height="100px"
                      width="100px"
                    />
                    <figcaption>
                      <h2>Analytics</h2>
                      <p>
                        Track business metrics from anywhere using the Analytics
                        mobile app.
                      </p>
                      <Button size="large" type="white">
                        Enable App
                      </Button>
                    </figcaption>
                  </Figure2>
                </Cards>
              </BannerWrapper>
            </Col>
            <Col xxl={6} xl={8} lg={8} sm={12} xs={24} className="appstr_crd">
              <BannerWrapper>
                <Cards
                  className="mb-70"
                  bodyStyle={{
                    background: "rgb(39, 43, 65)",
                    borderRadius: "10px",
                    Height: "200px",
                  }}
                  headless
                >
                  <Figure2>
                    <img
                      src={require(`../../static/img/app/inventory.png`)}
                      alt=""
                      height="100px"
                      width="100px"
                    />
                    <figcaption>
                      <h2>Inventory</h2>
                      <p>
                        Create inventories and manage stock in realtime with
                        reorder level alerts.
                      </p>
                      <Button size="large" type="white">
                        Enable App
                      </Button>
                    </figcaption>
                  </Figure2>
                </Cards>
              </BannerWrapper>
            </Col>

           <Col xxl={6} xl={8} lg={8} sm={12} xs={24} className="appstr_crd">
              <BannerWrapper>
                <Cards
                  className="mb-70"
                  bodyStyle={{
                    background: "#FEDD50",
                    borderRadius: "10px",
                    Height: "240px",
                  }}
                  headless
                >
                  <Figure2>
                    <img
                      src="https://web.slickpos.com/assets/img/urbanpiper.jpeg"
                      alt=""
                      height="100px"
                      width="100px"
                    />
                    <figcaption>
                      <h2 style={{ color: "red" }}>UrbanPiper Hub</h2>
                      <p style={{ color: "red" }}>
                        Accept and manage Swiggy, Zomato and Dunzo orders inside
                        Poster.
                      </p>
                      <Button size="large" type="white">
                        Enable App
                      </Button>
                    </figcaption>
                  </Figure2>
                </Cards>
              </BannerWrapper>
            </Col>
            
           <Col xxl={6} xl={8} lg={8} sm={12} xs={24} className="appstr_crd">
              <BannerWrapper>
                <Cards
                  className="mb-70"
                  bodyStyle={{
                    background: "rgb(39, 43, 65)",
                    borderRadius: "10px",
                    Height: "200px",
                  }}
                  headless
                >
                  <Figure2>
                    <img
                      src={require(`../../static/img/app/feedback.png`)}
                      alt=""
                      height="100px"
                      width="100px"
                    />
                    <figcaption>
                      <h2>Feedback</h2>
                      <p>
                        Get actionable feedback from your customers and also
                        know their favourite.
                      </p>
                      <Button size="large" type="white">
                        Enable App
                      </Button>
                    </figcaption>
                  </Figure2>
                </Cards>
              </BannerWrapper>
            </Col>
           <Col xxl={6} xl={8} lg={8} sm={12} xs={24} className="appstr_crd">
              <BannerWrapper>
                <Cards
                  className="mb-70"
                  bodyStyle={{
                    background: "#7C0000",
                    borderRadius: "10px",
                    Height: "200px",
                  }}
                  headless
                >
                  <Figure2>
                    <img
                      src={require(`../../static/img/app/sms.png`)}
                      alt=""
                      height="100px"
                      width="100px"
                    />
                    <figcaption>
                      <h2>SMS Receipts</h2>
                      <p>
                        Acknowledge your customers with an SMS when they shop at
                        your store.
                      </p>
                      <Button size="large" type="white">
                        Enable App
                      </Button>
                    </figcaption>
                  </Figure2>
                </Cards>
              </BannerWrapper>
            </Col>
           <Col xxl={6} xl={8} lg={8} sm={12} xs={24} className="appstr_crd">
              <BannerWrapper>
                <Cards
                  className="mb-70"
                  bodyStyle={{
                    background: "#5F63F2",
                    borderRadius: "10px",
                    Height: "200px",
                  }}
                  headless
                >
                  <Figure2>
                    <img
                      src="https://web.slickpos.com/assets/img/bingage.png"
                      alt=""
                      height="100px"
                      width="100px"
                    />
                    <figcaption>
                      <h2>Bingage</h2>
                      <p>
                        Loyalty, coupons, referral and marketing campaigns.
                        <span style={{ display: "none" }}>
                          sdfsdfdsfsffsrwerwrrrwer
                        </span>
                      </p>

                      <Button size="large" type="white">
                        Enable App
                      </Button>
                    </figcaption>
                  </Figure2>
                </Cards>
              </BannerWrapper>
            </Col>
            {/*<Col xxl={6} xl={8} lg={8} sm={12} xs={24} className="appstr_crd">
              <BannerWrapper>
                <Cards className="mb-70" bodyStyle={{ background: 'rgb(39, 43, 65)', borderRadius: '10px', Height: '200px' }} headless>
                  <Figure2>
                    <img src="https://web.slickpos.com/assets/img/payu.png" alt="" height="100px" width="100px" />
                    <figcaption>
                      <h2>Bharat QR - PayU</h2>
                      <p>Integrate Bharat QR with Posease.Automatically reconcile payments and prevent fraud.</p>
                      <Button size="large" type="white">
                        Enable App
                      </Button>
                    </figcaption>
                  </Figure2>
                </Cards>
              </BannerWrapper>
            </Col> */}
            {/*<Col xxl={6} xl={8} lg={8} sm={12} xs={24} className="appstr_crd">
              <BannerWrapper>
                <Cards className="mb-70" bodyStyle={{ background: '#5F63F2', borderRadius: '10px', Height: '200px' }} headless>
                  <Figure2>
                    <img src="https://web.slickpos.com/assets/img/pine-labs.png" alt="" height="100px" width="100px" />
                    <figcaption>
                      <h2>Pine Labs</h2>
                      <p>Integrate EDC terminal with SlickPOS.Automatically reconcile payments and prevent fraud.</p>
                      <Button size="large" type="white">
                        Enable App
                      </Button>
                    </figcaption>
                  </Figure2>
                </Cards>
              </BannerWrapper>
            </Col> */}
           <Col xxl={6} xl={8} lg={8} sm={12} xs={24} className="appstr_crd">
              <BannerWrapper>
                <Cards
                  className="mb-70"
                  bodyStyle={{
                    background: "#7C0000",
                    borderRadius: "10px",
                    Height: "200px",
                  }}
                  headless
                >
                  <Figure2>
                    <img
                      src="https://web.slickpos.com/assets/img/more-apps.svg"
                      alt=""
                      height="80px"
                      width="80px"
                    />
                    <figcaption>
                      <h2>More Apps</h2>
                      <p>
                        Apps for integrated payments, accounting, etc are
                        launching shortly.
                      </p>
                      <Button size="large" type="white">
                        Comming Soon
                      </Button>
                    </figcaption>
                  </Figure2>
                </Cards>
              </BannerWrapper>
            </Col>
          </Row>
        </Cards>
      </Main>
    </>
  );
};

export default Application;
