import React, { useRef, useMemo } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import classNames from 'classnames'
import { isFunction } from '@/utils/tool'

import styles from './dragRow.less'

function DragRow({
  rowKey,
  shouldDropped,
  record,
  onDropped,
  className,
  style,
  ...props
}) {
  const type = 'DragRow'
  const ref = useRef()
  const [, drag] = useDrag({
    item: { type, record },
    collect(monitor) {
      return { isDragging: monitor.isDragging() }
    },
  })
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect(monitor) {
      const item = monitor.getItem()

      if (
        item &&
        ((isFunction(shouldDropped) && !shouldDropped(item.record, record)) ||
          (item.record && item.record[rowKey] === record[rowKey]))
      )
        return {}

      return {
        isOver: monitor.isOver(),
        dropClassName: styles.dragging,
      }
    },
    drop(item) {
      if (!shouldDropped(item.record, record)) return

      onDropped(item.record, record)
    },
  })

  drop(drag(ref))

  return useMemo(() => {
    return (
      <tr
        ref={ref}
        className={classNames(className, { [dropClassName]: isOver })}
        style={{ cursor: 'move', ...style }}
        {...props}
      />
    )
  }, [className, dropClassName, isOver, props, style])
}

export default DragRow
