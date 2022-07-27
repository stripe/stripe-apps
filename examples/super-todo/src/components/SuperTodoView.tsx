import { ContextView } from "@stripe/ui-extension-sdk/ui";
const SuperTodoIcon =  require("../assets/super-todo-icon.svg");

const SuperTodoView = ({ title = "SuperTodo", ...contextViewProps }) => (
  <ContextView
    title={title}
    brandColor="#F662AD"
    brandIcon={SuperTodoIcon}
    {...contextViewProps}
  ></ContextView>
);

export default SuperTodoView;
