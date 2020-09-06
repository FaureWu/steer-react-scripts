import qs from 'qs'
import request from '@/utils/request'
import {
  setLocalStorage,
  getLocalStorage,
  removeLocalStorage,
  setSessionStorage,
  getSessionStorage,
  removeSessionStorage,
} from '@/utils/tool'

const REDIRECT_URL = '_REDIRECT_URL_'

function getAuthCodesLoop(data = []) {
  if (data.length <= 0) return {}

  return data.reduce((result, item) => ({
    ...result,
    [item.path.replace('{', ':').replace('}', '')]: true,
    ...getAuthCodesLoop(item.children),
  }), {})
}

const AUTO_LOGIN = '_AUTO_LOGIN_'
export function setAutoLogin(autoLogin) {
  setLocalStorage(AUTO_LOGIN, autoLogin)
}
export function getAutoLogin() {
  return getLocalStorage(AUTO_LOGIN) || false
}

const TOKEN_KEY = '_TOKEN_KEY_'
export function setToken(token) {
  const autoLogin = getAutoLogin()
  if (autoLogin) setLocalStorage(TOKEN_KEY, token)
  else setSessionStorage(TOKEN_KEY, token)
}
export function getToken() {
  const autoLogin = getAutoLogin()
  if (autoLogin) return getLocalStorage(TOKEN_KEY)
  return getSessionStorage(TOKEN_KEY)
}
export function removeToken() {
  const autoLogin = getAutoLogin()
  if (autoLogin) removeLocalStorage(TOKEN_KEY)
  else removeSessionStorage(TOKEN_KEY)
}

const USER_INFO = '_USER_INFO_'
export function setUserInfo(userInfo) {
  const autoLogin = getAutoLogin()
  if (autoLogin) setLocalStorage(USER_INFO, userInfo)
  else setSessionStorage(USER_INFO, userInfo)
}
export function getUserInfo() {
  const autoLogin = getAutoLogin()
  if (autoLogin) return getLocalStorage(USER_INFO) || {}
  return getSessionStorage(USER_INFO) || {}
}
export function removeUserInfo() {
  const autoLogin = getAutoLogin()
  if (autoLogin) removeLocalStorage(USER_INFO)
  else removeSessionStorage(USER_INFO)
}

const AUTH_CODES = '_AUTH_CODES_'
export function setAuthCodes(authCodes) {
  const autoLogin = getAutoLogin()
  if (autoLogin) setLocalStorage(AUTH_CODES, authCodes)
  else setSessionStorage(AUTH_CODES, authCodes)
}
export function getAuthCodes() {
  const autoLogin = getAutoLogin()
  if (autoLogin) return getLocalStorage(AUTH_CODES) || {}
  return getSessionStorage(AUTH_CODES) || {}
}
export function removeAuthCodes() {
  const autoLogin = getAutoLogin()
  if (autoLogin) removeLocalStorage(AUTH_CODES)
  else removeSessionStorage(AUTH_CODES)
}

const BREAD_CRUMBS = '_BREAD_CRUMBS_'
export function setBreadCrumbs(breadCrumbs) {
  setSessionStorage(BREAD_CRUMBS, breadCrumbs)
}
export function getBreadCrumbs() {
  return getSessionStorage(BREAD_CRUMBS) || []
}
export function removeBreadCrumbs() {
  removeSessionStorage(BREAD_CRUMBS)
}

/**
 * 跳转到登录界面
 * @return
 */
export function redirectToLogin() {
  const { hash, origin, pathname, search } = window.location
  const [hashPath, queryString = ''] = hash.replace('#', '').split('?')

  if (hashPath === '/login') return;

  const query = qs.parse(queryString)
  delete query.token

  const hashQueryString = qs.stringify(query)
  let hashString = ''
  if (hashPath) hashString += `#${hashPath}`
  if (hashQueryString) hashString += `?${hashQueryString}`

  setLocalStorage(REDIRECT_URL, `${origin}${pathname}${search}${hashString}`)
  window.location.href = `${origin}#/login`
}

/**
 * 登录成功返回原界面
 * @return
 */
export function loginToRedirect() {
  const url = getLocalStorage(REDIRECT_URL);
  removeLocalStorage(REDIRECT_URL);

  if (url) window.location.href = url
  else {
    const { origin, pathname, search } = window.location
    window.location.href = `${origin}${pathname}${search}`
  }
}

/**
 * 用户登录
 * @param {String} userName
 * @param {String} password
 * @return
 */
export async function login({ userName, password, autoLogin = false }) {
  setAutoLogin(autoLogin)
  const { data = '' } = await request('/user/login', {
    method: 'POST',
    data: { userName, password },
  })
  setToken(data)
}

/**
 * 用户退出登录
 * @return
 */
export function logout() {
  removeAuthCodes()
  removeUserInfo()
  removeToken()
}

/**
 * 获取用户信息
 * @return {Object} 用户信息
 */
export async function fetchUserInfo() {
  const { data = {} } = await request('/user/info', {
    method: 'GET',
  })
  setUserInfo(data)

  return data
}

/**
 * 获取用户授权信息
 */
export async function fetchUserAuth() {
  const { data = [] } = await request('/user/auth', {
    method: 'GET',
  })

  const authCodes = getAuthCodesLoop(data)
  setAuthCodes(authCodes)

  return authCodes
}
