import { Box, ContextView, Inline } from "@stripe/ui-extension-sdk/ui";

const App = () => {
  return (
    <ContextView title="Create your first Stripe app">
      <Box
        css={{
          padding: "large",
          backgroundColor: "container",
          fontFamily: "monospace",
          borderRadius: "small",
        }}
      >
        <Inline css={{ font: "heading" }}>To open the settings view:</Inline>
        <Box css={{ marginY: "large" }}>
          1. click on the options button{" "}
          <Inline css={{ font: "bodyEmphasized" }}>(...)</Inline> at the top
          right corner of the page to display a dropdown.
        </Box>
        <Box>
          2. Click on{" "}
          <Inline css={{ font: "bodyEmphasized" }}>preview app settings</Inline>{" "}
          from the dropdown and the settings view will open on a new tab.
        </Box>
      </Box>
    </ContextView>
  );
};

export default App;
