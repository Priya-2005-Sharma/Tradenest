import { initials } from '../../utils/format.js';

/**
 * User avatar: the image when there is one, initials otherwise. `onError` lets
 * callers fall back to initials when a supplied URL fails to load, rather than
 * showing a broken image.
 */
export const Avatar = ({ name, src, size = 32, className = '', onError }) => {
  const fontSize = size >= 80 ? '1.75rem' : size >= 36 ? '0.8125rem' : '0.6875rem';

  if (src) {
    return (
      <img
        src={src}
        alt=""
        className={`tn-avatar ${className}`}
        style={{ width: size, height: size }}
        onError={onError}
      />
    );
  }

  return (
    <span className={`tn-avatar ${className}`} style={{ width: size, height: size, fontSize }}>
      {initials(name)}
    </span>
  );
};
