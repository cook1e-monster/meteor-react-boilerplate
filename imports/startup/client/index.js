import React from 'react'
import ReactDOM from 'react-dom'

import { Router, Route, Switch } from 'react-router-dom'
import createBrowserHistory from 'history/createBrowserHistory'
import { routes } from './routes'

Meteor.startup(() => {
  ReactDOM.render(
    <Router history={createBrowserHistory()}>
      <Switch>
        {routes.map((route, idx) => (
          <Route
            key={idx}
            path={route.url}
            render={props => (
              <route.component
                {...props}
                routes={route.routes}
                exact={route.exact}
                name={route.name}
              />
            )}
          />
        ))}
      </Switch>
    </Router>,
    document.getElementById('app')
  )
})
