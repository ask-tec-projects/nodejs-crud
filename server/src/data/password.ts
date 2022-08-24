import { EmptyHashError } from "./error/empty_hash";
import bcrypt from "bcrypt";

export class Password {
    protected readonly hash: string;

    public constructor(hash?: string) {
        if (hash === undefined) {
            throw new EmptyHashError(hash);
        }
        this.hash = hash;
    }

    public toString(): string {
        return this.hash;
    }

    public async validate(input_hash: string): Promise<boolean> {
        return await bcrypt.compare(input_hash, this.hash);
    }

    public static async from_string(password_string: string): Promise<Password> {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password_string, salt);
        return new Password(hash);
    }
}
