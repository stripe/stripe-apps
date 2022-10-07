import { Box } from "@stripe/ui-extension-sdk/ui";
import React from "react";

export const Form = ({ children }: React.PropsWithChildren<object>) => {
  return (
    <>
      {React.Children.map(children, (child) => (
        <Box css={{ paddingY: "small" }}>{child}</Box>
      ))}
    </>
  );
};
