import { useCallback, useState } from 'react';
import { useToast } from './useToast.js';

/**
 * The request → confirm → run → refresh cycle behind every destructive action.
 *
 * `target` doubles as the open flag for a ConfirmModal and as the row being
 * acted on, so pages no longer track both separately.
 *
 * @param action         (target) => Promise — the call to make on confirm
 * @param successMessage (target) => string
 * @param onDone         called after a successful run, to refresh the list
 */
export const useConfirmAction = ({ action, successMessage, onDone }) => {
  const toast = useToast();
  const [target, setTarget] = useState(null);
  const [busy, setBusy] = useState(false);

  const confirm = useCallback(async () => {
    if (!target) return;
    setBusy(true);
    try {
      await action(target);
      toast.success(typeof successMessage === 'function' ? successMessage(target) : successMessage);
      setTarget(null);
      onDone?.();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusy(false);
    }
  }, [target, action, successMessage, onDone, toast]);

  return {
    target,
    busy,
    request: setTarget,
    cancel: useCallback(() => setTarget(null), []),
    confirm,
  };
};
