/**
 * 函数组合，从左往右
 */
function compose(...tasks) {
  return function done(params, taskId = 0) {
    const task = tasks[taskId]

    const result = task.call(this, params)
    const isLastTask = taskId === tasks.length - 1

    if (isLastTask) return result
    else return done.call(this, result, taskId + 1)
  }
}

module.exports = {
  compose,
}