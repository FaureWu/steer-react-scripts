import React, { useMemo, useCallback } from 'react'
import { Table as AntTable } from 'antd'

import Column from './column'

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

function Table({ columns, scroll, size = 'middle', children, ...props }) {
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

  return useMemo(() => {
    return (
      <AntTable {...props} size={size} scroll={realScroll}>
        {children}
      </AntTable>
    )
  }, [children, props, realScroll, size])
}

Table.Column = Column
Table.ColumnGroup = AntTable.ColumnGroup

export default Table
