import React from 'react'
import { Tag } from 'antd'
import Page from '@/components/page/page'
import Actions from '@/components/actions/actions'

export default function () {
  return (
    <Page>
      <Page.Header
        title="页面演示1"
        description="描述信息"
        avatar={{
          src: 'https://avatars1.githubusercontent.com/u/8186664?s=460&v=4',
        }}
        tags={<Tag color="blue">状态</Tag>}
        actions={
          <Actions>
            <Actions.Action>按钮1</Actions.Action>
            <Actions.Action>按钮2</Actions.Action>
            <Actions.Action>按钮3</Actions.Action>
          </Actions>
        }
        onBack={() => {}}
      >
        header
      </Page.Header>
      <Page.Sider>sider</Page.Sider>
      content
      <Page.Footer>footer</Page.Footer>
    </Page>
  )
}
