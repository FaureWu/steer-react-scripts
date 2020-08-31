import React, { useMemo } from 'react'
import { Dropdown, Button, Space, Menu } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { noop } from '@/utils/tool'

function Actions({ children, max = 2, size }) {
  const pos = useMemo(() => {
    if (React.Children.count(children) > max) return max - 1
    return max
  }, [children, max])

  const actionEle = useMemo(() => {
    return React.Children.toArray(children)
      .slice(0, pos)
      .map((child) => {
        if (!size) return child

        return React.cloneElement(child, { size })
      })
  }, [children, pos, size])

  const dropDownEle = useMemo(() => {
    if (React.Children.count(children) <= pos) return null

    const handles = {}
    const menuEle = React.Children.toArray(children)
      .slice(pos)
      .map((element) => {
        handles[element.key] = element.props.onClick || noop

        return (
          <Menu.Item
            key={element.key}
            danger={element.props.danger}
            disabled={element.props.disabled}
            icon={element.props.icon}
          >
            {element.props.children}
          </Menu.Item>
        )
      })

    function menuClick({ key }) {
      handles[key]()
    }

    return (
      <Dropdown
        overlay={<Menu onClick={menuClick}>{menuEle}</Menu>}
        trigger={['click']}
      >
        <Button type="link" size="small">
          更多
          <DownOutlined />
        </Button>
      </Dropdown>
    )
  }, [children, pos])

  return useMemo(() => {
    return (
      <Space>
        {actionEle}
        {dropDownEle}
      </Space>
    )
  }, [actionEle, dropDownEle])
}

Actions.Action = Button

export default Actions
