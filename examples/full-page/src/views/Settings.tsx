import { useState } from "react";

import {
  Box,
  Button,
  Inline,
  Select,
  SettingsView,
  Switch,
} from "@stripe/ui-extension-sdk/ui";
import type { ExtensionContextValue } from "@stripe/ui-extension-sdk/context";

export default function Settings({ userContext, environment }: ExtensionContextValue) {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  return (
    <SettingsView>
      <Box css={{ stack: "y", rowGap: "xlarge", maxWidth: "1/2" }}>
        <Box css={{ stack: "y", rowGap: "medium" }}>
          <Inline css={{ font: "heading" }}>Display Preferences</Inline>

          <Select label="Default currency" defaultValue="usd">
            <option value="usd">USD — US Dollar</option>
            <option value="eur">EUR — Euro</option>
            <option value="gbp">GBP — British Pound</option>
            <option value="cad">CAD — Canadian Dollar</option>
            <option value="aud">AUD — Australian Dollar</option>
            <option value="jpy">JPY — Japanese Yen</option>
          </Select>

          <Select label="Timezone" defaultValue="utc">
            <option value="utc">UTC</option>
            <option value="us_eastern">US Eastern (ET)</option>
            <option value="us_pacific">US Pacific (PT)</option>
            <option value="europe_london">Europe/London (GMT)</option>
            <option value="europe_berlin">Europe/Berlin (CET)</option>
            <option value="asia_tokyo">Asia/Tokyo (JST)</option>
          </Select>
        </Box>

        <Box css={{ stack: "y", rowGap: "medium" }}>
          <Inline css={{ font: "heading" }}>Notifications</Inline>

          <Switch
            label="Email notifications"
            description="Receive alerts for failed payments and unusual activity"
            checked={emailNotifications}
            onChange={(e) => setEmailNotifications(e.target.checked)}
          />

          <Switch
            label="Weekly digest"
            description="Get a summary of your revenue and key metrics every Monday"
            checked={weeklyDigest}
            onChange={(e) => setWeeklyDigest(e.target.checked)}
          />
        </Box>

        <Box>
          <Button type="primary" onPress={() => {}}>
            Save settings
          </Button>
        </Box>
      </Box>
    </SettingsView>
  );
};

