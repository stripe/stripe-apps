import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';

import type { TailorExtensionContextValue } from '@stripe/ui-extension-sdk/context';
import { ContextView } from '@stripe/ui-extension-sdk/ui';

import { AuthProvider } from '../components/AuthProvider';
import { CustomerGitHubDetails } from '../components/CustomerGitHubDetails';
import { CustomerSearch } from '../components/CustomerSearch';

const CustomerDetail = ({
  userContext,
  environment,
}: TailorExtensionContextValue) => {
  return (
    <ContextView title="Find Customers on GitHub">
      <AuthProvider
        userContext={userContext as TailorExtensionContextValue['userContext']}
      >
        <Router basename="/">
          <Routes>
            <Route
              path="/"
              element={
                <CustomerSearch
                  userContext={userContext}
                  environment={environment}
                />
              }
            />
            <Route
              path="/profile/:username"
              element={
                <CustomerGitHubDetails
                  userContext={userContext}
                  environment={environment}
                />
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ContextView>
  );
};

export default CustomerDetail;
