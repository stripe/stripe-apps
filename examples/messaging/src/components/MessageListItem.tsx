import React from 'react';
import {ContentListItem, Badge, Group} from '@stripe/tailor-browser-sdk/ui';

import {Message} from '../types';
import MessageDialog from './MessageDialog';
import {getEpochMsDisplayText} from '../utils/time';

const MessageListItem = ({message}: {message: Message}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <ContentListItem
      title={
        <Group style={{marginBottom: '4px'}}>
          {message.subject}
          <Badge label={getEpochMsDisplayText(message.date)} color="blue" />
        </Group>
      }
      end={<MessageDialog message={message} open={open} setOpen={setOpen} />}
      endAlign="center"
      description={message.snippet}
      onClick={() => setOpen(true)}
    />
  );
};

export default MessageListItem;
