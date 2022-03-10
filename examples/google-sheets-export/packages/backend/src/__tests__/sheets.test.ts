import { sheets } from '../routes/sheets';
import * as mockFetchStripeData from '../utils/fetchStripeData';

jest.mock('googleapis', () => ({
  google: {
    sheets: jest.fn(() => ({
      spreadsheets: jest.fn(() => ({
        create: jest.fn(),
        values: {
          update: jest.fn(),
        },
      })),
    })),
    auth: {
      OAuth2: jest.fn(() => ({
        setCredentials: jest.fn(),
      })),
    },
  },
}));

jest.mock('../utils/fetchStripeData.ts');

describe('Export to spreadsheet', () => {
  let mockTokenStore;
  let mockRequest;
  let mockResponse;

  beforeEach(() => {
    mockTokenStore = new Map();
    mockRequest = {
      body: {},
    };
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

  it('returns a 400 when a category is not provided', async () => {
    await sheets({
      req: mockRequest,
      res: mockResponse,
      tokenStore: mockTokenStore,
    });

    expect(mockResponse.sendStatus).toHaveBeenCalledWith(400);
  });

  it('returns a 400 when there is no data for the provided category to export', async () => {
    jest.spyOn(mockFetchStripeData, 'fetchStripeData').mockResolvedValue(null);

    await sheets({
      req: {
        ...mockRequest,
        body: {
          category: 'products',
        },
      },
      res: mockResponse,
      tokenStore: mockTokenStore,
    });

    expect(mockResponse.sendStatus).toHaveBeenCalledWith(400);
  });
});
