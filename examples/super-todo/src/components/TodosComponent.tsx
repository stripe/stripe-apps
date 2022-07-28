import {
  Box,
  TabPanel,
  Checkbox,
  Divider,
  Switch
} from "@stripe/ui-extension-sdk/ui";

type TodosComponentProps = {
  todos: object,
  setTodoType: void,
  showCompletedTodos: boolean
};

const TodosComponent = ({ todos, setTodoType, showCompletedTodos }: TodosComponentProps) => {
  return (
    <TabPanel>
      <Box css={{ marginTop: "large" }}>
        {Object.entries(todos).map(([email, { task, assignee, checked}]) => (
          <>
            <Box css={{ marginTop: "small" }}>
              <Checkbox
                defaultChecked={checked}
                label={<>
                  <Box>{`${task} ${email}`}</Box>
                  <Box css={{ color: "secondary", marginTop: "xxsmall" }}>
                    {`@${assignee}`}
                  </Box>
                </>} />
            </Box>
            <Box css={{ marginTop: "small" }}>
              <Divider />
            </Box>
          </>
        ))}
      </Box>
      <Box css={{marginTop: "large"}}>
          <Switch
            label="Toggle Todos."
            onChange={() => {setTodoType(!showCompletedTodos)}}
          />
        </Box>
    </TabPanel>
  )
};

export default TodosComponent;
