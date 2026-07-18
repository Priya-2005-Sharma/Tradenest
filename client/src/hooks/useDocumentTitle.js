import { useEffect } from 'react';

export const useDocumentTitle = (title) => {
  useEffect(() => {
    document.title = title ? `${title} · TradeNest` : 'TradeNest — Invest with clarity';
  }, [title]);
};
