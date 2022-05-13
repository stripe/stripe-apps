import { render, getMockContextProps } from '@stripe/ui-extension-sdk/testing';
import {
  Button,
  FormFieldGroup,
  Banner,
  TextField,
} from '@stripe/ui-extension-sdk/ui';
import App from './App';

describe('App', () => {
  const context = getMockContextProps();
  const { wrapper } = render(<App {...context} />);

  it('renders FormFieldGroup that contains a TextField', async () => {
    expect(wrapper.find(FormFieldGroup)).toContainComponent(TextField);
  });

  it('renders Notice Component with error message when a button is clicked', async () => {
    const button = wrapper.find(Button);
    button!.trigger('onPress');

    const notice = wrapper.find(Banner);
    expect(notice?.prop('description')).toEqual(
      'First name or last name not entered!'
    );
    notice?.trigger('onDismiss');
    expect(wrapper).not.toContainComponent(Banner);
  });

  it('renders Notice Component with success message when a button is clicked', async () => {
    const textField = wrapper.find(TextField);
    textField?.trigger('onChange', { target: { value: 'John Doe' } });

    const button = wrapper.find(Button);
    button!.trigger('onPress');

    const notice = wrapper.find(Banner);
    expect(notice?.prop('description')).toEqual('Added full Name!');
  });

  it('FormFieldGroup Component matches snapshot', async () => {
    expect(wrapper.find(FormFieldGroup)).toMatchSnapshot();
  });
});
