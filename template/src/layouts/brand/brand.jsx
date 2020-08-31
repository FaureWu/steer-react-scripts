import React, { useMemo } from 'react'
import logo from '@/assets/logo.png'
import classNames from 'classnames'

import styles from './brand.less'

function Brand({ collapsed }) {
  return useMemo(() => {
    return (
      <div
        className={classNames(styles.brand, { [styles.collapsed]: collapsed })}
      >
        <img
          className={styles.logo}
          src={logo}
          alt={process.env.REACT_APP_NAME}
        />
        <div className={styles.text}>{process.env.REACT_APP_NAME}</div>
      </div>
    )
  }, [collapsed])
}

export default Brand
