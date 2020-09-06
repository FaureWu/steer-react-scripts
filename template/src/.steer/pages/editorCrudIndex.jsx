import { lazy } from 'react'
import { app } from 'steer'

export default lazy(() => {
  app.model__quiet(
    require('/Volumes/Code/workspace/steer/steer-react-scripts/template/src/.steer/previews/crud/models/operator.js')
      .default,
  )
  app.model__quiet(
    require('/Volumes/Code/workspace/steer/steer-react-scripts/template/src/.steer/previews/crud/models/table.js')
      .default,
  )

  return import(
    /* webpackChunkName: "page~editorCrudIndex" */ '/Volumes/Code/workspace/steer/steer-react-scripts/template/src/.steer/previews/crud/index.jsx'
  )
})
