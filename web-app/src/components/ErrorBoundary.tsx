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
      <div
        role="alert"
        className="flex h-screen flex-col items-center justify-center gap-4 bg-amber-50 text-center dark:bg-slate-800"
      >
        <p className="text-lg">Something went wrong.</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-2xl bg-amber-300 px-4 py-2 font-bold text-black shadow-md outline-orange-400 hover:bg-amber-400 focus-visible:outline-dashed"
        >
          Reload the page
        </button>
      </div>
    );
  }
}
