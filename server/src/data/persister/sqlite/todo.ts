import { Database, OPEN_CREATE, OPEN_READWRITE } from "sqlite3";
import { DatabaseConnectionError } from "../../error/database_connection";
import { DatabaseQueryError } from "../../error/database_query_error";
import { HTTPNotFoundError } from "../../error/http_404";
import { TodoPayload } from "../../payload/todo";
import { SerializableTodo } from "../../serializable_todo";
import { Todo } from "../../todo";
import { UUIDv4 } from "../../uuidv4";
import { TodoPersister } from "../todo";

export class SQLite3TodoPersister implements TodoPersister {
    protected readonly path: string;
    protected db: Database;

    public constructor(path: string) {
        this.path = path;
    }

    protected async connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db = new Database(this.path, OPEN_READWRITE | OPEN_CREATE, (error: Error | null) => {
                if (error !== null) {
                    reject(new DatabaseConnectionError(`No databse connection (${this.path})`));
                }
                resolve()
            });
        })
    }

    protected async create_tables(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.run(`
                create table if not exists todo (
                    id text not null check(length(id) == 36) primary key,
                    title text not null,
                    description text not null,
                    state int check(state <= 1)
                );
            `, (error: Error | null) => {
                if (error !== null) {
                    return reject(new DatabaseQueryError("Unable to create tables", error.toString()));
                }
                resolve();
            });
        });
    }

    protected async get_db(): Promise<Database> {
        if (this.db !== undefined) {
            return this.db;
        }
        await this.connect();
        await this.create_tables();
        return this.db;
    }

    public async get_todo(id: UUIDv4): Promise<Todo> {
        return new Promise(async (resolve, reject) => {
            const db = await this.get_db();
            db.get("select * from todo where id = ?;", [id.toString()], (error: Error | null, todo: Todo | undefined) => {
                if (error !== null) {
                    return reject(error)
                }
                if (todo === undefined) {
                    return reject(new HTTPNotFoundError(`Todo<${id}>`));
                }
                resolve(new SerializableTodo(todo.id, todo.title, todo.description, todo.state))
            });
        });
    }

    public async get_todos(): Promise<Todo[]> {
        return new Promise(async (resolve, reject) => {
            const db = await this.get_db();
            db.all("select * from todo;", (error: Error | null, todos: Todo[]) => {
                if (error !== null) {
                    return reject(error);
                }
                const serialized_todos = todos.map((todo: Todo) => {
                    return new SerializableTodo(todo.id, todo.title, todo.description, todo.state)
                });
                resolve(serialized_todos);
            });
        });
    }

    public async create_todo(todo: TodoPayload): Promise<Todo> {
        return new Promise(async (resolve, reject) => {
            const db = await this.get_db();
            const id = UUIDv4.generate();
            db.run("insert into todo values (?, ?, ?, ?)", [id, todo.title, todo.description, todo.state], (error: Error | null) => {
                if (error !== null) {
                    return reject(error);
                }
                resolve(new SerializableTodo(id, todo.title, todo.description, todo.state))
            })
        });
    }

    public async mutate_todo(todo: Todo): Promise<Todo> {
        return new Promise(async (resolve, reject) => {
            const db = await this.get_db();
            db.run("update todo set title = ?, description = ?, state = ? where id = ?", [todo.title, todo.description, todo.state, todo.id], (error: Error | null) => {
                if (error !== null) {
                    return reject(error);
                }
                resolve(new SerializableTodo(todo.id, todo.title, todo.description, todo.state))
            });
        });
    }

    public async delete_todo(id: UUIDv4): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const db = await this.get_db();
            db.run("delete from todo where id = ?", [id], (error: Error | null) => {
                if (error !== null) {
                    return reject(error);
                }
                resolve()
            });
        });
    }
}
