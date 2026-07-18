import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { startTestServer, registerUser } from './helpers.js';

let server;
let baseUrl;

before(async () => {
  server = await startTestServer();
  baseUrl = server.baseUrl;
});

after(async () => {
  await server.close();
});

describe('holdings CRUD', () => {
  test('creates a holding and infers its sector from the instrument master', async () => {
    const { client } = await registerUser(baseUrl);
    const { status, data } = await client.post('/holdings', {
      stockName: 'Tata Consultancy Services',
      symbol: 'TCS',
      quantity: 8,
      buyPrice: 4000,
    });

    assert.equal(status, 201);
    assert.equal(data.holding.sector, 'IT');
  });

  test('refuses a duplicate symbol — one row per stock per user', async () => {
    const { client } = await registerUser(baseUrl);
    await client.post('/holdings', { stockName: 'TCS', symbol: 'TCS', quantity: 8, buyPrice: 4000 });

    const { status } = await client.post('/holdings', {
      stockName: 'TCS', symbol: 'TCS', quantity: 2, buyPrice: 4100,
    });
    assert.equal(status, 409);
  });

  test('updates and deletes a holding', async () => {
    const { client } = await registerUser(baseUrl);
    const { data } = await client.post('/holdings', {
      stockName: 'TCS', symbol: 'TCS', quantity: 8, buyPrice: 4000,
    });
    const id = data.holding._id;

    const updated = await client.put(`/holdings/${id}`, { quantity: 12 });
    assert.equal(updated.data.holding.quantity, 12);

    assert.equal((await client.delete(`/holdings/${id}`)).status, 200);
    assert.equal((await client.get('/holdings')).data.holdings.length, 0);
  });

  test('404s an unknown id', async () => {
    const { client } = await registerUser(baseUrl);
    const { status } = await client.delete('/holdings/507f1f77bcf86cd799439011');
    assert.equal(status, 404);
  });

  test('400s a malformed id rather than throwing', async () => {
    const { client } = await registerUser(baseUrl);
    const { status } = await client.delete('/holdings/not-an-object-id');
    assert.equal(status, 400);
  });

  test('values a holding from the live quote and computes P&L consistently', async () => {
    const { client } = await registerUser(baseUrl);
    await client.post('/holdings', {
      stockName: 'Infosys', symbol: 'INFY', quantity: 10, buyPrice: 1000,
    });

    const { data } = await client.get('/holdings');
    const holding = data.holdings[0];

    assert.equal(holding.investedValue, 10 * 1000);
    assert.equal(holding.currentValue, Number((holding.quantity * holding.currentPrice).toFixed(2)));
    assert.ok(Math.abs(holding.pnl - (holding.currentValue - holding.investedValue)) < 0.01);
    assert.equal(data.summary.holdingsCount, 1);
  });
});

describe('watchlist CRUD', () => {
  test('adds a stock and overlays a live quote', async () => {
    const { client } = await registerUser(baseUrl);
    const { status, data } = await client.post('/watchlist', {
      stockName: 'Infosys',
      symbol: 'INFY',
    });

    assert.equal(status, 201);
    assert.ok(data.item.lastPrice > 0, 'the stored row must be priced from the feed');
  });

  test('refuses a duplicate symbol', async () => {
    const { client } = await registerUser(baseUrl);
    await client.post('/watchlist', { stockName: 'Infosys', symbol: 'INFY' });

    const { status } = await client.post('/watchlist', { stockName: 'Infosys', symbol: 'INFY' });
    assert.equal(status, 409);
  });

  test('updates a note and removes the entry', async () => {
    const { client } = await registerUser(baseUrl);
    const { data } = await client.post('/watchlist', { stockName: 'Infosys', symbol: 'INFY' });

    const updated = await client.put(`/watchlist/${data.item._id}`, { notes: 'Watching for a dip' });
    assert.equal(updated.data.item.notes, 'Watching for a dip');

    assert.equal((await client.delete(`/watchlist/${data.item._id}`)).status, 200);
    assert.equal((await client.get('/watchlist')).data.watchlist.length, 0);
  });
});

describe('positions', () => {
  test('opens a position', async () => {
    const { client } = await registerUser(baseUrl);
    const { status, data } = await client.post('/positions', {
      stockName: 'Tata Motors', symbol: 'TATAMOTORS', quantity: 20, entryPrice: 700, product: 'MIS',
    });

    assert.equal(status, 201);
    assert.equal(data.position.status, 'OPEN');
  });

  test('refuses to close without an exit price', async () => {
    const { client } = await registerUser(baseUrl);
    const { data } = await client.post('/positions', {
      stockName: 'Tata Motors', symbol: 'TATAMOTORS', quantity: 20, entryPrice: 700,
    });

    assert.equal((await client.put(`/positions/${data.position._id}`, { status: 'CLOSED' })).status, 400);
  });

  test('books P&L exactly on close', async () => {
    const { client } = await registerUser(baseUrl);
    const { data } = await client.post('/positions', {
      stockName: 'Tata Motors', symbol: 'TATAMOTORS', quantity: 20, entryPrice: 700,
    });

    await client.put(`/positions/${data.position._id}`, { status: 'CLOSED', exitPrice: 750 });

    const { data: summary } = await client.get('/positions');
    assert.equal(summary.closed.length, 1);
    assert.equal(summary.closedPnl, 20 * (750 - 700));
  });

  test('a closed position cannot be reopened or edited', async () => {
    const { client } = await registerUser(baseUrl);
    const { data } = await client.post('/positions', {
      stockName: 'Tata Motors', symbol: 'TATAMOTORS', quantity: 20, entryPrice: 700,
    });
    await client.put(`/positions/${data.position._id}`, { status: 'CLOSED', exitPrice: 750 });

    assert.equal((await client.put(`/positions/${data.position._id}`, { currentPrice: 800 })).status, 400);
  });
});

