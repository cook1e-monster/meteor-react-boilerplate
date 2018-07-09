import React from 'react'
import { Nav } from 'reactstrap'
import PropTypes from 'prop-types'

import { AppNavbarBrand, AppSidebarToggler } from '@coreui/react'

const propTypes = {
  children: PropTypes.node
}

const defaultProps = {}

export function Header(props) {
  return (
    <React.Fragment>
      <AppSidebarToggler className="d-lg-none" display="md" mobile />

      <AppNavbarBrand
        full={{ src: '/img/logo.svg', width: 89, height: 25, alt: 'CoreUI Logo' }}
        minimized={{ src: '/img/sygnet.svg', width: 30, height: 30, alt: 'CoreUI Logo' }}
      />
      <AppSidebarToggler className="d-md-down-none" display="lg" />
      <Nav className="ml-auto" navbar />
    </React.Fragment>
  )
}

Header.propTypes = propTypes
Header.defaultProps = defaultProps
