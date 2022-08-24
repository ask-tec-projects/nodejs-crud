import { AccountPayload } from "../data/payload/account";
import { SQLite3AccountPersister } from "../data/persister/sqlite/account";
import { AccountPersister } from "../data/persister/account";
import { Account } from "../data/account";
import { UUIDv4 } from "../data/uuidv4";

export class AccountService {
    protected static instance: AccountService | undefined;
    protected readonly persister: AccountPersister;

    protected constructor(persister: AccountPersister) {
        this.persister = persister;
    }

    public static get(): AccountService {
        if (AccountService.instance === undefined) {
            AccountService.instance = new AccountService(new SQLite3AccountPersister(process.env.DB_PATH));
        }
        return AccountService.instance;
    }

    public async login(payload: AccountPayload): Promise<string> {
        return this.persister.login(payload);
    }

    public async create_account(payload: AccountPayload): Promise<void> {
        return this.persister.create_account(payload);
    }

    public async delete_account(id: UUIDv4): Promise<void> {
        return this.persister.delete_account(id);
    }
}
