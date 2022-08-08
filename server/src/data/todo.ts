import { TodoState } from "./todo_state";
import { UUIDv4 } from "./uuidv4";

export interface Todo {
    id: UUIDv4;
    title: string;
    description: string;
    state: TodoState
}
