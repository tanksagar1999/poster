import React, { useState, useEffect, useCallback } from 'react';
import { Link, NavLink, useHistory, withRouter } from 'react-router-dom';
import { Form, Input, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import { FacebookOutlined, TwitterOutlined } from '@ant-design/icons';
import { AuthWrapper } from './style';
import { login } from '../../../../redux/authentication/actionCreator';
import {
  fbAuthLogin,
  fbAuthLoginWithGoogle,
  fbAuthLoginWithFacebook,
} from '../../../../redux/firebase/auth/actionCreator';
import { Checkbox } from '../../../../components/checkbox/checkbox';
import Heading from '../../../../components/heading/heading';


const SignIn = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { isLoading, error, isFbAuthenticate } = useSelector(state => {
    return {
      error: state.firebaseAuth.error,
      isLoading: state.firebaseAuth.loading
    };
  });
  const [form] = Form.useForm();
  const [state, setState] = useState({
    checked: null,
  });

  const handleFbLogin = useCallback(() => {
    dispatch(login());
    history.push('admin/dashboard');
  }, [dispatch, history]);

  useEffect(() => {
    if (isFbAuthenticate) {
      handleFbLogin();
    }
  }, [isFbAuthenticate, handleFbLogin]);

  const handleSubmit = values => {
    dispatch(login());
  };

  const onChange = checked => {
    setState({ ...state, checked });
  };

  return (
    <AuthWrapper>
      <p className="auth-notice">
        Don&rsquo;t have an account? <NavLink to="/register">Sign up now</NavLink>
      </p>
      <div className="auth-contents">
        <Form name="login" form={form} onFinish={handleSubmit} layout="vertical">
          <Heading as="h3">
            Sign in to <span className="color-secondary">Poster</span>
          </Heading>
          <Form.Item
            name="email"
            value="jemi.devstree@gmail.com"
            rules={[{ message: 'Please input your Email!', required: true }]}
            label="Email Address"
          >
            <Input />
          </Form.Item>
          <Form.Item
            rules={[{ message: 'Please input your password!', required: true }]}
            name="password"
            value="12345678"
            label="Password"
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <div className="auth-form-action" style={{ float: 'right' }}>
            <NavLink className="forgot-pass-link" to="/forgotPassword" >
              Forgot password?
            </NavLink>
          </div>
          {error ? <p>{error.message}</p> : null}
          <Form.Item style={{ marginTop: '10px' }}>
            <Button className="btn-signin" htmlType="submit" type="primary" size="large">
              {isLoading ? 'Loading...' : 'Sign In'}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </AuthWrapper>
  );
};

export default withRouter(SignIn);
