import { lazy } from 'react'

export default lazy(() => {
  return import(
    /* webpackChunkName: "layout~vertical" */ '@/layouts/vertical.jsx'
  )
})
