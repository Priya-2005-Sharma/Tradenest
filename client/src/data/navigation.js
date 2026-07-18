export const DASHBOARD_NAV = [
  {
    section: 'Overview',
    links: [
      { to: '/dashboard', label: 'Dashboard', icon: 'fa-gauge-high', end: true },
      { to: '/portfolio', label: 'Portfolio', icon: 'fa-chart-pie' },
    ],
  },
  {
    section: 'Trade',
    links: [
      { to: '/watchlist', label: 'Watchlist', icon: 'fa-star' },
      { to: '/orders', label: 'Orders', icon: 'fa-receipt' },
      { to: '/positions', label: 'Positions', icon: 'fa-layer-group' },
      { to: '/holdings', label: 'Holdings', icon: 'fa-briefcase' },
    ],
  },
  {
    section: 'Account',
    links: [
      { to: '/funds', label: 'Funds', icon: 'fa-wallet' },
      { to: '/profile', label: 'Profile', icon: 'fa-user' },
      { to: '/settings', label: 'Settings', icon: 'fa-gear' },
    ],
  },
];

export const PUBLIC_NAV = [
  { to: '/about', label: 'About' },
  { to: '/products', label: 'Products' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/support', label: 'Support' },
];

export const FOOTER_NAV = [
  {
    title: 'Company',
    links: [
      { to: '/about', label: 'About' },
      { to: '/products', label: 'Products' },
      { to: '/pricing', label: 'Pricing' },
      { to: '/support', label: 'Support' },
    ],
  },
  {
    title: 'Platform',
    links: [
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/watchlist', label: 'Watchlist' },
      { to: '/holdings', label: 'Holdings' },
      { to: '/orders', label: 'Orders' },
    ],
  },
  {
    title: 'Account',
    links: [
      { to: '/login', label: 'Sign in' },
      { to: '/register', label: 'Open an account' },
      { to: '/profile', label: 'Profile' },
      { to: '/funds', label: 'Funds' },
    ],
  },
];
