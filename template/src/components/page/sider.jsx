import React from 'react'
import classNames from 'classnames'

import styles from './sider.less'

function Sider({ children, className }) {
  return <div className={classNames(styles.sider, className)}>{children}</div>
}

export default Sider
