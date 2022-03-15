import React, { useContext, useEffect } from 'react';

import type { TailorExtensionContextValue } from '@stripe/ui-extension-sdk/context';
import { ContextView } from '@stripe/ui-extension-sdk/ui';

import { AuthProvider } from '../components/AuthProvider';
import { CustomerGitHubDetails } from '../components/CustomerGitHubDetails';
import { CustomerSearch } from '../components/CustomerSearch';
import { GitHubContext, GitHubProvider } from '../components/GitHubProvider';
import { useCustomer } from '../hooks/useCustomer';

const SearchOrProfile = ({
  userContext,
  environment,
}: TailorExtensionContextValue) => {
  const { customer } = useCustomer(environment?.objectContext.id as string);
  const { state, dispatch } = useContext(GitHubContext);

  useEffect(() => {
    if (customer?.metadata.github_username) {
      dispatch({
        type: 'UPDATE_USERNAME',
        username: customer.metadata.github_username,
      });
      dispatch({
        type: 'TOGGLE_SEARCH_OR_PROFILE',
      });
    }
  }, [customer]);

  return state.isProfile ? (
    <CustomerGitHubDetails
      userContext={userContext}
      environment={environment}
    />
  ) : (
    <CustomerSearch userContext={userContext} environment={environment} />
  );
};

const CustomerDetail = ({
  userContext,
  environment,
}: TailorExtensionContextValue) => {
  return (
    <ContextView title="Find Customers on GitHub">
      <AuthProvider
        userContext={userContext as TailorExtensionContextValue['userContext']}
      >
        <GitHubProvider>
          <SearchOrProfile
            userContext={userContext}
            environment={environment}
          />
        </GitHubProvider>
      </AuthProvider>
    </ContextView>
  );
};

export default CustomerDetail;
