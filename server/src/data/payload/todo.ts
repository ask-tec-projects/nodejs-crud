import { TodoState } from "../todo_state";

export interface TodoPayload {
    title: string;
    description: string;
    state: TodoState;
}
