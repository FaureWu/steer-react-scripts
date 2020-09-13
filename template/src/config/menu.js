import { isArray } from '@/utils/tool'

export const menus = [
  {
    title: '首页',
    route: '/',
    icon: 'HomeOutlined',
  },
  {
    title: '组件演示',
    route: '/component',
    icon: 'AppstoreOutlined',
    children: [
      {
        title: 'Page',
        route: '/component/page',
      },
      {
        title: 'Table',
        route: '/component/table',
      },
      {
        title: 'Form',
        route: '/component/form',
      },
    ],
  },
]

function getRoutes(menus) {
  let routes = []
  menus.forEach((menu) => {
    if (isArray(menu.children)) {
      routes = routes.concat(getRoutes(menu.children))
    }
    routes.push(menu)
  })
  return routes
}

export const routes = getRoutes(menus)
