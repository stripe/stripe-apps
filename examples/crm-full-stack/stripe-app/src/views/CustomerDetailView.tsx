import type { ExtensionContextValue } from "@stripe/ui-extension-sdk/context";
import {
  Box,
  Button,
  ContextView,
  Icon,
  Inline,
} from "@stripe/ui-extension-sdk/ui";
import { showToast } from "@stripe/ui-extension-sdk/utils";
import { useEffect, useState } from "react";
import { getNotesForCustomerAPI } from "../api";
import AddNoteView from "../components/AddNoteView";
import Notes from "../components/Notes";
import { APIResponse, Note } from "../types";
import BrandIcon from "./brand_icon.svg";

const CustomerDetailView = ({
  userContext,
  environment,
}: ExtensionContextValue) => {
  const customerId = environment?.objectContext?.id;

  const agentId = userContext?.account.id || ""; //todo
  const agentName = userContext?.account.name || ""; //todo

  const [notes, setNotes] = useState<Note[] | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [showAddNoteSuccessMessage, setShowAddNoteSuccessMessage] =
    useState<boolean>(false);
  const [showAddNoteView, setShowAddNoteView] = useState<boolean>(false);

  const getNotes = () => {
    if (!customerId) {
      return;
    }

    getNotesForCustomerAPI({ customerId })
      .then((res: APIResponse) => {
        if (!res.data.error) {
          setNotes(res.data.notes);
        }
      })
      .catch(() => {
        setError(true);
        return showToast("Backend server not reachable", { type: "caution" });
      });
  };

  useEffect(() => {
    getNotes();
  }, [customerId]);

  console.log(notes);

  return (
    <ContextView
      title="All Notes"
      description={customerId}
      brandColor="#F6F8FA"
      brandIcon={BrandIcon}
      actions={
        <Button
          type="primary"
          css={{ width: "fill", alignX: "center" }}
          onPress={() => {
            setShowAddNoteView(true);
          }}
        >
          <Box css={{ stack: "x", gap: "small", alignY: "center" }}>
            <Icon name="addCircle" size="xsmall" />
            <Inline>Add note</Inline>
          </Box>
        </Button>
      }
    >
      <AddNoteView
        isOpen={showAddNoteView}
        customerId={customerId as string}
        agentId={agentId}
        onSuccessAction={() => {
          setShowAddNoteView(false);
          getNotes();
        }}
        onCancelAction={() => {
          setShowAddNoteView(false);
        }}
      />

      <Box>
        <Notes notes={notes} error={error} />
      </Box>
    </ContextView>
  );
};

export default CustomerDetailView;
