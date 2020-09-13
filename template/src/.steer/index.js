import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { ConfigProvider } from 'antd'
import qs from 'qs'
import locale from 'antd/es/locale/zh_CN'
import * as serviceWorker from '@/serviceWorker'
import { render } from '@/app'
import { useSelector, shallowEqual } from 'react-redux'
import { useLocation } from 'react-router-dom'
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

function useQuery() {
  const [query, setQuery] = useState({})
  const location = useLocation()

  useEffect(() => {
    setQuery(qs.parse(location.search.replace('?', '')))
  }, [location])

  return query
}

history.switch = function (layout, route) {
  const { origin } = window.location
  const layoutPath = layout ? `/${layout}` : ''
  window.location.href = `${origin}${layoutPath}#${route}`
}

export { app, store, history, useModel, useQuery }
