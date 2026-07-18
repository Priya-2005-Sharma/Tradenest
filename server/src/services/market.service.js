import { NIFTY50 } from '../data/instruments.js';

/**
 * Deterministic pseudo-random generator. Quotes derive from the symbol plus a
 * slowly-advancing time bucket, so prices look alive and move together across
 * requests instead of jittering on every call. Swapping in a real feed means
 * reimplementing getQuote/getQuotes against a broker API — callers stay put.
 */
const hash = (str) => {
  let h = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
};

const TICK_MS = 15_000;

const driftFor = (symbol, bucket) => {
  const seed = hash(`${symbol}:${bucket}`);
  // Map the hash into a percentage drift roughly within [-3%, +3%].
  return ((seed % 6001) / 100_000) - 0.03;
};

export const getQuote = (symbol) => {
  const instrument = NIFTY50.find((i) => i.symbol === symbol.toUpperCase());
  if (!instrument) return null;

  const bucket = Math.floor(Date.now() / TICK_MS);
  const drift = driftFor(instrument.symbol, bucket);
  const lastPrice = Number((instrument.basePrice * (1 + drift)).toFixed(2));
  const change = Number((lastPrice - instrument.basePrice).toFixed(2));

  return {
    symbol: instrument.symbol,
    stockName: instrument.name,
    sector: instrument.sector,
    exchange: instrument.exchange,
    previousClose: instrument.basePrice,
    lastPrice,
    change,
    changePercent: Number(((change / instrument.basePrice) * 100).toFixed(2)),
    dayHigh: Number((lastPrice * 1.012).toFixed(2)),
    dayLow: Number((lastPrice * 0.988).toFixed(2)),
  };
};

export const getQuotes = (symbols) =>
  symbols.map((s) => getQuote(s)).filter(Boolean);

export const getAllQuotes = () => NIFTY50.map((i) => getQuote(i.symbol));

export const searchInstruments = (query, limit = 12) => {
  const q = (query || '').trim().toUpperCase();
  const pool = q
    ? NIFTY50.filter(
        (i) => i.symbol.includes(q) || i.name.toUpperCase().includes(q),
      )
    : NIFTY50;
  return pool.slice(0, limit).map((i) => getQuote(i.symbol));
};

export const getMarketMovers = (count = 5) => {
  const quotes = getAllQuotes().sort((a, b) => b.changePercent - a.changePercent);
  return {
    gainers: quotes.slice(0, count),
    losers: quotes.slice(-count).reverse(),
  };
};

export const getIndices = () => {
  const bucket = Math.floor(Date.now() / TICK_MS);
  return [
    { name: 'NIFTY 50', base: 23_450.15 },
    { name: 'SENSEX', base: 77_210.4 },
    { name: 'BANK NIFTY', base: 50_120.85 },
    { name: 'NIFTY IT', base: 37_640.3 },
  ].map((index) => {
    const drift = driftFor(index.name, bucket) / 3;
    const value = Number((index.base * (1 + drift)).toFixed(2));
    const change = Number((value - index.base).toFixed(2));
    return {
      name: index.name,
      value,
      change,
      changePercent: Number(((change / index.base) * 100).toFixed(2)),
    };
  });
};
