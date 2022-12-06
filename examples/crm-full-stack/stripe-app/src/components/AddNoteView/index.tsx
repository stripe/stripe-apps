import { Button, FocusView, TextArea } from "@stripe/ui-extension-sdk/ui";
import { showToast } from "@stripe/ui-extension-sdk/utils";
import { FunctionComponent, useState } from "react";
import { addNoteAPI } from "../../api";

interface AddNoteViewProps {
  isOpen: boolean;
  customerId: string;
  agentId: string;
  onSuccessAction: () => void;
  onCancelAction: () => void;
}

const AddNoteView: FunctionComponent<AddNoteViewProps> = ({
  isOpen,
  customerId,
  agentId,
  onSuccessAction,
  onCancelAction,
}: AddNoteViewProps) => {
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  const addNote = () => {
    if (!customerId) {
      return;
    }

    addNoteAPI({ customerId, agentId, message }).catch(() => {
      return showToast("Backend server not reachable", { type: "caution" });
    });
    showToast("Added new note", { type: "success" });
  };

  return (
    <>
      <FocusView
        title="Add a new note"
        shown={isOpen}
        onClose={() => {
          onCancelAction();
        }}
        primaryAction={
          <Button
            type="primary"
            onPress={async () => {
              await addNote();
              setMessage("");
              onSuccessAction();
            }}
          >
            Save note
          </Button>
        }
        secondaryAction={
          <Button
            onPress={() => {
              onCancelAction();
            }}
          >
            Cancel
          </Button>
        }
      >
        <TextArea
          label="Message"
          placeholder="Looking for more enterprise features like SEO..."
          value={message}
          autoFocus
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />
      </FocusView>
    </>
  );
};

export default AddNoteView;
