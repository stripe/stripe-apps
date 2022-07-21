import {
  Box,
  Button,
  Icon,
  Img,
  Inline,
  Link,
} from "@stripe/ui-extension-sdk/ui";
import { BaseView } from "../components/BaseView";
import { useLogin } from "../hooks/LoginState";
import BrandIcon from "../assets/brand-icon-color.svg";
import StripeBrandIcon from "../assets/stripe-brand-icon.png";

const LoginView = () => {
  const { setIsLoggedIn } = useLogin();
  return (
    <BaseView title="Get started">
      <Box
        css={{
          background: "container",
          borderRadius: "medium",
          layout: "row",
          gap: 75,
          alignY: "center",
          alignX: "center",
          padding: "xxlarge",
          wordBreak: "break-all",
        }}
      >
        <Img height="30" src={BrandIcon} />
        <Icon name="convert" size="xsmall" />
        <Img height="30" src={StripeBrandIcon} />
      </Box>
      <Box
        css={{
          marginTop: "large",
        }}
      >
        To import your existing data from the Ship.io, you will need to connect
        your Ship.io account to Stripe.
      </Box>
      <Box
        css={{
          marginTop: "large",
          stack: "y",
          gap: "medium",
          alignX: "center",
          fontWeight: "semibold",
        }}
      >
        <Button
          type="primary"
          onPress={() => setIsLoggedIn(true)}
          css={{
            width: "fill",
            alignX: "center",
          }}
        >
          <Box css={{ layout: "row", gap: 75, alignY: "center" }}>
            <Inline>Sign in to Ship.io</Inline>
            <Icon name="external" size="xsmall" />
          </Box>
        </Button>
        <Inline>
          Don&apos;t have an account?{" "}
          <Link type="primary" href="#">
            Sign up
          </Link>
        </Inline>
      </Box>
    </BaseView>
  );
};

export default LoginView;
