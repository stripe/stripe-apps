import { render } from '@stripe/ui-extension-sdk/testing';
import { Box, Button } from '@stripe/ui-extension-sdk/ui';
import { SendButton } from "./SendButton";

describe("components/SendButton", () => {
    let mockCallSendMailAPI = jest.fn();
    afterEach(() => {
        mockCallSendMailAPI = jest.fn();
    });
    describe("UI texts", () => {
        it('Should return error message when sendingStatus === "error"', () => {
            const sendEmailErrorMessage = 'Internal Error';
            const { wrapper } = render(<SendButton {...{
                sendEmailErrorMessage,
                callSendMailAPI: mockCallSendMailAPI,
                sendingStatus: 'error'
            }}/>);
            expect(wrapper.find(Box)).toContainText(sendEmailErrorMessage);
        });
        it('Should return complete message when sendingStatus === "complete"', () => {
            const { wrapper } = render(<SendButton {...{
                sendEmailErrorMessage: '',
                callSendMailAPI: mockCallSendMailAPI,
                sendingStatus: 'complete'
            }}/>);
            expect(wrapper.find(Box)).toContainText('Email has sent!');
        });
        it('Should return submit text when sendingStatus === ""', () => {
            const { wrapper } = render(<SendButton {...{
                sendEmailErrorMessage: '',
                callSendMailAPI: mockCallSendMailAPI,
                sendingStatus: ''
            }}/>);
            expect(wrapper.find(Button)).toContainText('Send');
        });
        it('Should return inprogress message when sendingStatus === "sending"', () => {
            const { wrapper } = render(<SendButton {...{
                sendEmailErrorMessage: '',
                callSendMailAPI: mockCallSendMailAPI,
                sendingStatus: 'sending'
            }}/>);
            expect(wrapper.find(Button)).toContainText('Sending...');
        });
        it("Should have a expected props", () => {
            const { wrapper } = render(<SendButton {...{
                sendEmailErrorMessage: '',
                callSendMailAPI: mockCallSendMailAPI,
                sendingStatus: ''
            }}/>);
            expect(wrapper).toContainComponent(Button, {
                type: 'primary',
                onPress: expect.any(Function),
                disabled: false
            });
        });
    });
    describe("UI Actions", () => {
        it("Should call the API method 1 times", () => {
            const { wrapper } = render(<SendButton {...{
                sendEmailErrorMessage: '',
                callSendMailAPI: mockCallSendMailAPI,
                sendingStatus: ''
            }}/>);
            wrapper.find(Button)!.trigger('onPress');
            expect(mockCallSendMailAPI).toHaveBeenCalledTimes(1)
        });
    });
});
