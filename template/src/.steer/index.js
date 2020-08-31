import React from 'react'
import ReactDOM from 'react-dom'
import { ConfigProvider } from 'antd'
import locale from 'antd/es/locale/zh_CN'
import * as serviceWorker from '@/serviceWorker'
import { render } from '@/app'
import { useSelector, shallowEqual } from 'react-redux'
import './dayjs'
import App, { app, store, history } from './app'

render(() => {
  ReactDOM.render(
    <ConfigProvider locale={locale}>
      <App />
    </ConfigProvider>,
    document.getElementById(process.env.REACT_APP_ROOT_ELEMENT_ID),
  )
})

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register()

function useModel(selector) {
  return useSelector(selector, shallowEqual)
}

export { app, store, history, useModel }
