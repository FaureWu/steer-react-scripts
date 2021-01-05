import { lazy } from 'react'

export default lazy(() => {
  return import(/* webpackChunkName: "page~login" */ '@/pages/login.jsx')
})
