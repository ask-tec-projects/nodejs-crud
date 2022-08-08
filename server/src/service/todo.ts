import { TodoPayload } from "../data/payload/todo";
import { SQLite3TodoPersister } from "../data/persister/sqlite/todo";
import { TodoPersister } from "../data/persister/todo";
import { Todo } from "../data/todo";
import { UUIDv4 } from "../data/uuidv4";

export class TodoService {
    protected static instance: TodoService | undefined;
    protected readonly persister: TodoPersister;

    protected constructor() {
        this.persister = new SQLite3TodoPersister(process.env.DB_PATH);
    }

    public static get(): TodoService {
        if (TodoService.instance === undefined) {
            TodoService.instance = new TodoService();
        }
        return TodoService.instance;
    }

    public async get_todos(): Promise<Todo[]> {
        return this.persister.get_todos();
    }

    public async get_todo(id: UUIDv4): Promise<Todo> {
        return this.persister.get_todo(id);
    }

    public async create_todo(todo: TodoPayload): Promise<Todo> {
        return this.persister.create_todo(todo);
    }
}
