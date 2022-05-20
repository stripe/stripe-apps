import { Box, Button, Icon, Link, Img } from "@stripe/ui-extension-sdk/ui";
import StripeLogo from "../assets/stripe-logo.svg";
import SuperTodoLogo from "../assets/super-todo-logo.svg";
import { SuperTodoView } from "../components";

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
      <Box css={{ marginTop: "xlarge", lineHeight: "1.5" }}>
        To import your existing data from the SuperTodo, you will need to
        connect your SuperTodo account to Stripe.
      </Box>
      <Button
        type="primary"
        css={{
          width: "fill",
          alignX: "center",
          marginTop: "xlarge",
          stack: "x",
          gap: "small",
        }}
      >
        Sign in to SuperTodo <Icon name="external" size="xsmall" />
      </Button>
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
