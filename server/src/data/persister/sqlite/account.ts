import { Database, OPEN_CREATE, OPEN_READWRITE } from "sqlite3";
import { DatabaseConnectionError } from "../../error/database_connection";
import { DatabaseQueryError } from "../../error/database_query_error";
import { HTTPNotFoundError } from "../../error/http_404";
import { AccountPayload } from "../../payload/account";
import { SerializableAccount } from "../../serializable_account";
import { Account } from "../../account";
import { UUIDv4 } from "../../uuidv4";
import { AccountPersister } from "../account";

export class SQLite3AccountPersister implements AccountPersister {
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
                create table if not exists account (
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

    public async get_account(id: UUIDv4): Promise<Account> {
        return new Promise(async (resolve, reject) => {
            const db = await this.get_db();
            db.get("select * from account where id = ?;", [id.toString()], (error: Error | null, account: Account | undefined) => {
                if (error !== null) {
                    return reject(error)
                }
                if (account === undefined) {
                    return reject(new HTTPNotFoundError(`Account<${id}>`));
                }
                resolve(new SerializableAccount(account.id, account.title, account.description, account.state))
            });
        });
    }

    public async get_accounts(): Promise<Account[]> {
        return new Promise(async (resolve, reject) => {
            const db = await this.get_db();
            db.all("select * from account;", (error: Error | null, accounts: Account[]) => {
                if (error !== null) {
                    return reject(error);
                }
                const serialized_accounts = accounts.map((account: Account) => {
                    return new SerializableAccount(account.id, account.title, account.description, account.state)
                });
                resolve(serialized_accounts);
            });
        });
    }

    public async create_account(account: AccountPayload): Promise<Account> {
        return new Promise(async (resolve, reject) => {
            const db = await this.get_db();
            const id = UUIDv4.generate();
            db.run("insert into account values (?, ?, ?)", [id, account.email, account.password], (error: Error | null) => {
                if (error !== null) {
                    return reject(error);
                }
                resolve(new SerializableAccount(id, account.title, account.description, account.state))
            })
        });
    }

    public async delete_account(id: UUIDv4): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const db = await this.get_db();
            db.run("delete from account where id = ?", [id], (error: Error | null) => {
                if (error !== null) {
                    return reject(error);
                }
                resolve()
            });
        });
    }
}
