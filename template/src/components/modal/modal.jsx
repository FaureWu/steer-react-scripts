import React, { useMemo } from 'react'
import { Modal as AntModal } from 'antd'
import classNames from 'classnames'

import styles from './modal.less'

function Modal({
  destroyOnClose = true,
  forceRender = true,
  centered = true,
  closable,
  title,
  actions,
  children,
  ...props
}) {
  const titleEle = useMemo(() => {
    if (!title && !actions) return null

    return (
      <div className={styles.header}>
        <span>{title}</span>
        {actions}
      </div>
    )
  }, [actions, title])

  return useMemo(() => {
    return (
      <AntModal
        {...props}
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
    titleEle,
  ])
}

export default Modal
