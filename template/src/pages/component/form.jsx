import React from 'react'
import { Input, InputNumber, Select, DatePicker } from 'antd'
import Page from '@/components/page/page'
import Form from '@/components/form/form'
import Actions from '@/components/actions/actions'

export default function () {
  return (
    <Page>
      <Form>
        <Form.Group
          title="表单演示"
          actions={
            <Actions>
              <Actions.Action>按钮</Actions.Action>
            </Actions>
          }
        >
          <Form.Item name="name" label="姓名" required>
            <Input />
          </Form.Item>
          <Form.Item name="age" label="年龄">
            <InputNumber precision={0} />
          </Form.Item>
          <Form.Item name="gender" label="性别">
            <Select />
          </Form.Item>
          <Form.Item name="birthday" label="生日">
            <DatePicker />
          </Form.Item>
          <Form.Item name="address" label="地址">
            <Input.TextArea autoSize={{ minRows: 4, maxRows: 6 }} />
          </Form.Item>
        </Form.Group>
      </Form>
    </Page>
  )
}
