import { AccountPersister } from "./account";
import { SQLite3AccountPersister } from "./sqlite/account";
import { SQLite3TodoPersister } from "./sqlite/todo";
import { TodoPersister } from "./todo";

let todo_persister: TodoPersister;
let account_persister: AccountPersister;

export async function get_account_persister(): Promise<AccountPersister> {
    if (account_persister === undefined) {
        account_persister = new SQLite3AccountPersister(process.env.DB_PATH)
        account_persister.init();
    }
    return account_persister;
}

export async function get_todo_persister(): Promise<TodoPersister> {
    await get_account_persister();
    if (todo_persister === undefined) {
        todo_persister = new SQLite3TodoPersister(process.env.DB_PATH)
        todo_persister.init();
    }
    return todo_persister;
}
