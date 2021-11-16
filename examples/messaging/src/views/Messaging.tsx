import {
  ContentList,
  ContentState,
	EmbedView,
  Caption,
  CaptionAlt,
  ContentBlock,
  Section,
} from '@stripe/tailor-browser-sdk/ui';
import type { TailorExtensionContextValue } from '@stripe/tailor-browser-sdk/context';

import MessageListItem from '../components/MessageListItem';
import { fakeUserMessages } from '../fakeData';
import { useCustomer } from '../utils/stripeApi';

const Messaging = ({object}: TailorExtensionContextValue) => {
  const customer = useCustomer(object.id);

  return (
    <EmbedView title="Recent Messages">
      <Section>
        <ContentBlock>
          {fakeUserMessages.length ? (
            <ContentList>
              {fakeUserMessages.map((message) => (
                <MessageListItem key={message.id} message={message} />
              ))}
            </ContentList>
          ) : (
            <ContentState title="No messages found." />
          )}
        </ContentBlock>
        {!!customer?.email && (
          <ContentBlock padding={{top: 20}} divider={false}>
            <Caption display="block" color="gray">
              Displaying messages between{' '}
              <CaptionAlt>{customer.email}</CaptionAlt>{' '}
              and{' '}
              <CaptionAlt>some.merchant@example.com</CaptionAlt>.
            </Caption>
          </ContentBlock>
        )}
      </Section>
    </EmbedView>
  );
};

export default Messaging;
