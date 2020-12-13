/**
 * 条件组合
 */
function condition(check) {
  return function (...conditions) {
    let conditionId = 0
    const lastConditionId = conditions.length - 1

    return function done(...params) {
      const condition = conditions[conditionId]

      const isTrue = condition.apply(this, params)
      const isLastCondition = conditionId === lastConditionId

      if (isLastCondition || !check(isTrue)) {
        conditionId = 0
        return isTrue
      }

      conditionId++
      return done.apply(this, params)
    }
  }
}

function isTrue(bool) {
  return bool
}

function isFalse(bool) {
  return !bool
}

/**
 * 条件非
 */
function not(condition) {
  return function (...params) {
    return !condition.apply(this, params)
  }
}

function conIf(ifFn, task) {
  return function (param) {
    const isPass = ifFn.call(this, param)
    if (isPass) task.call(this, param)
    return param
  }
}

module.exports = {
  and: condition(isTrue),
  or: condition(isFalse),
  not,
  if: conIf,
}