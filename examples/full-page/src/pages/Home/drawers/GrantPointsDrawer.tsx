import { useEffect, useReducer } from "react";
import {
  FocusView,
  Button,
  Box,
  FormFieldGroup,
  Select,
  TextField,
  Divider,
  Icon,
} from "@stripe/ui-extension-sdk/ui";

import {
  useGrantPointsMutation,
  useMembersQuery,
  useSettingsQuery,
} from "@/data";
import { formatCurrency, formatPoints } from "@/utils/format";

type GrantPointsDrawerProps = {
  shown: boolean;
  setShown: (shown: boolean) => void;
  preselectedMemberId?: string;
  onGranted?: () => void;
  onGrantError?: () => void;
};

type GrantPointsFormState = {
  selectedMember: string;
  pointsAmount: string;
  grantReason: string;
};

type GrantPointsFormAction =
  | { type: "syncPreselected"; preselectedMemberId?: string }
  | { type: "setSelectedMember"; value: string }
  | { type: "setPointsAmount"; value: string }
  | { type: "setGrantReason"; value: string }
  | { type: "reset"; preselectedMemberId?: string };

function grantPointsFormReducer(
  state: GrantPointsFormState,
  action: GrantPointsFormAction,
): GrantPointsFormState {
  switch (action.type) {
    case "syncPreselected":
      return action.preselectedMemberId
        ? { ...state, selectedMember: action.preselectedMemberId }
        : state;
    case "setSelectedMember":
      return { ...state, selectedMember: action.value };
    case "setPointsAmount":
      return { ...state, pointsAmount: action.value };
    case "setGrantReason":
      return { ...state, grantReason: action.value };
    case "reset":
      return {
        selectedMember: action.preselectedMemberId ?? "",
        pointsAmount: "",
        grantReason: "",
      };
  }
}

export const GrantPointsDrawer = ({
  shown,
  setShown,
  preselectedMemberId,
  onGranted,
  onGrantError,
}: GrantPointsDrawerProps) => {
  const { data: members, isLoading, isError, error } = useMembersQuery();
  const { data: settings } = useSettingsQuery();
  const { mutate, isPending } = useGrantPointsMutation();
  const [form, dispatch] = useReducer(grantPointsFormReducer, {
    selectedMember: preselectedMemberId ?? "",
    pointsAmount: "",
    grantReason: "",
  });

  useEffect(() => {
    dispatch({ type: "syncPreselected", preselectedMemberId });
  }, [preselectedMemberId]);

  const isFormValid =
    form.selectedMember &&
    form.pointsAmount &&
    parseInt(form.pointsAmount) > 0;

  const handleClose = () => {
    setShown(false);
    dispatch({ type: "reset", preselectedMemberId });
  };

  const handleSubmit = () => {
    if (!members) {
      return;
    }

    const points = parseInt(form.pointsAmount, 10);

    mutate(
      {
        memberId: form.selectedMember,
        points,
        reason: form.grantReason || undefined,
      },
      {
        onSuccess: () => {
          dispatch({ type: "reset", preselectedMemberId });
          onGranted?.();
        },
        onError: () => {
          onGrantError?.();
        },
      },
    );
  };

  const selectedMemberDetails = members?.find(
    (m) => m.id === form.selectedMember,
  );

  return (
    <FocusView
      title="Grant points"
      shown={shown}
      setShown={(s) => {
        if (!s) handleClose();
      }}
      primaryAction={
        <Button
          type="primary"
          onPress={handleSubmit}
          disabled={!isFormValid || isLoading || isError || !members}
          pending={isPending}
        >
          Grant points
        </Button>
      }
      secondaryAction={<Button onPress={handleClose}>Cancel</Button>}
    >
      <Box css={{ stack: "y", gap: "large" }}>
        <Box css={{ font: "body", color: "secondary" }}>
          Award bonus points to a loyalty member for special occasions, customer
          service gestures, or promotional campaigns.
        </Box>

        {isLoading && (
          <Box css={{ font: "caption", color: "secondary" }}>Loading…</Box>
        )}

        {isError && (
          <Box css={{ font: "caption", color: "critical" }}>
            {error?.message ?? "Something went wrong"}
          </Box>
        )}

        {members && (
          <FormFieldGroup layout="vertical">
            <Select
              name="member"
              label="Select member"
              description="Choose the loyalty member to receive points"
              value={form.selectedMember}
              onChange={(e) =>
                dispatch({ type: "setSelectedMember", value: e.target.value })
              }
            >
              <option value="">Select a member...</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} ({member.email})
                </option>
              ))}
            </Select>

            <TextField
              name="points"
              label="Points to grant"
              type="number"
              placeholder="Enter amount"
              description="Number of bonus points to add to member's balance"
              value={form.pointsAmount}
              onChange={(e) =>
                dispatch({ type: "setPointsAmount", value: e.target.value })
              }
            />

            <Select
              name="reason"
              label="Reason"
              description="Categorize this points grant for reporting"
              value={form.grantReason}
              onChange={(e) =>
                dispatch({ type: "setGrantReason", value: e.target.value })
              }
            >
              <option value="">Select a reason...</option>
              <option value="customer_service">Customer service gesture</option>
              <option value="promotion">Promotional campaign</option>
              <option value="referral">Referral bonus</option>
              <option value="birthday">Birthday reward</option>
              <option value="anniversary">Membership anniversary</option>
              <option value="compensation">Service recovery</option>
              <option value="other">Other</option>
            </Select>
          </FormFieldGroup>
        )}

        {selectedMemberDetails && (
          <>
            <Divider />
            <Box css={{ stack: "y", gap: "small" }}>
              <Box css={{ font: "subheading", fontWeight: "semibold" }}>
                Member details
              </Box>
              <Box css={{ stack: "x", distribute: "space-between" }}>
                <Box css={{ color: "secondary" }}>Current balance</Box>
                <Box css={{ fontWeight: "semibold" }}>
                  {formatPoints(selectedMemberDetails.points)} points
                </Box>
              </Box>
              <Box css={{ stack: "x", distribute: "space-between" }}>
                <Box css={{ color: "secondary" }}>Tier</Box>
                <Box css={{ fontWeight: "semibold" }}>
                  {selectedMemberDetails.tier}
                </Box>
              </Box>
              <Box css={{ stack: "x", distribute: "space-between" }}>
                <Box css={{ color: "secondary" }}>Lifetime spend</Box>
                <Box css={{ fontWeight: "semibold" }}>
                  {formatCurrency(
                    selectedMemberDetails.lifetimeSpend,
                    settings?.currency,
                  )}
                </Box>
              </Box>
              {form.pointsAmount && parseInt(form.pointsAmount) > 0 && (
                <Box
                  css={{
                    stack: "x",
                    distribute: "space-between",
                    marginY: "small",
                  }}
                >
                  <Box css={{ color: "secondary" }}>New balance</Box>
                  <Box css={{ stack: "x", gap: "xsmall", alignY: "center" }}>
                    <Icon
                      name="arrowUp"
                      size="xsmall"
                      css={{ fill: "success" }}
                    />
                    <Box css={{ fontWeight: "bold" }}>
                      {formatPoints(
                        selectedMemberDetails.points +
                          parseInt(form.pointsAmount),
                      )}{" "}
                      points
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          </>
        )}
      </Box>
    </FocusView>
  );
};
