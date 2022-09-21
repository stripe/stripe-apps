import type { ExtensionContextValue } from "@stripe/ui-extension-sdk/context";
import { Box, ContextView, Inline } from "@stripe/ui-extension-sdk/ui";
import { useEffect, useState } from "react";
import { getAllNotesAPI } from "../api";
import Notes from "../components/Notes";
import { APIResponse, Note } from "../types";

const HomeOverviewView = ({
  userContext,
  environment,
}: ExtensionContextValue) => {
  const agentName = userContext?.account.name as string;

  const [notes, setNotes] = useState<Note[] | null>(null);

  const getAllNotes = () => {
    getAllNotesAPI().then((res: APIResponse) => {
      if (!res.data.error) {
        setNotes(res.data.notes);
      }
    });
  };

  useEffect(() => {
    getAllNotes();
  }, []);
  console.log(notes);
  return (
    <>
      <ContextView title="Overview">
        <Box css={{ stack: "y" }}>
          <Inline
            css={{
              color: "primary",
              fontWeight: "semibold",
            }}
          >
            View All Notes
          </Inline>

          <Notes notes={notes} />
        </Box>
      </ContextView>
    </>
  );
};

export default HomeOverviewView;
