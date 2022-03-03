import {
  Box,
  ContextView,
  TextField,
  TextArea,
  Button,
  Inline,
} from '@stripe/ui-extension-sdk/ui';
import type { ExtensionContextValue } from '@stripe/ui-extension-sdk/context';
import { useSendMail } from '../hooks/sendMail';
import { useCustomerLoader } from '../hooks/loadCustomer';

const App = (props: ExtensionContextValue) => {
  const {
    customerLoadingErrorMessage,
    customerLoadingStatus,
    customer,
  } = useCustomerLoader(props);
  const {
    subject,
    setSubject,
    text,
    setText,
    callSendMailAPI,
    sendingStatus,
    sendEmailErrorMessage,
  } = useSendMail(props);
  return (
    <ContextView title="Send a quick email">
      <Box
        css={{
          padding: 'large',
          backgroundColor: 'container',
          fontFamily: 'monospace',
          borderRadius: 'small',
          gap: 'large'
        }}
      >
      {customerLoadingStatus === 'complete' ? (
        <Box>
          <Box>
            <TextField
              label="Subject"
              value={subject}
              onChange={e=>{
                setSubject(e.target.value);
              }}
            />
            <TextArea
              label="Content (Text only)"
              value={text}
              onChange={(e) => {
                setText(e.target.value);
              }}
            />
          </Box>
          <Box>
            <Button
              type="primary"
              onPress={e => {
                callSendMailAPI(customer);
              }}
              disabled={sendingStatus === 'sending'}
            >
              {sendingStatus === 'sending' ? 'Sending...' : 'Send'}
            </Button>
            {sendingStatus === 'error' ? (
              <Box>{sendEmailErrorMessage}</Box>
            ): null}
            {sendingStatus === 'complete' ? (
              <Box>Email has sent!</Box>
            ): null}
          </Box>
        </Box>
      ): (
        <Box>
          {customerLoadingStatus === 'loading' ? <Inline>Loading</Inline> : null}
          {customerLoadingStatus === 'error' ? <Inline>{customerLoadingErrorMessage}</Inline> : null}
        </Box>
      )}
      </Box>
    </ContextView>
  );
};

export default App;
