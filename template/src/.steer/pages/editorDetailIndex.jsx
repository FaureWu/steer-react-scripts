import { lazy } from 'react'
import { app } from 'steer'

export default lazy(() => {
  app.model__quiet(
    require('/Volumes/Code/workspace/steer/steer-react-scripts/template/src/.steer/previews/detail/models/detail.js')
      .default,
  )

  return import(
    /* webpackChunkName: "page~editorDetailIndex" */ '/Volumes/Code/workspace/steer/steer-react-scripts/template/src/.steer/previews/detail/index.jsx'
  )
})
