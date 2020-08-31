import React from 'react'
import ReactDOM from 'react-dom'
import { SyncOutlined } from '@ant-design/icons'

import styles from './loading.less'

function Loading() {
  return (
    <div className={styles.loading}>
      <SyncOutlined className={styles.icon} spin />
    </div>
  )
}

const create = (function () {
  function Create() {
    const element = document.createElement('div')

    return {
      show() {
        document.body.appendChild(element)
        ReactDOM.render(<Loading />, element)
      },
      hide() {
        ReactDOM.unmountComponentAtNode(element)
        document.body.removeChild(element)
      },
    }
  }
  let instance
  return function () {
    if (instance) return instance
    return new Create()
  }
})()

export default Loading

export const loading = create()
