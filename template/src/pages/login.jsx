import React, { useMemo, useCallback } from 'react'
import { Form, Input, Checkbox, Button } from 'antd'
import { dispatcher } from '@opcjs/zoro'
import { getAutoLogin } from '@/services/user'
import { useModel } from 'steer'
import logo from '@/assets/logo.png'

import styles from './login.less'

function Login() {
  const loading = useModel(({ loading }) => loading.effect['user/login'])

  const layout = useMemo(() => {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
    }
  }, [])

  const offsetLayout = useMemo(() => {
    return {
      wrapperCol: {
        offset: layout.labelCol.span,
        span: layout.wrapperCol.span,
      },
    }
  }, [layout.labelCol.span, layout.wrapperCol.span])

  const initValues = useMemo(() => {
    return {
      autoLogin: getAutoLogin(),
    }
  }, [])

  const handleLogin = useCallback((values) => {
    dispatcher.user.login(values)
  }, [])

  const loginFormEle = useMemo(() => {
    return (
      <Form initialValues={initValues} onFinish={handleLogin}>
        <Form.Item
          {...layout}
          label="帐 号"
          name="userName"
          rules={[{ required: true, message: '请输入帐号!' }]}
        >
          <Input size="large" autoComplete="userName" />
        </Form.Item>
        <Form.Item
          {...layout}
          label="密 码"
          name="password"
          rules={[{ required: true, message: '请输入密码!' }]}
        >
          <Input.Password autoComplete="password" size="large" />
        </Form.Item>
        <Form.Item {...offsetLayout} valuePropName="checked" name="autoLogin">
          <Checkbox>自动登录</Checkbox>
        </Form.Item>
        <Form.Item {...offsetLayout}>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={loading}
          >
            登 录
          </Button>
        </Form.Item>
      </Form>
    )
  }, [handleLogin, initValues, layout, loading, offsetLayout])

  return useMemo(() => {
    return (
      <div className={styles.login}>
        <div className={styles.form}>
          <div className={styles.brand}>
            <img
              className={styles.logo}
              src={logo}
              alt={process.env.REACT_APP_NAME}
            />
            <div className={styles.text}>{process.env.REACT_APP_NAME}</div>
          </div>
          {loginFormEle}
        </div>
      </div>
    )
  }, [loginFormEle])
}

export default Login
