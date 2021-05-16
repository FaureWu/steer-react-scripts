export function noop() {}

export function delay(time) {
  let timer = null
  return new Promise((resolve) => {
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
  return data !== data
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

export function isEmpty(data) {
  if (isUndefined(data) || isNull(data) || isNaN(data)) return true

  if (isNumber(data)) return !data

  if (isBoolean(data)) return false

  if (isString(data) || isArray(data)) return !data.length

  if (isObject(data)) return !Object.keys(data).length

  return false
}

export function createUniqueId() {
  let idStr = Date.now().toString(36)
  idStr += Math.random().toString(36).substr(3)
  return idStr
}

export function setLocalStorage(key, data) {
  try {
    if (isArray(data) || isObject(data))
      window.localStorage.setItem(key, JSON.stringify(data))
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
    if (isArray(data) || isObject(data))
      window.sessionStorage.setItem(key, JSON.stringify(data))
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

export function reduceTrees(trees, reducer, initValue) {
  if (!isArray(trees)) return initValue

  return trees.reduce((result, item) => {
    return reduceTree(item, reducer, result)
  }, initValue)
}

export function mapTrees(trees, mapper) {
  if (!isArray(trees)) return trees

  return trees.map((tree) => mapTree(tree, mapper))
}

export function eachTrees(trees, looper) {
  if (!isArray(trees)) return trees

  return trees.forEach((tree) => eachTree(tree, looper))
}

export function reduceTree(tree, reducer, initValue) {
  const nextValue = reducer(initValue, tree)
  const children = isArray(tree.children) ? tree.children : []
  return children.reduce((result, item) => {
    return reduceTree(item, reducer, result)
  }, nextValue)
}

export function mapTree(tree, mapper) {
  const data = mapper(tree)
  const children = isArray(tree.children) ? tree.children : []
  data.children = children.map((child) => mapTree(child, mapper))
  return data
}

export function eachTree(tree, looper) {
  looper(tree)
  const children = isArray(tree.children) ? tree.children : []
  children.forEach((child) => eachTree(child, looper))
}

export function tileTrees(trees, reducer) {
  return reduceTrees(
    trees,
    (result, item) => {
      result.push(item)
      return result
    },
    [],
  )
}

export function formatPrice(num, precision = 2) {
  const number = parseFloat(num)

  if (!isNumber(number)) return num

  return `${parseFloat(number).toFixed(precision)}`.replace(
    /(\d{1,3})(?=(\d{3})+(?:$|\.))/g,
    '$1,',
  )
}
