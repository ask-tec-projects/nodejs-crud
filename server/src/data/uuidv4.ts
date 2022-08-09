import { InvalidUUIDv4Error } from "./error/invalid_uuidv4";
import { re_uuidv4 } from "./regex";

export class UUIDv4 {
    protected readonly id: string;

    public constructor(id?: string) {
        if (id === undefined || id.match(re_uuidv4) === null) {
            throw new InvalidUUIDv4Error(id);
        }
        this.id = id;
    }

    public toString(): string {
        return this.id;
    }

    public static generate(): UUIDv4 {
        const id = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (character) => {
            const rand = Math.random() * 16 | 0
            const v = character == 'x' ? rand : (rand & 0x3 | 0x8);
            return v.toString(16);
        });
        return new UUIDv4(id);
    }
}
