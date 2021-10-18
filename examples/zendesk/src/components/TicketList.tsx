import {
    Badge,
    Button,
    ButtonLink,
    ButtonGroup,
    ContentBlock,
    ContentHeader,
    ContentListItem,
    ContentList,
    ErrorState,
    LoadingState,
    ModalView,
    Section,
    Text,
    TruncatedText
    } from '@stripe/tailor-browser-sdk/ui';
import { Tickets } from 'node-zendesk';
import {useEffect, useState} from 'react';
import { useZendeskContext } from "../components/AuthWall";

import TicketDetails from './TicketDetails';
import {statusColorMap, capitalize} from './utils';


const TicketList = (): JSX.Element => {
  const [ticketData, setTicketData] = useState<Tickets.ListPayload>();
  const [currentPage, setCurrentPage] = useState<Number>(0);
  const [modalState, setModalState] = useState<'hidden'|'visible'|'pending'>('hidden');
  const [modalTicket, setModalTicket] = useState<any>(null);
  const heading = 'Support History';
  const createButtonLabel = 'Create';
  const zendeskClient = useZendeskContext();

  let ticketItems;

  const handleTicketUpdate = async() => {
      setModalState('pending');
      // TODO: POST to Zendesk
      setModalState('hidden');
  }

  const DetailModal = (): JSX.Element => {
    const modalContent = modalTicket ? <TicketDetails ticket={modalTicket}></TicketDetails> : null;

    return (
      <ModalView
        shown={modalState !== 'hidden'}
        width="xlarge"
        title={`Ticket #${modalTicket?.id}`}
        onClose={() => setModalState('hidden')}
        actions={
          <ButtonGroup>
            <Button label="Cancel" onClick={() => setModalState('hidden')} />
            <Button label="Submit" onClick={handleTicketUpdate} color="primary" pending={modalState==='pending'} />
          </ButtonGroup>
        }
      >
        {modalContent}
        <Text style={{display: "none"}}>FIXME: Figure out why remote-ui breaks when there's only a single child, and that child is imported from another module.</Text>
      </ModalView>
  )};

  const loadTickets = async () => {
    const ticketData = await zendeskClient.getTickets();
    setTicketData(ticketData);
  }

  useEffect(() => {
    // TODO: Support pagination using `currentPage`. For now the dependency still breaks the infinite loop in useEffect.
    loadTickets();
  }, [currentPage]);

  if (ticketData?.tickets) {
    ticketItems = ticketData.tickets.map((ticket, index) => {

      const ticketTitle = <TruncatedText>{ticket.subject || ticket.description}</TruncatedText>;

      return (
        <ContentListItem
          onClick={() => {
            setModalTicket(ticket);
            setModalState('visible');
          }}
          key={index}
          start={
            <Badge
              color={statusColorMap[ticket.status]}
              label={`#${ticket.id}`}
            />
          }
          title={ticketTitle}
          end={(
            <ButtonLink
              label={capitalize(ticket.status)}
              color="grey"
              iconPosition="right"
            />
          )}
        />
      );
    });
  } else if (ticketData?.error) {
    ticketItems = (
      <ErrorState size="medium" title="Unable To Load ZenDesk Tickets" />
    );
  } else {
    ticketItems = (
      <LoadingState size="medium" title="Loading ZenDesk Tickets" />
    );
  }

  return (
    <Section shadow="none">
      <DetailModal/>
      <ContentBlock>
        <ContentHeader
          size="medium"
          title={heading}
          end={<ButtonLink label={createButtonLabel} />}
        />
        <ContentList>{ticketItems}</ContentList>
      </ContentBlock>
      <ContentBlock padding={{horizontal: 20, vertical: 8}}>
        <ButtonLink
          label="View on Zendesk"
          icon="chevronRight"
          iconPosition="right"
        />
      </ContentBlock>
    </Section>
  );
};

export default TicketList;
