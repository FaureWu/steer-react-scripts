import { lazy } from 'react'
import { app } from 'steer'

export default lazy(() => {
  app.model__quiet(
    require('/Volumes/Code/workspace/steer/steer-react-scripts/template/src/pages/order/models/table.js')
      .default,
  )

  return import(
    /* webpackChunkName: "page~orderIndex" */ '/Volumes/Code/workspace/steer/steer-react-scripts/template/src/pages/order/index.jsx'
  )
})
