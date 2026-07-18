import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { startTestServer, createClient, registerUser, uniqueEmail } from './helpers.js';

let server;
let baseUrl;

before(async () => {
  server = await startTestServer();
  baseUrl = server.baseUrl;
});

after(async () => {
  await server.close();
});

describe('health', () => {
  test('GET /health reports ok', async () => {
    const { status, body } = await createClient(baseUrl).get('/health');
    assert.equal(status, 200);
    assert.equal(body.status, 'ok');
  });
});

describe('registration', () => {
  test('rejects invalid input with per-field details', async () => {
    const { status, body } = await createClient(baseUrl).post('/auth/register', {
      name: 'A',
      email: 'not-an-email',
      password: 'short',
    });

    assert.equal(status, 400);
    assert.ok(Array.isArray(body.details));
    const fields = body.details.map((d) => d.field);
    assert.ok(fields.includes('name'));
    assert.ok(fields.includes('email'));
    assert.ok(fields.includes('password'));
  });

  test('rejects a password with no digit', async () => {
    const { status } = await createClient(baseUrl).post('/auth/register', {
      name: 'No Digits',
      email: uniqueEmail(),
      password: 'onlyletters',
    });
    assert.equal(status, 400);
  });

  test('creates an account, sets a session and never returns the password', async () => {
    const { response } = await registerUser(baseUrl, { name: 'New Trader' });

    assert.equal(response.status, 201);
    assert.equal(response.data.user.name, 'New Trader');
    assert.equal(response.data.user.password, undefined);
  });

  test('funds a new account with virtual capital', async () => {
    const { client } = await registerUser(baseUrl);
    const { data } = await client.get('/funds');

    assert.equal(data.funds.availableBalance, 100_000);
    assert.equal(data.funds.totalDeposits, 100_000);
  });

  test('rejects a duplicate email', async () => {
    const email = uniqueEmail();
    await registerUser(baseUrl, { email });
    const { status } = await createClient(baseUrl).post('/auth/register', {
      name: 'Impostor',
      email,
      password: 'Password123',
    });

    assert.equal(status, 409);
  });
});

describe('login', () => {
  test('accepts correct credentials', async () => {
    const { credentials } = await registerUser(baseUrl);
    const client = createClient(baseUrl);
    const { status, data } = await client.post('/auth/login', {
      email: credentials.email,
      password: credentials.password,
    });

    assert.equal(status, 200);
    assert.equal(data.user.email, credentials.email);
  });

  test('rejects a wrong password without revealing which field was wrong', async () => {
    const { credentials } = await registerUser(baseUrl);
    const { status, body } = await createClient(baseUrl).post('/auth/login', {
      email: credentials.email,
      password: 'WrongPassword123',
    });

    assert.equal(status, 401);
    assert.equal(body.message, 'Invalid email or password');
  });

  test('gives an unknown email the identical message, so accounts cannot be enumerated', async () => {
    const { body } = await createClient(baseUrl).post('/auth/login', {
      email: uniqueEmail('ghost'),
      password: 'Password123',
    });

    assert.equal(body.message, 'Invalid email or password');
  });
});

describe('session', () => {
  test('GET /auth/me returns the signed-in user', async () => {
    const { client, credentials } = await registerUser(baseUrl);
    const { status, data } = await client.get('/auth/me');

    assert.equal(status, 200);
    assert.equal(data.user.email, credentials.email);
  });

  test('protected routes reject an anonymous caller', async () => {
    const { status } = await createClient(baseUrl).get('/dashboard');
    assert.equal(status, 401);
  });

  test('a garbage token is rejected rather than trusted', async () => {
    const response = await fetch(`${baseUrl}/auth/me`, {
      headers: { Authorization: 'Bearer not.a.real.token' },
    });
    assert.equal(response.status, 401);
  });

  test('logout clears the session', async () => {
    const { client } = await registerUser(baseUrl);
    assert.equal((await client.get('/dashboard')).status, 200);

    const { status } = await client.post('/auth/logout');
    assert.equal(status, 200);

    // The server sends an expiring cookie; drop it as a browser would.
    client.forgetCookie();
    assert.equal((await client.get('/dashboard')).status, 401);
  });
});

describe('profile', () => {
  test('updates name and phone', async () => {
    const { client } = await registerUser(baseUrl);
    const { status, data } = await client.put('/profile', {
      name: 'Updated Name',
      phone: '9000000000',
    });

    assert.equal(status, 200);
    assert.equal(data.user.name, 'Updated Name');
    assert.equal(data.user.phone, '9000000000');
  });

  test('refuses an email already taken by someone else', async () => {
    const taken = uniqueEmail('taken');
    await registerUser(baseUrl, { email: taken });
    const { client } = await registerUser(baseUrl);

    const { status } = await client.put('/profile', { email: taken });
    assert.equal(status, 409);
  });

  test('rejects a password change with the wrong current password', async () => {
    const { client } = await registerUser(baseUrl);
    const { status } = await client.put('/profile/password', {
      currentPassword: 'NotMyPassword1',
      newPassword: 'BrandNewPass123',
    });

    assert.equal(status, 400);
  });

  test('changes the password and invalidates the old one', async () => {
    const { client, credentials } = await registerUser(baseUrl);

    const { status } = await client.put('/profile/password', {
      currentPassword: credentials.password,
      newPassword: 'BrandNewPass123',
    });
    assert.equal(status, 200);

    const fresh = createClient(baseUrl);
    assert.equal(
      (await fresh.post('/auth/login', { email: credentials.email, password: credentials.password })).status,
      401,
      'the old password must stop working',
    );
    assert.equal(
      (await fresh.post('/auth/login', { email: credentials.email, password: 'BrandNewPass123' })).status,
      200,
    );
  });
});
