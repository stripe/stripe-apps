import { useEffect, useReducer } from "react";
import {
  Box,
  SettingsView,
  TextField,
  Select,
  FormFieldGroup,
  Divider,
} from "@stripe/ui-extension-sdk/ui";
import { withAppProviders } from "@/providers/AppProviders";
import { useQueuedToast } from "@/hooks/useQueuedToast";
import type { ExtensionContextValue } from "@stripe/ui-extension-sdk/context";

import {
  ProgramConfig,
  useSettingsQuery,
  useUpdateProgramConfigMutation,
} from "@/data";

type SettingsFormState = {
  programName: string;
  pointsPerDollar: string;
  activeDays: string;
  atRiskDays: string;
  currency: ProgramConfig["currency"];
};

type SettingsFormAction =
  | { type: "sync"; settings: ProgramConfig }
  | { type: "setProgramName"; value: string }
  | { type: "setPointsPerDollar"; value: string }
  | { type: "setActiveDays"; value: string }
  | { type: "setAtRiskDays"; value: string }
  | { type: "setCurrency"; value: ProgramConfig["currency"] };

const initialFormState: SettingsFormState = {
  programName: "",
  pointsPerDollar: "",
  activeDays: "",
  atRiskDays: "",
  currency: "usd",
};

function settingsFormReducer(
  state: SettingsFormState,
  action: SettingsFormAction,
): SettingsFormState {
  switch (action.type) {
    case "sync":
      return {
        programName: action.settings.name,
        pointsPerDollar: String(action.settings.pointsPerDollar),
        activeDays: String(action.settings.engagementWindows.active),
        atRiskDays: String(action.settings.engagementWindows.atRisk),
        currency: action.settings.currency,
      };
    case "setProgramName":
      return { ...state, programName: action.value };
    case "setPointsPerDollar":
      return { ...state, pointsPerDollar: action.value };
    case "setActiveDays":
      return { ...state, activeDays: action.value };
    case "setAtRiskDays":
      return { ...state, atRiskDays: action.value };
    case "setCurrency":
      return { ...state, currency: action.value };
  }
}

function AppSettingsView(_props: ExtensionContextValue) {
  const { data: settings, isLoading } = useSettingsQuery();
  const { mutate } = useUpdateProgramConfigMutation();
  const { queueToast } = useQueuedToast();
  const [form, dispatch] = useReducer(settingsFormReducer, initialFormState);

  useEffect(() => {
    if (settings) {
      dispatch({ type: "sync", settings });
    }
  }, [settings]);

  const handleSave = () => {
    mutate(
      {
        name: form.programName,
        pointsPerDollar: parseInt(form.pointsPerDollar, 10),
        currency: form.currency,
        engagementWindows: {
          active: parseInt(form.activeDays, 10),
          atRisk: parseInt(form.atRiskDays, 10),
        },
      },
      {
        onSuccess: () => {
          queueToast("Settings saved", "success");
        },
        onError: () => {
          queueToast("Could not save settings", "caution");
        },
      },
    );
  };

  if (isLoading || !settings) {
    return (
      <SettingsView onSave={handleSave}>
        <Box css={{ font: "caption", color: "secondary" }}>Loading…</Box>
      </SettingsView>
    );
  }

  return (
    <SettingsView onSave={handleSave}>
      <Box css={{ stack: "y", gap: "xlarge" }}>
        <Box css={{ stack: "y", gap: "small" }}>
          <Box css={{ font: "heading", fontWeight: "bold" }}>
            Program configuration
          </Box>
          <Box css={{ font: "caption", color: "secondary" }}>
            Configure how your loyalty program works.
          </Box>
        </Box>

        <FormFieldGroup legend="General" layout="vertical">
          <TextField
            label="Program name"
            description="The name displayed to your customers"
            value={form.programName}
            onChange={(e) =>
              dispatch({ type: "setProgramName", value: e.target.value })
            }
          />

          <TextField
            label="Points per dollar"
            description="How many points a customer earns per dollar spent"
            type="number"
            value={form.pointsPerDollar}
            onChange={(e) =>
              dispatch({ type: "setPointsPerDollar", value: e.target.value })
            }
          />

          <Select
            label="Currency"
            description="The currency used for monetary calculations"
            value={form.currency}
            onChange={(e) =>
              dispatch({
                type: "setCurrency",
                value: e.target.value as ProgramConfig["currency"],
              })
            }
          >
            <option value="usd">USD</option>
            <option value="eur">EUR</option>
            <option value="gbp">GBP</option>
          </Select>
        </FormFieldGroup>

        <Divider />

        <Box css={{ stack: "y", gap: "small" }}>
          <Box css={{ font: "subheading", fontWeight: "semibold" }}>
            Engagement thresholds
          </Box>
          <Box css={{ font: "caption", color: "secondary" }}>
            Define when members are considered active, at risk, or dormant based
            on days since their last purchase.
          </Box>
        </Box>

        <FormFieldGroup legend="Thresholds" layout="vertical">
          <TextField
            label="Active window (days)"
            description="Members who purchased within this many days are active"
            type="number"
            value={form.activeDays}
            onChange={(e) =>
              dispatch({ type: "setActiveDays", value: e.target.value })
            }
          />

          <TextField
            label="At-risk window (days)"
            description="Members past the active window but within this window are at risk"
            type="number"
            value={form.atRiskDays}
            onChange={(e) =>
              dispatch({ type: "setAtRiskDays", value: e.target.value })
            }
          />
        </FormFieldGroup>
      </Box>
    </SettingsView>
  );
}

export default withAppProviders(AppSettingsView);
