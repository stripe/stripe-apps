import {
    ButtonLink,
    ContentBlock,
    ContentList,
    ContentListItem,
    Grid,
    GridItem,
    Group,
    Section,
    BodyAlt,
    BodyExtra,
    Caption,
    Heading,
    Text,
    TextInput,
    TextArea,
    TruncatedText,
    Avatar
  } from '@stripe-internal/extensions-sail';
import {capitalize} from './utils';


const formatDateTime = (timestamp) => {
  // FIXME: Date and time formatting.
  return timestamp;
}

const lookupZendeskUser = (userId) => {
  // FIXME: Get user details.
  // NOTE: Cache user lookups locally so we don't look up the same user twice.
  return {
    name: "Mr. Not Implemented",
    email: "notimplemented@example.com"
  };
}

const fetchTicketConversation = (ticket_id) => {
  // FIXME: Get the conversation thread for the ticket.
  return [
    {
      submitter_id: "Mr. Not Implement",
      created_at: "2021-09-03T21:48:08Z",
      message: "This feature is not implemented yet."
    }
  ];
}

type Props = {
  ticket: any,
  children?: React.Node,
};

const TicketDetails = ({ticket, children}: Props): React.Node => {
  const submitter = lookupZendeskUser(ticket.submitter_id) || {};
  const assignee = lookupZendeskUser(ticket.assignee_id) || {};

  const conversationItems = fetchTicketConversation(ticket.id).map((item, index) => {
    const user = lookupZendeskUser(item.submitter_id);
    return (<ContentListItem
      key={index}
      start={<Avatar />}
      title={
        <Text>
          <BodyExtra display="inline-block" style={{marginRight: 8}}>
            {user.name}
          </BodyExtra>
          <Caption color="gray">{formatDateTime(item.created_at)}</Caption>
        </Text>
      }
      description={item.message}
    />);
  });

  return (
    <Section>
      <ContentBlock padding={{bottom: 24, left: 4, right: 4}}>
        <Grid>
          <GridItem columnSpan={10}>
            <Heading display="block"><TruncatedText>{ticket.subject || ticket.description}</TruncatedText></Heading>
            <Text>{formatDateTime(ticket.created_at)} - {submitter?.name} [{submitter?.email}]</Text>
          </GridItem>
          <GridItem column={11} columnSpan={2}>
            <ButtonLink label={`Status: ${capitalize(ticket.status)}`} iconPosition="right" />
          </GridItem>
        </Grid>
      </ContentBlock>
      <ContentBlock padding={{top: 24, bottom: 24, left: 4, right: 4}}>
        <form>
          <Grid>
            <GridItem columnSpan={6}>
              <Group spacing={4} padding={{right: 16}}>
                <Grid>
                  <GridItem columnSpan={8}>
                    <label htmlFor="assignee">
                      <BodyAlt>Assignee</BodyAlt>
                    </label>
                  </GridItem>
                  <GridItem column={9} columnSpan={4} style={{align: 'right'}}>
                    <ButtonLink label="Assign To Me" />
                  </GridItem>
                </Grid>
                <TextInput
                  id="assignee"
                  autoComplete="username email"
                  placeholder="you@example.com"
                  width="maximized"
                  value={assignee?.name}
                />
              </Group>
            </GridItem>
            <GridItem column={7} columnSpan={6}>
              <Group spacing={4}>
                <label htmlFor="ccs">
                  <BodyAlt>CCs</BodyAlt>
                </label>
                <TextInput id="ccs" width="maximized" value={ticket.email_cc_ids}/>
              </Group>
            </GridItem>
            <GridItem row={2} columnSpan={12}>
              <Group spacing={4} padding={{top: 24}}>
                <label htmlFor="reply">
                  <BodyAlt>Public Reply</BodyAlt>
                </label>
                <TextArea id="reply" width="maximized" />
              </Group>
            </GridItem>
          </Grid>
        </form>
      </ContentBlock>
      <ContentBlock padding={{top: 24, left: 4, right: 4}}>
        <BodyAlt>Conversations</BodyAlt>
        <ContentList>
          {conversationItems}
        </ContentList>
      </ContentBlock>
    </Section>
  );
};

export default TicketDetails;
