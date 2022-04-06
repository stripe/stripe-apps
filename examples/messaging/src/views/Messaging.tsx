import {useState} from 'react';
import {
  Badge,
  Box,
  Button,
  ContextView,
  FocusView,
  List,
  ListItem,
} from '@stripe/ui-extension-sdk/ui';
import type {ExtensionContextValue} from '@stripe/ui-extension-sdk/context';

import type { Message } from "../types";
import {getEpochMsDisplayText} from '../utils/time';
import {fakeUserMessages} from '../fakeData';
import {useCustomer, useDashboardUserEmail} from '../utils/stripeApi';

const Messaging = ({environment, userContext}: ExtensionContextValue) => {
  const customer = useCustomer(environment?.objectContext?.id);
  const dashboardUserEmail = useDashboardUserEmail();
  const [openMessage, setOpenMessage] = useState<Message | undefined>(undefined);

  return (
    <ContextView title="Recent Messages">
      {fakeUserMessages.length ? (
        <List
          onAction={(id) => setOpenMessage(fakeUserMessages.find((message) => message.id === id))}
        >
          {fakeUserMessages.map((message) => (
            <ListItem
              id={message.id}
              key={message.id}
              title={
                <>
                  <Box>{message.subject}</Box>
                  <Box css={{font: 'caption', color: 'secondary'}}>
                    {getEpochMsDisplayText(message.date)}
                  </Box>
                </>
              }
            />
          ))}
        </List>
      ) : (
        <Box>
          No messages found.
        </Box>
      )}
      {!!customer && 'email' in customer && !!customer.email && dashboardUserEmail && (
        <Box
          css={{
            font: 'caption',
            color: 'secondary',
            paddingY: 'medium',
          }}
        >
          Displaying messages between {customer.email} and {dashboardUserEmail}.
        </Box>
      )}
      <FocusView
        shown={!!openMessage}
        title={openMessage?.subject || '...'}
        onClose={() => setOpenMessage(undefined)}
        primaryAction={<Button onPress={() => setOpenMessage(undefined)}>Close</Button>}
      >
        <Box css={{paddingBottom: 'medium'}}>
          <Badge type="info">{getEpochMsDisplayText(openMessage?.date || 0)}</Badge>
        </Box>
        {openMessage?.body}
      </FocusView>
    </ContextView>
  );
};

export default Messaging;
