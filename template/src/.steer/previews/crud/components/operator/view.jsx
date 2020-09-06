import React, { useMemo, useCallback } from 'react'
import dayjs from 'dayjs'
import { useModel } from 'steer'
import Modal from '@/components/modal/modal'
import View from '@/components/view/view'

export default function () {
  const { view, activeRow } = useModel(({ crudOperator }) => crudOperator)
  const loading = useModel(({ loading }) => ({
    view: loading.effect['crudOperator/view'] || false,
  }))

  const handleCancel = useCallback(() => {
    view.current.hide()
  }, [view])

  return useMemo(() => {
    return (
      <Modal
        ref={view}
        title="详情"
        footer={null}
        confirmLoading={loading.editSubmit}
        onCancel={handleCancel}
      >
        <View loading={loading.view}>
          <View.Item label="姓名">{activeRow.name}</View.Item>
          <View.Item label="年龄">{activeRow.age}</View.Item>
          <View.Item label="性别">{activeRow.gender}</View.Item>
          <View.Item label="生日" span={3}>
            {dayjs(activeRow.birthday).format('YYYY-MM-DD')}
          </View.Item>
          <View.Item label="地址" span={3}>
            {activeRow.address}
          </View.Item>
        </View>
      </Modal>
    )
  }, [loading, view, handleCancel, activeRow])
}
