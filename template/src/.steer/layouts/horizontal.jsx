import { lazy } from 'react'

export default lazy(() => {
  return import(
    /* webpackChunkName: "layout~horizontal" */ '/Volumes/Code/workspace/steer/steer-react-scripts/template/src/layouts/horizontal.jsx'
  )
})
