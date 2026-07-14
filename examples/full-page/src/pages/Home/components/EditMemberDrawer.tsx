import { useEffect, useReducer } from "react";
import {
  Box,
  Button,
  CurrencyField,
  FocusView,
  FormFieldGroup,
  TextField,
} from "@stripe/ui-extension-sdk/ui";
import type { Member, ProgramConfig } from "@/data";
import { useSettingsQuery, useUpdateMemberMutation } from "@/data";
import { useQueuedToast } from "@/hooks/useQueuedToast";

type EditMemberDrawerProps = {
  member: Member | null;
  shown: boolean;
  setShown: (shown: boolean) => void;
};

export function EditMemberDrawer(props: EditMemberDrawerProps) {
  const {
    shown,
    handleSetShown,
    handleClose,
    handleSubmit,
    name,
    onNameChange,
    email,
    onEmailChange,
    programCurrency,
    lifetimeSpendCents,
    onLifetimeSpendChange,
    isSubmitDisabled,
    isPending,
  } = useEditMemberDrawer(props);

  return (
    <FocusView
      title="Edit member"
      shown={shown}
      setShown={handleSetShown}
      primaryAction={
        <Button
          type="primary"
          onPress={handleSubmit}
          disabled={isSubmitDisabled}
          pending={isPending}
        >
          Save
        </Button>
      }
      secondaryAction={<Button onPress={handleClose}>Cancel</Button>}
    >
      <Box css={{ stack: "y", gap: "large" }}>
        <FormFieldGroup layout="vertical">
          <TextField
            name="name"
            label="Name"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
          />
          <TextField
            name="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
          />
          <CurrencyField
            label="Lifetime spend"
            description={`Total amount this member has spent, in ${programCurrency}`}
            currency={programCurrency}
            currencyAllowlist={[programCurrency]}
            value={lifetimeSpendCents}
            onChange={onLifetimeSpendChange}
          />
        </FormFieldGroup>
      </Box>
    </FocusView>
  );
}

type EditMemberFormState = {
  name: string;
  email: string;
  lifetimeSpendCents: number;
};

type EditMemberFormAction =
  | { type: "sync"; member: Member | null }
  | { type: "setName"; value: string }
  | { type: "setEmail"; value: string }
  | { type: "setLifetimeSpendCents"; value: number }
  | { type: "reset" };

const initialFormState: EditMemberFormState = {
  name: "",
  email: "",
  lifetimeSpendCents: 0,
};

const toSdkCurrency = (
  currency: ProgramConfig["currency"],
): "USD" | "EUR" | "GBP" => currency.toUpperCase() as "USD" | "EUR" | "GBP";

const dollarsToCents = (amount: number) => Math.round(amount * 100);

const centsToDollars = (amount: number) => amount / 100;

function editMemberFormReducer(
  state: EditMemberFormState,
  action: EditMemberFormAction,
): EditMemberFormState {
  switch (action.type) {
    case "sync":
      return {
        name: action.member?.name ?? "",
        email: action.member?.email ?? "",
        lifetimeSpendCents: dollarsToCents(action.member?.lifetimeSpend ?? 0),
      };
    case "setName":
      return { ...state, name: action.value };
    case "setEmail":
      return { ...state, email: action.value };
    case "setLifetimeSpendCents":
      return { ...state, lifetimeSpendCents: action.value };
    case "reset":
      return initialFormState;
  }
}

function useEditMemberDrawer({
  member,
  shown,
  setShown,
}: EditMemberDrawerProps) {
  const { data: settings } = useSettingsQuery();
  const { mutate, isPending } = useUpdateMemberMutation();
  const { queueToast } = useQueuedToast();
  const [form, dispatch] = useReducer(editMemberFormReducer, initialFormState);

  useEffect(() => {
    dispatch({ type: "sync", member });
  }, [member]);

  const programCurrency = toSdkCurrency(settings?.currency ?? "usd");

  const handleClose = () => {
    setShown(false);
    dispatch({ type: "reset" });
  };

  const handleSubmit = () => {
    if (!member) {
      return;
    }

    mutate(
      {
        id: member.id,
        name: form.name,
        email: form.email,
        lifetimeSpend: centsToDollars(form.lifetimeSpendCents),
      },
      {
        onSuccess: () => {
          queueToast("Member updated", "success");
          handleClose();
        },
        onError: () => {
          queueToast("Could not save member", "caution");
        },
      },
    );
  };

  return {
    shown,
    handleSetShown: (open: boolean) => {
      if (!open) handleClose();
    },
    handleClose,
    handleSubmit,
    name: form.name,
    onNameChange: (value: string) => dispatch({ type: "setName", value }),
    email: form.email,
    onEmailChange: (value: string) => dispatch({ type: "setEmail", value }),
    programCurrency,
    lifetimeSpendCents: form.lifetimeSpendCents,
    onLifetimeSpendChange: (value: number | null) =>
      dispatch({
        type: "setLifetimeSpendCents",
        value: value ?? 0,
      }),
    isSubmitDisabled: !form.name || !form.email,
    isPending,
  };
}
