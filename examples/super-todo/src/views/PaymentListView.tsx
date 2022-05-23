import { Box, Button, Spinner } from "@stripe/ui-extension-sdk/ui";
import { useEffect, useState } from "react";
import { SuperTodoView } from "../components";

const PaymentListView = () => {
  const [loadingState, setLoadingState] = useState("LOADING");

  useEffect(() => {
    setTimeout(() => setLoadingState("DONE"), 2000);
  });

  if (loadingState === "LOADING") {
    return (
      <SuperTodoView
        title="Get started"
        externalLink={{
          label: "Go to SuperTodo dashboard",
          href: "#",
        }}
      >
        <Box css={{ alignX: "start", stack: "x" }}>
          <Box
            css={{
              padding: "small",
              color: "secondary",
              background: "container",
              borderRadius: "small",
            }}
          >
            <Spinner size="large" />
          </Box>
        </Box>

        <Box css={{ marginTop: "medium", font: "heading" }}>Loading list</Box>
      </SuperTodoView>
    );
  }

  return (
    <SuperTodoView
      title="Get started"
      externalLink={{
        label: "Go to SuperTodo dashboard",
        href: "#",
      }}
      actions={
        <>
          <Button type="primary" css={{ width: "fill", alignX: "center" }}>
            Create list
          </Button>
        </>
      }
    >
      <Box css={{ marginTop: "small", font: "heading" }}>
        No lists have been created.
      </Box>
      <Box css={{ marginTop: "xsmall", lineHeight: 1.5 }}>
        You need to have a list before you can create and assign tasks.
      </Box>
    </SuperTodoView>
  );
};

export default PaymentListView;
