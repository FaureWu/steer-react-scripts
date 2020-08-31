export function noop() {}

export function delay(time) {
  let timer = null
  return new Promise(resolve => {
    timer = setTimeout(() => {
      resolve()
      clearTimeout(timer)
      timer = null
    }, time)
  })
}

function check(data, type) {
  return Object.prototype.toString.call(data) === type
}

export function isString(data) {
  return check(data, '[object String]')
}

export function isObject(data) {
  return check(data, '[object Object]')
}

export function isArray(data) {
  return check(data, '[object Array]')
}

export function isNull(data) {
  return check(data, '[object Null]')
}

export function isNaN(data) {
  // eslint-disable-next-line
  return data !== data;
}

export function isNumber(data) {
  return check(data, '[object Number]') && !isNaN(data)
}

export function isBoolean(data) {
  return check(data, '[object Boolean]')
}

export function isUndefined(data) {
  return check(data, '[object Undefined]')
}

export function isFunction(data) {
  return check(data, '[object Function]')
}

export function setLocalStorage(key, data) {
  try {
    if (isArray(data) || isObject(data)) window.localStorage.setItem(key, JSON.stringify(data))
    else window.localStorage.setItem(key, data)
  } catch (e) {
    console.error(e)
  }
}

export function getLocalStorage(key) {
  if (!isString(key)) return

  const data = window.localStorage.getItem(key)
  try {
    return JSON.parse(data)
  } catch (e) {
    return data
  }
}

export function removeLocalStorage(key) {
  if (!isString(key)) return

  localStorage.removeItem(key)
}

export function setSessionStorage(key, data) {
  try {
    if (isArray(data) || isObject(data)) window.sessionStorage.setItem(key, JSON.stringify(data))
    else window.sessionStorage.setItem(key, data)
  } catch (e) {
    console.error(e)
  }
}

export function getSessionStorage(key) {
  if (!isString(key)) return

  const data = window.sessionStorage.getItem(key)
  try {
    return JSON.parse(data)
  } catch (e) {
    return data
  }
}

export function removeSessionStorage(key) {
  if (!isString(key)) return

  sessionStorage.removeItem(key)
}
