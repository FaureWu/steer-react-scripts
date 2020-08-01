import { message } from 'antd'
import { delay } from '@/utils/tool'

/**
 * 控制页面的渲染逻辑
 */
export function render(oldRender) {
  oldRender()
}

/**
 * 路由变化
 */
export function onRouteChange() {

}

/**
 * 本项目自动集成数据处理框架zoro
 * @url https://faurewu.github.io/zoro/
 */
export const zoro = {
  onError(error) {
    if (error.message) {
      delay(0).then(() => message.error(error.message))
    }
  },
}
