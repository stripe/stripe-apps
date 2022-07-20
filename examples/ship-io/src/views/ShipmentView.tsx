import { useNavigate } from "react-router-dom";
import {
  Badge,
  Banner,
  Box,
  Button,
  Checkbox,
  DateField,
  Icon,
  Inline,
  Link,
  Select,
} from "@stripe/ui-extension-sdk/ui";
import { BaseView } from "../components/BaseView";
import { useState } from "react";
const defaultShipmentOptions = {
  "1": {
    label: "Add signature confirmation",
    description: "Package must be signed for",
    selected: false,
  },
  "2": {
    label: "Add shipment insurance",
    description: "Full coverage if lost or damaged",
    selected: false,
  },
  "3": {
    label: "Include return label",
    description: "Label in a box for easy returns",
    selected: false,
  },
};

const ShipmentView = () => {
  const navigate = useNavigate();
  const [showMessage, setShowMessage] = useState<boolean>(false);
  return (
    <BaseView title="Label printer">
      <Box
        css={{
          stack: "y",
          gap: "medium",
        }}
      >
        <Link type="primary" onPress={() => navigate(-1)}>
          <Box
            css={{
              stack: "x",
              alignY: "center",
              gap: "small",
            }}
          >
            <Icon name="previous" />
            Back to create fullfillment
          </Box>
        </Link>
        <Inline css={{ font: "heading" }}>Shipment options</Inline>
        <Select name="package-size" label="Package size">
          <option value="">Choose an package size</option>
          <option value="large-box">Large box</option>
          <option value="medium-box">Medium box</option>
          <option value="small-box">Small box</option>
        </Select>
        <DateField label="Shipment date" />
      </Box>
      <Box
        css={{
          marginTop: "large",
          stack: "y",
          gap: "small",
        }}
      >
        <Inline
          css={{
            font: "subheading",
          }}
        >
          Additional options
        </Inline>
        <Box
          css={{
            stack: "y",
            gap: "small",
          }}
        >
          {Object.entries(defaultShipmentOptions).map((kv) => {
            const [key, option] = kv;
            return (
              <Checkbox
                key={key}
                label={option.label}
                description={option.description}
              ></Checkbox>
            );
          })}
        </Box>
      </Box>
      <Box
        css={{
          marginTop: "medium",
        }}
      >
        <Button
          type="primary"
          onPress={() => setShowMessage(true)}
          css={{
            width: "fill",
            alignX: "center",
          }}
        >
          Print label
        </Button>
      </Box>
      {showMessage ? (
        <Box
          css={{
            marginTop: "medium",
          }}
        >
          <Banner
            onDismiss={() => setShowMessage(false)}
            description={
              <Box
                css={{
                  stack: "y",
                  gap: "small",
                }}
              >
                <Box
                  css={{
                    width: "min",
                  }}
                >
                  <Badge type="positive">Success</Badge>
                </Box>
                <Inline>Printed shipping label for selected items.</Inline>
              </Box>
            }
          />
        </Box>
      ) : null}
    </BaseView>
  );
};

export default ShipmentView;
