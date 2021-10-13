import {
  AlignBox,
  ContentBlock,
  ContentHeader,
  Group,
  Icon,
  Body,
  BodyMono,
  Heading,
} from "@stripe/tailor-browser-sdk/ui";
import { useStripeContext } from "@stripe/tailor-browser-sdk/context";
import { Tickets } from "node-zendesk";
import { useEffect, useState } from "react";

import stripeClient from "../clients/stripe";
import AuthWall, { useZendeskContext } from "../components/AuthWall";

const CustomerSupportHistory = () => {
  const {
    object: { id: customerId },
  } = useStripeContext();
  const zendeskClient = useZendeskContext();

  const [tickets, setTickets] = useState<Tickets.ListPayload>();

  const loadTickets = async (customerId: string) => {
    const customer = await stripeClient.customers.retrieve(customerId);
    if (customer.deleted === true) throw new Error("Customer is deleted");

    const tickets = await zendeskClient.getTicketsByEmail(customer.email);
    setTickets(tickets);
  };

  useEffect(() => {
    loadTickets(customerId);
  }, [customerId]);

  return (
    <>
      <ContentHeader
        size="large"
        title="🧩 This is CustomerSupportHistory!"
        description="Make a change to CustomerSupportHistory.tsx and reload to see your change here."
      />
      <ContentBlock padding={32}>
        <Group direction="horizontal" spacing={20}>
          <AlignBox flex={{ direction: "row" }}>
            <Icon icon="review" size={16} />
            <Group padding={{ left: 12 }} spacing={4}>
              <Heading>Views</Heading>
              <Body>{JSON.stringify(tickets)}</Body>
            </Group>
          </AlignBox>
          <AlignBox flex={{ direction: "row" }}>
            <Icon icon="change" size={16} />
            <Group padding={{ left: 12 }} spacing={4}>
              <Heading>Actions</Heading>
              <Body>These aren't implemented yet. </Body>
            </Group>
          </AlignBox>
          <AlignBox flex={{ direction: "row" }}>
            <Icon icon="api" size={16} />
            <Group padding={{ left: 12 }} spacing={4}>
              <Heading>Stripe CLI</Heading>
              <Body>
                The CLI offers a variety of helpful commands for working with
                Dashboard UI extensions. Run{" "}
                <BodyMono>stripe help extensions</BodyMono> to see all the
                options.
              </Body>
            </Group>
          </AlignBox>
        </Group>
      </ContentBlock>
    </>
  );
};

export default () => {
  return (
    <AuthWall>
      <CustomerSupportHistory />
    </AuthWall>
  );
};
