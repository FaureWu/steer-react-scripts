import React, { useMemo } from 'react'
import { Form } from 'antd'
import styles from './group.less'

function Group({ title, actions, children }) {
  return useMemo(() => {
    return (
      <Form.Item noStyle className={styles.group}>
        <div className={styles.header}>
          <span className={styles.title}>{title}</span>
          {actions}
        </div>
        <div className={styles.content}>{children}</div>
      </Form.Item>
    )
  }, [actions, children, title])
}

export default Group
