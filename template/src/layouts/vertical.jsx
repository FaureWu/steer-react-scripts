import React, { useMemo, useState, useCallback } from 'react'
import { Layout } from 'antd'
import classNames from 'classnames'
import { useModel } from 'steer'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'

import Brand from './brand/brand'
import Menu from './menu/menu'
import User from './user/user'
import BreadCrumbs from './breadCrumbs/breadCrumbs'

import styles from './vertical.less'

function Vertical({ children }) {
  const [collapsed, setCollapsed] = useState(false)
  const hasBreadCrumb = useModel(({ user }) => user.breadCrumbs.length > 0)

  const handleToggleCollapse = useCallback(() => {
    setCollapsed(!collapsed)
  }, [collapsed])

  return useMemo(() => {
    return (
      <Layout>
        <Layout.Sider
          className={styles.sider}
          collapsed={collapsed}
          onCollapse={handleToggleCollapse}
        >
          <Brand collapsed={collapsed} />
          <div className={styles.menu}>
            <Menu mode="inline" />
          </div>
        </Layout.Sider>
        <Layout>
          <Layout.Header className={styles.header}>
            <div className={styles.collapsed} onClick={handleToggleCollapse}>
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </div>
            <User />
          </Layout.Header>
          <BreadCrumbs />
          <div
            className={classNames(styles.scroll, {
              [styles.breadcrumb]: hasBreadCrumb,
            })}
          >
            <Layout.Content className={styles.content}>
              {children}
            </Layout.Content>
            <Layout.Footer className={styles.footer}>
              Copyright @ {new Date().getFullYear()}
            </Layout.Footer>
          </div>
        </Layout>
      </Layout>
    )
  }, [children, collapsed, handleToggleCollapse, hasBreadCrumb])
}

export default Vertical
