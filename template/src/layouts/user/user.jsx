import React, { useMemo, useCallback } from 'react'
import { Dropdown, Menu, Avatar, Space, Badge } from 'antd'
import { useModel } from 'steer'
import { BellOutlined } from '@ant-design/icons'
import { dispatcher } from '@opcjs/zoro'

import styles from './user.less'

function User() {
  const userInfo = useModel(({ user }) => user.userInfo)
  const handleSelectMenu = useCallback(({ key }) => {
    switch (key) {
      case 'logout':
        dispatcher.user.logout()
        break
      default:
        break
    }
  }, [])

  const userEle = useMemo(() => {
    const { userName = '' } = userInfo

    return (
      <Dropdown
        placement="bottomRight"
        overlay={
          <Menu onClick={handleSelectMenu}>
            <Menu.Item key="user">个人中心</Menu.Item>
            <Menu.Divider />
            <Menu.Item key="logout">退出登录</Menu.Item>
          </Menu>
        }
        trigger={['click']}
      >
        <Space className={styles.item}>
          <Avatar className={styles.avatar}>
            {userName.slice(0, 1).toLocaleUpperCase()}
          </Avatar>
          <span>{userName}</span>
        </Space>
      </Dropdown>
    )
  }, [handleSelectMenu, userInfo])

  return useMemo(() => {
    return (
      <div className={styles.user}>
        <div className={styles.item}>
          <Badge overflowCount={99}>
            <BellOutlined className={styles.icon} />
          </Badge>
        </div>
        {userEle}
      </div>
    )
  }, [userEle])
}

export default User
