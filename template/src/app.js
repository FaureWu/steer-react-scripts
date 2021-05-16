import { message } from 'antd'
import { delay } from '@/utils/tool'
import { dispatcher } from '@opcjs/zoro'
import { redirectToLogin, getToken, getAuthCodes } from '@/services/user'
import { history } from 'steer'
import { loading } from '@/components/loading/loading'
import { updateBreadCrumbs } from '@/layouts/breadCrumbs/breadCrumbs'

/**
 * 控制页面的渲染逻辑
 */
export function render(oldRender) {
  let token = history.get('token')

  if (token) {
    loading.show()
    dispatcher.user
      .init()
      .catch((e) => redirectToLogin())
      .finally(() => {
        loading.hide()
        oldRender()
      })

    return
  }

  token = getToken()
  if (!token) {
    redirectToLogin()
    oldRender()
  } else dispatcher.user.config().finally(() => oldRender())
}

/**
 * 路由变化
 */
export function onRouteChange({ location }) {
  const { pathname } = location
  const whiteLists = ['/login', '/404']

  if (whiteLists.indexOf(pathname) !== -1) return

  const token = getToken()
  if (!token) {
    redirectToLogin()
    return
  }

  const authCodes = getAuthCodes()
  if (process.env.REACT_APP_ENV !== 'mock' && !authCodes[pathname]) {
    history.push('/404')
    return
  }

  if (
    process.env.REACT_APP_TEMPLATE_EDITOR_ROUTE &&
    pathname.indexOf(process.env.REACT_APP_TEMPLATE_EDITOR_ROUTE) === 0
  )
    return

  updateBreadCrumbs(location)
}

let messages = []
/**
 * 本项目自动集成数据处理框架zoro
 * @url https://faurewu.github.io/zoro/
 */
export const zoro = {
  onError(error) {
    if (error.message && messages.indexOf(error.message) === -1) {
      messages.push(error.message)
      delay(0).then(() => {
        message.error(error.message, 2, () => {
          messages = messages.filter((message) => message !== error.message)
        })
      })
    }
  },
}
