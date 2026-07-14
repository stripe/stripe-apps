import { useEffect, useReducer } from "react";
import {
  FocusView,
  Button,
  Box,
  FormFieldGroup,
  TextField,
  Select,
  Switch,
} from "@stripe/ui-extension-sdk/ui";
import type { Reward } from "@/data";
import { useUpdateRewardMutation } from "@/data";
import { useQueuedToast } from "@/hooks/useQueuedToast";

type EditRewardDrawerProps = {
  reward: Reward | null;
  shown: boolean;
  setShown: (shown: boolean) => void;
};

export function EditRewardDrawer(props: EditRewardDrawerProps) {
  const {
    shown,
    handleSetShown,
    handleClose,
    handleSubmit,
    name,
    onNameChange,
    description,
    onDescriptionChange,
    pointsCost,
    onPointsCostChange,
    category,
    onCategoryChange,
    available,
    onAvailableChange,
    isSubmitDisabled,
    isPending,
  } = useEditRewardDrawer(props);

  return (
    <FocusView
      title="Edit reward"
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
            name="description"
            label="Description"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
          />
          <TextField
            name="pointsCost"
            label="Points cost"
            type="number"
            value={pointsCost}
            onChange={(e) => onPointsCostChange(e.target.value)}
          />
          <Select
            name="category"
            label="Category"
            value={category}
            onChange={(e) =>
              onCategoryChange(e.target.value as Reward["category"])
            }
          >
            <option value="coffee">Coffee</option>
            <option value="merchandise">Merchandise</option>
          </Select>
          <Switch
            label="Available"
            checked={available}
            onChange={(e) => onAvailableChange(e.target.checked)}
          />
        </FormFieldGroup>
      </Box>
    </FocusView>
  );
}

type EditRewardFormState = {
  name: string;
  description: string;
  pointsCost: string;
  category: Reward["category"];
  available: boolean;
};

type EditRewardFormAction =
  | { type: "sync"; reward: Reward | null }
  | { type: "setName"; value: string }
  | { type: "setDescription"; value: string }
  | { type: "setPointsCost"; value: string }
  | { type: "setCategory"; value: Reward["category"] }
  | { type: "setAvailable"; value: boolean }
  | { type: "reset" };

const initialFormState: EditRewardFormState = {
  name: "",
  description: "",
  pointsCost: "",
  category: "coffee",
  available: true,
};

function editRewardFormReducer(
  state: EditRewardFormState,
  action: EditRewardFormAction,
): EditRewardFormState {
  switch (action.type) {
    case "sync":
      return action.reward
        ? {
            name: action.reward.name,
            description: action.reward.description,
            pointsCost: action.reward.pointsCost.toString(),
            category: action.reward.category,
            available: action.reward.available,
          }
        : initialFormState;
    case "setName":
      return { ...state, name: action.value };
    case "setDescription":
      return { ...state, description: action.value };
    case "setPointsCost":
      return { ...state, pointsCost: action.value };
    case "setCategory":
      return { ...state, category: action.value };
    case "setAvailable":
      return { ...state, available: action.value };
    case "reset":
      return initialFormState;
  }
}

function useEditRewardDrawer({
  reward,
  shown,
  setShown,
}: EditRewardDrawerProps) {
  const { mutate, isPending } = useUpdateRewardMutation();
  const { queueToast } = useQueuedToast();
  const [form, dispatch] = useReducer(editRewardFormReducer, initialFormState);

  useEffect(() => {
    dispatch({ type: "sync", reward });
  }, [reward]);

  const handleClose = () => {
    setShown(false);
    dispatch({ type: "reset" });
  };

  const handleSubmit = () => {
    if (!reward) {
      return;
    }

    mutate(
      {
        id: reward.id,
        name: form.name,
        description: form.description,
        pointsCost: parseInt(form.pointsCost, 10),
        category: form.category,
        available: form.available,
      },
      {
        onSuccess: () => {
          queueToast("Reward updated", "success");
          handleClose();
        },
        onError: () => {
          queueToast("Could not save reward", "caution");
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
    description: form.description,
    onDescriptionChange: (value: string) =>
      dispatch({ type: "setDescription", value }),
    pointsCost: form.pointsCost,
    onPointsCostChange: (value: string) =>
      dispatch({ type: "setPointsCost", value }),
    category: form.category,
    onCategoryChange: (value: Reward["category"]) =>
      dispatch({ type: "setCategory", value }),
    available: form.available,
    onAvailableChange: (value: boolean) =>
      dispatch({ type: "setAvailable", value }),
    isSubmitDisabled: !form.name || !form.pointsCost,
    isPending,
  };
}
