import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // You could send this to a logging service here
    this.setState({ error, info });
    // eslint-disable-next-line no-console
    console.error('Unhandled render error:', error, info);
  }

  handleReload = () => {
    // Simple recovery: reload the page
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
          <div className="max-w-lg w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
            <h2 className="text-xl font-semibold mb-2 text-red-600">Something went wrong</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">An unexpected error occurred while rendering the app. You can reload the page to try again.</p>
            <div className="flex justify-center gap-3">
              <button onClick={this.handleReload} className="px-4 py-2 bg-indigo-600 text-white rounded">Reload</button>
              <button onClick={() => this.setState({ hasError: false, error: null, info: null })} className="px-4 py-2 border rounded">Dismiss</button>
            </div>
            <details className="text-left mt-4 text-xs text-gray-500">
              <summary>Technical details</summary>
              <pre className="whitespace-pre-wrap max-h-48 overflow-auto text-xs mt-2">{String(this.state.error)}{this.state.info ? '\n' + String(this.state.info.componentStack) : ''}</pre>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
