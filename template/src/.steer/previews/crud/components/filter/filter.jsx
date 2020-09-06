import React, { useMemo, useCallback } from 'react'
import { Input, DatePicker, Select } from 'antd'
import { useModel } from 'steer'
import { dispatcher } from '@opcjs/zoro'
import Filter from '@/components/filter/filter'
import Actions from '@/components/actions/actions'

export default function () {
  const { filter } = useModel(({ crudTable }) => crudTable)

  const initialValues = useMemo(
    () => ({
      gender: 'man',
    }),
    [],
  )

  const genderOptions = useMemo(
    () => [
      { label: '男', value: 'man' },
      { label: '女', value: 'women' },
    ],
    [],
  )

  const handleSearch = useCallback(() => {
    dispatcher.crudTable.search()
  }, [])

  const handleCreate = useCallback(() => {
    dispatcher.crudOperator.create()
  }, [])

  return useMemo(() => {
    return (
      <Filter
        ref={filter}
        initialValues={initialValues}
        onSearch={handleSearch}
        actions={
          <Actions>
            <Actions.Action onClick={handleCreate}>创建</Actions.Action>
            <Actions.Action>按钮</Actions.Action>
          </Actions>
        }
      >
        <Filter.Item name="name">
          <Input placeholder="名称" />
        </Filter.Item>
        <Filter.Item name="birthday">
          <DatePicker.RangePicker />
        </Filter.Item>
        <Filter.Item name="gender" trigger>
          <Select dropdownMatchSelectWidth={false} options={genderOptions} />
        </Filter.Item>
      </Filter>
    )
  }, [filter, initialValues, handleSearch, genderOptions, handleCreate])
}
