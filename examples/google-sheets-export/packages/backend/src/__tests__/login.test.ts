import request from 'supertest';

import app from '../app';
import { authClientId, authRedirectUrl, authUrl, scope } from '../config';

describe('GET login', () => {
  it('returns a 400 when the state identifier is not provided', async () => {
    const response = await request(app).get('/api/auth/login');

    expect(response.statusCode).toBe(400);
  });

  it('redirects to the google authentication endpoint with the oauth credentials', async () => {
    const mockState = 'mock-state';
    const response = await request(app).get(
      `/api/auth/login?state=${mockState}`,
    );
    const expectedParams = new URLSearchParams({
      client_id: authClientId,
      response_type: 'code',
      redirect_uri: authRedirectUrl,
      scope,
      state: mockState,
    });

    expect(response.statusCode).toBe(303);
    expect(response.headers.location).toBe(`${authUrl}?${expectedParams}`);
  });
});
