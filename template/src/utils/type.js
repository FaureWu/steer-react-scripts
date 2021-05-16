/**
 * 类型定义文件说明
 *
 * @description type 指代前端对于类型的定义
 * @description value 指代后端对于类型的定义
 * @description label 指代前端对于类型的展示
 *
 */

export function getOptions(def) {
  return Object.keys(def).map((type) => {
    const { label, value, ...rest } = def[type]
    return { label, value, ...rest }
  })
}

/**
 * 通过前端定义拿到后端值
 */
export function getType2Value(def) {
  return Object.keys(def).reduce((_, type) => {
    const option = def[type]
    return { ..._, [type]: option.value }
  }, {})
}

/**
 * 通过前端定义拿到label
 */
export function getType2Label(def) {
  return Object.keys(def).reduce((_, type) => {
    const option = def[type]
    return { ..._, [type]: option.label }
  }, {})
}

/**
 * 通过后端定义拿到展示值
 */
export function getValue2Label(def) {
  return Object.keys(def).reduce((_, type) => {
    const option = def[type]
    return { ..._, [option.value]: option.label }
  }, {})
}

export function getValue2Props(def) {
  return Object.keys(def).reduce((_, type) => {
    const props = def[type]
    return { ..._, [props.value]: props }
  }, {})
}
