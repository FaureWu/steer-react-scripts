import React, { useMemo, useCallback } from 'react'
import { Menu as AntMenu } from 'antd'
import { useHistory } from 'react-router-dom'
import { useModel } from 'steer'
import { isArray } from '@/utils/tool'
import { HomeOutlined, ContainerOutlined } from '@ant-design/icons'

const MENU_ICONS = {
  HomeOutlined: <HomeOutlined />,
  ContainerOutlined: <ContainerOutlined />,
}

function Menu(props) {
  const menus = useModel((state) => state.user.menus)
  const history = useHistory()
  const handleSelectMenu = useCallback(({ key }) => history.push(key), [
    history,
  ])

  const renderSubMenu = useCallback((menu) => {
    return <AntMenu.Item key={menu.route}>{menu.title}</AntMenu.Item>
  }, [])

  const renderMenu = useCallback(
    (menu) => {
      if (isArray(menu.children)) {
        return (
          <AntMenu.SubMenu
            key={menu.route}
            title={
              <span>
                {MENU_ICONS[menu.icon]}
                <span>{menu.title}</span>
              </span>
            }
          >
            {menu.children.map(renderSubMenu)}
          </AntMenu.SubMenu>
        )
      }

      return (
        <AntMenu.Item key={menu.route}>
          <span>
            {MENU_ICONS[menu.icon]}
            <span>{menu.title}</span>
          </span>
        </AntMenu.Item>
      )
    },
    [renderSubMenu],
  )

  return useMemo(() => {
    return (
      <AntMenu
        {...props}
        selectable={false}
        theme="dark"
        onClick={handleSelectMenu}
      >
        {menus.map(renderMenu)}
      </AntMenu>
    )
  }, [handleSelectMenu, menus, props, renderMenu])
}

export default Menu
