import React from 'react'
import { Switch } from 'react-router-dom'
import { renderRoutes } from '../Utils.js'

// import { landingRoutes } from '../config/routes'

export default function Landing(props) {
  return (
    <div>
      <h2>Landing layout</h2>
      {/*<LoadableComponent />*/}
      {/* loading routes */}
      <Switch>{renderRoutes(props.routes, props)}</Switch>
    </div>
  )
}
