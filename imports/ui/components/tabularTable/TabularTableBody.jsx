import React from 'react'
import { _ } from 'meteor/underscore'
import { withTracker } from 'meteor/react-meteor-data'
import { Table, Dimmer, Loader, Grid, Segment } from 'semantic-ui-react'
import Paginator from './Paginator'

function TabularTableBody(props) {
  function __renderColumn(val, item, doc) {
    if (item.render && typeof item.render === 'function') return item.render(val, item, doc)
    if (typeof val === 'boolean') return val.toString()

    return val
  }

  function handlePage(value) {
    props.setFilters({ page: value })
  }

  return (
    <Table celled selectable>
      {/******************************
                Header
      ******************************/}

      <Table.Header>
        <Table.Row>
          {props.options.columns.map((column, key) => {
            return (
              <Table.HeaderCell key={key} className="pointer">
                {column.title || columns.data || null}
              </Table.HeaderCell>
            )
          })}
        </Table.Row>
      </Table.Header>

      {/******************************
                  Body
      ******************************/}

      <Table.Body>
        {props.loading ? (
          <Table.Row>
            <Table.Cell colSpan={props.options.columns.length}>
              <Dimmer active inverted>
                <Loader />
              </Dimmer>
            </Table.Cell>
          </Table.Row>
        ) : props.docs.length === 0 ? (
          <Table.Row>
            <Table.Cell colSpan={props.options.columns.length}>
              <p style={{ textAlign: 'center' }}>Table is Empty</p>
            </Table.Cell>
          </Table.Row>
        ) : (
          props.docs.map((doc, key) => {
            return (
              <Table.Row key={key}>
                {props.options.columns.map((column, key) => {
                  return (
                    <Table.Cell key={key}>
                      {__renderColumn(doc[column.data], column, doc)}
                    </Table.Cell>
                  )
                })}
              </Table.Row>
            )
          })
        )}
      </Table.Body>

      {/******************************
                  Footer
      ******************************/}
      <Table.Footer>
        <Table.Row>
          <Table.HeaderCell colSpan={props.options.columns.length}>
            <p>
              <i>Total documents {props.count}</i>
            </p>
            {props.count > 0 && props.pagination.totalPages > 1 ? (
              <Paginator pagination={props.pagination} handlePage={handlePage} />
            ) : null}
          </Table.HeaderCell>
        </Table.Row>
      </Table.Footer>
    </Table>
  )
}

export default withTracker(function({ query, currentPage = 1, options = {} }) {
  const perPage = options.limit || 25

  const q = query.clone({
    query: options.filters,
    limit: perPage,
    skip: (currentPage - 1) * perPage
  })

  const handleQuery = q.subscribe()
  const handleCount = query.subscribeCount()

  if (handleQuery.ready() && handleCount.ready()) {
    const count = query.getCount()
    const totalPages = Math.ceil(count / options.limit || 1)
    if (currentPage > 1 && count <= options.limit * currentPage) currentPage = totalPages

    return {
      loading: false,
      pagination: { totalPages, currentPage, limit: options.limit },
      count,
      docs: q.fetch()
    }
  }

  return { loading: true }
})(TabularTableBody)
