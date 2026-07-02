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
import { Reward, useUpdateRewardMutation } from "@/data";
import { useQueuedToast } from "@/hooks/useQueuedToast";

type EditRewardDrawerProps = {
  reward: Reward | null;
  shown: boolean;
  setShown: (shown: boolean) => void;
};

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

export function EditRewardDrawer({
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

  return (
    <FocusView
      title="Edit reward"
      shown={shown}
      setShown={(s) => {
        if (!s) handleClose();
      }}
      primaryAction={
        <Button
          type="primary"
          onPress={handleSubmit}
          disabled={!form.name || !form.pointsCost}
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
            value={form.name}
            onChange={(e) =>
              dispatch({ type: "setName", value: e.target.value })
            }
          />
          <TextField
            name="description"
            label="Description"
            value={form.description}
            onChange={(e) =>
              dispatch({ type: "setDescription", value: e.target.value })
            }
          />
          <TextField
            name="pointsCost"
            label="Points cost"
            type="number"
            value={form.pointsCost}
            onChange={(e) =>
              dispatch({ type: "setPointsCost", value: e.target.value })
            }
          />
          <Select
            name="category"
            label="Category"
            value={form.category}
            onChange={(e) =>
              dispatch({
                type: "setCategory",
                value: e.target.value as Reward["category"],
              })
            }
          >
            <option value="coffee">Coffee</option>
            <option value="merchandise">Merchandise</option>
          </Select>
          <Switch
            label="Available"
            checked={form.available}
            onChange={(e) =>
              dispatch({ type: "setAvailable", value: e.target.checked })
            }
          />
        </FormFieldGroup>
      </Box>
    </FocusView>
  );
}
