import {render} from '@stripe/ui-extension-sdk/testing';
import App from './App';

jest.mock('@stripe/ui-extension-sdk/oauth', () => {
  return {
    __esModule: true,
    createOAuthState: () => Promise.resolve({state: 'state', challenge: 'challenge'}),
  };
});

describe('App', () => {
  it('renders properly', () => {
    const {wrapper} = render(<App />);
    expect(wrapper).toContainText('Begin authorization flow');
  });
});
