import { lazy } from 'react'

export default lazy(() => {
  return import(
    /* webpackChunkName: "page~componentTable" */ '/Volumes/Code/workspace/steer/steer-react-scripts/template/src/pages/component/table.jsx'
  )
})
