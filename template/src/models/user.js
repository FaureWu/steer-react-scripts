import {
  login,
  logout,
  fetchUserInfo,
  fetchUserAuth,
  loginToRedirect,
  redirectToLogin,
  getUserInfo,
  getAuthCodes,
} from '@/services/user'
import { isArray } from '@/utils/tool'
import { menus as menuData } from '@/config/menu'

function getAuthMenus(menus = [], authCodes) {
  return menus.reduce((result, menu) => {
    if (isArray(menu.children)) {
      const authChildren = getAuthMenus(menu.children, authCodes)
      if (!isArray(authChildren) || authChildren.length <= 0) return result

      result.push({ ...menu, children: authChildren })
      return result
    }

    if (!authCodes[menu.route]) return result

    result.push(menu)
    return result
  }, [])
}

const defaultState = {
  menus: [],
  userInfo: {},
  unReadMessageCount: 0,
  breadCrumbs: [],
}

export default {
  namespace: 'user',

  state: defaultState,

  mixins: ['update'],

  effects: {
    async login({ payload }, { put }) {
      await login(payload)
      await put({ type: 'init' })
      loginToRedirect()
    },

    async init(action, { put }) {
      const [userInfo, authCodes] = await Promise.all([
        fetchUserInfo(),
        fetchUserAuth(),
      ])
      const authMenus = getAuthMenus(menuData, authCodes)
      put({ type: 'update', payload: { menus: authMenus, userInfo } })
    },

    logout(action, { put }) {
      redirectToLogin()
      logout()
      put({ type: 'clear' })
    },

    config(action, { put }) {
      const userInfo = getUserInfo()
      const authCodes = getAuthCodes()
      const authMenus = getAuthMenus(menuData, authCodes)
      put({ type: 'update', payload: { menus: authMenus, userInfo } })
    },
  },

  reducers: {
    clear() {
      return defaultState
    },
    updateBreadCrumbs({ payload }, state) {
      return {
        ...state,
        breadCrumbs: payload,
      }
    },
  },
}
