import React, {
  useMemo,
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react'
import { Modal as AntModal } from 'antd'
import classNames from 'classnames'

import styles from './modal.less'

function Modal(
  {
    destroyOnClose = true,
    forceRender = true,
    centered = true,
    closable,
    visible,
    title,
    actions,
    children,
    ...props
  },
  ref,
) {
  const [show, setShow] = useState()

  const titleEle = useMemo(() => {
    if (!title && !actions) return null

    return (
      <div className={styles.header}>
        <span>{title}</span>
        {actions}
      </div>
    )
  }, [actions, title])

  useEffect(() => {
    setShow(visible)
  }, [visible])
  useImperativeHandle(ref, () => ({
    show: () => setShow(true),
    hide: () => setShow(false),
  }))

  return useMemo(() => {
    return (
      <AntModal
        {...props}
        visible={show}
        closable={closable}
        className={classNames(styles.modal, { [styles.closable]: closable })}
        title={titleEle}
        centered={centered}
        forceRender={forceRender}
        destroyOnClose={destroyOnClose}
      >
        {children}
      </AntModal>
    )
  }, [
    centered,
    children,
    closable,
    destroyOnClose,
    forceRender,
    props,
    show,
    titleEle,
  ])
}

export default forwardRef(Modal)
