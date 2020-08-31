import React, { useMemo } from 'react'
import { Form } from 'antd'
import { isArray } from '@/utils/tool'

function Item({ required, rules, children, ...props }) {
  const realRules = useMemo(() => {
    const validateRules = []
    if (required) {
      validateRules.push({ required: true, message: '请填写必填项' })
    }

    if (isArray(rules)) return validateRules.concat(rules)

    return validateRules
  }, [required, rules])

  return useMemo(() => {
    return (
      <Form.Item {...props} validateFirst rules={realRules}>
        {children}
      </Form.Item>
    )
  }, [children, props, realRules])
}

export default Item
