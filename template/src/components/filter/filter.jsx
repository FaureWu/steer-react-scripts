import React, {
  useMemo,
  useState,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react'
import { Form, Button, Space } from 'antd'
import classNames from 'classnames'
import { noop, isArray, isEmpty } from '@/utils/tool'

import Item from './item'

import styles from './filter.less'

function Filter(
  {
    className,
    children,
    actions,
    initialValues,
    allowReset = true,
    onSearch,
    onReset = noop,
    onFieldChange = noop,
  },
  ref,
) {
  const [form] = Form.useForm()
  const [loaded, setLoaded] = useState(false)
  const [readyMap, setReadyMap] = useState({})

  const { triggerMap, waitMap } = useMemo(() => {
    const triggerMap = {}
    const waitMap = {}
    React.Children.forEach(children, (child) => {
      if (child.type !== Item || !child.props || !child.props.name) return

      if (child.props.trigger) triggerMap[child.props.name] = true
      if (child.props.wait) waitMap[child.props.name] = true
    })

    return { triggerMap, waitMap }
  }, [children])

  const setAndCheckReady = useCallback(
    (name) => {
      const newReadyMap = { ...readyMap, [name]: true }
      setReadyMap(newReadyMap)

      return Object.keys(waitMap).every((key) => newReadyMap[key])
    },
    [readyMap, waitMap],
  )

  const handleSearch = useCallback(() => {
    form.submit()
  }, [form])

  const handleReset = useCallback(() => {
    form.resetFields()
    onReset(form.getFieldsValue())
    form.submit()
  }, [form, onReset])

  const handleFieldChange = useCallback(
    (fields) => {
      if (!fields || !isArray(fields) || fields.length <= 0) return

      const field = fields[0]
      const name = field.name[0]
      onFieldChange(name, field.value)

      if (isEmpty(waitMap) || loaded) {
        if (triggerMap[name]) form.submit()
        return
      }

      if (!setAndCheckReady(name)) return

      setLoaded(true)
      form.submit()
    },
    [onFieldChange, waitMap, loaded, setAndCheckReady, form, triggerMap],
  )

  useImperativeHandle(ref, () => ({
    search() {
      handleSearch()
    },
    reset() {
      handleReset()
    },
    setFieldsValue: form.setFieldsValue,
    getFieldsValue: form.getFieldsValue,
  }))

  return useMemo(() => {
    return (
      <div className={classNames(className, styles.filter)}>
        <Form
          className={styles.form}
          form={form}
          initialValues={initialValues}
          layout="inline"
          onFinish={onSearch}
          onFieldsChange={handleFieldChange}
        >
          {React.Children.map(children, (child) => {
            if (child.type === Item) return child
            return null
          })}
        </Form>
        <Space className={styles.actions}>
          {allowReset && (
            <Button type="text" onClick={handleReset} size="small">
              重置
            </Button>
          )}
          <Button type="primary" onClick={handleSearch}>
            搜索
          </Button>
          {actions}
        </Space>
      </div>
    )
  }, [
    className,
    form,
    initialValues,
    onSearch,
    handleFieldChange,
    children,
    allowReset,
    handleReset,
    handleSearch,
    actions,
  ])
}

export { Item }

const FFilter = forwardRef(Filter)
FFilter.Item = Item

export default FFilter
