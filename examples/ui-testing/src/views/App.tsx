import {
  Box,
  Button,
  ContextView,
  FormFieldGroup,
  Banner,
  TextField,
} from '@stripe/ui-extension-sdk/ui';
import type { ExtensionContextValue } from '@stripe/ui-extension-sdk/context';
import { useState } from 'react';

const App = ({ userContext, environment }: ExtensionContextValue) => {
  const [fullName, setFullName] = useState<string>();
  const [show, setShow] = useState<boolean>(false);
  const [type, setType] = useState<'success' | 'error'>();

  const handleSubmit = () => {
    fullName ? setType('success') : setType('error');
    setShow(true);
  };
  return (
    <ContextView title="Create your first Stripe app">
      <Box
        css={{
          padding: 'large',
          backgroundColor: 'container',
          fontFamily: 'monospace',
          borderRadius: 'small',
        }}
      >
        <FormFieldGroup legend="Enter Full Name" layout="column">
          <TextField
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <Button onPress={handleSubmit}>Submit</Button>
        </FormFieldGroup>
        {show && (
          <Banner
            type={type == 'success' ? 'default' : 'critical'}
            title={type}
            description={
              type == 'success'
                ? 'Added full Name!'
                : 'First name or last name not entered!'
            }
            onDismiss={() => setShow(false)}
          />
        )}
      </Box>
    </ContextView>
  );
};

export default App;
