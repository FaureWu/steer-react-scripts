import React, {
  useMemo,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react'
import classNames from 'classnames'
import { TreeSelect as AntTreeSelect } from 'antd'

import Async from './async'

import styles from './treeSelect.less'

function TreeSelect(
  { dropdownMatchSelectWidth = false, className, children, treeData, ...props },
  ref,
) {
  const getData = useCallback(() => {
    return treeData
  }, [treeData])

  const handleFilter = useCallback((input = '', treeNode) => {
    const title = treeNode.title || ''

    return title.toLowerCase().indexOf(input.toLowerCase()) >= 0
  }, [])

  useImperativeHandle(ref, () => ({
    getData,
  }))

  return useMemo(() => {
    return (
      <AntTreeSelect
        {...props}
        treeData={treeData}
        className={classNames(className, styles.tree)}
        dropdownMatchSelectWidth={dropdownMatchSelectWidth}
        filterTreeNode={handleFilter}
      >
        {children}
      </AntTreeSelect>
    )
  }, [
    children,
    className,
    dropdownMatchSelectWidth,
    handleFilter,
    props,
    treeData,
  ])
}

const FTreeSelect = forwardRef(TreeSelect)

FTreeSelect.Async = Async

export default FTreeSelect
