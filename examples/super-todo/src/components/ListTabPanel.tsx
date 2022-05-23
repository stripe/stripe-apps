import { Box, Divider, Inline, TabPanel } from "@stripe/ui-extension-sdk/ui";

type ListTabPanelProps = {
  lists: { [name: string]: { current: number; total: number } };
};

const ListTabPanel = ({ lists }: ListTabPanelProps) => (
  <TabPanel>
    <Box css={{ marginTop: "large" }}>
      {Object.entries(lists).map(([name, { current, total }]) => (
        <>
          <Box css={{ font: "heading", marginTop: "small" }}>
            Team <Inline css={{ textTransform: "capitalize" }}>{name}</Inline>
          </Box>
          <Box>
            {current}/{total} complete
          </Box>
          <Divider css={{ marginTop: "small" }} />
        </>
      ))}
    </Box>
  </TabPanel>
);

export default ListTabPanel;
