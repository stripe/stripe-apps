import { Box, Button, Spinner } from "@stripe/ui-extension-sdk/ui";
import { useEffect, useState } from "react";
import { SuperTodoView } from "../components";

const PaymentListView = () => {
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
      <Box css={{ marginTop: "xsmall" }}>
        You need to have a list before you can create and assign tasks.
      </Box>
    </SuperTodoView>
  );
};

export default PaymentListView;
