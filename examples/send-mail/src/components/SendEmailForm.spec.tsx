import { getMockContextProps, render } from '@stripe/ui-extension-sdk/testing';
import { Inline, TextArea } from '@stripe/ui-extension-sdk/ui';
import { SendEmailForm } from './SendEmailForm';

describe('components/SendEmailForm', () => {
    describe('customerLoadingStatus !== "complete"', () => {
        it.each([
            ['loading', "Loading"],
            ['error', 'Dummy error message'],
        ])('Props: customerLoadingStatus is %p, should show the text as %p', (customerLoadingStatus, message) => {
            const { wrapper } = render(<SendEmailForm {...{
                customerLoadingErrorMessage: message,
                customerLoadingStatus: customerLoadingStatus,
                userContext: getMockContextProps(),
            } as any}/>);
            expect(wrapper.find(Inline)).toContainText(message);
        });
    });
    describe('customerLoadingStatus === "complete"', () => {
        it('Should contain TextArea component', () => {
            const { wrapper } = render(<SendEmailForm {...{
                customerLoadingErrorMessage: '',
                customerLoadingStatus: 'complete',
                userContext: getMockContextProps(),
            } as any}/>);
            expect(wrapper).toContainComponent(TextArea, {
                label: "Content (Text only)",
                value: '',
                onChange: expect.any(Function),
            })
        })
    });
});