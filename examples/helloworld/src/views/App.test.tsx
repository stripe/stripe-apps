import {render, getMockContextProps} from '@stripe/ui-extension-sdk/testing';
import {Link} from '@stripe/ui-extension-sdk/ui';
import App from './App';

const context = getMockContextProps();

describe('App', () => {
  it('renders link', () => {
    const {wrapper} = render(<App {...context} />);

    expect(wrapper.find(Link)).toContainText('Go to UI documentation');
  });
});
