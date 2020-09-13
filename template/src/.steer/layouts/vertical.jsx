import { lazy } from 'react'

export default lazy(() => {
  return import(
    /* webpackChunkName: "layout~vertical" */ '/Volumes/Code/workspace/steer/steer-react-scripts/template/src/layouts/vertical.jsx'
  )
})
