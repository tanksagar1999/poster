import React, { useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { Form, Input, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AuthWrapper } from "./style";
import Heading from "../../../../components/heading/heading";
import { register } from "../../../../redux/authentication/actionCreator";
import { Checkbox } from "../../../../components/checkbox/checkbox";

const SignUp = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [state, setState] = useState({
    checked: null,
  });

  const handleSubmit = async (formData) => {
    const getResponseUserRegistered = await dispatch(register(formData));
    if (
      getResponseUserRegistered &&
      getResponseUserRegistered.data &&
      !getResponseUserRegistered.data.error
    ) {
      history.push("/login");
    }
  };

  const onChange = (checked) => {
    setState({ ...state, checked });
  };

  return (
    <AuthWrapper>
      <p className="auth-notice">
        Already have an account? <NavLink to="/login">Sign In</NavLink>
      </p>
      <div className="auth-contents">
        <Form name="register" onFinish={handleSubmit} layout="vertical">
          <Heading as="h3">
            Sign Up to <span className="color-secondary">PosEase</span>
          </Heading>
          <Form.Item
            label="Organization Name"
            name="shop_name"
            rules={[
              {
                required: true,
                message: "Please enter your organization name",
              },
            ]}
          >
            <Input
              placeholder="Organization name"
              style={{ marginBottom: 10 }}
            />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              {
                required: true,
                message: "Please enter your email",
                type: "email",
              },
            ]}
          >
            <Input placeholder="Email" style={{ marginBottom: 10 }} />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password
              placeholder="Password"
              style={{ marginBottom: 10 }}
            />
          </Form.Item>
          <Form.Item
            name="number"
            label="Mobile No"
            rules={[
              {
                required: true,
                message: "Please enter your mobile number",
              },
            ]}
          >
            <Input placeholder="Mobile Number" style={{ marginBottom: 10 }} />
          </Form.Item>
          <Form.Item
            name="checkbox"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error(
                          "You must agree to Terms & Conditions and Privacy Policy"
                        )
                      ),
              },
            ]}
          >
            <div className="auth-form-action">
              <Checkbox onChange={onChange}>
                Creating an account means you’re okay with our Terms of Service
                and Privacy Policy
              </Checkbox>
            </div>
          </Form.Item>
          <Form.Item>
            <Button
              className="btn-create"
              htmlType="submit"
              type="primary"
              size="large"
            >
              Create Account
            </Button>
          </Form.Item>
        </Form>
      </div>
    </AuthWrapper>
  );
};

export default SignUp;
