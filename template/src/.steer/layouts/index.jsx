import { lazy } from 'react'

export default lazy(() => {
  return import(
    /* webpackChunkName: "layout~index" */ '/Volumes/Code/workspace/steer/steer-react-scripts/template/src/layouts/index.jsx'
  )
})
