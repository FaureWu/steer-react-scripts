import { lazy } from 'react'

export default lazy(() => {
  return import(
    /* webpackChunkName: "page~login" */ '/Volumes/Code/workspace/steer/steer-react-scripts/template/src/pages/login.jsx'
  )
})
