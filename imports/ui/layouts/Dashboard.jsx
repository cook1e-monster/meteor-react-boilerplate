import React, { Component } from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import { Container } from 'semantic-ui-react'
import { Switch } from 'react-router-dom'
import { renderRoutes } from '../Utils.js'
import { Redirect } from 'react-router-dom'

// import '@coreui/icons/css/coreui-icons.min.css'
import '../stylesheets/dashboard.css'

import { AppFooter, AppHeader, AppSidebar, AppSidebarNav } from '@coreui/react'
import { Header } from '../components/dashboard/Header'
import AppBreadcrumb from '../components/dashboard/BreadCrumb.jsx'

class Dashboard extends Component {
  state = { items: [], redirect: false }

  componentDidUpdate(prevProps) {
    //get roles
    if (this.props.ready !== prevProps.ready) {
      if (!Roles.userIsInRole(Meteor.userId(), Meteor.settings.public.accessRolesToDashboard)) {
        return this.setState({ redirect: true })
      } else {
        const { routes } = this.props

        const items = []

        if (routes) {
          routes.map(
            route =>
              (route.name || route.title) &&
              Roles.userIsInRole(Meteor.userId(), Meteor.settings.public.accessRolesToDashboard)
                ? items.push(route)
                : null
          )
        }

        if (items.length) this.setState({ items })
      }
    }
  }

  render() {
    const { items, redirect } = this.state

    return (
      <div className="app">
        {/* navbar */}
        <AppHeader fixed>
          <Header />
        </AppHeader>

        <div className="app-body">
          {/* side bar */}
          <AppSidebar fixed display="lg">
            <AppSidebarNav navConfig={{ items }} {...this.props} />
          </AppSidebar>

          <main className="main">
            <AppBreadcrumb root={'dashboard'} appRoutes={this.props.routes} />

            <Container fluid>
              <Switch>{renderRoutes(this.props.routes)}</Switch>
            </Container>
          </main>
        </div>

        {/* Footer */}
        <AppFooter>footer</AppFooter>
        {redirect ? <Redirect to={'/signIn'} /> : null}
      </div>
    )
  }
}
//
export default withTracker(props => {
  const handler = Meteor.subscribe('roles')
  return { ready: handler.ready() }
})(Dashboard)
