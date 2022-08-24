import { Account } from "./account";
import { Password } from "./password";
import { UUIDv4 } from "./uuidv4";

export class SerializableAccount implements Account {
    public readonly id: UUIDv4;
    public readonly email: string;
    public readonly password: Password;

    public constructor(id: UUIDv4, email: string, password: Password) {
        this.id = id;
        this.email = email;
        this.password = password;
    }

    public serialize(): string {
        return JSON.stringify({
            id: this.id.toString(),
            email: this.email,
        })
    }
}
