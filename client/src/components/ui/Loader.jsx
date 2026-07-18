export const Spinner = ({ size = 'md', className = '' }) => {
  const dimension = size === 'sm' ? '1rem' : size === 'lg' ? '2.5rem' : '1.75rem';
  return (
    <div
      className={`spinner-border text-primary ${className}`}
      style={{ width: dimension, height: dimension, borderWidth: size === 'sm' ? 2 : 3 }}
      role="status"
    >
      <span className="visually-hidden">Loading…</span>
    </div>
  );
};

export const PageLoader = ({ label = 'Loading…' }) => (
  <div className="d-flex flex-column align-items-center justify-content-center gap-3 py-5 my-5">
    <Spinner size="lg" />
    <p className="text-muted small mb-0">{label}</p>
  </div>
);

export const TableSkeleton = ({ rows = 5, columns = 5 }) => (
  <div className="p-3">
    {Array.from({ length: rows }).map((_, rowIndex) => (
      // Skeleton rows are positional placeholders with no identity of their own.
      // eslint-disable-next-line react/no-array-index-key
      <div key={rowIndex} className="d-flex gap-3 mb-3">
        {Array.from({ length: columns }).map((__, colIndex) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={colIndex} className="tn-skeleton flex-fill" style={{ height: 14 }} />
        ))}
      </div>
    ))}
  </div>
);
