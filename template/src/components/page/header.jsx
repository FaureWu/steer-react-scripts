import React from 'react'
import classNames from 'classnames'
import { PageHeader } from 'antd'
import { LeftOutlined } from '@ant-design/icons'

import styles from './header.less'

function Header({
  className,
  title,
  description,
  actions,
  tags,
  avatar,
  onBack,
  children,
}) {
  return (
    <PageHeader
      className={classNames(styles.header, className)}
      title={title}
      backIcon={<LeftOutlined />}
      subTitle={description}
      extra={actions}
      avatar={avatar}
      tags={tags}
      onBack={onBack}
    >
      {children}
    </PageHeader>
  )
}

export default Header
