import { createApp } from '../src/app.js';
import { connectDatabase, disconnectDatabase } from '../src/config/database.js';

/**
 * Boots the real app against a throwaway in-memory MongoDB on an ephemeral
 * port. Tests exercise the actual HTTP stack — routing, middleware, validation,
 * cookies — rather than calling controllers directly, so anything that would
 * break a browser client breaks here too.
 */
export const startTestServer = async () => {
  await connectDatabase();

  const server = createApp().listen(0);
  await new Promise((resolve) => server.once('listening', resolve));

  const { port } = server.address();

  return {
    baseUrl: `http://127.0.0.1:${port}/api`,
    close: async () => {
      await new Promise((resolve) => server.close(resolve));
      await disconnectDatabase();
    },
  };
};

/**
 * A minimal HTTP client that remembers its auth cookie, so a test can act as a
 * signed-in user the same way a browser does. Each instance is an independent
 * session — two clients means two users.
 */
export const createClient = (baseUrl) => {
  let cookie = '';

  const request = async (method, path, body) => {
    const response = await fetch(`${baseUrl}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(cookie ? { Cookie: cookie } : {}),
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });

    const setCookie = response.headers.get('set-cookie');
    if (setCookie) cookie = setCookie.split(';')[0];

    let json = null;
    try {
      json = await response.json();
    } catch {
      // 204s and empty bodies are legitimate.
    }

    return { status: response.status, body: json, data: json?.data };
  };

  return {
    get: (path) => request('GET', path),
    post: (path, body) => request('POST', path, body),
    put: (path, body) => request('PUT', path, body),
    delete: (path) => request('DELETE', path),
    /** Drops the session without touching the server. */
    forgetCookie: () => {
      cookie = '';
    },
  };
};

let counter = 0;

/** Unique per call so tests never collide on the unique email index. */
export const uniqueEmail = (prefix = 'trader') => {
  counter += 1;
  return `${prefix}.${process.pid}.${counter}@tradenest.test`;
};

/** Registers a new user and returns a client already holding their session. */
export const registerUser = async (baseUrl, overrides = {}) => {
  const client = createClient(baseUrl);
  const credentials = {
    name: 'Test Trader',
    email: uniqueEmail(),
    password: 'Password123',
    ...overrides,
  };
  const response = await client.post('/auth/register', credentials);
  return { client, credentials, response };
};
