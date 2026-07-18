const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const inrCompact = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  notation: 'compact',
  maximumFractionDigits: 2,
});

const number = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 });

export const formatCurrency = (value, { compact = false } = {}) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return '—';
  return compact ? inrCompact.format(n) : inr.format(n);
};

/** Signed currency — used wherever a value represents a gain or a loss. */
export const formatSignedCurrency = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return '—';
  return `${n >= 0 ? '+' : '−'}${inr.format(Math.abs(n))}`;
};

export const formatNumber = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? number.format(n) : '—';
};

export const formatPercent = (value, { signed = true } = {}) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return '—';
  const sign = signed && n > 0 ? '+' : signed && n < 0 ? '−' : '';
  return `${sign}${Math.abs(n).toFixed(2)}%`;
};

export const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';

export const formatDateTime = (value) =>
  value
    ? new Date(value).toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—';

export const formatRelativeTime = (value) => {
  if (!value) return '—';
  const diffMs = Date.now() - new Date(value).getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(value);
};

/** Maps a P&L number to the matching semantic class. */
export const pnlClass = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n) || n === 0) return 'tn-neutral';
  return n > 0 ? 'tn-profit' : 'tn-loss';
};

export const pnlPillClass = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n) || n === 0) return 'tn-pill tn-pill-neutral';
  return n > 0 ? 'tn-pill tn-pill-profit' : 'tn-pill tn-pill-loss';
};

export const initials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || '?';
