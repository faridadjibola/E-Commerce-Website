import { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

type Props = { children: ReactNode }
type State = { hasError: boolean }

export default class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Application render error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="container mx-auto flex min-h-[65vh] max-w-2xl items-center justify-center px-4 py-16">
          <section role="alert" className="w-full rounded-2xl border border-red-200 bg-red-50 p-6 text-center shadow-sm sm:p-8">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-700">
              <AlertTriangle className="h-6 w-6" aria-hidden="true" />
            </span>
            <h1 className="mt-4 text-2xl font-semibold text-gray-950">We couldn’t load this page</h1>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-700">
              Something went wrong while rendering the storefront. Please try again or restart the page.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Try again
            </button>
          </section>
        </main>
      )
    }

    return this.props.children
  }
}
