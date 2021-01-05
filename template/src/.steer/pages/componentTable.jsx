import { lazy } from 'react'

export default lazy(() => {
  return import(
    /* webpackChunkName: "page~componentTable" */ '@/pages/component/table.jsx'
  )
})
