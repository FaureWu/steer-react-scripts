import { dispatcher } from '@opcjs/zoro'
import { isArray, isString, isNumber, isObject } from '@/utils/tool'
import { getToken } from '@/utils/auth'

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

function checkHttpStatus(response) {
  if (response.status >= 200 && response.status < 300 && response.ok) {
    return response
  }

  if (response.status === 401) {
    dispatcher.user.logout()
  }

  const errMessage = `[${response.status}] 服务器异常，请检查服务器！`
  const error = new Error(errMessage)
  error.response = response
  throw error
}

function checkSuccess(response) {
  if (isObject(response) && response.code === 200) {
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

export default function request(route, options) {
  const { data, headers = {}, form, ...newOptions } = options

  newOptions.credentials = 'include'
  newOptions.headers = headers

  const token = getToken()
  if (token) newOptions.headers.Authorization = token

  let { url, body } = resolveParams(route, data)

  if (form) {
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
    url = process.env.REACT_APP_SERVER + url
  }

  return fetch(url, newOptions)
    .then(checkHttpStatus)
    .then((response) => {
      return response.json()
    })
    .then(checkSuccess)
    .catch(throwError)
}
