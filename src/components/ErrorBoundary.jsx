import React from 'react';

/**
 * Global ErrorBoundary component that catches unhandled JavaScript errors
 * in child component trees and renders a user-friendly fallback UI.
 * Prevents the entire application from crashing due to isolated errors.
 *
 * @class ErrorBoundary
 * @extends React.Component
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', minHeight: '300px', padding: '2rem',
          textAlign: 'center', color: '#94a3b8'
        }}>
          <h2 style={{ color: '#f87171', marginBottom: '1rem' }}>Something went wrong</h2>
          <p>We encountered an unexpected error. Please try refreshing the page.</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '1rem', padding: '0.75rem 1.5rem',
              background: 'var(--primary-accent, #3b82f6)', color: 'white',
              border: 'none', borderRadius: '8px', cursor: 'pointer',
              fontSize: '1rem'
            }}
            aria-label="Reload page"
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
