import React from 'react';
import Stripe from 'stripe';

import type { TailorExtensionContextValue } from '@stripe/ui-extension-sdk/context';
import { ContextView } from '@stripe/ui-extension-sdk/ui';

import { AuthProvider } from '../components/AuthProvider';
import { CustomerGitHubDetails } from '../components/CustomerGitHubDetails';
import { CustomerSearch } from '../components/CustomerSearch';

interface StateProps {
  github_username: string | null;
  previousCursor: string | null;
  nextCursor: string | null;
  firstOrLast: string | null;
  beforeOrAfter: string | null;
  customer: Stripe.Response<Stripe.Customer> | null;
}

const initialState: StateProps = {
  github_username: null,
  previousCursor: null,
  nextCursor: null,
  firstOrLast: null,
  beforeOrAfter: null,
  customer: null,
};

const GitHubContext = React.createContext<StateProps | null>(null);

const CustomerDetail = ({
  userContext,
  environment,
}: TailorExtensionContextValue) => {
  return (
    <ContextView title="Find Customers on GitHub">
      <AuthProvider
        userContext={userContext as TailorExtensionContextValue['userContext']}
      >
        <GitHubContext.Provider value={initialState}></GitHubContext.Provider>
      </AuthProvider>
    </ContextView>
  );
};

export default CustomerDetail;