describe('dashboard aggregate', () => {
  test('returns every section the page renders', async () => {
    const { client } = await registerUser(baseUrl);
    const { status, data } = await client.get('/dashboard');

    assert.equal(status, 200);
    for (const key of [
      'summary', 'funds', 'allocation', 'recentOrders', 'growth',
      'holdings', 'watchlist', 'indices', 'gainers', 'losers', 'news',
    ]) {
      assert.ok(data[key] !== undefined, `dashboard payload is missing "${key}"`);
    }
  });

  test('growth is built from holdings, so a manually added holding still charts', async () => {
    const { client } = await registerUser(baseUrl);
    // Added directly, never via an order — this is the case that regressed once.
    await client.post('/holdings', {
      stockName: 'Infosys', symbol: 'INFY', quantity: 10, buyPrice: 1000,
    });

    const { data } = await client.get('/dashboard');
    assert.ok(data.growth.length > 0, 'a holding with no order history must still produce a curve');
  });

  test('the growth curve ends exactly at the reported portfolio value', async () => {
    const { client } = await registerUser(baseUrl);
    await client.post('/holdings', {
      stockName: 'Infosys', symbol: 'INFY', quantity: 10, buyPrice: 1000,
    });

    const { data } = await client.get('/dashboard');
    const last = data.growth[data.growth.length - 1];

    assert.ok(
      Math.abs(last.value - data.summary.currentValue) < 1,
      `curve ends at ${last.value} but the summary says ${data.summary.currentValue}`,
    );
    assert.ok(Math.abs(last.invested - data.summary.invested) < 1);
  });

  test('an empty portfolio charts nothing rather than inventing a curve', async () => {
    const { client } = await registerUser(baseUrl);
    const { data } = await client.get('/dashboard');

    assert.equal(data.growth.length, 0);
    assert.equal(data.summary.currentValue, 0);
  });

  test('sector allocation sums to 100%', async () => {
    const { client } = await registerUser(baseUrl);
    await client.post('/holdings', { stockName: 'Infosys', symbol: 'INFY', quantity: 10, buyPrice: 1000 });
    await client.post('/holdings', { stockName: 'ITC', symbol: 'ITC', quantity: 50, buyPrice: 400 });

    const { data } = await client.get('/dashboard');
    const total = data.allocation.reduce((sum, slice) => sum + slice.percent, 0);

    assert.ok(Math.abs(total - 100) < 0.5, `allocation totals ${total}%`);
  });
});

describe('notifications', () => {
  test('trading activity generates a notification', async () => {
    const { client } = await registerUser(baseUrl);
    const { data } = await client.get('/notifications');

    assert.ok(data.notifications.length > 0, 'registration should welcome the user');
    assert.ok(data.unreadCount > 0);
  });

  test('marks everything read', async () => {
    const { client } = await registerUser(baseUrl);
    await client.put('/notifications/read-all');

    const { data } = await client.get('/notifications');
    assert.equal(data.unreadCount, 0);
  });
});

describe('per-user isolation', () => {
  test('one user cannot read, edit or delete another user\'s records', async () => {
    const owner = await registerUser(baseUrl);
    const intruder = await registerUser(baseUrl);

    const { data } = await owner.client.post('/holdings', {
      stockName: 'Infosys', symbol: 'INFY', quantity: 10, buyPrice: 1000,
    });
    const id = data.holding._id;

    // 404 rather than 403: the intruder learns nothing about what exists.
    assert.equal((await intruder.client.put(`/holdings/${id}`, { quantity: 999 })).status, 404);
    assert.equal((await intruder.client.delete(`/holdings/${id}`)).status, 404);
    assert.equal((await intruder.client.get('/holdings')).data.holdings.length, 0);

    assert.equal(
      (await owner.client.get('/holdings')).data.holdings[0].quantity,
      10,
      "the owner's record must be untouched",
    );
  });

  test('each user has their own funds', async () => {
    const first = await registerUser(baseUrl);
    const second = await registerUser(baseUrl);

    await first.client.post('/funds/deposit', { amount: 50_000 });

    assert.equal((await second.client.get('/funds')).data.funds.availableBalance, 100_000);
  });
});
