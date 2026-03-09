import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h2 className="text-lg font-semibold">Something went wrong</h2>
            <p className="mt-2 text-sm text-neutral-500">Try refreshing the page.</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-[#6f9ca2] px-4 py-2 text-sm text-white transition-colors hover:bg-[#5f8c93]"
            >
              Reload page
            </button>
          </div>
        )
      )
    }

    return this.props.children
  }
}
