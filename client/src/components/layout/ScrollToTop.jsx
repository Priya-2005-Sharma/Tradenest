import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Client-side navigation keeps scroll position; pages should start at the top. */
export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
};
