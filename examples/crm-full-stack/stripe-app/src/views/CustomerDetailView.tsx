import type { ExtensionContextValue } from "@stripe/ui-extension-sdk/context";
import {
  Banner,
  Box,
  Button,
  ContextView,
  Icon,
  Inline,
} from "@stripe/ui-extension-sdk/ui";
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
  const [showAddNoteView, setShowAddNoteView] = useState<boolean>(false);
  const [showAddNoteSuccessMessage, setShowAddNoteSuccessMessage] =
    useState<boolean>(false);

  const getNotes = () => {
    if (!customerId) {
      return;
    }

    getNotesForCustomerAPI({ customerId }).then((res: APIResponse) => {
      if (!res.data.error) {
        setNotes(res.data.notes);
      }
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
      {showAddNoteSuccessMessage && (
        <Box css={{ marginBottom: "small" }}>
          <Banner
            type="default"
            onDismiss={() => setShowAddNoteSuccessMessage(false)}
            title="Added new note"
          />
        </Box>
      )}

      <AddNoteView
        isOpen={showAddNoteView}
        customerId={customerId as string}
        agentId={agentId}
        onSuccessAction={() => {
          setShowAddNoteView(false);
          setShowAddNoteSuccessMessage(true);
          getNotes();
        }}
        onCancelAction={() => {
          setShowAddNoteView(false);
        }}
      />

      <Box css={{ stack: "y" }}>
        <Box css={{}}>
          <Inline
            css={{
              font: "heading",
              color: "primary",
              fontWeight: "semibold",
              paddingY: "medium",
            }}
          >
            View All Notes
          </Inline>

          <Notes notes={notes} />
        </Box>
      </Box>
    </ContextView>
  );
};

export default CustomerDetailView;
