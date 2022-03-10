import axios from 'axios';

import { logout } from '../routes/logout';

jest.mock('axios');

describe('GET logout', () => {
  let mockTokenStore;
  let mockResponse;

  beforeEach(() => {
    mockTokenStore = new Map();
    mockResponse = {
      sendStatus: jest.fn(),
      status: jest.fn(() => ({ send: jest.fn() })),
      locals: {
        sessionId: 'mockSessionId',
      },
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns a 401 when a user token is not found', async () => {
    logout({}, mockResponse, mockTokenStore);

    expect(mockResponse.sendStatus).toHaveBeenCalledWith(401);
  });

  it('should delete the session ID from the token store when the call is sucessful', async () => {
    mockTokenStore.set(mockResponse.locals.sessionId, 'mockSessionId');

    axios.get = jest.fn().mockResolvedValue(Promise.resolve({ status: 200 }));

    await logout({}, mockResponse, mockTokenStore);

    expect(mockResponse.sendStatus).toHaveBeenCalledWith(200);
    expect(mockTokenStore.size).toBe(0);
  });

  it('should return a 400 when the response from the auth URL is unsuccessful', async () => {
    mockTokenStore.set(mockResponse.locals.sessionId, 'mockSessionId');

    axios.get = jest.fn().mockResolvedValue(Promise.resolve({ status: 400 }));

    await logout({}, mockResponse, mockTokenStore);

    expect(mockResponse.sendStatus).toHaveBeenCalledWith(400);
  });

  it('should return a server error when there is an error logging out', async () => {
    mockTokenStore.set(mockResponse.locals.sessionId, 'mockSessionId');

    axios.get = jest.fn().mockResolvedValue(Promise.reject(new Error('error')));

    await logout({}, mockResponse, mockTokenStore);

    expect(mockResponse.sendStatus).toHaveBeenCalledWith(503);
  });
});
