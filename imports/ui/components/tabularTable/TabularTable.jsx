import React, { Component } from 'react'
import { Form, Grid, Select } from 'semantic-ui-react'
import Search from './Search.js'
import TabularTableBody from './TabularTableBody.jsx'
import { _ } from 'meteor/underscore'

export default class TabularTable extends Component {
  state = {
    page: 1,
    limit: 25,
    filters: {},
    skip: 0,
    sort: {}
  }

  componentDidMount() {
    const states = {}
    if (this.props.limit) states.limit = 25
    if (this.props.filters) states.filters = this.props.filters
    if (this.props.sort) states.sort = this.props.sort

    this.setState(states)
  }

  componentDidUpdate(prevProps) {
    if (this.props.options !== prevProps.options) {
      this.setState({ filters: this.props.options.filters })
    }
  }

  render() {
    const { collection, subscriptionName } = this.props
    const { options } = this.state

    let fields = []
    if (this.props.fields) fields = fields.concat(this.props.fields)

    if (this.props.columns) {
      this.props.columns.forEach(function(val, key) {
        if (val.data) fields.push(val.data)
      })
    }

    fields = _.unique(fields)

    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={6}>
            <Form size="large">
              <Select
                onChange={(e, data) => {
                  let { value } = data
                  this.setState({ limit: Number(value), page: 1 })
                }}
                placeholder="Show entries"
                options={[
                  { value: 25, text: 25 },
                  { value: 50, text: 50 },
                  { value: 100, text: 100 }
                ]}
              />
            </Form>
          </Grid.Column>
          <Grid.Column width={8} floated="right">
            <Search
              fields={fields}
              getSearch={search => {
                const filters = Object.assign({}, search, this.props.filters)
                this.setState({ filters, page: 1 })
              }}
            />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={16}>
            <TabularTableBody
              query={this.props.query}
              currentPage={this.state.page}
              options={{
                columns: this.props.columns || [],
                fields: fields,
                limit: this.state.limit,
                filters: this.state.filters,
                skip: (this.state.page - 1) * this.state.limit + this.state.skip,
                sort: this.state.sort
              }}
              setFilters={filters => this.setState(filters)}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}
