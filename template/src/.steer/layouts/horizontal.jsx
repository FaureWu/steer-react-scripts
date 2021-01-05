import { lazy } from 'react'

export default lazy(() => {
  return import(
    /* webpackChunkName: "layout~horizontal" */ '@/layouts/horizontal.jsx'
  )
})
