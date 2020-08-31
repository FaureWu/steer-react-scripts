import React from 'react'
import classNames from 'classnames'

import styles from './footer.less'

function Footer({ children, className }) {
  return <div className={classNames(styles.footer, className)}>{children}</div>
}

export default Footer
