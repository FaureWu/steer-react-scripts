import { lazy } from 'react'

export default lazy(() => {
  return import(/* webpackChunkName: "page~index" */ '@/pages/index.jsx')
})
