import React, { lazy, Suspense } from "react";
import { Row, Col, Skeleton } from "antd";
import { Switch, Route } from "react-router-dom";
import propTypes from "prop-types";
import { SettingWrapper } from "./overview/style";
import { Main } from "../../styled";
import { Cards } from "../../../components/cards/frame/cards-frame";

const UserBuilder = lazy(() => import("./overview/UserBuilder"));
const AddCashier = lazy(() => import("./overview/Userpage/AddCashier"));
const EditCashier = lazy(() => import("./overview/Userpage/EditCashier"));
const AddApp = lazy(() => import("./overview/Userpage/AddApp"));
const EditApp = lazy(() => import("./overview/Userpage/EditApp"));
const AddKitchen = lazy(() => import("./overview/Userpage/AddKitchen"));
const EditKitchen = lazy(() => import("./overview/Userpage/EditKitchen"));
const AddWaiter = lazy(() => import("./overview/Userpage/AddWaiter"));
const EditWaiter = lazy(() => import("./overview/Userpage/EditWaiter"));

const ShopBuilder = lazy(() => import("./overview/ShopBuilder"));
const PreferencesBuilder = lazy(() => import("./overview/PreferencesBuilder"));

const DiscountRuleBuilder = lazy(() =>
  import("./overview/DiscountRuleBuilder")
);
const AddDiscount = lazy(() =>
  import("./overview/Discountrulepage/AddDiscount")
);
const EditDiscount = lazy(() =>
  import("./overview/Discountrulepage/EditDiscount")
);

const AdditionalBuilder = lazy(() => import("./overview/AdditionalBuilder"));
const AddAdditional = lazy(() =>
  import("./overview/Additionalpage/AddAdditional")
);

const RegisterBuilder = lazy(() => import("./overview/RegisterBuilder"));
const AddRegister = lazy(() => import("./overview/Registerpage/AddRegister"));
const EditRegister = lazy(() => import("./overview/Registerpage/EditRegister"));

const CustomFieldBuilder = lazy(() => import("./overview/CustomFieldBuilder"));
const AddCustomField = lazy(() =>
  import("./overview/Customfield/AddCustomField")
);

const TaxBuilder = lazy(() => import("./overview/TaxBuilder"));
const AddTax = lazy(() => import("./overview/Taxpage/AddTax"));
const AddTaxGroup = lazy(() => import("./overview/Taxpage/AddTaxGroup"));
const Password = lazy(() => import("./overview/Passwoard"));
const SocialProfiles = lazy(() => import("./overview/SocialProfile"));
const Notification = lazy(() => import("./overview/Notification"));
const AuthorBox = lazy(() => import("./overview/ProfileAuthorBox"));

const Settings = ({ match }) => {
  const { path } = match;

  return (
    <>
      <Main className="padding-top-form">
        <Row gutter={25}>
          <Col xxl={4} lg={6} md={8} xs={24} className="settings-top">
            <Suspense
              fallback={
                <Cards headless>
                  <Skeleton avatar />
                </Cards>
              }
            >
              <AuthorBox />
            </Suspense>
          </Col>
          <Col xxl={20} lg={18} md={16} xs={24}>
            <SettingWrapper>
              <Switch>
                <Suspense
                  fallback={
                    <Cards headless>
                      <Skeleton paragraph={{ rows: 20 }} />
                    </Cards>
                  }
                >
                  <Route exact path={`${path}/users`} component={UserBuilder} />
                  <Route
                    exact
                    path={`${path}/preferences`}
                    component={PreferencesBuilder}
                  />
                  <Route
                    exact
                    path={`${path}/registers`}
                    component={RegisterBuilder}
                  />
                  <Route
                    exact
                    path={`${path}/registers/add`}
                    component={AddRegister}
                  />
                  <Route
                    exact
                    path={`${path}/registers/edit`}
                    component={EditRegister}
                  />
                  <Route
                    exact
                    path={`${path}/users/add/cashier`}
                    component={AddCashier}
                  />
                  <Route
                    exact
                    path={`${path}/users/cashiers/edit`}
                    component={EditCashier}
                  />
                  <Route
                    exact
                    path={`${path}/users/add/app-user`}
                    component={AddApp}
                  />
                  <Route
                    exact
                    path={`${path}/users/app-user/edit`}
                    component={EditApp}
                  />
                  <Route
                    exact
                    path={`${path}/users/add/waiter`}
                    component={AddWaiter}
                  />
                  <Route
                    exact
                    path={`${path}/users/waiter/edit`}
                    component={EditWaiter}
                  />
                  <Route
                    exact
                    path={`${path}/users/add/kitchen`}
                    component={AddKitchen}
                  />
                  <Route
                    exact
                    path={`${path}/users/kitchen/edit`}
                    component={EditKitchen}
                  />

                  <Route
                    exact
                    path={`${path}/discount-rules`}
                    component={DiscountRuleBuilder}
                  />
                  <Route
                    exact
                    path={`${path}/discount-rules/add`}
                    component={AddDiscount}
                  />
                  <Route
                    exact
                    path={`${path}/discount-rules/edit/:_id`}
                    component={EditDiscount}
                  />

                  <Route
                    exact
                    path={`${path}/additional-charges`}
                    component={AdditionalBuilder}
                  />
                  <Route
                    exact
                    path={`${path}/additional-charges/add`}
                    component={AddAdditional}
                  />

                  <Route
                    exact
                    path={`${path}/custom-fields/`}
                    component={CustomFieldBuilder}
                  />
                  <Route
                    exact
                    path={`${path}/custom-fields/add/:type`}
                    component={AddCustomField}
                  />
                  <Route exact path={`${path}/shop`} component={ShopBuilder} />
                  <Route exact path={`${path}/taxes`} component={TaxBuilder} />
                  <Route
                    exact
                    path={`${path}/taxes/add/:type`}
                    component={AddTax}
                  />

                  <Route
                    exact
                    path={`${path}/taxgroup/add/:type`}
                    component={AddTaxGroup}
                  />

                  <Route exact path={`${path}/password`} component={Password} />
                  <Route
                    exact
                    path={`${path}/social`}
                    component={SocialProfiles}
                  />
                  <Route
                    exact
                    path={`${path}/notification`}
                    component={Notification}
                  />
                </Suspense>
              </Switch>
            </SettingWrapper>
          </Col>
        </Row>
      </Main>
    </>
  );
};

Settings.propTypes = {
  match: propTypes.object,
};

export default Settings;
