import React, { Suspense } from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { createHashHistory } from 'history'
import { Avatar } from 'antd'
import { SettingOutlined } from '@ant-design/icons'
import zoro from '@opcjs/zoro'
import { createLoading } from '@opcjs/zoro-plugin'
import { zoro as config } from '@/app'
import Loading from '@/components/loading/loading'
import Layout from './layout'
import Routes from './routes'

import '@/app.less'

const app = zoro(config)
app.model(require('@/models/user.js').default)
app.use(createLoading())
app.use(require('@/plugins/mixin.js').default)
const store = app.start()

const history = createHashHistory()

export { app, store, history }

export default function App() {
  function handleToEditor() {
    history.push(process.env.REACT_APP_TEMPLATE_EDITOR_ROUTE)
  }

  return (
    <Provider store={store}>
      <Suspense fallback={<Loading />}>
        <Router history={history}>
          <Layout>
            <Suspense fallback={<Loading />}>
              <Routes />
            </Suspense>
            <div
              style={{
                position: 'fixed',
                bottom: '16px',
                right: '16px',
                cursor: 'pointer',
              }}
              onClick={handleToEditor}
            >
              <Avatar size="large" icon={<SettingOutlined />} />
            </div>
          </Layout>
        </Router>
      </Suspense>
    </Provider>
  )
}
