import { Box, ContextView, Inline, Link } from "@stripe/ui-extension-sdk/ui";
import BrandIconLight from "../assets/brand-icon-light.svg";
import { TITLE } from "../constants";
import { useLogin } from "../hooks/LoginState";

export const BaseView = ({ ...contextViewProps }) => {
  const { isLoggedIn, setIsLoggedIn } = useLogin();
  return (
    <ContextView
      title={TITLE}
      brandColor="#00356b"
      brandIcon={BrandIconLight}
      {...contextViewProps}
    >
      {contextViewProps.children}
      {isLoggedIn ? (
        <Box
          css={{
            marginTop: "large",
          }}
        >
          <Inline>
            <Link onPress={() => setIsLoggedIn(false)}>Sign out</Link>
          </Inline>
        </Box>
      ) : null}
    </ContextView>
  );
};
