import { Card } from './Card.jsx';
import { ErrorState } from './ErrorState.jsx';

/**
 * The loading/error gate every data-backed page repeats. Children render only
 * once a request has succeeded.
 *
 * `errorTitle` may be a function of the error, so a page can distinguish a
 * missing record from a failed request. `errorAction` adds a way out beside the
 * retry — pages that can land on a dead URL need one.
 *
 * `skeleton` lets a page keep its own layout-aware placeholder; without one the
 * children render immediately and are expected to handle their own `loading`.
 */
export const QueryBoundary = ({
  loading,
  error,
  onRetry,
  errorTitle,
  errorAction,
  skeleton,
  children,
}) => {
  if (error) {
    return (
      <Card>
        <ErrorState
          error={error}
          onRetry={onRetry}
          title={typeof errorTitle === 'function' ? errorTitle(error) : errorTitle}
        />
        {errorAction && <div className="text-center pb-4">{errorAction}</div>}
      </Card>
    );
  }

  if (loading && skeleton) return skeleton;

  return children;
};
