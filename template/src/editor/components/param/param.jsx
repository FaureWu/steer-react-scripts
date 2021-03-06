import React, {
  useMemo,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react'
import { Checkbox, Radio, Input, Select } from 'antd'
import Form from '@/components/form/form'
import { isString, isObject, isArray } from '@/utils/tool'

import styles from './param.less'

function Param({ config, onSubmit }, ref) {
  const form = useRef(null)
  const [params, setParams] = useState(null)

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

  const currentParams = useMemo(() => {
    if (params) return params

    return initialValues
  }, [initialValues, params])

  const isShow = useCallback(
    (item) => {
      if (!isArray(item.dependencies) || item.dependencies.length <= 0)
        return true

      return item.dependencies.every((dependency) => {
        if (!isString(dependency) || !dependency) return true

        const paths = dependency.split('.')

        let values = currentParams

        return paths.every((path) => {
          if (isObject(values) && values[path]) {
            values = values[path]
            return true
          }

          if (isArray(values) && values.indexOf(path) !== -1) {
            values = values[path]
            return true
          }

          return false
        })
      })
    },
    [currentParams],
  )

  const handleChange = useCallback((_, values) => {
    setParams(values)
  }, [])

  const renderItems = useCallback(
    (items, values = {}, paths = []) => {
      return items.map((item) => {
        if (!isShow(item)) return null

        if (item.type === 'group') {
          return (
            <Form.Group key={item.name} title={item.label}>
              {renderItems(item.items, undefined, [item.name])}
            </Form.Group>
          )
        }

        if (item.type === 'checkbox') {
          return (
            <Form.Item
              key={item.name}
              name={paths.concat(item.name)}
              labelAlign={item.label ? 'left' : undefined}
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
              labelAlign={item.label ? 'left' : undefined}
              label={item.label}
            >
              <Checkbox.Group options={item.options} />
            </Form.Item>
          )
        }

        if (item.type === 'radio') {
          return (
            <Form.Item
              key={item.name}
              name={paths.concat(item.name)}
              labelAlign={item.label ? 'left' : undefined}
              label={item.label}
            >
              <Radio.Group options={item.options} />
            </Form.Item>
          )
        }

        if (item.type === 'input') {
          return (
            <Form.Item
              key={item.name}
              name={paths.concat(item.name)}
              labelAlign={item.label ? 'left' : undefined}
              label={item.label}
            >
              <Input />
            </Form.Item>
          )
        }

        if (item.type === 'select') {
          return (
            <Form.Item
              key={item.name}
              name={paths.concat(item.name)}
              labelAlign={item.label ? 'left' : undefined}
              label={item.label}
            >
              <Select options={item.options} />
            </Form.Item>
          )
        }

        if (item.type === 'multiSelect') {
          return (
            <Form.Item
              key={item.name}
              name={paths.concat(item.name)}
              labelAlign={item.label ? 'left' : undefined}
              label={item.label}
            >
              <Select mode="multiple" options={item.options} />
            </Form.Item>
          )
        }

        return null
      })
    },
    [isShow],
  )

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
          onSubmit={onSubmit}
          onValuesChange={handleChange}
        >
          {renderItems(items, currentParams)}
        </Form>
      </div>
    )
  }, [currentParams, handleChange, initialValues, items, onSubmit, renderItems])
}

export default forwardRef(Param)
