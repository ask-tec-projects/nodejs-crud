import { TodoPayload } from "../data/payload/todo";
import { get_todo_persister } from "../data/persister/persisters";
import { SQLite3TodoPersister } from "../data/persister/sqlite/todo";
import { TodoPersister } from "../data/persister/todo";
import { Todo } from "../data/todo";
import { UUIDv4 } from "../data/uuidv4";

export class TodoService {
    protected static instance: TodoService | undefined;
    protected readonly persister: TodoPersister;

    protected constructor(persister: TodoPersister) {
        this.persister = persister;
    }

    public static async get(): Promise<TodoService> {
        if (TodoService.instance === undefined) {
            TodoService.instance = new TodoService(await get_todo_persister());
        }
        return TodoService.instance;
    }

    public async get_todos(user_id: UUIDv4): Promise<Todo[]> {
        return this.persister.get_todos(user_id);
    }

    public async get_todo(id: UUIDv4, user_id: UUIDv4): Promise<Todo> {
        return this.persister.get_todo(id, user_id);
    }

    public async create_todo(todo: TodoPayload, user_id: UUIDv4): Promise<Todo> {
        return this.persister.create_todo(todo, user_id);
    }

    public async delete_todo(id: UUIDv4, user_id: UUIDv4): Promise<void> {
        return this.persister.delete_todo(id, user_id);
    }

    public async mutate_todo(todo: Todo, user_id: UUIDv4): Promise<Todo> {
        return this.persister.mutate_todo(todo, user_id);
    }
}
