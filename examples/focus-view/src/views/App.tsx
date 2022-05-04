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
  const [openFocus, setOpenFocus] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  const [name, setName] = useState<string>("");

  // For this example, we save the result in memory.
  // You may wish to store this data on your backend in a real life scenario.
  const handleSave = () => {
    setName(text);
    setOpenFocus(false);
  };

  return (
    <ContextView title="FocusView Example">
      <Box css={{ marginBottom: "medium" }}>
        The FocusView provides a dedicated space to display info or complete
        tasks. Click the button below to open the FocusView.
      </Box>
      <Button type="primary" onPress={() => setOpenFocus(true)}>
        Open
      </Button>
      <Box css={{ marginTop: "medium" }}>
        {name ? (
          <Inline css={{ font: "bodyEmphasized" }}>Name: {name}</Inline>
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
