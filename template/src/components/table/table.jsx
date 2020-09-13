import React, { useMemo, useCallback } from 'react'
import classNames from 'classnames'
import { Table as AntTable } from 'antd'

import Header from './header'
import Column from './column'

import styles from './table.less'

function loopChildren(children) {
  let x = 0
  React.Children.forEach(children, (child) => {
    if (child.type === AntTable.ColumnGroup) {
      x += loopChildren(child.props.children)
    } else if (child.type === Column) {
      x += child.props.width || 100
    }
  })

  return x
}

function Table({
  columns,
  scroll,
  size = 'middle',
  className,
  title,
  actions,
  children,
  ...props
}) {
  const calcX = useCallback(() => {
    return loopChildren(children)
  }, [children])

  const realScroll = useMemo(() => {
    const data = { ...scroll }
    if (!data.x) {
      data.x = calcX()
    }
    return data
  }, [calcX, scroll])

  const renderTitle = useCallback(() => {
    if (!title && !actions) return null

    return <Header title={title} actions={actions} />
  }, [actions, title])

  return useMemo(() => {
    return (
      <AntTable
        {...props}
        className={classNames(styles.table, className)}
        title={renderTitle}
        size={size}
        scroll={realScroll}
      >
        {children}
      </AntTable>
    )
  }, [props, className, renderTitle, size, realScroll, children])
}

Table.Column = Column
Table.ColumnGroup = AntTable.ColumnGroup

export default Table
