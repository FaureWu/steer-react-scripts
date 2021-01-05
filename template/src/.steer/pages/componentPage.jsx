import { lazy } from 'react'

export default lazy(() => {
  return import(
    /* webpackChunkName: "page~componentPage" */ '@/pages/component/page.jsx'
  )
})
