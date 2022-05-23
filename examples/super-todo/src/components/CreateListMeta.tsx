import {
  Box,
  Button,
  Checkbox,
  FocusView,
  Icon,
  TextArea,
} from "@stripe/ui-extension-sdk/ui";

type CreateListMetaProps = {
  shown: boolean;
  onSave: () => void;
  onBack: () => void;
};

const CreateListMeta = ({ shown, onSave, onBack }: CreateListMetaProps) => (
  <FocusView
    title="Create a list"
    shown={shown}
    primaryAction={
      <Button type="primary" onClick={onSave}>
        Save
      </Button>
    }
    secondaryAction={
      <Button css={{ stack: "x", gap: "small" }} onClick={onBack}>
        <Icon name="previous" size="xsmall" />
        Back
      </Button>
    }
  >
    <Box>Member Permissions</Box>
    <Checkbox label="Modify list" css={{ marginTop: "medium" }} />
    <Checkbox label="Add new team members" css={{ marginTop: "small" }} />
    <TextArea
      label="Team description"
      placeholder="Add a description"
      css={{ marginTop: "medium" }}
    />
  </FocusView>
);

export default CreateListMeta;
