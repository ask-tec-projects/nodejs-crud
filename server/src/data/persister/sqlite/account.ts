import { DatabaseQueryError } from "../../error/database_query_error";
import { HTTPNotFoundError } from "../../error/http_404";
import { AccountPayload } from "../../payload/account";
import { SerializableAccount } from "../../serializable_account";
import { Account } from "../../account";
import { UUIDv4 } from "../../uuidv4";
import { AccountPersister } from "../account";
import { SQLite3Persister } from "./sqlite";
import { Password } from "../../password";

export class SQLite3AccountPersister extends SQLite3Persister implements AccountPersister {
    protected async create_tables(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.run(`
                create table if not exists account (
                    id text not null check(length(id) == 36) primary key,
                    email text not null,
                    password text not null
                );
            `, (error: Error | null) => {
                if (error !== null) {
                    return reject(new DatabaseQueryError("Unable to create tables", error.toString()));
                }
                resolve();
            });
        });
    }

    public async login(payload: AccountPayload): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const db = await this.get_db();
            db.get("select password from account where email = ?;", [payload.email], async (error: Error | null, account: { password: string } | undefined) => {
                if (error !== null) {
                    return reject(error)
                }

                const authenticated = await new Password(account.password).validate(payload.password)
                if (authenticated) {
                    resolve(payload.email);
                } else {
                    resolve(undefined);
                }
            });
        });
    }


    public async get_account(id: UUIDv4): Promise<Account> {
        return new Promise(async (resolve, reject) => {
            const db = await this.get_db();
            db.get("select * from account where id = ?;", [id.toString()], (error: Error | null, account: Account & { password: string } | undefined) => {
                if (error !== null) {
                    return reject(error)
                }
                if (account === undefined) {
                    return reject(new HTTPNotFoundError(`Account<${id}>`));
                }
                resolve(new SerializableAccount(account.id, account.email, new Password(account.password)));
            });
        });
    }

    public async create_account(account: AccountPayload): Promise<Account> {
        return new Promise(async (resolve, reject) => {
            const db = await this.get_db();
            const id = UUIDv4.generate();
            const password = await Password.from_string(account.password);
            db.run("insert into account values (?, ?, ?)", [id, account.email, password], (error: Error | null) => {
                if (error !== null) {
                    return reject(error);
                }
                resolve(new SerializableAccount(id, account.email, password));
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
