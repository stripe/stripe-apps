import { Todo, Mode } from '../TodoApp';

import { Inline, List, ListItem, Button, Icon } from '@stripe/ui-extension-sdk/ui';

export type TodoListProps = {
  todoList: Todo[],
  mode: Mode,
  onDelete: (todo: Todo) => void,
  onComplete?: (todo: Todo) => void,
  setOpenNotes: (todo: Todo) => void,
  setNotesTextFieldValue: (notes: string) => void,
}

const TodoList = ({
  todoList,
  mode,
  onDelete,
  onComplete,
  setOpenNotes,
  setNotesTextFieldValue,
}: TodoListProps) => {
  return (
    <List key={`todo-list-${mode}`}>
      {todoList.filter((todo: Todo) => {
        return todo.completed && mode === Mode.Completed || !todo.completed && mode === Mode.Uncompleted;
      }).map((todo: Todo) => (
        <ListItem key={`todo-${todo.created}`} title={todo.text} value={(
          <Inline css={{
            layout: 'row',
            fontWeight: 'semibold',
            gap: 'small',
          }}>
            {
              mode === Mode.Uncompleted ?
                <Button size="small" type="primary" onPress={() => onComplete!(todo)}>
                  <Icon name="check" />
                </Button> :
                null
            }
            <Button size="small" onPress={() => {
              setNotesTextFieldValue(todo.notes);
              setOpenNotes(todo);
            }}>
              <Icon name="edit" />
            </Button>
            <Button size="small" type="destructive" onPress={() => onDelete(todo)}>
              <Icon name="cancel" />
            </Button>
          </Inline>
        )} />
      ))}
    </List>
  );
};

export default TodoList;
