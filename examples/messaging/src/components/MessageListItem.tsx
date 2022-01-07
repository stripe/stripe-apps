import {
  Badge,
  TableRow,
  TableCell,
  Link,
} from '@stripe/ui-extension-sdk/ui';

import {Message} from '../types';
import {getEpochMsDisplayText} from '../utils/time';

const MessageListItem = ({message}: {message: Message}) => {
  return (
    <TableRow>
      <TableCell>
        <Link href="#">{message.subject}</Link>
      </TableCell>
      <TableCell>
        <Badge type="info">{getEpochMsDisplayText(message.date)}</Badge>
      </TableCell>
    </TableRow>
  );
};

export default MessageListItem;
