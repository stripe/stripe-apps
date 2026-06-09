import { useReducer, useEffect } from "react";

import {
  Box,
  Button,
  FocusView,
  Select,
  TextField,
} from "@stripe/ui-extension-sdk/ui";

import type { Payment } from "../../data/mockData";

interface FormState {
  customer: string;
  email: string;
  amount: string;
  description: string;
  currency: string;
}

type FormAction =
  | { type: "SET_FIELD"; field: keyof FormState; value: string }
  | { type: "RESET"; payment?: Payment };

const emptyForm: FormState = {
  customer: "",
  email: "",
  amount: "",
  description: "",
  currency: "usd",
};

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "RESET":
      if (action.payment) {
        return {
          customer: action.payment.customer,
          email: action.payment.email,
          amount: String(action.payment.amount),
          description: action.payment.description,
          currency: action.payment.currency,
        };
      }
      return emptyForm;
  }
}

interface PaymentFormProps {
  shown: boolean;
  onClose: () => void;
  payment?: Payment;
  onSave: (data: { customer: string; email: string; amount: number; currency: string; description: string }) => void;
}

export function PaymentForm({ shown, onClose, payment, onSave }: PaymentFormProps) {
  const [form, dispatch] = useReducer(formReducer, emptyForm);
  const isEditing = !!payment;

  useEffect(function () {
    dispatch({ type: "RESET", payment });
  }, [payment, shown]);

  function setField(field: keyof FormState) {
    return function (e: { target: { value: string } }) {
      dispatch({ type: "SET_FIELD", field, value: e.target.value });
    };
  }

  function handleSave() {
    onSave({
      customer: form.customer,
      email: form.email,
      amount: Number(form.amount),
      currency: form.currency,
      description: form.description,
    });
  }

  return (
    <FocusView
      title={isEditing ? "Edit payment" : "Create payment"}
      shown={shown}
      setShown={function (visible) {
        if (!visible) onClose();
      }}
      primaryAction={
        <Button type="primary" onPress={handleSave}>
          {isEditing ? "Save" : "Create"}
        </Button>
      }
      secondaryAction={<Button onPress={onClose}>Cancel</Button>}
    >
      <Box css={{ stack: "y", rowGap: "large", paddingY: "medium" }}>
        <TextField
          label="Customer name"
          placeholder="e.g. Acme Corp"
          value={form.customer}
          onChange={setField("customer")}
        />
        <TextField
          label="Email"
          placeholder="e.g. billing@acme.com"
          value={form.email}
          onChange={setField("email")}
        />
        <Box css={{ stack: "x", columnGap: "medium", distribute: "packed" }}>
          <Box css={{ width: "fill" }}>
            <TextField
              label="Amount (in cents)"
              placeholder="e.g. 4999"
              type="number"
              value={form.amount}
              onChange={setField("amount")}
            />
          </Box>
          <Box css={{ width: "1/4" }}>
            <Select
              label="Currency"
              value={form.currency}
              onChange={setField("currency")}
            >
              <option value="usd">USD</option>
              <option value="eur">EUR</option>
              <option value="gbp">GBP</option>
            </Select>
          </Box>
        </Box>
        <TextField
          label="Description"
          placeholder="e.g. Pro plan - March"
          value={form.description}
          onChange={setField("description")}
        />
      </Box>
    </FocusView>
  );
}

