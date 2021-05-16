import qs from 'qs'
import { dispatcher } from '@opcjs/zoro'
import { isArray, isString, isNumber, isObject, isEmpty } from '@/utils/tool'
import { getToken } from '@/services/user'

function resolveParams(route, data) {
  if (
    typeof data !== 'object' ||
    data instanceof Array ||
    data instanceof ArrayBuffer
  ) {
    return { url: route, body: data }
  }

  let url = route
  const params = { ...data }

  const match = url.match(/\/:(\w+)/g)

  if (isArray(match)) {
    match.forEach((v) => {
      const key = v.replace('/:', '')
      const param = params[key]
      if (isString(param) || isNumber(param)) {
        url = url.replace(v, `/${param}`)
        delete params[key]
      }
    })
  }

  return { url, body: params }
}

function checkHttpStatus(response, { quite }) {
  if (response.status >= 200 && response.status < 300 && response.ok) {
    return response
  }

  if (response.status === 401) {
    dispatcher.user.logout()
    return
  }

  const errMessage = `[${response.status}] 服务器异常，请检查服务器！`
  const error = new Error(errMessage)
  error.response = response
  if (response.status === 403) {
    error.message = `无权访问${response.url.replace(
      (/^http/.test(response.url)
        ? window.location.origin
        : process.env.REACT_APP_SERVER || '') +
        (process.env.REACT_APP_API_PREFIX || ''),
      '',
    )}`
  }

  if (quite) {
    console.warn(error.message)
    error.message = ''
  }

  throw error
}

function checkSuccess(response) {
  const code = `${response.code}`.toUpperCase()
  if (isObject(response) && (code === '200' || code === 'SUCCESS')) {
    return response
  }

  const error = new Error(response.message)
  error.response = response
  throw error
}

function throwError(e) {
  if (e.response) throw e

  const error = new Error('网络异常，请检查网络情况！')
  throw error
}

function joinParams(url, params) {
  const hasQueryParams = url.indexOf('?') !== -1

  if (isEmpty(params)) return url

  if (hasQueryParams) return `${url}&${qs.stringify(params)}`
  else return `${url}?${qs.stringify(params)}`
}

export default function request(route, options) {
  const {
    data,
    headers = {},
    form,
    quite,
    method = 'GET',
    ...newOptions
  } = options

  newOptions.credentials = 'omit'
  newOptions.headers = headers
  newOptions.method = method.toLocaleUpperCase()
  newOptions.headers['Content-Type'] = 'application/json'

  const token = getToken()
  if (token) newOptions.headers.Authorization = `Bearer ${token}`

  let { url, body } = resolveParams(route, data)

  if (['GET', 'DELETE'].indexOf(newOptions.method) !== -1)
    url = joinParams(url, body)
  else if (form) {
    newOptions.body = Object.keys(body).reduce((formData, key) => {
      if (isArray(body[key])) {
        body[key].forEach((value) => {
          formData.append(key, value)
        })
      } else formData.append(key, body[key])

      return formData
    }, new FormData())
  } else newOptions.body = JSON.stringify(body)

  if (!/^http/.test(url)) {
    url =
      (process.env.REACT_APP_SERVER || '') +
      (process.env.REACT_APP_API_PREFIX || '') +
      url
  }

  return fetch(url, newOptions)
    .then((response) => checkHttpStatus(response, { quite }))
    .then((response) => {
      return response.json()
    })
    .then(checkSuccess)
    .catch(throwError)
}
