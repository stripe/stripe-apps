import {
  Box,
  Button,
  ButtonGroup,
  ContextView,
  List,
  ListItem,
} from "@stripe/ui-extension-sdk/ui";
import type { ExtensionContextValue } from "@stripe/ui-extension-sdk/context";
import {
  MemoryRouter,
  Outlet,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";

// This is a mock representation of an external data store, for example data
// retrieved from the Stripe API or a custom backend server.
const data = new Map([
  ["1", { id: "1", name: "Mollie Osborne" }],
  ["2", { id: "2", name: "Jeff Bowen" }],
  ["3", { id: "3", name: "Timothy Mendoza" }],
  ["4", { id: "4", name: "Sara Hardy" }],
  ["5", { id: "5", name: "Joseph Norris" }],
]);

const App = ({ userContext, environment }: ExtensionContextValue) => {
  return (
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<Select />} />
        <Route path=":item" element={<Details />}>
          <Route path="confirm-delete" element={<ConfirmDeletion />} />
          <Route index element={<Actions />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
};

const Select = () => {
  const items = Array.from(data.values());
  const navigate = useNavigate();

  return (
    <ContextView title="Select an item">
      <List onAction={(key) => navigate(key.toString())}>
        {items.map((item) => (
          <ListItem key={item.id} id={item.id} title={item.name} />
        ))}
      </List>
    </ContextView>
  );
};

const Details = () => {
  const { item } = useParams<"item">();
  const details = data.get(item!);

  if (!details) {
    return (
      <ContextView title="Item not found">
        <BackButton />
      </ContextView>
    );
  }

  return (
    <ContextView title={`Details for ${details?.name}`}>
      <Box css={{ layout: "column", gap: "medium" }}>
        <BackButton />
        <Box>
          In a real application this page would hold all the details of the item
          so that the actions flow could occur in context.
        </Box>
        <Outlet />
      </Box>
    </ContextView>
  );
};

const Actions = () => {
  const navigate = useNavigate();

  return (
    <Button onPress={() => navigate("confirm-delete")} type="destructive">
      Delete Item
    </Button>
  );
};

const ConfirmDeletion = () => {
  const { item } = useParams<"item">();
  const navigate = useNavigate();

  return (
    <Box
      css={{
        background: "container",
        padding: "medium",
        layout: "column",
        gap: "small",
      }}
    >
      <Box>Are you sure you want to delete this item?</Box>
      <ButtonGroup>
        <Button onPress={() => navigate(-1)}>Cancel</Button>
        <Button
          onPress={() => {
            data.delete(item!);
            navigate("/");
          }}
          type="destructive"
        >
          Delete
        </Button>
      </ButtonGroup>
    </Box>
  );
};

const BackButton = () => {
  const navigate = useNavigate();

  return <Button onPress={() => navigate(-1)}>Back</Button>;
};

export default App;
