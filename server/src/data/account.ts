import { UUIDv4 } from "./uuidv4";
import { Password } from "./password";

export interface Account {
    id: UUIDv4;
    email: string;
    password: Password
}
