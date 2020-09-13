import React from 'react'
import { PageHeader } from 'antd'

import styles from './header.less'

function Header({ title, actions, children }) {
  return (
    <PageHeader className={styles.header} title={title} extra={actions}>
      {children}
    </PageHeader>
  )
}

export default Header
