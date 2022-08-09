import { TodoState } from "./todo_state";

export interface Todo {
    id: string;
    title: string;
    description: string;
    state: TodoState
}
