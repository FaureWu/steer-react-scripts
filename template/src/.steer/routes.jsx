import React, { useEffect } from 'react'
import {
  Switch,
  Route,
  useLocation,
  useHistory,
  useParams,
  matchPath,
} from 'react-router-dom'
import { onRouteChange } from '@/app'

import PIndex from '/Volumes/Code/workspace/steer/steer-react-scripts/template/src/.steer/pages/index.jsx'
import PLogin from '/Volumes/Code/workspace/steer/steer-react-scripts/template/src/.steer/pages/login.jsx'
import POrderIndex from '/Volumes/Code/workspace/steer/steer-react-scripts/template/src/.steer/pages/orderIndex.jsx'
import PEditor from '/Volumes/Code/workspace/steer/steer-react-scripts/template/src/editor/index.jsx'
import NotFound from '@/pages/404'

export default function Routes() {
  const location = useLocation()
  const history = useHistory()
  const params = useParams()

  useEffect(() => {
    const isEditor = matchPath(location.pathname, {
      path: '/editor',
      exact: true,
    })
    const isPreview = matchPath(location.pathname, {
      path: '/editor/preview',
      exact: true,
    })
    if (isEditor || isPreview) return
    onRouteChange({ history, location, params })
  }, [location, history, params])

  return (
    <Switch>
      <Route exact path="/" component={PIndex} />
      <Route exact path="/login" component={PLogin} />
      <Route exact path="/order" component={POrderIndex} />
      <Route exact path="/editor" component={PEditor} />
      <Route path="*" component={NotFound} />
    </Switch>
  )
}
