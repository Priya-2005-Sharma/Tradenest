import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Runs an async fetcher on mount and exposes { data, loading, error, reload }.
 *
 * The fetcher must be stable (useCallback) — it is the effect's dependency.
 * Results from a superseded call are discarded so a slow earlier request can
 * never overwrite a newer one.
 */
export const useApi = (fetcher, { immediate = true } = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const mountedRef = useRef(true);
  const callIdRef = useRef(0);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const run = useCallback(async () => {
    callIdRef.current += 1;
    const callId = callIdRef.current;

    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      if (mountedRef.current && callId === callIdRef.current) setData(result);
      return result;
    } catch (err) {
      if (mountedRef.current && callId === callIdRef.current) setError(err);
      return undefined;
    } finally {
      if (mountedRef.current && callId === callIdRef.current) setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    if (immediate) run();
  }, [immediate, run]);

  return { data, setData, loading, error, reload: run };
};
