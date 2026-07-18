/**
 * Placeholder market headlines. Timestamps are generated relative to the
 * request so the feed always reads as current. Replace getMarketNews with a
 * real news API call and the shape stays the same for the UI.
 */
const HEADLINES = [
  {
    id: 'n1',
    title: 'Nifty 50 closes higher for a third straight session on IT strength',
    source: 'Market Wire',
    category: 'Markets',
    minutesAgo: 24,
  },
  {
    id: 'n2',
    title: 'RBI holds repo rate steady, signals a data-dependent stance ahead',
    source: 'Economic Desk',
    category: 'Economy',
    minutesAgo: 68,
  },
  {
    id: 'n3',
    title: 'Reliance announces expansion of its renewables capacity by 2027',
    source: 'Business Standard Desk',
    category: 'Corporate',
    minutesAgo: 112,
  },
  {
    id: 'n4',
    title: 'IT majors rally as global tech spending forecasts get an upgrade',
    source: 'Tech Tracker',
    category: 'Sectors',
    minutesAgo: 155,
  },
  {
    id: 'n5',
    title: 'Foreign investors turn net buyers in Indian equities this month',
    source: 'Flows Monitor',
    category: 'Markets',
    minutesAgo: 190,
  },
  {
    id: 'n6',
    title: 'Auto sales data beats estimates on strong festive-season demand',
    source: 'Auto Beat',
    category: 'Sectors',
    minutesAgo: 240,
  },
  {
    id: 'n7',
    title: 'Banking stocks consolidate as credit growth moderates quarter on quarter',
    source: 'Finance Daily',
    category: 'Sectors',
    minutesAgo: 305,
  },
  {
    id: 'n8',
    title: 'Crude oil eases below key levels, offering relief to oil marketing firms',
    source: 'Commodity Desk',
    category: 'Commodities',
    minutesAgo: 372,
  },
  {
    id: 'n9',
    title: 'Pharma exporters gain on favourable regulatory clearances overseas',
    source: 'Pharma Watch',
    category: 'Sectors',
    minutesAgo: 428,
  },
  {
    id: 'n10',
    title: 'Rupee steadies against the dollar ahead of key inflation data',
    source: 'Currency Desk',
    category: 'Economy',
    minutesAgo: 496,
  },
  {
    id: 'n11',
    title: 'Metal stocks in focus as global demand indicators improve',
    source: 'Commodity Desk',
    category: 'Sectors',
    minutesAgo: 540,
  },
  {
    id: 'n12',
    title: 'Midcap index outperforms benchmarks on sustained retail participation',
    source: 'Market Wire',
    category: 'Markets',
    minutesAgo: 610,
  },
];

export const getMarketNews = (limit = 6) =>
  HEADLINES.slice(0, limit).map(({ minutesAgo, ...item }) => ({
    ...item,
    publishedAt: new Date(Date.now() - minutesAgo * 60_000).toISOString(),
  }));
