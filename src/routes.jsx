import React from 'react'

import { Router, IndexRoute, Route, browserHistory } from 'react-router'

import AnonLayout from './components/anon-layout.jsx'
import Auth from './components/auth.jsx'
import AuthCallback from './components/auth-callback.jsx'
import NotFound from './components/not-found.jsx'

const routes = (
  <Router history={browserHistory}>
    <Route path="/" component={AnonLayout}>
      <IndexRoute component={Auth} />
      <Route path="auth" component={AuthCallback} />
    </Route>
    <Route path="*" component={NotFound} />
  </Router>
)

export default routes
