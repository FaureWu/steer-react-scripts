import React, { Suspense } from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { createHashHistory } from 'history'
import zoro from '@opcjs/zoro'
import { createLoading } from '@opcjs/zoro-plugin'
import { zoro as config } from '@/app'
import Loading from '@/components/loading/loading'
import Layout from './layout'
import Routes from './routes'

import '@/app.less'

const app = zoro(config)
app.model(
  require('/Volumes/Code/workspace/steer/steer-react-scripts/template/src/models/user.js')
    .default,
)
app.use(createLoading())
app.use(
  require('/Volumes/Code/workspace/steer/steer-react-scripts/template/src/plugins/mixin.js')
    .default,
)
const store = app.start()

const history = createHashHistory()

export { app, store, history }

export default function App() {
  return (
    <Provider store={store}>
      <Suspense fallback={<Loading />}>
        <Router history={history}>
          <Layout>
            <Suspense fallback={<Loading />}>
              <Routes />
            </Suspense>
          </Layout>
        </Router>
      </Suspense>
    </Provider>
  )
}
