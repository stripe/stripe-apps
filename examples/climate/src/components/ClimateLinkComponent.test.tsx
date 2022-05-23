import {render} from '@stripe/ui-extension-sdk/testing';
import {Button} from '@stripe/ui-extension-sdk/ui';
import ClimateLinkComponent from './ClimateLinkComponent';

describe('Climate', () => {
  it('renders Learn more button', () => {
    const {wrapper} = render(<ClimateLinkComponent appId="com.example.climate" />);
    expect(wrapper.find(Button)).toContainText('Learn more');
  });

  it('the Learn more button link contains our app id referrer param', () => {
    const {wrapper} = render(<ClimateLinkComponent appId="com.example.climate" />);
    expect(wrapper.find(Button)?.prop('href')).toContain(
      '?src_app=com.example.climate',
    );
  });
});