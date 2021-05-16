import React, {
  useMemo,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react'
import classNames from 'classnames'
import { isUndefined, noop } from '@/utils/tool'
import { Select as AntSelect } from 'antd'

import Async from './async'
import Search from './search'

import styles from './select.less'

function Select(
  {
    dropdownMatchSelectWidth = false,
    className,
    options,
    onChange = noop,
    children,
    ...props
  },
  ref,
) {
  const getData = useCallback(() => {
    return options
  }, [options])

  const handleFilter = useCallback((input = '', option) => {
    const label = isUndefined(option.children) ? option.label : option.children

    return label.toLowerCase().indexOf(input.toLowerCase()) >= 0
  }, [])

  const handleChange = useCallback(
    (value, option) => {
      onChange(value, option, options)
    },
    [onChange, options],
  )

  useImperativeHandle(ref, () => ({
    getData,
  }))

  return useMemo(() => {
    return (
      <AntSelect
        {...props}
        options={options}
        className={classNames(className, styles.select)}
        dropdownMatchSelectWidth={dropdownMatchSelectWidth}
        filterOption={handleFilter}
        onChange={handleChange}
      >
        {children}
      </AntSelect>
    )
  }, [
    children,
    className,
    dropdownMatchSelectWidth,
    handleChange,
    handleFilter,
    options,
    props,
  ])
}

const FSelect = forwardRef(Select)

FSelect.Async = Async
FSelect.Search = Search

export default FSelect
