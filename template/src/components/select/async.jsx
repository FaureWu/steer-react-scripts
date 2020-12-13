import React, {
  useMemo,
  useCallback,
  useState,
  useImperativeHandle,
  forwardRef,
} from 'react'
import classNames from 'classnames'
import { useDidMount } from 'beautiful-react-hooks'
import { isFunction } from '@/utils/tool'
import { Select } from 'antd'

import styles from './select.less'

function Async(
  {
    dropdownMatchSelectWidth = false,
    className,
    options,
    children,
    value,
    ...props
  },
  ref,
) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  const load = useCallback(() => {
    if (!isFunction(options)) return

    setLoading(true)
    options()
      .then((opts) => setData(opts))
      .finally(() => setLoading(false))
  }, [options])

  const handleFilter = useCallback((input = '', { label = '' }) => {
    return label.toLowerCase().indexOf(input.toLowerCase()) >= 0
  }, [])

  useDidMount(() => {
    load()
  })

  useImperativeHandle(ref, () => ({
    load,
  }))

  return useMemo(() => {
    return (
      <Select
        {...props}
        className={classNames(className, styles.select)}
        value={loading ? undefined : value}
        options={data}
        loading={loading}
        dropdownMatchSelectWidth={dropdownMatchSelectWidth}
        filterOption={handleFilter}
      />
    )
  }, [
    className,
    data,
    dropdownMatchSelectWidth,
    handleFilter,
    loading,
    props,
    value,
  ])
}

export default forwardRef(Async)
