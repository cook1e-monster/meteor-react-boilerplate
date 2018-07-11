import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'semantic-ui-react'

export default class Paginator extends React.Component {
  state = { displayedPages: [] }

  componentWillMount() {
    this.setDisplayedPages(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.setDisplayedPages(nextProps)
  }

  getIntArray(min, max) {
    const result = []

    for (; min < max; ++min) result.push(min)
    return result
  }

  setDisplayedPages = props => {
    const { pagination, limit } = props

    const pageCount = pagination.totalPages
    const current = pagination.currentPage
    let min = 0

    let { displayedPages } = this.state

    if (pageCount > limit) {
      if (current > limit / 2) {
        min = current > pageCount - limit / 2 ? pageCount - limit : Math.floor(current - limit / 2)
      }

      displayedPages = this.getIntArray(min + 1, min + 1 + limit)
    } else {
      displayedPages = this.getIntArray(1, pageCount + 1)
    }

    if (displayedPages !== this.state.displayedPages) {
      this.setState({ displayedPages })
    }
  }

  handleClickPage = (event, data) => {
    event.preventDefault()
    const { pagination } = this.props

    if (!pagination || !pagination.totalPages) return

    const { value } = data

    if (value > 0 && value <= pagination.totalPages) this.props.handlePage(value)

    return
  }

  handleClickShowPrevious = event => {
    event.preventDefault()

    const min = Math.max(1, this.state.displayedPages[0] - this.props.limit)
    const displayedPages = this.getIntArray(min, min + this.props.limit)

    if (displayedPages !== this.state.displayedPages) this.setState({ displayedPages })
  }

  handleClickShowNext = event => {
    event.preventDefault()

    const { pagination, limit } = this.props
    if (!pagination || !pagination.totalPages) return

    const pageCount = pagination.totalPages
    const min =
      1 +
      Math.min(pageCount - limit, this.state.displayedPages[this.state.displayedPages.length - 1])
    const displayedPages = this.getIntArray(min, min + this.props.limit)

    if (displayedPages !== this.state.displayedPages) this.setState({ displayedPages })

    return
  }

  renderPage = page => {
    const { pagination } = this.props

    if (!pagination.currentPage) return

    return (
      <Button
        key={page}
        disabled={Number(pagination.currentPage) === page ? true : false}
        value={page}
        onClick={this.handleClickPage}
      >
        {page}
      </Button>
    )
  }

  render() {
    const { pagination, containerClass, limit } = this.props
    const { displayedPages } = this.state

    const divClass = containerClass.length
      ? 'pagination-container ' + containerClass
      : 'pagination-container'

    if (pagination.totalPages <= 1) return <div className={divClass} />

    const currentPage = pagination.currentPage

    return (
      <Button.Group basic>
        <Button
          content="Prev page"
          onClick={this.handleClickPage}
          disabled={currentPage === 1 ? true : false}
          value={currentPage - 1}
        />

        {displayedPages.length && displayedPages[0] > 1 ? this.renderPage(1) : null}

        {displayedPages.length && displayedPages[0] > 2 ? (
          <Button title="Show previous pages" onClick={this.handleClickShowPrevious}>
            ...
          </Button>
        ) : null}

        {displayedPages.map(this.renderPage)}

        {displayedPages.length &&
        displayedPages[displayedPages.length - 1] < pagination.totalPages - 1 ? (
          <Button content="..." title="Show next pages" onClick={this.handleClickShowNext} />
        ) : null}

        {displayedPages.length && displayedPages[displayedPages.length - 1] < pagination.totalPages
          ? this.renderPage(pagination.totalPages)
          : null}

        <Button
          content="Next page"
          disabled={pagination.currentPage === pagination.totalPages ? true : false}
          value={currentPage + 1}
          onClick={this.handleClickPage}
        />
      </Button.Group>
    )
  }
}

Paginator.propTypes = {
  error: PropTypes.any,
  pagination: PropTypes.object,
  pageCount: PropTypes.number,
  limit: PropTypes.number,
  page: PropTypes.number,
  containerClass: PropTypes.string
}

Paginator.defaultProps = {
  containerClass: '',
  limit: 5, //num rows to show
  pagination: { currentPage: 1, totalPages: 1 }
}
