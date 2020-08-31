import React, { useMemo, forwardRef, useImperativeHandle, useRef } from 'react'
import { Input } from 'antd'
import Form from '@/components/form/form'

import styles from './result.less'

function Result({ onSubmit }, ref) {
  const form = useRef(null)

  useImperativeHandle(ref, () => form.current)

  const pathRules = useMemo(() => {
    return [
      {
        validator(rule, value) {
          if (!/^[a-zA-Z-z/]+$/.test(value))
            return Promise.reject('只能输入`字母` `/`两种符号！')

          if (value.split('/').filter((item) => item).length <= 0)
            return Promise.reject('无效的路径格式！')

          return Promise.resolve()
        },
      },
    ]
  }, [])

  return useMemo(() => {
    return (
      <div className={styles.result}>
        <Form
          ref={form}
          style={{ width: '300px' }}
          showSubmitButton={false}
          layout="vertical"
          onSubmit={onSubmit}
        >
          <Form.Item
            required
            name="path"
            wrapperCol={{ span: 24 }}
            rules={pathRules}
          >
            <Input prefix="pages/" placeholder="请输入页面路径" />
          </Form.Item>
        </Form>
      </div>
    )
  }, [onSubmit, pathRules])
}

export default forwardRef(Result)
