import { lazy } from 'react'

export default lazy(() => {
  return import(
    /* webpackChunkName: "page~componentPage" */ '/Volumes/Code/workspace/steer/steer-react-scripts/template/src/pages/component/page.jsx'
  )
})
