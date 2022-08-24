import { AccountPayload } from "../payload/account";

export interface AccountPersister {
    login(payload: AccountPayload): Promise<string>;
    create_account(payload: AccountPayload): Promise<void>;
    delete_account(id: AccountPayload): Promise<void>;
}
