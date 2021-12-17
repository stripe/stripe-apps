import {
  ContextView,
  Table,
  TableBody,
  TableHead,
  TableHeaderCell,
  TableRow,
  View,
} from '@stripe/tailor-browser-sdk/ui';
import type {TailorExtensionContextValue} from '@stripe/tailor-browser-sdk/context';

import MessageListItem from '../components/MessageListItem';
import {fakeUserMessages} from '../fakeData';
import {useCustomer} from '../utils/stripeApi';

const Messaging = ({environment}: TailorExtensionContextValue) => {
  const customer = useCustomer(environment?.objectContext?.id);

  return (
    <ContextView title="Recent Messages">
      {fakeUserMessages.length ? (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Subject</TableHeaderCell>
              <TableHeaderCell>Date</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fakeUserMessages.map((message) => (
              <MessageListItem key={message.id} message={message} />
            ))}
          </TableBody>
        </Table>
      ) : (
        <View>
          No messages found.
        </View>
      )}
      {!!customer && 'email' in customer && !!customer.email && (
        <View
          css={{
            fontSize: '10px',
            lineHeight: '1.5',
            color: 'secondary',
            paddingY: 'medium',
          }}
        >
          Displaying messages between {customer.email} and some.merchant@example.com.
        </View>
      )}
    </ContextView>
  );
};

export default Messaging;
