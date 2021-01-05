import { lazy } from 'react'

export default lazy(() => {
  return import(
    /* webpackChunkName: "page~componentForm" */ '@/pages/component/form.jsx'
  )
})
