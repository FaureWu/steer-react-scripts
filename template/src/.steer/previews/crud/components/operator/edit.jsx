import React, { useMemo, useCallback, useRef } from 'react'
import { useModel } from 'steer'
import { dispatcher } from '@opcjs/zoro'
import dayjs from 'dayjs'
import { Input, InputNumber, Select, DatePicker } from 'antd'
import Modal from '@/components/modal/modal'
import Form from '@/components/form/form'

export default function () {
  const form = useRef(null)
  const { edit, activeRow } = useModel(({ crudOperator }) => crudOperator)
  const loading = useModel(({ loading }) => ({
    edit: loading.effect['crudOperator/edit'] || false,
    editSubmit: loading.effect['crudOperator/editSubmit'] || false,
  }))

  const genderOptions = useMemo(
    () => [
      { label: '男', value: 'man' },
      { label: '女', value: 'women' },
    ],
    [],
  )

  const initialValues = useMemo(() => {
    return {
      ...activeRow,
      birthday: dayjs(activeRow.birthday),
    }
  }, [activeRow])

  const handleCancel = useCallback(() => {
    edit.current.hide()
  }, [edit])

  const handleOk = useCallback(() => {
    form.current.submit()
  }, [form])

  const handleSubmit = useCallback((values) => {
    dispatcher.crudOperator.editSubmit(values)
  }, [])

  return useMemo(() => {
    return (
      <Modal
        ref={edit}
        title="编辑"
        confirmLoading={loading.editSubmit}
        onCancel={handleCancel}
        onOk={handleOk}
      >
        <Form
          ref={form}
          loading={loading.edit}
          preserve
          showSubmitButton={false}
          initialValues={initialValues}
          onSubmit={handleSubmit}
        >
          <Form.Item name="name" label="姓名" required>
            <Input />
          </Form.Item>
          <Form.Item name="age" label="年龄">
            <InputNumber precision={0} />
          </Form.Item>
          <Form.Item name="gender" label="性别">
            <Select options={genderOptions} />
          </Form.Item>
          <Form.Item name="birthday" label="生日">
            <DatePicker />
          </Form.Item>
          <Form.Item name="address" label="地址">
            <Input.TextArea autoSize={{ minRows: 4, maxRows: 6 }} />
          </Form.Item>
        </Form>
      </Modal>
    )
  }, [
    genderOptions,
    activeRow,
    handleCancel,
    handleOk,
    handleSubmit,
    edit,
    form,
    loading,
  ])
}
