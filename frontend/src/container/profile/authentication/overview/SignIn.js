import React, { useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { Form, Input, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
// eslint-disable-next-line import/no-extraneous-dependencies
import { AuthWrapper } from "./style";
import { login } from "../../../../redux/authentication/actionCreator";
import Heading from "../../../../components/heading/heading";

const SignIn = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.login);
  const isLoading = useSelector((state) => state.auth.loading);
  const error = useSelector((state) => state.auth.error);
  const [form] = Form.useForm();
  const [state] = useState({});

  const handleSubmit = (formData) => {
    dispatch(login(formData, history));
  };

  return (
    <AuthWrapper>
      <p className="auth-notice blong_clr">
        Don&rsquo;t have an account?{" "}
        <NavLink to="/register">Sign up now</NavLink>
      </p>
      <div className="auth-contents">
        <Form
          name="login"
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          className="comman-input"
        >
          <Heading as="h3">
            Sign in to <span className="color-secondary">PosEase</span>
          </Heading>
          <Form.Item
            name="email"
            rules={[
              {
                message: "Please enter your email.",
                required: true,
              },
              {
                message: "Please enter valid email address.",
                type: "email",
              },
            ]}
            label="Email"
          >
            <Input placeholder="Email" style={{ marginBottom: 10 }} />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                message: "Please enter your password.",
                required: true,
              },
            ]}
          >
            <Input.Password
              placeholder="Password"
              style={{ marginBottom: 10 }}
            />
          </Form.Item>
          <div className="auth-form-action blong_clr">
            <NavLink className="forgot-pass-link" to="/forgotPassword">
              Forgot password?
            </NavLink>
          </div>
          <Form.Item>
            <Button
              className="btn-signin"
              htmlType="submit"
              type="primary"
              size="large"
            >
              {isLoading ? "Loading..." : "Sign In"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </AuthWrapper>
  );
};

export default SignIn;
