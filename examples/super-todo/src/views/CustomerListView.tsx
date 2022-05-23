import {
  Banner,
  Box,
  Button,
  Checkbox,
  Divider,
  Icon,
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
  todos: "You todos",
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
            onClick={() => setProgress(Progress.BASICS)}
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
            <Button css={{ stack: "x", gap: "small" }}>
              Sign in to SuperTodo <Icon name="external" size="xsmall" />
            </Button>
          }
        />
      ) : (
        ""
      )}

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

          {/* You todos */}
          <TabPanel>
            <Box css={{ marginTop: "large" }}>
              <Checkbox
                css={{ marginTop: "small" }}
                label={
                  <>
                    <Box>Respond to janefisher@gmail.com</Box>
                    <Box css={{ color: "secondary", marginTop: "xxsmall" }}>
                      @tayler
                    </Box>
                  </>
                }
              />
              <Divider css={{ marginTop: "small" }} />
              <Checkbox
                css={{ marginTop: "small" }}
                label={
                  <>
                    <Box>Respond to ryan.lee@gmail.com</Box>
                    <Box css={{ color: "secondary", marginTop: "xxsmall" }}>
                      @tayler
                    </Box>
                  </>
                }
              />
              <Divider css={{ marginTop: "small" }} />
              <Checkbox
                css={{ marginTop: "small" }}
                label={
                  <>
                    <Box>Respond to chris_p@hotmail.com</Box>
                    <Box css={{ color: "secondary", marginTop: "xxsmall" }}>
                      @tayler
                    </Box>
                  </>
                }
              />
              <Divider css={{ marginTop: "small" }} />
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </SuperTodoView>
  );
};

export default CustomerListView;
