import React from 'react'
import Loadable from 'react-loadable'

import { Loading } from '../../ui/components/Loading'

export const routes = {
  url: '/dashboard',
  exact: true,
  component: Loadable({
    loading: Loading,
    loader: () => import('../../ui/layouts/Dashboard')
  }),
  routes: [
    {
      url: '/dashboard',
      name: 'Dashboard',
      exact: true,
      title: true,
      component: () => <div>dashboard</div>
    },
    {
      name: 'test 3',
      children: [
        {
          name: 'test 2',
          url: '/dashboard/test2',
          exact: true,
          component: () => {
            return <div>test2</div>
          }
        }
      ]
    },
    {
      name: 'Admin',
      title: true,
      roles: ['admin']
    },
    {
      name: 'jobs',
      url: '/dashboard/admin/jobs',
      exact: true,
      component: Loadable({
        loading: Loading,
        loader: () => import('../../ui/components/jobs/TabularTableJobs')
      }),
      roles: ['admin']
    },
    {
      url: '/500',
      exact: true,
      component: () => <div>500</div>
    },
    {
      url: '*',
      component: Loadable({
        loading: Loading,
        loader: () => import('../../ui/pages/NotFound')
      })
    }
  ]
}
