import request from 'supertest';

import app from '../app';
import { authSuccessRedirectURL } from '../config';
import { loggedIn } from '../routes/loggedIn';

describe('GET loggedIn', () => {
  it('returns a 400 when the state identifier is not provided', async () => {
    const response = await request(app).get(
      '/api/auth/callback/logged-in?state=',
    );

    expect(response.statusCode).toBe(400);
  });

  it('returns a 400 when the code identifier is not provided', async () => {
    const response = await request(app).get(
      '/api/auth/callback/logged-in?code=',
    );

    expect(response.statusCode).toBe(400);
  });

  it('stores the provided code and the state identifier inside the provided store', () => {
    const mockAuthStore = new Map<string, string>();
    const mockCode = '123';
    const mockState = 'mock-state';

    loggedIn(
      {
        query: {
          code: mockCode,
          state: mockState,
        },
      },
      {
        sendStatus: jest.fn(),
        render: jest.fn(),
      },
      mockAuthStore,
    );

    expect(mockAuthStore.get(mockState)).toBe(mockCode);
  });

  it('renders the authorized route with a redirect URL that redirects users back to the Stripe dashboard', async () => {
    const response = await request(app).get(
      '/api/auth/callback/logged-in?state=mock-state&code=mock-code',
    );

    expect(response.statusCode).toBe(200);
    expect(response.text).toMatch(/authorized/i);
    expect(response.text).toMatch(authSuccessRedirectURL);
  });
});
