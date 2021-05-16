import React, {
  useMemo,
  useCallback,
  useState,
  useImperativeHandle,
  forwardRef,
} from 'react'
import classNames from 'classnames'
import { useDidMount } from 'beautiful-react-hooks'
import { isFunction, noop } from '@/utils/tool'
import { Select } from 'antd'

import styles from './select.less'

function Async(
  {
    dropdownMatchSelectWidth = false,
    className,
    options,
    children,
    value,
    defaultSelectFirst,
    labelInValue,
    onChange = noop,
    ...props
  },
  ref,
) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  const load = useCallback(
    (init) => {
      if (!isFunction(options)) return

      setLoading(true)
      options()
        .then((opts) => {
          setData(opts)

          if (init && defaultSelectFirst && opts.length) {
            const selectOption = opts[0]
            if (labelInValue) {
              const { value, label } = selectOption
              onChange({ value, label, key: value }, selectOption, opts)
            } else onChange(selectOption.value, selectOption, opts)
          }
        })
        .finally(() => setLoading(false))
    },
    [defaultSelectFirst, labelInValue, onChange, options],
  )

  const getData = useCallback(() => {
    return data
  }, [data])

  const handleFilter = useCallback((input = '', { label = '' }) => {
    return label.toLowerCase().indexOf(input.toLowerCase()) >= 0
  }, [])

  const handleChange = useCallback(
    (value, option) => {
      onChange(value, option, data)
    },
    [onChange, data],
  )

  useDidMount(() => {
    load(true)
  })

  useImperativeHandle(ref, () => ({
    load,
    getData,
  }))

  return useMemo(() => {
    return (
      <Select
        {...props}
        className={classNames(className, styles.select)}
        value={loading ? undefined : value}
        options={data}
        loading={loading}
        labelInValue={labelInValue}
        onChange={handleChange}
        dropdownMatchSelectWidth={dropdownMatchSelectWidth}
        filterOption={handleFilter}
      />
    )
  }, [
    className,
    data,
    dropdownMatchSelectWidth,
    handleChange,
    handleFilter,
    labelInValue,
    loading,
    props,
    value,
  ])
}

export default forwardRef(Async)
