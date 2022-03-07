import { useEffect, useState } from "react";
import type { ExtensionContextValue } from '@stripe/ui-extension-sdk/context';
import Stripe from 'stripe';
import {createHttpClient, STRIPE_API_KEY } from '@stripe/ui-extension-sdk/http_client';

const stripeClient = new Stripe(
  STRIPE_API_KEY,
  {
    httpClient: createHttpClient() as Stripe.HttpClient,
    apiVersion: '2020-08-27',
  }
);

const isActiveCustomer = (customer: Stripe.Customer | Stripe.DeletedCustomer): customer is Stripe.Customer => {
    return !customer.deleted;
};

export type LoadingStatus = '' | 'loading' | 'complete' | 'error';
export type CustomerLoaderProps = {
    customerLoadingStatus: LoadingStatus;
    customerLoadingErrorMessage: string;
    customer?: Stripe.Customer | null;
};
export const useCustomerLoader = ({environment}: ExtensionContextValue): CustomerLoaderProps => {
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [customerLoadingStatus, setCustomerLoadingStatus] = useState<LoadingStatus>('');
    const [customer, setCustomer] = useState<Stripe.Customer | null>(null);
    const objectType = environment?.objectContext.object;
    const objectId = environment?.objectContext.id;
    useEffect(() => {
        if (objectType !== 'customer' || !objectId) {
            return;
        }
        setErrorMessage('');
        setCustomerLoadingStatus('loading');
        stripeClient.customers.retrieve(objectId)
        .then(data => {
            if (!isActiveCustomer(data)) {
                throw new Error(`This customer has been deleted.`);
            }
            if (!data.email) {
                throw new Error(`This customer has no email address.`);
            }
            setCustomer(data);
            setCustomerLoadingStatus('complete');
        }).catch(e => {
            setErrorMessage(e.message);
            setCustomerLoadingStatus('error');
        });
        return () => {
            setCustomer(null);
        };
    },[objectId, objectType, setCustomer, setErrorMessage]);

    return {
        customerLoadingErrorMessage: errorMessage,
        customerLoadingStatus,
        customer
    };
};
