import {
  Badge,
  Button,
  ContentBlock,
  ContentHeader,
  Dialog,
  Group,
  ModalLayer,
} from '@stripe/tailor-browser-sdk/ui';

import { Message } from "../types";
import { getEpochMsDisplayText } from '../utils/time';

const padding = {horizontal: 20, vertical: 20};

const MessageDialog = ({message, open, setOpen}: {
  message: Message;
  open: boolean,
  setOpen: (open: boolean) => void,
}) => (
  <>
    <Button onClick={() => setOpen(true)} label="View Message" size="small" />
    <ModalLayer shown={!!open} onWashClick={setOpen} onEscape={setOpen}>
      <Dialog width="large">
        <ContentHeader
          padding={padding}
          title={message.subject}
          description={getEpochMsDisplayText(message.date)}
        />
        <ContentBlock padding={padding}>
          <Group direction="horizontal" spacing={12}>
            <Badge label={`From: ${message.from}`} />
            <Badge label={`To: ${message.to}`} />
          </Group>
        </ContentBlock>
        <ContentBlock padding={padding} style={{ whiteSpace: 'pre-wrap' }}>
          {message.body}
        </ContentBlock>
        <ContentHeader
          padding={padding}
          background="offset"
          end={
            <Group direction="horizontal" spacing={12}>
              <Button label="View in Messaging" icon="external" iconPosition="right" />
              <Button onClick={() => setOpen(false)} label="Close" />
            </Group>
          }
        />
      </Dialog>
    </ModalLayer>
  </>
);

export default MessageDialog;
