import { useReducer, useCallback, useMemo } from "react";

import { payments as initialPayments } from "../data/mockData";
import type { Payment } from "../data/mockData";

export interface PaymentFormData {
  customer: string;
  email: string;
  amount: number;
  currency: string;
  description: string;
}

interface State {
  payments: Payment[];
  selectedPayment: Payment | null;
  showForm: boolean;
  editingPayment: Payment | undefined;
}

type Action =
  | { type: "CREATE_PAYMENT"; payment: Payment }
  | { type: "EDIT_PAYMENT"; payment: Payment }
  | { type: "REFUND_PAYMENT" }
  | { type: "REFUND_PAYMENT_BY_ID"; id: string }
  | { type: "SELECT_PAYMENT"; payment: Payment | null }
  | { type: "OPEN_CREATE_FORM" }
  | { type: "OPEN_EDIT_FORM" }
  | { type: "CLOSE_FORM" };

const initialState: State = {
  payments: initialPayments,
  selectedPayment: null,
  showForm: false,
  editingPayment: undefined,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "CREATE_PAYMENT":
      return {
        ...state,
        payments: [action.payment, ...state.payments],
        showForm: false,
      };

    case "EDIT_PAYMENT": {
      const payments = state.payments.map(function (payment) {
        return payment.id === action.payment.id ? action.payment : payment;
      });
      return {
        ...state,
        payments,
        selectedPayment: action.payment,
        editingPayment: undefined,
        showForm: false,
      };
    }

    case "REFUND_PAYMENT": {
      if (!state.selectedPayment) return state;
      const refunded: Payment = { ...state.selectedPayment, status: "refunded" };
      const payments = state.payments.map(function (payment) {
        return payment.id === refunded.id ? refunded : payment;
      });
      return { ...state, payments, selectedPayment: refunded };
    }

    case "REFUND_PAYMENT_BY_ID": {
      const payments = state.payments.map(function (payment) {
        return payment.id === action.id ? { ...payment, status: "refunded" as const } : payment;
      });
      return { ...state, payments };
    }

    case "SELECT_PAYMENT":
      return { ...state, selectedPayment: action.payment };

    case "OPEN_CREATE_FORM":
      return { ...state, showForm: true, editingPayment: undefined };

    case "OPEN_EDIT_FORM":
      return state.selectedPayment
        ? { ...state, showForm: true, editingPayment: state.selectedPayment }
        : state;

    case "CLOSE_FORM":
      return { ...state, showForm: false };
  }
}

export function usePayments() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const paymentsById = useMemo(function () {
    return new Map(
      state.payments.map(function (payment) {
        return [payment.id, payment];
      })
    );
  }, [state.payments]);

  const customerFilterOptions = useMemo(function () {
    const seen = new Map<string, string>();
    for (const payment of state.payments) {
      if (!seen.has(payment.customer)) {
        seen.set(payment.customer, `cus_${seen.size + 1}`);
      }
    }
    return Array.from(seen.entries())
      .map(function ([label, id]) {
        return { id, label };
      })
      .sort(function (a, b) {
        return a.label.localeCompare(b.label);
      });
  }, [state.payments]);

  const createPayment = useCallback(function (data: PaymentFormData) {
    const payment: Payment = {
      id: `pi_${Date.now().toString(36).toUpperCase()}`,
      customer: data.customer,
      email: data.email,
      amount: data.amount,
      currency: data.currency,
      status: "pending",
      date: new Date().toISOString().split("T")[0],
      description: data.description,
      receiptUrl: "",
    };
    dispatch({ type: "CREATE_PAYMENT", payment });
  }, []);

  const editPayment = useCallback(function (data: PaymentFormData) {
    dispatch({
      type: "EDIT_PAYMENT",
      payment: { ...state.editingPayment!, ...data },
    });
  }, [state.editingPayment]);

  const refundPayment = useCallback(function () {
    dispatch({ type: "REFUND_PAYMENT" });
  }, []);

  const refundPaymentById = useCallback(function (id: string) {
    dispatch({ type: "REFUND_PAYMENT_BY_ID", id });
  }, []);

  const selectPayment = useCallback(function (payment: Payment | null) {
    dispatch({ type: "SELECT_PAYMENT", payment });
  }, []);

  const openCreateForm = useCallback(function () {
    dispatch({ type: "OPEN_CREATE_FORM" });
  }, []);

  const openEditForm = useCallback(function () {
    dispatch({ type: "OPEN_EDIT_FORM" });
  }, []);

  const closeForm = useCallback(function () {
    dispatch({ type: "CLOSE_FORM" });
  }, []);

  return {
    payments: state.payments,
    paymentsById,
    customerFilterOptions,
    selectedPayment: state.selectedPayment,
    showForm: state.showForm,
    editingPayment: state.editingPayment,
    selectPayment,
    createPayment,
    editPayment,
    refundPayment,
    refundPaymentById,
    openCreateForm,
    openEditForm,
    closeForm,
  };
}
