import { Children } from 'react';

/**
 * Lays out headline metrics: two per row on mobile, four on desktop.
 * Each child is wrapped in its own column, so callers compose stat cards
 * without repeating grid classes on every page.
 */
export const StatGrid = ({ children, className = 'mb-3' }) => (
  <div className={`row g-3 ${className}`}>
    {Children.map(children, (child) =>
      child ? <div className="col-6 col-lg-3">{child}</div> : null,
    )}
  </div>
);
