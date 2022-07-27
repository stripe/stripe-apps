import { Box, Button, Icon, Link, Img, Inline } from "@stripe/ui-extension-sdk/ui";
const StripeLogo = require("../assets/stripe-logo.svg");
const SuperTodoLogo = require("../assets/super-todo-logo.svg");
import { SuperTodoView } from "../components";

// Example of a Customer Details View

const CustomerDetailView = () => {
  return (
    <SuperTodoView title="Get started">
      <Box
        css={{
          padding: "xxlarge",
          color: "secondary",
          background: "container",
          borderRadius: "small",
          stack: "x",
          gap: "large",
          alignX: "center",
          alignY: "center",
        }}
      >
        <Img
          src={SuperTodoLogo}
          alt="Logo of SuperTodo"
          width="32"
          height="32"
        />
        <Icon name="convert" />
        <Img src={StripeLogo} alt="Logo of Stripe" width="32" height="32" />
      </Box>
      <Box css={{ marginTop: "xlarge"}}>
        To import your existing data from the SuperTodo, you will need to
        connect your SuperTodo account to Stripe.
      </Box>
      <Box css={{marginTop: 'xlarge', alignX: "center",}}>
        <Button type="primary" css={{ width: "fill"}}>
          <Box css={{ stack: "x", gap: "small", alignY: "center"}}>
            <Inline>Sign in to SuperTodo</Inline>
            <Icon name="external" size="xsmall" />
          </Box>
        </Button>
      </Box>
      <Box
        css={{
          marginTop: "medium",
          alignX: "center",
          stack: "x",
          gap: "small",
        }}
      >
        Don't have an account? <Link>Sign up</Link>
      </Box>
    </SuperTodoView>
  );
};

export default CustomerDetailView;
