import React, { useEffect } from 'react'
import {
  Switch,
  Route,
  useLocation,
  useHistory,
  useParams,
} from 'react-router-dom'
import { onRouteChange } from '@/app'

import PComponentForm from '@/.steer/pages/componentForm.jsx'
import PComponentPage from '@/.steer/pages/componentPage.jsx'
import PComponentTable from '@/.steer/pages/componentTable.jsx'
import PIndex from '@/.steer/pages/index.jsx'
import PLogin from '@/.steer/pages/login.jsx'
import PEditor from '@/editor/index.jsx'
import NotFound from '@/pages/404'

export default function Routes() {
  const location = useLocation()
  const history = useHistory()
  const params = useParams()

  useEffect(() => {
    onRouteChange({ history, location, params })
  }, [location, history, params])

  return (
    <Switch>
      <Route exact path="/component/form" component={PComponentForm} />
      <Route exact path="/component/page" component={PComponentPage} />
      <Route exact path="/component/table" component={PComponentTable} />
      <Route exact path="/" component={PIndex} />
      <Route exact path="/login" component={PLogin} />
      <Route exact path="/editor" component={PEditor} />
      <Route path="*" component={NotFound} />
    </Switch>
  )
}
