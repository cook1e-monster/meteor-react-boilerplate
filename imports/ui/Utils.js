// import { check } from 'meteor/check'
import React from 'react'
import { Route } from 'react-router'

const renderRoute = (route, idx) => (
  <Route
    key={idx}
    path={route.url}
    exact={route.exact}
    name={route.name}
    render={props => <route.component {...props} />}
  />
)

export function renderRoutes(routes = [], props) {
  return routes.map((route, idx) => {
    if (route.children) return renderRoutes(route.children, props)
    return route.component ? renderRoute(route, idx) : null
  })
}
