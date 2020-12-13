import React, { useMemo, useCallback, useState, useRef } from 'react'
import classNames from 'classnames'
import { Select } from 'antd'
import { isFunction, noop } from '@/utils/tool'
import { useDebouncedFn } from 'beautiful-react-hooks'

import styles from './select.less'

function Search(
  {
    dropdownMatchSelectWidth = false,
    className,
    onSearch,
    onChange = noop,
    onBlur = noop,
    children,
    ...props
  },
  ref,
) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const loadCount = useRef(0)

  const handleSearch = useDebouncedFn(
    (text) => {
      setData([])

      if (!isFunction(onSearch) || !text) return

      setLoading(true)
      loadCount.current += 1
      const count = loadCount.current
      onSearch(text)
        .then((opts) => {
          if (count !== loadCount.current) return
          setData(opts)
          console.log('set', count, loadCount.current)
          setLoading(false)
        })
        .catch(() => setLoading(false))
    },
    300,
    null,
    [onSearch, loadCount],
  )

  const handleChange = useCallback(
    (...rest) => {
      setData([])
      onChange(...rest)
    },
    [onChange],
  )

  const handleBlur = useCallback(
    (...rest) => {
      setData([])
      onBlur(...rest)
    },
    [onBlur],
  )

  return useMemo(() => {
    return (
      <Select
        {...props}
        className={classNames(className, styles.select)}
        dropdownMatchSelectWidth={dropdownMatchSelectWidth}
        filterOption={false}
        labelInValue
        notFoundContent={false}
        loading={loading}
        showSearch
        defaultActiveFirstOption={false}
        showArrow={loading}
        options={data}
        onSearch={handleSearch}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    )
  }, [
    className,
    data,
    dropdownMatchSelectWidth,
    handleChange,
    handleSearch,
    handleBlur,
    loading,
    props,
  ])
}

export default Search
