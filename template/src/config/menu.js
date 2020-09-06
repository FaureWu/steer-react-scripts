import { isArray } from '@/utils/tool'

export const menus = [{
  title: '首页',
  route: '/',
  icon: 'HomeOutlined',
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
