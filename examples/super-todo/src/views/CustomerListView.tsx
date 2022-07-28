import {
  Banner,
  Box,
  Button,
  Tab,
  TabList,
  TabPanels,
  Tabs,
} from "@stripe/ui-extension-sdk/ui";

import {
  CreateListBasics,
  CreateListMeta,
  ListTabPanel,
  SuperTodoView,
  TodosComponent
} from "../components";
import { useState } from "react";

const tabs = {
  all: "Lists",
  todos: "Todos",
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

const todos = {
  "janefisher@gmail.com": { task: "Respond to", assignee: "Tayler", checked: false},
  "ryan.lee@gmail.com": { task: "Respond to", assignee: "Tayler", checked: false},
  "john.ryan@cloudly.com": {task: "Send payout to", assignee: "Corey", checked: false}
};

const completedTodos = {
  "meghan.smith@cloudly.com": { task: "Set up meeting with", assignee: "Jon", checked: true},
  "john.ryan@cloudly.com": { task: "Review most recent refunds with", assignee: "Tayler", checked: true},
  "sarah.baker@cloudly.com": {task: "Transition operations to", assignee: "Corey", checked: true}
};

type listsTypes = keyof typeof lists;

enum Progress {
  NOT_CREATING,
  BASICS,
  META,
  SUCCESS,
  ERROR,
}

const showTodos = (showCompletedTodos: boolean, setTodoType: void) => {
  if(showCompletedTodos) {
    return (
      /* Completed Todos */
      <TodosComponent todos={completedTodos} setTodoType={setTodoType} showCompletedTodos={showCompletedTodos}/>
    )
  } else {
    return (
      /* Todos */
      <TodosComponent todos={todos} setTodoType={setTodoType} showCompletedTodos={showCompletedTodos}/>
    )
  }
};

const CustomerListView = () => {
  const [progress, setProgress] = useState(Progress.ERROR);
  const [showCompletedTodos, setTodoType] = useState(false);

  return (
    <SuperTodoView
      title={"Todo lists"}
      actions={
        <>
          <Button
            type="primary"
            css={{ width: "fill", alignX: "center" }}
            onPress={() => {
              setProgress(Progress.BASICS)}
            }
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

      <Box css={{marginTop: 'large'}}>
        <Tabs fitted size="medium">
          <TabList>
            {Object.keys(tabs).map((name: string) => (
              <Tab key={name}>{tabs[name as tabTypes]}</Tab>
            ))}
          </TabList>
          <TabPanels>
            {/* Lists */}
            <ListTabPanel lists={lists} />

            {/* Render Todos */}
            {showTodos(showCompletedTodos, setTodoType)}
          </TabPanels>
        </Tabs>

      </Box>
    </SuperTodoView>
  );
};

export default CustomerListView;
