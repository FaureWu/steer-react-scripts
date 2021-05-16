import React, { useMemo, useCallback, useRef } from 'react'
import classNames from 'classnames'
import { isFunction, isObject } from '@/utils/tool'
import { Table as AntTable, Tooltip } from 'antd'
import { DndProvider, createDndContext } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { ExclamationCircleOutlined, MenuOutlined } from '@ant-design/icons'

import Header from './header'
import Column from './column'
import DragRow from './dragRow'

import styles from './table.less'

function loopChildren(children) {
  let x = 0
  React.Children.forEach(children, (child) => {
    if (child.type === AntTable.ColumnGroup) {
      x += loopChildren(child.props.children)
    } else if (child.type === Column) {
      x += child.props.width || 80
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
  draggable,
  actions,
  rowKey = 'key',
  onRow,
  dataSource = [],
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

  const resolveDraggable = useMemo(() => {
    const result = {
      enable: !!draggable,
      width: 86,
      title: '排序',
      tip: '你可以通过拖动行进行位置交换！',
    }

    if (!isObject(draggable)) return result

    result.width = draggable.width || result.width
    result.title = draggable.title || result.title
    result.tip = draggable.tip || result.tip
    result.shouldDropped = draggable.shouldDropped
    result.onDropped = draggable.onDropped

    return result
  }, [draggable])

  const handleRow = useCallback(
    (...rest) => {
      let result = {}
      if (isFunction(onRow)) result = onRow(...rest)

      if (resolveDraggable.enable) {
        result.rowKey = rowKey
        result.record = rest[0]
        result.shouldDropped = resolveDraggable.shouldDropped
        result.onDropped = resolveDraggable.onDropped
      }

      return result
    },
    [
      onRow,
      resolveDraggable.enable,
      resolveDraggable.onDropped,
      resolveDraggable.shouldDropped,
      rowKey,
    ],
  )

  const renderTitle = useCallback(() => {
    if (!title && !actions) return null

    return <Header title={title} actions={actions} />
  }, [actions, title])

  const renderDrag = useCallback(() => {
    return <MenuOutlined style={{ color: '#999' }} />
  }, [])

  const tableEle = useMemo(() => {
    return (
      <AntTable
        {...props}
        rowKey={rowKey}
        dataSource={dataSource}
        className={classNames(styles.table, className)}
        title={renderTitle}
        size={size}
        scroll={realScroll}
        components={
          resolveDraggable.enable && dataSource.length
            ? {
                body: {
                  row: DragRow,
                },
              }
            : undefined
        }
        onRow={handleRow}
      >
        {resolveDraggable.enable && (
          <Column
            title={
              <div className={styles.sort}>
                {resolveDraggable.title}
                <Tooltip placement="top" title={resolveDraggable.tip}>
                  <ExclamationCircleOutlined className={styles.tip} />
                </Tooltip>
              </div>
            }
            fixed="left"
            width={resolveDraggable.width}
            dataIndex="sort"
            render={renderDrag}
          ></Column>
        )}
        {children}
      </AntTable>
    )
  }, [
    children,
    className,
    dataSource,
    handleRow,
    props,
    realScroll,
    renderDrag,
    renderTitle,
    resolveDraggable.enable,
    resolveDraggable.tip,
    resolveDraggable.title,
    resolveDraggable.width,
    rowKey,
    size,
  ])

  const RNDContext = useMemo(() => {
    return createDndContext(HTML5Backend)
  }, [])

  const manager = useRef(RNDContext)

  return useMemo(() => {
    if (!resolveDraggable.enable) return tableEle

    return (
      <DndProvider manager={manager.current.dragDropManager}>
        {tableEle}
      </DndProvider>
    )
  }, [resolveDraggable.enable, tableEle])
}

Table.Column = Column
Table.ColumnGroup = AntTable.ColumnGroup

export default Table
