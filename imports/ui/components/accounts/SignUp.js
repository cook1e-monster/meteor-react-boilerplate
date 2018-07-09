//meteor core
import { Meteor } from 'meteor/meteor'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { Redirect } from 'react-router'
import ErrorMessage from './ErrorMessage'
import { Accounts } from 'meteor/accounts-base'

export default class SignUp extends Component {
  state = { email: '', password: '', password2: '', fireRedirect: false }

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value })
  }

  signUpWithPassword = e => {
    e.preventDefault()

    let { email, password, password2 } = this.state

    password = password.trim()
    password2 = password2.trim()

    if (password !== password2) {
      this.setState({ message: 'Passwords not match', code: 403 })
    } else {
      Accounts.createUser({ email, password }, (error, response) => {
        if (error) {
          this.setState({ message: error.reason || error.message, code: error.error })
        } else {
          this.setState({ fireRedirect: true })
        }
      })
    }
  }

  render() {
    const { email, password, password2, message, code, fireRedirect } = this.state

    return (
      <div className="login-form" style={{ backgroundColor: 'white' }}>
        <style>{`
      body > div,
      body > div > div,
      body > div > div > div.login-form {
        height: 100%;
      }
    `}</style>
        <Grid
          textAlign="center"
          style={{ height: '100%' }}
          verticalAlign="middle"
          className="dashboard"
        >
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as="h2" color="teal" textAlign="center">
              Register your account
            </Header>

            {message ? <ErrorMessage code={code} message={message} /> : null}

            <Form size="large" onSubmit={this.signUpWithPassword}>
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
                  name="password"
                  value={password}
                  onChange={this.handleChange}
                />

                <Form.Input
                  fluid
                  icon="lock"
                  iconPosition="left"
                  placeholder="Password"
                  type="password"
                  name="password2"
                  value={password2}
                  onChange={this.handleChange}
                />

                <Button color="teal" fluid size="large">
                  Register
                </Button>
              </Segment>
            </Form>
            <Message>
              Do you have account? <Link to="/signIn">Sign In</Link>
            </Message>
          </Grid.Column>
        </Grid>

        {fireRedirect && <Redirect to={this.props.path} />}
      </div>
    )
  }
}

SignUp.propTypes = {
  path: PropTypes.string
}

SignUp.defaultProps = {
  path: Meteor.settings.public.signInRedirect || '/dashboard'
}
