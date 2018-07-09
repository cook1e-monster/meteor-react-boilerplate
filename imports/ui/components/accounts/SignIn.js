//meteor core
import { Meteor } from 'meteor/meteor'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withTracker } from 'meteor/react-meteor-data'

import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react'
import { Link, Redirect } from 'react-router-dom'
import ErrorMessage from './ErrorMessage'

class SignIn extends Component {
  state = {
    email: '',
    password: '',
    fireRedirect: false,
    message: null,
    code: null
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  loginWithPassword = e => {
    e.preventDefault()

    let { email, password } = this.state

    Meteor.loginWithPassword(email, password.trim(), (error, response) => {
      if (error) {
        this.setState({ message: error.reason || error.message, code: error.error })
      } else {
        this.setState({ fireRedirect: true })
      }
    })
  }

  render() {
    const { fireRedirect, email, password, message, code } = this.state

    return (
      <div className="login-form" style={{ backgroundColor: 'white' }}>
        <style>{`
      body > div,
      body > div > div,
      body > div > div > div.login-form {
        height: 100%;
      },
    `}</style>
        <Grid
          textAlign="center"
          style={{ height: '100%' }}
          verticalAlign="middle"
          className="dashboard"
        >
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as="h2" color="teal" textAlign="center">
              Log-in to your account
            </Header>

            {message ? <ErrorMessage code={code} message={message} /> : null}

            <Form size="large" onSubmit={this.loginWithPassword}>
              <Segment stacked>
                <Form.Input
                  fluid
                  icon="user"
                  iconPosition="left"
                  placeholder="E-mail address"
                  value={email}
                  onChange={this.handleChange}
                  name="email"
                />

                <Form.Input
                  fluid
                  icon="lock"
                  iconPosition="left"
                  placeholder="Password"
                  type="password"
                  value={this.state.password}
                  onChange={this.handleChange}
                  name="password"
                />

                <Button color="teal" fluid size="large">
                  Login
                </Button>
              </Segment>
            </Form>
            <Message>
              New to us? <Link to="/signUp">Sign Up</Link>
            </Message>
          </Grid.Column>
        </Grid>

        {fireRedirect && <Redirect to={this.props.path} />}
      </div>
    )
  }
}

SignIn.propTypes = {
  path: PropTypes.string
}
SignIn.defaultProps = {
  path: Meteor.settings.public.signInRedirect || '/dashboard'
}

export default withTracker(props => {
  const handler = Meteor.subscribe('roles')

  const redirect = Meteor.userId() && handler.ready() ? false : true

  return {
    redirect,
    path: Roles.userIsInRole(Meteor.userId(), Meteor.settings.public.accessRolesToDashboard)
      ? '/dashboard'
      : '/'
  }
})(SignIn)
