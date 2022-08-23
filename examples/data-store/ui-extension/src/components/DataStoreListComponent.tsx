import { useCallback, useEffect, useState } from 'react';
import { Stripe } from 'stripe';
import {
  Accordion,
  AccordionItem,
  Box,
  Button,
  List,
  ListItem
} from "@stripe/ui-extension-sdk/ui";
import { createHttpClient, STRIPE_API_KEY } from '@stripe/ui-extension-sdk/http_client';

const APP_ID = "STRIPE APP ACCOUNT ID";

type DataStoreBucketType = 'app';
type DataStoreResourceType = 'customer' | 'payment_intent' | 'charge';
type Entity = {
  id: string;
  object: string;
  livemode: boolean;
  resource: DataStoreResource;
  bucket: DataStoreBucket;
  name: string;
  data: object;
  created: number;
};
type ListComponentProperties = {
  resourceType: DataStoreResourceType;
  resourceId: string;
};
type DataStoreResource = {
  object: DataStoreResourceType;
  id: string;
};
type DataStoreBucket = {
  type: DataStoreBucketType;
  app?: string;
};

const DataStoreListComponent = ({ resourceType, resourceId }: ListComponentProperties) => {
  const stripe: Stripe = new Stripe(STRIPE_API_KEY, {
    httpClient: createHttpClient() as Stripe.HttpClient,
    apiVersion: '2020-08-27',
  });

  const listEntities = async () => {
    const listEntityResource = Stripe.StripeResource.extend({
      list: Stripe.StripeResource.method({
        method: 'GET',
        path: '/datastore/entities',
      }) as (...args: any[]) => Promise<Stripe.Response<object>>,
    });
    const entityResource = new listEntityResource(stripe);

    try {
      return await entityResource.list({
        resource: {
          object: resourceType,
          id: resourceId,
        },
        bucket: {
          type: "app",
          app: APP_ID
        }
      });
    } catch (e) {
      console.error(e);
    }
  };

  const [entities, setEntities] = useState<Entity[]>([]);

  const getEntities = async () => {
    const response = await listEntities();
    setEntities(response.data);
  };

  useEffect(() => {
    getEntities();
  }, []);

  const pluralizeKeys = (data: object) => {
    const n = Object.keys(data).length;
    return (n > 1) ? `${n} keys` : '1 key';
  };

  return (
    <Box css={{margin: "small"}}>
      <Accordion>
        {entities.map((entity) => {
          return <AccordionItem key={entity.id} title={entity.name} subtitle={pluralizeKeys(entity.data)}>
            <Box css={{padding: "small"}}>
              <List>
                {Object.entries(entity.data).map(([key, val], _) => {
                  return <ListItem key={key} title={key} value={val} />;
                })}
              </List>
            </Box>
          </AccordionItem>
        })}
      </Accordion>
      <Box css={{margin: "medium"}}>
        <Button type="primary" onPress={getEntities}>Reload Entities</Button>
      </Box>
    </Box>
  );
};

export default DataStoreListComponent;
