import {
  Box,
  Inline,
  Select,
  SettingsView,
  Switch,
  TextArea,
} from "@stripe/ui-extension-sdk/ui";
import type { ExtensionContextValue } from "@stripe/ui-extension-sdk/context";
import { useState, useEffect, useCallback } from "react";
import { Stripe } from 'stripe';
import { createHttpClient, STRIPE_API_KEY } from '@stripe/ui-extension-sdk/http_client';

interface SettingsData {
  description: string;
  country: string;
  language: string;
  account_id: string;
}

const SETTINGS_ENTITY_NAME = "app_settings";
const APP_ID = "STRIPE APP ACCOUNT ID";

const AppSettings = ({ userContext, environment }: ExtensionContextValue) => {
  const account_id = userContext.account.id;

  const stripe: Stripe = new Stripe(STRIPE_API_KEY, {
    httpClient: createHttpClient() as Stripe.HttpClient,
    apiVersion: '2020-08-27',
  });

  const datastoreEntityResource = Stripe.StripeResource.extend({
    find: Stripe.StripeResource.method({
      method: 'GET',
      path: '/datastore/entities/find',
    }) as (...args: any[]) => Promise<Stripe.Response<object>>,
    set: Stripe.StripeResource.method({
      method: 'POST',
      path: '/datastore/entities',
    }) as (...args: any[]) => Promise<Stripe.Response<object>>,
  });
  const entityResource = new datastoreEntityResource(stripe);

  const [status, setStatus] = useState("");
  const [storedValue, setStoredValue] = useState<SettingsData>();
  const [enableSetting, setEnableSetting] = useState<boolean>(false)

  useEffect(() => {
    const fetchSetting = async (key: string) => {
      try {
        const response = await entityResource.find({
          name: SETTINGS_ENTITY_NAME,
          resource: {
            object: "account",
            id: account_id,
          },
          bucket: {
            type: "app",
            app: APP_ID,
          }
        });
        setStoredValue(response.data);
      } catch (error) {
        console.log("Error fetching setting: ", error);
      }
    };
    fetchSetting(account_id);
  }, [account_id]);

  const saveSettings = useCallback(async (values) => {
    setStatus("Saving...");
    try {
      await entityResource.set({
        name: SETTINGS_ENTITY_NAME,
        data: values,
        resource: {
          object: "account",
          id: account_id,
        },
        bucket: {
          type: "app",
          app: APP_ID,
        }
      });
      setStatus("Saved!");
    } catch (error) {
      console.log("Error saving settings: ", error);
      setStatus("error");
    }
  }, []);

  return (
    <SettingsView onSave={saveSettings} statusMessage={status}>
      <Box
        css={{
          paddingY: "xxlarge",
          paddingX: "xxlarge",
          background: "container",
        }}
      >
        <Box
          css={{
            background: "surface",
            layout: "column",
            gap: "xxlarge",
            padding: "xlarge",
          }}
        >
          {storedValue && (
            <Box css={{ padding: "small" }}>
              <Box>
                <Inline css={{ marginRight: "large", font: "heading" }}>
                  Country:
                </Inline>
                {storedValue.country}
              </Box>
              <Box>
                <Inline css={{ marginRight: "large", font: "heading" }}>
                  Language:
                </Inline>
                {storedValue.language}
              </Box>
            </Box>
          )}
          <Box>
            <Switch
              label="Enable this app setting"
              value="disabled"
              onChange={(e) => setEnableSetting(e.target.checked)}

            />
            <Select name="country" label="Select Country" disabled={!enableSetting}>
              <option value="">--Options--</option>
              <option value="United states">United States</option>
              <option value="Netherlands">Netherlands</option>
              <option value="Canada">Canada</option>
              <option value="England">England</option>
            </Select>
            <Select name="language" label="Change App Language" disabled={!enableSetting}>
              <option value="">--Options--</option>
              <option value="English">English</option>
              <option value="French">French</option>
              <option value="Spanish">Spanish</option>
              <option value="Dutch">Dutch</option>
            </Select>
          </Box>
        </Box>
      </Box>
    </SettingsView>
  );
};

export default AppSettings;
