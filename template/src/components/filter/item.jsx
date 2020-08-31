import React, { useMemo } from 'react'
import { Form } from 'antd'

import styles from './item.less'

function Item({ children, name, valuePropName, required, rules, hidden }) {
  const validators = useMemo(() => {
    if (required) {
      return [
        {
          required: true,
          message: '请填写必填项',
        },
      ].concat(rules || [])
    }

    return rules
  }, [required, rules])

  return useMemo(() => {
    return (
      <Form.Item
        className={styles.item}
        name={name}
        valuePropName={valuePropName}
        rules={validators}
        hidden={hidden}
      >
        {children}
      </Form.Item>
    )
  }, [children, hidden, name, validators, valuePropName])
}

export default Item
