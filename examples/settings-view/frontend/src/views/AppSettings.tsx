import {
  Box,
  Inline,
  Select,
  SettingsView,
  Switch,
  TextArea,
} from "@stripe/ui-extension-sdk/ui";
import fetchStripeSignature from "@stripe/ui-extension-sdk/signature";
import type { ExtensionContextValue } from "@stripe/ui-extension-sdk/context";
import { useState, useEffect, useCallback } from "react";

interface SettingsData {
  description: string;
  country: string;
  language: string;
  user_id: string;
  account_id: string;
}

const BACKEND_URL = "http://localhost:8080/api/settings";

const AppSettings = ({ userContext, environment }: ExtensionContextValue) => {
  const [status, setStatus] = useState("");
  const [storedValue, setStoredValue] = useState<SettingsData>();
  const [enableSetting, setEnableSetting] = useState<boolean>(false)

  const user_id = userContext.id;

  useEffect(() => {
    const fetchSetting = async (key: string) => {
      try {
        const response = await fetch(`${BACKEND_URL}/${key}`);
        const storedSettingValue = await response.json();
        setStoredValue(storedSettingValue);
      } catch (error) {
        console.log("Error fetching setting: ", error);
      }
    };
    fetchSetting(user_id);
  }, [user_id]);

  const saveSettings = useCallback(async (values) => {
    setStatus("Saving...");
    try {
      const signaturePayload = {
        user_id,
        account_id: userContext?.account.id,
      };

      const data = {
        ...values,
        ...signaturePayload,
      };

      await fetch(`${BACKEND_URL}`, {
        method: "POST",
        headers: {
          "Stripe-Signature": await fetchStripeSignature(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      setStatus("Saved!");
    } catch (error) {
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
