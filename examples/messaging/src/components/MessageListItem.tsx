import React from 'react';
import {
  ContentListItem,
  Badge,
} from '@stripe/tailor-browser-sdk/ui';

import { Message } from '../types';
import MessageDialog from './MessageDialog';
import { getEpochMsDisplayText } from '../utils/time';

const MessageListItem = ({message}: {message: Message}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <ContentListItem
      start={<Badge label={getEpochMsDisplayText(message.date)} color="blue" />}
      end={<MessageDialog message={message} open={open} setOpen={setOpen} />}
      title={message.subject}
      description={message.snippet}
      onClick={() => setOpen(true)}
    />
  );
};

export default MessageListItem;
