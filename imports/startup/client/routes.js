import React from 'react'
import Loadable from 'react-loadable'
import { Loading } from '../../ui/components/Loading'

import Dashboard from './routesDashboard'
import Landing from './routesLanding'

/* https://github.com/coreui/coreui-react/blob/master/src/SidebarNav.md */

const routes = [
  {
    url: '/signIn',
    exact: true,
    component: Loadable({
      loading: Loading,
      loader: () => import('../../ui/components/accounts/SignIn')
    })
  },
  {
    url: '/signUp',
    exact: true,
    component: Loadable({
      loading: Loading,
      loader: () => import('../../ui/components/accounts/SignUp')
    })
  }
]

routes.push(Dashboard.routes, Landing.routes, {
  url: '*',
  name: 404,
  component: Loadable({
    loading: Loading,
    loader: () => import('../../ui/pages/NotFound')
  })
})

exports.routes = routes
