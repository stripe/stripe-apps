import { FC } from "react";
import { Button, Box } from '@stripe/ui-extension-sdk/ui';
import { useSendMail } from "../hooks/sendMail";
import Stripe from "stripe";


export type SendButtonProps = Pick<ReturnType<typeof useSendMail>, 'sendingStatus' | 'callSendMailAPI' | 'sendEmailErrorMessage'> & {
    customer?: Stripe.Customer | null;
};
export const SendButton: FC<SendButtonProps> = ({
    sendingStatus,
    callSendMailAPI,
    sendEmailErrorMessage,
    customer,
}) => {
    if (sendingStatus === 'error') {
      return <Box>{sendEmailErrorMessage}</Box>;
    } else if (sendingStatus === 'complete') {
      return <Box>Email has sent!</Box>;
    };
    return (
        <Button
          type="primary"
          onPress={e => {
            callSendMailAPI(customer);
          }}
          disabled={sendingStatus === 'sending'}
        >
          {sendingStatus === 'sending' ? 'Sending...' : 'Send'}
        </Button>
    );
};