import { useNavigate } from "react-router-dom";
import { Box, Button } from "@stripe/ui-extension-sdk/ui";
import { BaseView } from "../components/BaseView";

const MainMenuView = () => {
  const navigate = useNavigate();
  return (
    <BaseView
      title="Get started"
      description="Fast & easy shipping"
      actions={
        <Box
          css={{
            layout: "column",
            gap: "small",
            alignY: "center",
          }}
        >
          <Button disabled={true} css={{ width: "fill", alignX: "center" }}>
            Connect your store
          </Button>
          <Button disabled={true} css={{ width: "fill", alignX: "center" }}>
            Upload CVS
          </Button>
          <Button
            css={{ width: "fill", alignX: "center" }}
            onPress={() => navigate("/products")}
          >
            Create label
          </Button>
        </Box>
      }
    >
      <Box
        css={{
          fontWeight: "bold",
        }}
      >
        No orders
      </Box>
    </BaseView>
  );
};

export default MainMenuView;
