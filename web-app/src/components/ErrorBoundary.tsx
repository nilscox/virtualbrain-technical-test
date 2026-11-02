import { Component, type ReactNode } from 'react';

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

/**
 * Show a fallback instead of a blank page when rendering fails, React logs the error itself
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div role="alert" className="flex h-screen flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="font-display text-xl font-semibold">Something went wrong</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-full bg-dex px-5 py-2 font-semibold text-white hover:bg-dex-deep"
        >
          Reload the page
        </button>
      </div>
    );
  }
}
