import { useMemo } from 'react';

/** Time-of-day greeting, resolved once per mount. */
export const useGreeting = () =>
  useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);
