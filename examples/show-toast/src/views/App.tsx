import {
  Box,
  Button,
  ContextView,
  Inline,
  Radio,
  TextField
} from "@stripe/ui-extension-sdk/ui";
import { showToast, ToastType } from "@stripe/ui-extension-sdk/utils";
import { useRef, useState } from "react";
import { Form } from "../components";
import { withValueFromEvent } from "../events";
import BrandIcon from "./brand_icon.svg";

function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

type UnwrapPromise<T> = T extends Promise<infer U> ? U : never;

const App = () => {
  const defaultMessage = "Yummy, yummy 🍞";
  const defaultAction = "Undo";
  const [message, setMessage] = useState(defaultMessage);
  const types: ToastType[] = [undefined, "success", "caution", "pending"];
  const [type, setType] = useState(types[0]);
  const [action, setAction] = useState(defaultAction);
  const toastResults = useRef(new Set<UnwrapPromise<ReturnType<typeof showToast>>>());

  const onAction = action ? () => console.log('Toast onAction handler called') : undefined;
  const renderToast = async () =>
    toastResults.current.add(await showToast(message, { type, action, onAction }));
  const updateToasts = () =>
    toastResults.current.forEach(({update}) => update(message, { type, action, onAction }));
  const clearToasts = () => {
    toastResults.current.forEach(({dismiss}) => dismiss());
    toastResults.current.clear();
  };

  return (
    <ContextView
      title="Send a message"
      brandColor="#e8bd7d" // replace this with your brand color
      brandIcon={BrandIcon} // replace this with your brand icon
      externalLink={{
        label: "View docs",
        href: "https://stripe.com/docs/stripe-apps",
      }}
    >
      <Form>
        <TextField
          label="Message"
          defaultValue={defaultMessage}
          onChange={withValueFromEvent(setMessage)}
        />
        <TextField
          label="Action"
          defaultValue={defaultAction}
          onChange={withValueFromEvent(setAction)}
        />
        <Box>
          <Inline css={{ font: "caption" }}>Type</Inline>
          {types.map((type) => (
            <Radio
              name="type"
              label={type ? capitalize(type) : "No icon"}
              key={type || 'undefined'}
              defaultChecked={type === types[0]}
              onChange={() => setType(type)}
            />
          ))}
        </Box>
        <Box css={{stack: 'y', gap: 'small'}}>
          <Button css={{width: '1/2'}} type="primary" onPress={renderToast}>Render toast</Button>
          <Button css={{width: '1/2'}} type="secondary" onPress={updateToasts}>Update toasts</Button>
          <Button css={{width: '1/2'}} type="destructive" onPress={clearToasts}>Clear toasts</Button>
        </Box>
      </Form>
    </ContextView>
  );
};

export default App;
