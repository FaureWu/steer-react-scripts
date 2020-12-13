import React, { useMemo, useCallback } from 'react'
import classNames from 'classnames'
import { isUndefined } from '@/utils/tool'
import { Select as AntSelect } from 'antd'

import Async from './async'
import Search from './search'

import styles from './select.less'

function Select({
  dropdownMatchSelectWidth = false,
  className,
  children,
  ...props
}) {
  const handleFilter = useCallback((input = '', option) => {
    const label = isUndefined(option.children) ? option.label : option.children

    return label.toLowerCase().indexOf(input.toLowerCase()) >= 0
  }, [])

  return useMemo(() => {
    return (
      <AntSelect
        {...props}
        className={classNames(className, styles.select)}
        dropdownMatchSelectWidth={dropdownMatchSelectWidth}
        filterOption={handleFilter}
      >
        {children}
      </AntSelect>
    )
  }, [children, className, dropdownMatchSelectWidth, handleFilter, props])
}

Select.Async = Async
Select.Search = Search

export default Select
