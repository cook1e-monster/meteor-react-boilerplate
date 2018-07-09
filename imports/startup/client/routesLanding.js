import React from 'react'
import Loadable from 'react-loadable'
import { Loading } from '../../ui/components/Loading'

export const routes = {
  url: '/',
  component: Loadable({
    loading: Loading,
    loader: () => import('../../ui/layouts/Landing')
  }),
  routes: [
    {
      exact: true,
      url: '/',
      component: Loadable({
        loading: Loading,
        loader: () => import('../../ui/components/hello/Hello')
      })
    },
    {
      url: '*',
      name: 404,
      component: Loadable({
        loading: Loading,
        loader: () => import('../../ui/pages/NotFound')
      })
    }
  ]
}
