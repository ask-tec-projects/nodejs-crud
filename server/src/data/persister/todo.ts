import { TodoPayload } from "../payload/todo";
import { Todo } from "../todo";
import { UUIDv4 } from "../uuidv4";

export interface TodoPersister {
    get_todo(id: UUIDv4): Promise<Todo>;
    get_todos(): Promise<Todo[]>;
    create_todo(todo: TodoPayload): Promise<Todo>;
    update_todo(todo: Todo): Promise<Todo>;
    delete_todo(id: UUIDv4): Promise<Todo>;
}
