import { Account } from "../account";
import { AccountPayload } from "../payload/account";
import { UUIDv4 } from "../uuidv4";
import { InitializablePersister } from "./initializable";

export interface AccountPersister extends InitializablePersister {
    login(payload: AccountPayload): Promise<string>;
    create_account(payload: AccountPayload): Promise<Account>;
    delete_account(id: UUIDv4): Promise<void>;
    init(): Promise<void>;
}
