import { Database, OPEN_CREATE, OPEN_READWRITE, verbose } from "sqlite3";
import { DatabaseConnectionError } from "../../error/database_connection";
import { InitializablePersister } from "../initializable";

export abstract class SQLite3Persister implements InitializablePersister {
    protected readonly path: string;
    protected db: Database;

    public constructor(path: string) {
        this.path = path;
        verbose();
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

    public async init(): Promise<void> {
        if (this.db !== undefined) {
            return;
        }
        await this.connect();
        await this.create_tables();
    }

    protected async get_db(): Promise<Database> {
        if (this.db !== undefined) {
            return this.db;
        }
        await this.connect();
        await this.create_tables();
        return this.db;
    }

    protected abstract create_tables(): Promise<void>;
}
