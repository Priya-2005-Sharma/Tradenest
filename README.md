# TradeNest

A full-stack MERN stock trading platform — portfolio tracking, watchlists, order
management and analytics, built with a modern fintech UI.

> **This is a demonstration project.** TradeNest is not a registered broker, holds no
> client funds and executes no real trades. All market data is simulated. Nothing here
> should inform a real investment decision.

---

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Quick start](#quick-start)
- [Configuration](#configuration)
- [Project structure](#project-structure)
- [API reference](#api-reference)
- [Architecture notes](#architecture-notes)
- [Deployment](#deployment)

---

## Features

**Public**
- Landing page with a live (simulated) market ticker, indices and top movers
- About, Products, Pricing and Support pages
- Register / sign in

**Trading**
- **Dashboard** — portfolio value, day and overall P&L, invested capital, growth chart,
  sector allocation, holdings summary, watchlist, top gainers/losers, recent orders,
  market indices and news, in a single aggregated request
- **Holdings** — full CRUD, average cost basis, live valuation and per-holding P&L
- **Watchlist** — add/remove/annotate stocks, live quotes, one-click trading
- **Orders** — market and limit orders; pending, executed, cancelled and rejected states
- **Positions** — open and closed, with live and booked P&L
- **Funds** — deposits, withdrawals, balance, equity and transaction history
- **Stock details** — live quote, your position, and per-symbol order history
- **Profile / Settings** — update details, change password

**Platform**
- JWT auth in HTTP-only cookies, bcrypt-hashed passwords
- Protected routes with session persistence across refreshes
- Per-user data isolation enforced on every query
- Input validation (Zod) and centralised error handling
- Responsive from 375px up, with no horizontal scrolling

---

## Tech stack

| Layer     | Choices                                                          |
| --------- | ---------------------------------------------------------------- |
| Frontend  | React 18, Vite, React Router 6, Bootstrap 5, Chart.js, Axios, Context API |
| Backend   | Node.js, Express 4, MongoDB, Mongoose 8, JWT, bcryptjs, Zod      |
| Security  | helmet, CORS with credentials, express-rate-limit, HTTP-only cookies |

---

## Quick start

**Requirements:** Node.js 18+. No MongoDB installation needed — see below.

```bash
cd tradenest
npm run install:all   # installs root, server and client dependencies
npm run dev           # starts the API (:5000) and the client (:5173)
```

Open <http://localhost:5173> and create an account. Every new account is funded with
₹1,00,000 in virtual capital, so you can trade immediately.

> On first run the server downloads a MongoDB binary (~600 MB) for the in-memory
> database. This happens once and is cached; later starts take about a second.

### Other commands

```bash
npm run dev:server   # API only
npm run dev:client   # client only
npm run build        # production build of the client
npm start            # run the API in production mode
npm run seed         # seed a demo account (needs a persistent MONGO_URI)
```

---

## Configuration

Server config lives in `server/.env` (see `server/.env.example`).

| Variable        | Default                 | Notes                                              |
| --------------- | ----------------------- | -------------------------------------------------- |
| `PORT`          | `5000`                  | API port                                            |
| `MONGO_URI`     | *(empty)*               | **Empty starts an in-memory MongoDB.** See below.   |
| `JWT_SECRET`    | dev value               | **Must be replaced in production.**                 |
| `JWT_EXPIRES_IN`| `7d`                    | Token lifetime                                      |
| `CLIENT_ORIGIN` | `http://localhost:5173` | Comma-separated allowed origins                     |
| `COOKIE_NAME`   | `tradenest_token`       | Auth cookie name                                    |

### Database

`MONGO_URI` empty is a deliberate zero-setup mode: the server boots an in-memory
MongoDB so the app runs with no external dependency. **Data is discarded when the
process exits.**

For persistence, point it at a real database — no code changes required:

```bash
# Local
MONGO_URI=mongodb://127.0.0.1:27017/tradenest

# Atlas
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/tradenest
```

With a persistent `MONGO_URI` set, `npm run seed` creates a demo account
(`demo@tradenest.app` / `Demo12345`) preloaded with holdings, orders and positions.

Generate a real secret for any deployment:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

---

## Project structure

```
tradenest/
├── server/
│   └── src/
│       ├── config/        # env parsing, database connection
│       ├── controllers/   # request handlers (thin)
│       ├── data/          # instrument master, news fixtures
│       ├── middleware/    # auth, validation, error handling
│       ├── models/        # Mongoose schemas
│       ├── routes/        # RESTful route definitions
│       ├── services/      # business logic (trading, portfolio, market, token)
│       ├── utils/         # ApiError, asyncHandler, logger, seed
│       ├── validators/    # Zod schemas
│       ├── app.js         # express app assembly
│       └── server.js      # bootstrap + graceful shutdown
└── client/
    └── src/
        ├── assets/styles/ # theme.css — the design system
        ├── components/    # see "Component architecture" below
        ├── context/       # AuthContext, ToastContext
        ├── data/          # navigation and marketing content
        ├── hooks/         # useAuth, useApi, useToast, useFormErrors, useConfirmAction, …
        ├── layouts/       # Public, Auth, Dashboard shells
        ├── pages/         # public/, auth/, app/ — composition only
        ├── routes/        # route table + guards
        ├── services/      # axios client and API wrappers
        └── utils/         # formatting, validation helpers
```

### Component architecture

Components are grouped by **what they know about**, in three layers. Anything shared
moves down a layer; nothing ever imports upward.

```
components/
├── ui/          Generic primitives — know nothing about trading.
│                Card, Modal, DataTable, FormField, StatCard, StatGrid,
│                RowActions, Avatar, QueryBoundary, EmptyState, ErrorState…
│
├── trading/     Domain vocabulary reused across features.
├── charts/      PnL, ChangePill, QuoteRow, InstrumentCell, StockSearch,
├── layout/      OrderTicket, StatusBadge · Portfolio/Allocation/ProfitTrend
│                charts · Sidebar, Topbar, Footer, NotificationBell
│
└── <feature>/   Owned by one page: dashboard, portfolio, holdings, orders,
                 positions, watchlist, funds, stock, auth, settings, profile,
                 marketing
```

Two conventions do most of the work:

- **Feature modals own their own behaviour.** `HoldingFormModal` holds its form state,
  validation, API call and toasts. The page decides only *when* it is open and what to
  refresh afterwards — so no page carries form state it does not read.
- **Table columns are factories, not constants.** `createHoldingColumns({ onEdit, onDelete })`
  returns the column array, closing over the page's handlers. Column markup lives with its
  feature; the page keeps the orchestration.

Pages are therefore thin: data fetching, a little state, and composition. Every page is
under 150 lines.

Cross-cutting behaviour lives in hooks rather than being copied:

| Hook | Removes |
| ---- | ------- |
| `useApi` | fetch/loading/error/reload, with stale-response guarding |
| `useFormErrors` | mapping the API's `details[]` onto the right inputs (was duplicated in 9 files) |
| `useConfirmAction` | the request → confirm → run → refresh cycle behind every delete |
| `QueryBoundary` | the loading/error gate repeated on every data-backed page |

---

## API reference

All routes are prefixed with `/api`. Authenticated routes read the JWT from an
HTTP-only cookie (an `Authorization: Bearer` header also works).

| Method | Endpoint | Auth | Purpose |
| ------ | -------- | :--: | ------- |
| `GET` | `/health` | — | Liveness probe |
| `POST` | `/auth/register` | — | Create an account (funded with ₹1,00,000) |
| `POST` | `/auth/login` | — | Sign in, sets the auth cookie |
| `POST` | `/auth/logout` | — | Clear the auth cookie |
| `GET` | `/auth/me` | ✓ | Current user (used to restore sessions) |
| `GET` | `/profile` | ✓ | Get profile |
| `PUT` | `/profile` | ✓ | Update name / email / phone / avatar |
| `PUT` | `/profile/password` | ✓ | Change password (ends the session) |
| `GET` | `/dashboard` | ✓ | Aggregated dashboard payload |
| `GET` | `/dashboard/portfolio` | ✓ | Summary, allocation, growth, holdings |
| `GET` `POST` | `/holdings` | ✓ | List / create |
| `PUT` `DELETE` | `/holdings/:id` | ✓ | Update / delete |
| `GET` `POST` | `/watchlist` | ✓ | List / add |
| `PUT` `DELETE` | `/watchlist/:id` | ✓ | Update / remove |
| `GET` `POST` | `/orders` | ✓ | List (filter by `status`, `symbol`, `limit`) / place |
| `GET` `PUT` `DELETE` | `/orders/:id` | ✓ | Get / modify pending / cancel |
| `GET` `POST` | `/positions` | ✓ | List (open + closed) / open |
| `PUT` `DELETE` | `/positions/:id` | ✓ | Update or close / delete |
| `GET` | `/funds` | ✓ | Balance, equity, transactions |
| `POST` | `/funds/deposit` | ✓ | Add funds |
| `POST` | `/funds/withdraw` | ✓ | Withdraw funds |
| `GET` | `/notifications` | ✓ | List with unread count |
| `PUT` | `/notifications/:id/read` | ✓ | Mark one read |
| `PUT` | `/notifications/read-all` | ✓ | Mark all read |
| `DELETE` | `/notifications/:id` | ✓ | Delete |
| `GET` | `/market/instruments` | — | List/search instruments (`?q=`) |
| `GET` | `/market/quote/:symbol` | — | Single quote |
| `GET` | `/market/overview` | — | Indices, movers and news |
| `GET` | `/market/movers` | — | Top gainers and losers |
| `GET` | `/market/news` | — | Market headlines |

**Response envelope**

```jsonc
// success
{ "success": true, "message": "Order executed", "data": { "order": { } } }

// failure
{ "success": false, "message": "Validation failed",
  "details": [{ "field": "quantity", "message": "Quantity must be at least 1" }] }
```

---

## Architecture notes

**Orders are the source of truth for cash.** Placing a market order settles it
immediately: funds are debited, and the holding is created or its average cost
recalculated. Selling credits funds and reduces (or removes) the holding. Validation
runs before any write, so a rejected order never leaves partial state. Rejected orders
are kept with their reason rather than discarded, so the order book stays honest.

**Executed orders are immutable.** They have already moved cash and stock, so editing
or deleting them would desync the portfolio. Only pending orders can be modified or
cancelled.

**The market feed is deterministic, not random.** Quotes derive from a hash of the
symbol plus a 15-second time bucket, so prices move together and stay stable within a
tick instead of jittering on every request. Replacing `market.service.js` with a real
broker feed leaves every caller unchanged.

**The portfolio growth series is reconstructed from holdings**, not from order history —
holdings are the source of truth for invested capital whether they arrived via an order
or were entered by hand. Each holding's return is eased in from its purchase date to
today, so the final point equals the real current value.

**Auth lives in an HTTP-only cookie**, which page scripts cannot read, so an XSS bug
cannot become account takeover. The client cannot inspect the token, so sessions are
restored by asking `/auth/me` on mount.

**Every query is scoped to `req.user._id`.** A user requesting another user's record by
id gets a 404, never their data.

---

## Deployment

1. Set a strong `JWT_SECRET` and a persistent `MONGO_URI`.
2. Set `NODE_ENV=production` — this enables `secure` + `SameSite=None` cookies (so the
   API must be served over HTTPS) and tightens rate limits.
3. Set `CLIENT_ORIGIN` to your deployed frontend origin(s).
4. Build the client (`npm run build`) and serve `client/dist` as static files.
5. Run the API with `npm start`.

If the client and API are on different domains, HTTPS is required for cookies to be
sent cross-origin. Serving both from one origin (or putting the API behind a `/api`
rewrite) avoids that entirely.
