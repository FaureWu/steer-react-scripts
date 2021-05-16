import React, {
  useMemo,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react'
import { Form as AntForm, Button, Skeleton, Spin } from 'antd'
import { noop, isArray, createUniqueId } from '@/utils/tool'
import { useOnce } from '@/utils/hook'

import Group from './group'
import Item from './item'

function Form(
  {
    labelSpan = 6,
    wrapperSpan = 14,
    preserve = true,
    showSubmitButton = true,
    onFieldChange = noop,
    skeletonRows = 5,
    onSubmit,
    loading = false,
    layout,
    children,
    ...props
  },
  ref,
) {
  const [form] = AntForm.useForm()
  const [skeleton] = useOnce(loading)

  const name = useMemo(() => {
    return createUniqueId()
  }, [])

  const handleFieldChange = useCallback(
    (fields) => {
      if (!fields || !isArray(fields) || fields.length <= 0) return

      const field = fields[0]
      const name = field.name[0]
      onFieldChange(name, field.value)
    },
    [onFieldChange],
  )

  useImperativeHandle(ref, () => form)

  return useMemo(() => {
    return (
      <Skeleton
        loading={skeleton}
        active
        paragraph={{ rows: skeletonRows, width: '100%' }}
      >
        <Spin spinning={loading}>
          <AntForm
            {...props}
            labelCol={{ span: labelSpan }}
            wrapperCol={{ span: wrapperSpan }}
            layout={layout === 'inline' ? undefined : layout}
            form={form}
            name={name}
            preserve={preserve}
            onFieldsChange={handleFieldChange}
            onFinish={onSubmit}
          >
            {children}
            {showSubmitButton && (
              <AntForm.Item
                wrapperCol={{ span: wrapperSpan, offset: labelSpan }}
              >
                <Button type="primary" htmlType="submit">
                  提交
                </Button>
              </AntForm.Item>
            )}
          </AntForm>
        </Spin>
      </Skeleton>
    )
  }, [
    children,
    form,
    handleFieldChange,
    labelSpan,
    layout,
    loading,
    name,
    onSubmit,
    preserve,
    props,
    showSubmitButton,
    skeleton,
    skeletonRows,
    wrapperSpan,
  ])
}

const FForm = forwardRef(Form)
FForm.Group = Group
FForm.Item = Item

export default FForm
