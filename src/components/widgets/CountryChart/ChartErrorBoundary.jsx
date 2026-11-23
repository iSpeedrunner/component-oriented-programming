import { Component } from 'react'

class ChartErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children
    }

    return (
      <div className="country-chart-state">
        <p className="country-chart-error" role="alert">
          This chart could not be displayed. Try switching chart types or reload the page.
        </p>
        <button
          className="country-chart-reload"
          type="button"
          onClick={() => window.location.reload()}
        >
          Reload page
        </button>
      </div>
    )
  }
}

export default ChartErrorBoundary
