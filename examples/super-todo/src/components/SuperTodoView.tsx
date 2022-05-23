import { ContextView } from "@stripe/ui-extension-sdk/ui";
import SuperTodoIcon from "../assets/super-todo-icon.svg";

const SuperTodoView = ({ title = "SuperTodo", ...contextViewProps }) => (
  <ContextView
    title={title}
    brandColor="#F662AD"
    brandIcon={SuperTodoIcon}
    {...contextViewProps}
  ></ContextView>
);

export default SuperTodoView;
