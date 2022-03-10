import request from 'supertest';

import app from '../app';
import { verify } from '../routes/verify';
import * as fetchTokenUtility from '../utils/fetchToken';

jest.mock('../utils/verifyCaller.ts', () => ({
  verifyCaller: (req, res, next) => next(),
}));

describe('GET verify', () => {
  let mockState;
  let mockAuthCode;
  let mockAuthStore;
  let mockTokenStore;
  let mockResponse;
  let mockFetchToken: jest.SpyInstance;

  beforeEach(() => {
    mockState = 'mock-state';
    mockAuthCode = 'mock-code';
    mockAuthStore = new Map<string, string>();
    mockTokenStore = new Map();
    mockResponse = {
      sendStatus: jest.fn(),
      status: jest.fn(() => ({ send: jest.fn() })),
      locals: {
        sessionId: 'mockSessionId',
      },
    };
    mockFetchToken = jest
      .spyOn(fetchTokenUtility, 'fetchToken')
      .mockImplementation(() =>
        Promise.resolve({
          access_token: 'mock-token',
          refresh_token: 'mock-refresh-token',
          id_token: '123',
          token_type: 'access_token',
          expires: new Date(),
        }),
      );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns a 400 when the state identifier is not provided', async () => {
    const response = await request(app).get('/api/auth/verify');

    expect(response.statusCode).toBe(400);
  });

  it('returns a 401 when the user making the request is unauthorized', () => {
    verify(
      {
        query: {
          state: mockState,
        },
      },
      mockResponse,
      mockAuthStore,
      mockTokenStore,
    );

    expect(mockResponse.sendStatus).toHaveBeenCalledWith(401);
  });

  it('fetches the auth token using the stored auth code and returns a 402 status', async () => {
    mockAuthStore.set(mockState, mockAuthCode);

    await verify(
      {
        query: {
          state: mockState,
        },
      },
      mockResponse,
      mockAuthStore,
      mockTokenStore,
    );

    expect(mockFetchToken).toHaveBeenCalledWith(
      mockResponse.locals.sessionId,
      mockAuthCode,
      mockTokenStore,
    );

    expect(mockResponse.sendStatus).toHaveBeenCalledWith(204);
  });

  it('returns a 503 when the request to fetch the auth token fails', async () => {
    mockAuthStore.set(mockState, mockAuthCode);
    mockFetchToken.mockImplementation(() => Promise.reject({}));

    try {
      await verify(
        {
          query: {
            state: mockState,
          },
        },
        mockResponse,
        mockAuthStore,
        mockTokenStore,
      );
    } catch {
      expect(mockResponse.status).toHaveBeenCalledWith(503);
    }
  });

  it('returns a 401 when the user fetching the token is unauthorized', async () => {
    mockAuthStore.set(mockState, mockAuthCode);
    mockFetchToken.mockImplementation(() =>
      Promise.reject({ response: 'Unauthorized' }),
    );

    try {
      await verify(
        {
          query: {
            state: mockState,
          },
        },
        mockResponse,
        mockAuthStore,
        mockTokenStore,
      );
    } catch {
      expect(mockResponse.sendStatus).toHaveBeenCalledWith(401);
    }
  });
});
