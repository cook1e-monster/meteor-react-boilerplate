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
  componentDidUpdate(prevProps) {
    if (this.props.redirect !== prevProps.redirect) {
      this.setState({ redirect: this.props.redirect })
    }
  }

  render() {
    const routes = []

    if (this.props.routes) {
      this.props.routes.map(route => {
        if (route.name) routes.push(route)
      })
    }

    return (
      <div className="app">
        {/* navbar */}
        <AppHeader fixed>
          <Header />
        </AppHeader>

        <div className="app-body">
          {/* side bar */}
          <AppSidebar fixed display="lg">
            <AppSidebarNav navConfig={{ items: routes }} {...this.props} />
          </AppSidebar>

          <main className="main">
            <AppBreadcrumb root={'dashboard'} appRoutes={routes} />

            <Container fluid>
              <Switch>{renderRoutes(this.props.routes)}</Switch>
            </Container>
          </main>
        </div>

        {/* Footer */}
        <AppFooter>footer</AppFooter>
        {this.props.redirect ? <Redirect to={'/signIn'} /> : null}
      </div>
    )
  }
}

export default withTracker(props => {
  const handler = Meteor.subscribe('roles')

  let redirect = Meteor.userId() ? false : true

  if (handler.ready()) {
    redirect = !Roles.userIsInRole(Meteor.userId(), Meteor.settings.public.accessRolesToDashboard)
  }

  return { redirect }
})(Dashboard)
