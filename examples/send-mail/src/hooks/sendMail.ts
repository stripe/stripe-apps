import { useState } from "react";
import type { ExtensionContextValue } from '@stripe/ui-extension-sdk/context';
import Stripe from 'stripe';

export type SendingStatus = '' | 'sending' | 'complete' | 'error';
export const useSendMail = ({userContext}: ExtensionContextValue) => {
    const [errorMessage, setErrorMessage] = useState('');
    const [sendingStatus, setSendingStatus] = useState<SendingStatus>('');
    const [subject, setSubject] = useState('');
    const [text, setText] = useState('');
    const fromAddress = userContext?.email;
    return {
        callSendMailAPI: async (customer: Stripe.Customer | null | undefined) => {
            if (!customer) {
                return;
            }
            setErrorMessage('');
            setSendingStatus('sending');
            await new Promise(resolve => {
                return setTimeout(()=>{
                    resolve(true);
                }, 2000);
            });
            setErrorMessage([
                "API will called by these props",
                JSON.stringify({
                    from: fromAddress,
                    to: customer.email,
                    subject,
                    text
                }, null, 2),
                "If you want to send a real email, please update the code to call the real API."
            ].join('\n'));
            setSendingStatus('error');
            return;
            /**
             * @TODO replace the API to send a real email
            fetch('https://example.com', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    from: fromAddress,
                    to: customer.email,
                    subject,
                    text
                })
            }).then(data => data.json())
            .then(response => {
                console.log(response);
                setSendingStatus('complete');
            })
            .catch(e => {
                console.log(e);
                console.log('====ERROR===');
                setErrorMessage(e.message);
                setSendingStatus('error');
            });
            */
        },
        sendEmailErrorMessage: errorMessage,
        sendingStatus,
        subject,
        setSubject,
        text,
        setText,
    };
};
