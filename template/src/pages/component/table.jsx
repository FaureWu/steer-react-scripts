import React from 'react'
import Page from '@/components/page/page'
import Table from '@/components/table/table'
import Actions from '@/components/actions/actions'

export default function () {
  function renderActions() {
    return (
      <Actions size="small">
        <Actions.Action>编辑</Actions.Action>
        <Actions.Action>详情</Actions.Action>
        <Actions.Action danger>删除</Actions.Action>
      </Actions>
    )
  }

  return (
    <Page>
      <Table
        rowKey="id"
        title="表格演示"
        actions={
          <Actions>
            <Actions.Action>编辑</Actions.Action>
            <Actions.Action>详情</Actions.Action>
            <Actions.Action danger>删除</Actions.Action>
          </Actions>
        }
        dataSource={[
          {
            id: '1',
            name: 'Faure',
            age: '16',
            gender: '男',
            birthday: new Date(),
            address: '家庭地址',
          },
        ]}
      >
        <Table.Column title="姓名" width={200} dataIndex="name" fixed="left" />
        <Table.Column title="年龄" dataIndex="age" />
        <Table.Column title="性别" dataIndex="gender" />
        <Table.Column title="生日" width={300} dataIndex="birthday" />
        <Table.Column
          title="家庭住址"
          width={300}
          dataIndex="address"
          ellipsis
        />
        <Table.Column
          title="操作"
          fixed="right"
          width={130}
          dataIndex="action"
          render={renderActions}
        />
      </Table>
    </Page>
  )
}
