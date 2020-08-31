import React, {
  useMemo,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react'
import { Checkbox } from 'antd'
import Form from '@/components/form/form'

import styles from './param.less'

function Param({ config, onSubmit }, ref) {
  const form = useRef(null)

  const formatGroup = useCallback((group) => {
    const { initialValues, items } = Object.keys(group.config).reduce(
      (_, key) => {
        const item = group.config[key]

        _.initialValues[key] = item.defaultValue
        _.items.push({ name: key, ...item })

        return _
      },
      { initialValues: {}, items: [] },
    )

    return { defaultValue: initialValues, items }
  }, [])

  const { initialValues, items } = useMemo(() => {
    return Object.keys(config).reduce(
      (_, key) => {
        const item = config[key]

        if (item.type === 'group') {
          const { defaultValue, items } = formatGroup(item)

          _.initialValues[key] = defaultValue
          _.items.push({
            name: key,
            ...item,
            items,
          })

          return _
        }

        _.initialValues[key] = item.defaultValue
        _.items.push({ name: key, ...item })

        return _
      },
      {
        initialValues: {},
        items: [],
      },
    )
  }, [config, formatGroup])

  const renderItems = useCallback((items, paths = []) => {
    return items.map((item) => {
      if (item.type === 'group') {
        return (
          <Form.Group key={item.name} title={item.label}>
            {renderItems(item.items, [item.name])}
          </Form.Group>
        )
      }

      if (item.type === 'checkbox') {
        return (
          <Form.Item
            key={item.name}
            name={paths.concat(item.name)}
            valuePropName="checked"
          >
            <Checkbox>{item.label}</Checkbox>
          </Form.Item>
        )
      }

      if (item.type === 'checkboxGroup') {
        return (
          <Form.Item
            key={item.name}
            name={paths.concat(item.name)}
            label={item.label}
          >
            <Checkbox.Group options={item.options} />
          </Form.Item>
        )
      }

      return null
    })
  }, [])

  useImperativeHandle(ref, () => form.current)

  return useMemo(() => {
    return (
      <div className={styles.param}>
        <Form
          ref={form}
          style={{ width: '500px' }}
          showSubmitButton={false}
          initialValues={initialValues}
          loading={!initialValues}
          layout="vertical"
          onSubmit={onSubmit}
        >
          {renderItems(items)}
        </Form>
      </div>
    )
  }, [initialValues, items, onSubmit, renderItems])
}

export default forwardRef(Param)
