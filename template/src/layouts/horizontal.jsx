import React, { useMemo } from 'react'
import { Layout } from 'antd'
import classNames from 'classnames'
import { useModel } from 'steer'

import Brand from './brand/brand'
import Menu from './menu/menu'
import User from './user/user'
import BreadCrumbs from './breadCrumbs/breadCrumbs'

import styles from './horizontal.less'

function Horizontal({ children }) {
  const hasBreadCrumb = useModel(({ user }) => user.breadCrumbs.length > 0)

  return useMemo(() => {
    return (
      <Layout>
        <Layout.Header className={styles.header}>
          <div className={styles.top}>
            <Brand />
            <Menu mode="horizontal" />
          </div>
          <User dark />
        </Layout.Header>
        <Layout.Content className={styles.container}>
          <BreadCrumbs />
          <div
            className={classNames(styles.scroll, {
              [styles.breadcrumb]: hasBreadCrumb,
            })}
          >
            <div className={styles.content}>{children}</div>
            <div className={styles.footer}>
              Copyright @ {new Date().getFullYear()}
            </div>
          </div>
        </Layout.Content>
      </Layout>
    )
  }, [children, hasBreadCrumb])
}

export default Horizontal
