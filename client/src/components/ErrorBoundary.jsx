import { Component } from 'react';

/**
 * Last line of defence: a render error anywhere below shows a recovery screen
 * instead of a blank page.
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Swap for a real reporter (Sentry et al.) in production.
    console.error('Unhandled UI error:', error, info);
  }

  render() {
    const { error } = this.state;
    const { children } = this.props;

    if (!error) return children;

    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center p-4">
        <div className="tn-card text-center p-4 p-sm-5" style={{ maxWidth: 460 }}>
          <div className="tn-empty-icon mb-3" style={{ background: 'var(--tn-loss-light)', color: 'var(--tn-loss)' }}>
            <i className="fa-solid fa-triangle-exclamation" aria-hidden="true" />
          </div>
          <h1 className="h5 mb-2">This page ran into a problem</h1>
          <p className="text-muted small mb-4">
            Something unexpected broke while rendering. Reloading usually clears it.
          </p>
          <div className="d-flex gap-2 justify-content-center">
            <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>
              Reload page
            </button>
            <a href="/" className="btn btn-light">Go home</a>
          </div>
        </div>
      </div>
    );
  }
}
