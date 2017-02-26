import React from 'react'

import { Router, IndexRoute, Route, browserHistory } from 'react-router'

import LocalStorage from './models/local-storage'

import AnonLayout from './components/anon-layout.jsx'
import Auth from './components/auth.jsx'
import AuthCallback from './components/auth-callback.jsx'
import AuthLayout from './components/auth-layout.jsx'
import Swarm from './components/swarm.jsx'
import NotFound from './components/not-found.jsx'

function redirectIfSignedIn(nextState, replace) {
  if (LocalStorage.has('foursquare-token')) {
    replace({
      pathname: '/its-gym-time',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

function requireFoursquareAuth(nextState, replace) {
  if (!LocalStorage.has('foursquare-token')) {
    replace({
      pathname: '/',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

const routes = (
  <Router history={browserHistory}>
    <Route path="/" component={AnonLayout}>
      <IndexRoute component={Auth} onEnter={redirectIfSignedIn} />
      <Route path="auth" component={AuthCallback} />
    </Route>
    <Route path="/its-gym-time" component={AuthLayout} onEnter={requireFoursquareAuth}>
      <IndexRoute component={Swarm} />
    </Route>
    <Route path="*" component={NotFound} />
  </Router>
)

export default routes
