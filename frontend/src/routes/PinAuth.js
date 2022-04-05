import React, { lazy, Suspense } from "react";
import { Spin } from "antd";
import { Switch, Route, Redirect } from "react-router-dom";
import AuthLayout from "../container/profile/authentication/Index";

const SignIn = lazy(() =>
  import("../container/profile/authentication/overview/SignIn")
);
const SignUp = lazy(() =>
  import("../container/profile/authentication/overview/Signup")
);
const ForgotPassword = lazy(() =>
  import("../container/profile/authentication/overview/ForgotPassword")
);

const ResetPassword = lazy(() =>
  import("../container/profile/authentication/overview/ResetPassword")
);

const PinAuth = lazy(() =>
  import("../container/profile/authentication/overview/PinAuth")
);

const NotFound = () => {
  return <Redirect to="/pin-auth" />;
};

const FrontendRoutes = () => {
  return (
    <Switch>
      <Suspense
        fallback={
          <div className="spin">
            <Spin />
          </div>
        }
      >
        <Route exact path="/resetPassword" component={ResetPassword} />
        <Route exact path="/forgotPassword" component={ForgotPassword} />
        <Route exact path="/register" component={SignUp} />
        <Route exact path="/login" component={SignIn} />
        <Route exact path="/pin-auth" component={PinAuth} />
        <Route exact path="*" component={NotFound} />
      </Suspense>
    </Switch>
  );
};

export default AuthLayout(FrontendRoutes);
