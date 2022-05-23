import {
  Box,
  Button,
  Checkbox,
  FocusView,
  Select,
  TextField,
} from "@stripe/ui-extension-sdk/ui";

const employees = [
  "Cadence",
  "Chase",
  "Craig",
  "Cynthia",
  "Dave",
  "Eric",
  "Hugo",
  "Jason",
  "Jeff",
  "Jono",
  "Kat",
  "Khoi",
  "Lucie",
  "Marissa",
  "Misha",
  "Tayler",
  "Vince",
];

type CreateListBasicsProps = {
  shown: boolean;
  lists: { [name: string]: { current: number; total: number } };
  onContinue: () => void;
};

const CreateListBasics = ({
  shown,
  lists,
  onContinue,
}: CreateListBasicsProps) => (
  <FocusView
    title="Create a list"
    shown={shown}
    primaryAction={<Button onClick={onContinue}>Continue</Button>}
  >
    <TextField
      label="List name"
      placeholder="My list"
      css={{ width: "2/3" }}
      required
    />
    <Select label="Team" css={{ marginTop: "medium", width: "2/3" }}>
      {Object.keys(lists).map((team) => (
        <option>{`Team ${team}`}</option>
      ))}
    </Select>

    <Box
      css={{
        textTransform: "uppercase",
        marginTop: "xlarge",
        marginBottom: "small",
        font: "subheading",
      }}
    >
      Team members
    </Box>
    <Box>Select who can be assigned tasks for this list.</Box>
    <Box css={{ stack: "x", wrap: "wrap" }}>
      {employees.map((employee) => (
        <Checkbox
          css={{ width: "1/3", marginTop: "medium" }}
          label={employee}
        />
      ))}
    </Box>
  </FocusView>
);

export default CreateListBasics;
