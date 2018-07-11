import React, { Component } from 'react'
import { Form } from 'semantic-ui-react'
import PropTypes from 'prop-types'

export default class Search extends Component {
  state = { filter: '', value: '', items: [] }

  handleOfChange = (e, { name, value }) => {
    this.setState({ [name]: value })
    this.search()
  }

  search = () => {
    Meteor.setTimeout(() => {
      const search = {}

      if (this.state.filter !== '' && this.state.value !== '')
        search[this.state.filter] = this.state.value
      this.props.getSearch(search)
    }, 1100)
  }

  componentDidMount() {
    const { fields } = this.props
    const items = fields ? fields.map(item => ({ key: item, text: item, value: item })) : []
    this.setState({ items })
  }

  render() {
    const { filter, value, items } = this.state

    return (
      <Form>
        <Form.Group>
          <Form.Dropdown
            width={4}
            options={items}
            placeholder="Select field to search"
            search
            selection
            fluid
            allowAdditions
            name="filter"
            value={filter}
            onChange={this.handleOfChange}
            onAddItem={(event, { name, value }) => {
              event.preventDefault()
              this.setState({
                items: [{ key: value, text: value, value: value }, ...items]
              })
            }}
          />

          <Form.Input width={12} onChange={this.handleOfChange} name="value" value={value} />
        </Form.Group>
      </Form>
    )
  }
}

Search.propTypes = {
  fields: PropTypes.array,
  getSearch: PropTypes.func
}
