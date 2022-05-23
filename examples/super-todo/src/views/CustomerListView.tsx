import {
  Banner,
  Box,
  Button,
  Checkbox,
  Divider,
  Icon,
  Inline,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@stripe/ui-extension-sdk/ui";

import {
  CreateListBasics,
  CreateListMeta,
  ListTabPanel,
  SuperTodoView,
} from "../components";
import { useState } from "react";

const tabs = {
  all: "All lists",
  your: "Your lists",
  todos: "Your todos",
};
type tabTypes = keyof typeof tabs;

const lists = {
  apple: { current: 6, total: 7 },
  pear: { current: 0, total: 3 },
  berry: { current: 10, total: 20 },
  watermelon: { current: 9, total: 9 },
  orange: { current: 23, total: 50 },
  banana: { current: 0, total: 16 },
  melon: { current: 1, total: 3 },
};
const yourLists = ["pear", "orange", "melon"];

type listsTypes = keyof typeof lists;

enum Progress {
  NOT_CREATING,
  BASICS,
  META,
  SUCCESS,
  ERROR,
}

const CustomerListView = () => {
  const [progress, setProgress] = useState(Progress.ERROR);

  return (
    <SuperTodoView
      title={"Todo lists"}
      actions={
        <>
          <Button
            type="primary"
            css={{ width: "fill", alignX: "center" }}
            onPress={() => setProgress(Progress.BASICS)}
          >
            Create list
          </Button>
        </>
      }
    >
      <CreateListBasics
        shown={progress === Progress.BASICS}
        lists={lists}
        onContinue={() => setProgress(Progress.META)}
      />
      <CreateListMeta
        shown={progress === Progress.META}
        onSave={() => setProgress(Progress.SUCCESS)}
        onBack={() => setProgress(Progress.BASICS)}
      />

      {progress === Progress.SUCCESS ? (
        <Banner
          description="Team Created"
          onDismiss={() => setProgress(Progress.NOT_CREATING)}
        />
      ) : (
        ""
      )}

      {progress === Progress.ERROR ? (
        <Banner
          type="critical"
          title="Authentication expired"
          description="Please re-connect to your SuperTodo account."
          actions={
            <Button>
              <Box css={{ stack: "x", gap: "small", alignY: "center"}}>
                <Inline>Sign in to SuperTodo</Inline>
                <Icon name="external" size="xsmall" />
              </Box>
            </Button>
          }
        />
      ) : (
        ""
      )}

      <Box css={{marginTop: 'large'}}>
        <Tabs fitted size="small">
          <TabList>
            {Object.keys(tabs).map((name: string) => (
              <Tab key={name}>{tabs[name as tabTypes]}</Tab>
            ))}
          </TabList>
          <TabPanels>
            {/* All lists */}
            <ListTabPanel lists={lists} />

            {/* Your lists */}
            <ListTabPanel
              lists={Object.keys(lists)
                .filter((name) => yourLists.includes(name))
                .reduce(
                  (list, name) => ({
                    ...list,
                    [name]: lists[name as listsTypes],
                  }),
                  {}
                )}
            />

            {/* Your todos */}
            <TabPanel>
              <Box css={{ marginTop: "large" }}>
                <Box css={{ marginTop: "small" }}>
                  <Checkbox
                    label={
                      <>
                        <Box>Respond to janefisher@gmail.com</Box>
                        <Box css={{ color: "secondary", marginTop: "xxsmall" }}>
                          @tayler
                        </Box>
                      </>
                    }
                  />
                </Box>
                <Box css={{ marginTop: "small" }}>
                  <Divider/>
                </Box>
                <Box css={{ marginTop: "small" }}>
                  <Checkbox
                    label={
                      <>
                        <Box>Respond to ryan.lee@gmail.com</Box>
                        <Box css={{ color: "secondary", marginTop: "xxsmall" }}>
                          @tayler
                        </Box>
                      </>
                    }
                  />
                </Box>
                <Box css={{ marginTop: "small" }}>
                  <Divider/>
                </Box>
                <Box css={{ marginTop: "small" }}>
                  <Checkbox
                    label={
                      <>
                        <Box>Respond to chris_p@hotmail.com</Box>
                        <Box css={{ color: "secondary", marginTop: "xxsmall" }}>
                          @tayler
                        </Box>
                      </>
                    }
                  />
                </Box>
                <Box css={{ marginTop: "small" }}>
                  <Divider/>
                </Box>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </SuperTodoView>
  );
};

export default CustomerListView;
