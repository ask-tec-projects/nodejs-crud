import { Serializable } from "../serializable";
import { Todo } from "./todo";
import { TodoState } from "./todo_state";
import { UUIDv4 } from "./uuidv4";

export class SerializableTodo implements Serializable, Todo {
    public readonly id: UUIDv4;
    public readonly title: string;
    public readonly description: string;
    public readonly state: TodoState;

    public constructor(id: UUIDv4, title: string, description: string, state: TodoState) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.state = state;
    }

    public serialize(): string {
        return JSON.stringify({
            id: this.id.toString(),
            title: this.title,
            description: this.description,
            state: this.state,
        })
    }
}
