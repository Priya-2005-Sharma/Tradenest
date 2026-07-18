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

const quoteFor = async (client, symbol) => {
  const { data } = await client.get(`/market/quote/${symbol}`);
  return data.quote;
};

const balanceOf = async (client) => {
  const { data } = await client.get('/funds');
  return data.funds.availableBalance;
};

describe('market data', () => {
  test('is public — the landing page quotes before anyone signs in', async () => {
    const response = await fetch(`${baseUrl}/market/overview`);
    assert.equal(response.status, 200);

    const { data } = await response.json();
    assert.equal(data.indices.length, 4);
    assert.equal(data.gainers.length, 5);
    assert.equal(data.losers.length, 5);
  });

  test('returns a quote for a known symbol', async () => {
    const { client } = await registerUser(baseUrl);
    const quote = await quoteFor(client, 'RELIANCE');

    assert.equal(quote.symbol, 'RELIANCE');
    assert.ok(quote.lastPrice > 0);
    assert.ok(quote.dayHigh >= quote.lastPrice);
    assert.ok(quote.dayLow <= quote.lastPrice);
  });

  test('404s an unknown symbol', async () => {
    const { client } = await registerUser(baseUrl);
    assert.equal((await client.get('/market/quote/NOTREAL')).status, 404);
  });

  test('search matches on symbol and on name', async () => {
    const { client } = await registerUser(baseUrl);

    const bySymbol = await client.get('/market/instruments?q=INFY');
    assert.ok(bySymbol.data.instruments.some((i) => i.symbol === 'INFY'));

    const byName = await client.get('/market/instruments?q=infosys');
    assert.ok(byName.data.instruments.some((i) => i.symbol === 'INFY'));
  });
});

describe('orders settle against funds and holdings', () => {
  test('a market BUY executes, debits cash and creates the holding', async () => {
    const { client } = await registerUser(baseUrl);
    const before = await balanceOf(client);
    const quote = await quoteFor(client, 'RELIANCE');

    const { status, data } = await client.post('/orders', {
      stockName: quote.stockName,
      symbol: 'RELIANCE',
      type: 'BUY',
      mode: 'MARKET',
      quantity: 10,
      price: quote.lastPrice,
    });

    assert.equal(status, 201);
    assert.equal(data.order.status, 'EXECUTED');

    const spent = data.order.quantity * data.order.price;
    assert.equal(await balanceOf(client), Number((before - spent).toFixed(2)));

    const { data: holdings } = await client.get('/holdings');
    assert.equal(holdings.holdings.length, 1);
    assert.equal(holdings.holdings[0].quantity, 10);
  });

  test('buying more of the same stock averages the cost basis', async () => {
    const { client } = await registerUser(baseUrl);

    // Two fills at prices we control, so the average is exactly predictable.
    await client.post('/orders', {
      stockName: 'Infosys', symbol: 'INFY', type: 'BUY', mode: 'LIMIT', quantity: 10, price: 1000,
    }).then((r) => client.put(`/orders/${r.data.order._id}`, { status: 'EXECUTED' }));
    await client.post('/orders', {
      stockName: 'Infosys', symbol: 'INFY', type: 'BUY', mode: 'LIMIT', quantity: 10, price: 2000,
    }).then((r) => client.put(`/orders/${r.data.order._id}`, { status: 'EXECUTED' }));

    const { data } = await client.get('/holdings');
    const holding = data.holdings.find((h) => h.symbol === 'INFY');

    assert.equal(holding.quantity, 20);
    assert.equal(holding.buyPrice, 1500, 'average of 1000 and 2000 across equal quantities');
  });

  test('a BUY beyond available funds is rejected and recorded with a reason', async () => {
    const { client } = await registerUser(baseUrl);
    const quote = await quoteFor(client, 'MARUTI');

    const { status } = await client.post('/orders', {
      stockName: quote.stockName,
      symbol: 'MARUTI',
      type: 'BUY',
      mode: 'MARKET',
      quantity: 1000,
      price: quote.lastPrice,
    });
    assert.equal(status, 400);

    const { data } = await client.get('/orders?status=REJECTED');
    assert.equal(data.orders.length, 1);
    assert.ok(data.orders[0].statusReason.length > 0, 'a rejected order must say why');

    assert.equal(await balanceOf(client), 100_000, 'a rejected order must not move money');
  });

  test('selling more than you hold is rejected', async () => {
    const { client } = await registerUser(baseUrl);
    const quote = await quoteFor(client, 'ITC');
    await client.post('/orders', {
      stockName: quote.stockName, symbol: 'ITC', type: 'BUY', mode: 'MARKET', quantity: 5, price: quote.lastPrice,
    });

    const { status } = await client.post('/orders', {
      stockName: quote.stockName, symbol: 'ITC', type: 'SELL', mode: 'MARKET', quantity: 50, price: quote.lastPrice,
    });
    assert.equal(status, 400);
  });

  test('selling a stock you do not hold is rejected', async () => {
    const { client } = await registerUser(baseUrl);
    const quote = await quoteFor(client, 'WIPRO');

    const { status } = await client.post('/orders', {
      stockName: quote.stockName, symbol: 'WIPRO', type: 'SELL', mode: 'MARKET', quantity: 1, price: quote.lastPrice,
    });
    assert.equal(status, 400);
  });

  test('selling the whole position credits cash and removes the holding', async () => {
    const { client } = await registerUser(baseUrl);
    const quote = await quoteFor(client, 'ITC');

    await client.post('/orders', {
      stockName: quote.stockName, symbol: 'ITC', type: 'BUY', mode: 'MARKET', quantity: 20, price: quote.lastPrice,
    });
    const afterBuy = await balanceOf(client);

    const { data } = await client.post('/orders', {
      stockName: quote.stockName, symbol: 'ITC', type: 'SELL', mode: 'MARKET', quantity: 20, price: quote.lastPrice,
    });
    assert.equal(data.order.status, 'EXECUTED');

    const proceeds = data.order.quantity * data.order.price;
    assert.equal(await balanceOf(client), Number((afterBuy + proceeds).toFixed(2)));

    const { data: holdings } = await client.get('/holdings');
    assert.equal(holdings.holdings.length, 0);
  });

  test('an unreachable LIMIT order rests as PENDING and moves no money', async () => {
    const { client } = await registerUser(baseUrl);

    const { data } = await client.post('/orders', {
      stockName: 'Infosys', symbol: 'INFY', type: 'BUY', mode: 'LIMIT', quantity: 5, price: 1,
    });

    assert.equal(data.order.status, 'PENDING');
    assert.equal(await balanceOf(client), 100_000);
  });

  test('rejects an untradable symbol', async () => {
    const { client } = await registerUser(baseUrl);
    const { status } = await client.post('/orders', {
      stockName: 'Fake Corp', symbol: 'FAKECO', type: 'BUY', quantity: 1, price: 10,
    });
    assert.equal(status, 400);
  });

  test('rejects a non-positive or fractional quantity', async () => {
    const { client } = await registerUser(baseUrl);
    const base = { stockName: 'Infosys', symbol: 'INFY', type: 'BUY', price: 100 };

    assert.equal((await client.post('/orders', { ...base, quantity: 0 })).status, 400);
    assert.equal((await client.post('/orders', { ...base, quantity: -5 })).status, 400);
    assert.equal((await client.post('/orders', { ...base, quantity: 1.5 })).status, 400);
  });
});

