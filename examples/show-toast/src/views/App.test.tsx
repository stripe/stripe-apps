import {render, getMockContextProps} from "@stripe/ui-extension-sdk/testing";
import {TextField, Button} from "@stripe/ui-extension-sdk/ui";

import App from "./App";

let mockShowToast = jest.fn();
jest.mock('@stripe/ui-extension-sdk/utils', () => {
  return {
    ...jest.requireActual('@stripe/ui-extension-sdk/utils'),
    showToast: (...args: any[]) => mockShowToast(...args),
  };
});

describe("App", () => {
  let toastResults: Array<{dismiss: Function, update: Function}> = [];
  beforeEach(() => {
    toastResults = [];
    mockShowToast = jest.fn().mockImplementation(() => {
      const result = {dismiss: jest.fn(), update: jest.fn()};
      toastResults.push(result);
      return Promise.resolve(result);
    });
  });
  it("can show a toast", () => {
    const {wrapper} = render(<App {...getMockContextProps()} />);
    const [messageField, actionField] = wrapper.findAll(TextField);
    messageField.trigger('onChange', {target: {value: 'Bread was toasted'}});
    actionField.trigger('onChange', {target: {value: 'Untoast it'}});

    const [renderToast] = wrapper.findAll(Button);
    renderToast.props.onPress?.(null as any);
    expect(mockShowToast).toHaveBeenCalledWith(
      'Bread was toasted',
      expect.objectContaining({
        action: 'Untoast it',
      }),
    );
  });
  it('can update toasts', async () => {
    const {wrapper, update} = render(<App {...getMockContextProps()} />);
    const [messageField, actionField] = wrapper.findAll(TextField);
    messageField.trigger('onChange', {target: {value: 'Bread was toasted'}});
    actionField.trigger('onChange', {target: {value: 'Untoast it'}});

    const [renderToast] = wrapper.findAll(Button);
    renderToast.trigger('onPress', {type: 'press'});

    // Wait for the async showToast to complete
    await Promise.resolve();

    messageField.trigger('onChange', {target: {value: 'Toast was buttered'}});
    actionField.trigger('onChange', {target: {value: 'Unbutter it'}});

    await update();
    const [, updateToasts] = wrapper.findAll(Button);
    updateToasts.trigger('onPress', {type: 'press'});
    expect(toastResults[0].update).toHaveBeenCalledWith(
      'Toast was buttered',
      expect.objectContaining({
        action: 'Unbutter it',
      }),
    );
  });
  it('can dismiss toasts', async () => {
    const {wrapper} = render(<App {...getMockContextProps()} />);
    const [messageField, actionField] = wrapper.findAll(TextField);
    messageField.trigger('onChange', {target: {value: 'Bread was toasted'}});
    actionField.trigger('onChange', {target: {value: 'Untoast it'}});

    const [renderToast] = wrapper.findAll(Button);
    renderToast.trigger('onPress', {type: 'press'});

    // Wait for the async showToast to complete
    await Promise.resolve();

    const [,, dismissToasts] = wrapper.findAll(Button);
    dismissToasts.trigger('onPress', {type: 'press'});
    expect(toastResults[0].dismiss).toHaveBeenCalled();
  });
});
