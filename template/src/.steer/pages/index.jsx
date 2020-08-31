import { lazy } from 'react'

export default lazy(() => {
  return import(
    /* webpackChunkName: "page~index" */ '/Volumes/Code/workspace/steer/steer-react-scripts/template/src/pages/index.jsx'
  )
})