describe('order lifecycle', () => {
  test('a pending order can be cancelled', async () => {
    const { client } = await registerUser(baseUrl);
    const { data } = await client.post('/orders', {
      stockName: 'Infosys', symbol: 'INFY', type: 'BUY', mode: 'LIMIT', quantity: 5, price: 1,
    });

    const cancelled = await client.put(`/orders/${data.order._id}`, { status: 'CANCELLED' });
    assert.equal(cancelled.data.order.status, 'CANCELLED');
  });

  test('a cancelled order can no longer be edited', async () => {
    const { client } = await registerUser(baseUrl);
    const { data } = await client.post('/orders', {
      stockName: 'Infosys', symbol: 'INFY', type: 'BUY', mode: 'LIMIT', quantity: 5, price: 1,
    });
    await client.put(`/orders/${data.order._id}`, { status: 'CANCELLED' });

    assert.equal((await client.put(`/orders/${data.order._id}`, { quantity: 9 })).status, 400);
  });

  test('an executed order is immutable — it has already moved cash and stock', async () => {
    const { client } = await registerUser(baseUrl);
    const quote = await quoteFor(client, 'ITC');
    const { data } = await client.post('/orders', {
      stockName: quote.stockName, symbol: 'ITC', type: 'BUY', mode: 'MARKET', quantity: 2, price: quote.lastPrice,
    });

    assert.equal((await client.put(`/orders/${data.order._id}`, { quantity: 99 })).status, 400);
    assert.equal((await client.delete(`/orders/${data.order._id}`)).status, 400);
  });

  test('filters the order book by status', async () => {
    const { client } = await registerUser(baseUrl);
    await client.post('/orders', {
      stockName: 'Infosys', symbol: 'INFY', type: 'BUY', mode: 'LIMIT', quantity: 5, price: 1,
    });

    const pending = await client.get('/orders?status=PENDING');
    assert.equal(pending.data.orders.length, 1);

    const executed = await client.get('/orders?status=EXECUTED');
    assert.equal(executed.data.orders.length, 0);
  });
});

describe('funds', () => {
  test('a deposit credits the balance and is recorded', async () => {
    const { client } = await registerUser(baseUrl);
    const { data } = await client.post('/funds/deposit', { amount: 50_000, note: 'Top-up' });

    assert.equal(data.funds.availableBalance, 150_000);
    assert.equal(data.funds.totalDeposits, 150_000);
  });

  test('a withdrawal debits the balance', async () => {
    const { client } = await registerUser(baseUrl);
    const { data } = await client.post('/funds/withdraw', { amount: 20_000 });

    assert.equal(data.funds.availableBalance, 80_000);
    assert.equal(data.funds.totalWithdrawals, 20_000);
  });

  test('refuses to withdraw more than is available', async () => {
    const { client } = await registerUser(baseUrl);
    const { status } = await client.post('/funds/withdraw', { amount: 999_999 });

    assert.equal(status, 400);
    assert.equal(await balanceOf(client), 100_000, 'a failed withdrawal must not move money');
  });

  test('rejects a zero or negative amount', async () => {
    const { client } = await registerUser(baseUrl);
    assert.equal((await client.post('/funds/deposit', { amount: 0 })).status, 400);
    assert.equal((await client.post('/funds/deposit', { amount: -100 })).status, 400);
  });

  test('equity counts idle cash plus the market value of holdings', async () => {
    const { client } = await registerUser(baseUrl);
    const quote = await quoteFor(client, 'ITC');
    await client.post('/orders', {
      stockName: quote.stockName, symbol: 'ITC', type: 'BUY', mode: 'MARKET', quantity: 10, price: quote.lastPrice,
    });

    const { data } = await client.get('/funds');
    const { data: holdings } = await client.get('/holdings');

    const expected = Number(
      (data.funds.availableBalance + holdings.summary.currentValue).toFixed(2),
    );
    assert.ok(Math.abs(data.funds.equity - expected) < 1);
  });
});
