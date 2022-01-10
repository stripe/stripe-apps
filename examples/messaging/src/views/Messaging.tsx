import {
  Badge,
  Box,
  ContextView,
  List,
  ListItem,
} from '@stripe/ui-extension-sdk/ui';
import type {TailorExtensionContextValue} from '@stripe/ui-extension-sdk/context';

import {getEpochMsDisplayText} from '../utils/time';
import {fakeUserMessages} from '../fakeData';
import {useCustomer} from '../utils/stripeApi';

const Messaging = ({environment}: TailorExtensionContextValue) => {
  const customer = useCustomer(environment?.objectContext?.id);

  return (
    <ContextView title="Recent Messages">
      {fakeUserMessages.length ? (
        <List>
          {fakeUserMessages.map((message) => (
            <ListItem value={message.subject} id={message.id}>
              <Box>
                <Badge type="info">{getEpochMsDisplayText(message.date)}</Badge>
              </Box>
            </ListItem>
          ))}
        </List>
      ) : (
        <Box>
          No messages found.
        </Box>
      )}
      {!!customer && 'email' in customer && !!customer.email && (
        <Box
          css={{
            color: 'secondary',
            paddingY: 'medium',
          }}
        >
          Displaying messages between {customer.email} and some.merchant@example.com.
        </Box>
      )}
    </ContextView>
  );
};

export default Messaging;
