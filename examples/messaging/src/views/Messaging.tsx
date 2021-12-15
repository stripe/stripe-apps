import {
  ContentList,
  ContentState,
  ContextView,
  Caption,
  CaptionAlt,
  ContentBlock,
} from '@stripe/tailor-browser-sdk/ui';
import type {TailorExtensionContextValue} from '@stripe/tailor-browser-sdk/context';

import MessageListItem from '../components/MessageListItem';
import {fakeUserMessages} from '../fakeData';
import {useCustomer} from '../utils/stripeApi';

const Messaging = ({object}: TailorExtensionContextValue) => {
  const customer = useCustomer(object.id);

  return (
    <ContextView title="Recent Messages">
      {fakeUserMessages.length ? (
        <ContentList>
          {fakeUserMessages.map((message) => (
            <MessageListItem key={message.id} message={message} />
          ))}
        </ContentList>
      ) : (
        <ContentState title="No messages found." />
      )}
      {!!customer?.email && (
        <ContentBlock padding={{top: 20}} divider={false}>
          <Caption display="block" color="gray">
            Displaying messages between{' '}
            <CaptionAlt>{customer.email}</CaptionAlt> and{' '}
            <CaptionAlt>some.merchant@example.com</CaptionAlt>.
          </Caption>
        </ContentBlock>
      )}
    </ContextView>
  );
};

export default Messaging;
