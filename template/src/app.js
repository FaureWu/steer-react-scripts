import qs from 'qs'
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
  const [, hashQuery = ''] = window.location.hash.split('?')
  const query = window.location.search.replace('?', '')

  let token = qs.parse(query).token
  if (!token) {
    token = qs.parse(hashQuery).token
  }

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

  const authCodes = getAuthCodes()
  if (!authCodes[pathname]) {
    history.push('/404')
    return
  }

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
