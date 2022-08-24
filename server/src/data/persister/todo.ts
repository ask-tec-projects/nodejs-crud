import { TodoPayload } from "../payload/todo";
import { Todo } from "../todo";
import { UUIDv4 } from "../uuidv4";
import { InitializablePersister } from "./initializable";

export interface TodoPersister extends InitializablePersister {
    get_todo(id: UUIDv4, user_id: UUIDv4): Promise<Todo>;
    get_todos(user_id: UUIDv4): Promise<Todo[]>;
    create_todo(todo: TodoPayload, user_id: UUIDv4): Promise<Todo>;
    delete_todo(id: UUIDv4, user_id: UUIDv4): Promise<void>;
    mutate_todo(todo: Todo, user_id: UUIDv4): Promise<Todo>;
}
