import { isArray } from '@/utils/tool'

export const menus = [{
  title: '首页',
  route: '/',
  icon: 'HomeOutlined',
}, {
  title: '订单管理',
  route: '/order',
  icon: 'ContainerOutlined',
  children: [{
    title: '订单列表',
    route: '/order/list',
  }, {
    title: '订单详情',
    route: '/order/detail',
  }],
}]

function getRoutes(menus) {
  let routes = []
  menus.forEach(menu => {
    if (isArray(menu.children)) {
      routes = routes.concat(getRoutes(menu.children))
    }
    routes.push(menu)
  })
  return routes
}

export const routes = getRoutes(menus)
