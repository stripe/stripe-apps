import {render} from '@stripe/ui-extension-sdk/testing';
import {Link} from '@stripe/ui-extension-sdk/ui';
import App from './App';

describe('App', () => {
  it('renders link', () => {
    const {wrapper} = render(<App />);

    expect(wrapper.find(Link)).toContainText('Go to UI documentation');
  });
});
