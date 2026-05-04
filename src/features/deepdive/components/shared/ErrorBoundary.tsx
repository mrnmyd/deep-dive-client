import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'

type Props = {
  children: ReactNode
  fallback?: (props: { error: Error; reset: () => void }) => ReactNode
}

type State = { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (typeof window !== 'undefined') {
      console.error('DeepDive error:', error, info)
    }
  }

  reset = () => this.setState({ error: null })

  render() {
    if (this.state.error) {
      if (this.props.fallback)
        return this.props.fallback({ error: this.state.error, reset: this.reset })
      return (
        <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-3 p-6 text-center">
          <h2 className="text-lg font-semibold">Something went wrong</h2>
          <p className="text-sm text-muted-foreground">{this.state.error.message}</p>
          <div className="flex gap-2">
            <Button onClick={() => window.location.reload()}>Reload page</Button>
            <Button variant="outline" onClick={this.reset}>
              Dismiss
            </Button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
