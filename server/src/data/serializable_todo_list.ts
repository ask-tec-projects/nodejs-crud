import { Serializable } from "../serializable";
import { SerializableTodo } from "./serializable_todo";

export class SerializableTodoList implements Serializable {
    protected readonly items: SerializableTodo[];

    public constructor(items: SerializableTodo[]) {
        this.items = items;
    }

    public serialize(): string {
        const body = this.items.map((item) => item.serialize()).join(",");
        return `[${body}]`;
    }
}
