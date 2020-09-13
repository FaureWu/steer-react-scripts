import React, { useMemo, useCallback } from 'react'
import { useModel } from 'steer'
import { useDidMount, useWillUnmount } from 'beautiful-react-hooks'
import { dispatcher } from '@opcjs/zoro'
import Table from '@/components/table/table'
import Actions from '@/components/actions/actions'

export default function () {
  const { dataSource, pagination } = useModel(({ crudTable }) => crudTable)
  const loading = useModel(({ loading }) => ({
    query: loading.effect['crudTable/query'] || false,
  }))

  const handleEdit = useCallback(() => {
    dispatcher.crudOperator.edit()
  }, [])

  const handleView = useCallback(() => {
    dispatcher.crudOperator.view()
  }, [])

  const handleDelete = useCallback(() => {
    dispatcher.crudOperator.delete()
  }, [])

  const handleRow = useCallback((record) => {
    return {
      onClick: () => dispatcher.crudOperator.setActiveRow(record),
    }
  }, [])

  const handleChange = useCallback((pagination) => {
    dispatcher.crudTable.change({ pagination })
  }, [])

  useDidMount(() => {
    dispatcher.crudTable.query()
  })

  useWillUnmount(() => {
    dispatcher.crudTable.clear()
  })

  const renderActions = useCallback(
    () => (
      <Actions size="small">
        <Actions.Action onClick={handleEdit}>编辑</Actions.Action>
        <Actions.Action onClick={handleView}>详情</Actions.Action>
        <Actions.Action danger onClick={handleDelete}>
          删除
        </Actions.Action>
      </Actions>
    ),
    [handleEdit, handleView, handleDelete],
  )

  return useMemo(() => {
    return (
      <Table
        rowKey="id"
        loading={loading.query}
        dataSource={dataSource}
        onRow={handleRow}
        pagination={pagination}
        onChange={handleChange}
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
    )
  }, [loading, dataSource, renderActions, handleRow, handleChange, pagination])
}
