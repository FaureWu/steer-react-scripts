import React, { useMemo } from 'react'
import { useModel } from 'steer'
import Table from '@/components/table/table'

export default function () {
  const { data } = useModel(({ detailDetail }) => detailDetail)
  const loading = useModel(({ loading }) => ({
    query: loading.effect['detailDetail/query'] || false,
  }))

  return useMemo(() => {
    return (
      <Table
        rowKey="id"
        loading={loading.query}
        dataSource={data.list}
        pagination={false}
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
      </Table>
    )
  }, [loading, data])
}
