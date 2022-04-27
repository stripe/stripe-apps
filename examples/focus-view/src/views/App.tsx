import {
  Box,
  Button,
  ContextView,
  FocusView,
  Inline,
  TextField,
} from "@stripe/ui-extension-sdk/ui";
import type { ExtensionContextValue } from "@stripe/ui-extension-sdk/context";
import { useState } from "react";

const App = ({ userContext, environment }: ExtensionContextValue) => {
  const [openFocus, setOpenFocus] = useState(false);
  const [text, setText] = useState("");
  const [state, setState] = useState("");

  //This should save the data to your backend.
  const handleSave = () => {
    setState(text);
    setOpenFocus(false);
  };

  return (
    <ContextView title="FocusView Example">
      <Box css={{ marginBottom: "medium" }}>
        The focusView gives you a dedicated space to display info or complete
        task. Click the button below to open the focusView
      </Box>
      <Button type="primary" onPress={() => setOpenFocus(true)}>
        Open
      </Button>
      <Box css={{ marginTop: "medium" }}>
        {state ? (
          <Inline css={{ font: "bodyEmphasized" }}>Name: {state}</Inline>
        ) : (
          "No Name Found"
        )}
      </Box>

      <FocusView
        title="Focus View"
        shown={openFocus}
        onClose={() => setOpenFocus(false)}
        primaryAction={
          <Button type="primary" onPress={handleSave}>
            Save
          </Button>
        }
        secondaryAction={
          <Button onPress={() => setOpenFocus(false)}>Cancel</Button>
        }
      >
        <TextField
          label="Add a name"
          onChange={(e) => setText(e.target.value)}
        />
      </FocusView>
    </ContextView>
  );
};

export default App;
