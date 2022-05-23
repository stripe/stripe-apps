import { Box, Button, Spinner } from "@stripe/ui-extension-sdk/ui";
import { useEffect, useState } from "react";
import { SuperTodoView } from "../components";

const PaymentListView = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  if (isLoading) {
    return (
      <SuperTodoView
        title="Get started"
        externalLink={{
          label: "Go to SuperTodo dashboard",
          href: "#",
        }}
      >
        <Box>
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
        </Box>
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
        <Button type="primary" css={{ width: "fill", alignX: "center" }}>
          Create list
        </Button>
      }
    >
      <Box css={{ marginTop: "small", font: "heading" }}>
        No lists have been created.
      </Box>
      <Box css={{ marginTop: "xsmall" }}>
        You need to have a list before you can create and assign tasks.
      </Box>
    </SuperTodoView>
  );
};

export default PaymentListView;
