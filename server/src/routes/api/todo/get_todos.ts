import { IncomingMessage } from "http";
import { HTTPResponseContext } from "../../../data/http_context";
import { MimeType } from "../../../data/mimetype";
import { re_uuidv4 } from "../../../data/regex";
import { SerializableTodo } from "../../../data/serializable_todo";
import { SerializableTodoList } from "../../../data/serializable_todo_list";
import { TodoService } from "../../../service/todo";
import { GETRoute } from "../../get";

export class GetTodosRoute extends GETRoute {
    public constructor() {
        super(new RegExp("^/todo/?$", "i"));
    }

    public async respond(_request: IncomingMessage): Promise<HTTPResponseContext> {
        const todos = await TodoService.get().get_todos();
        const serializable_todos = todos.map((todo) => new SerializableTodo(todo.title, todo.description, todo.state));
        return {
            status_code: 200,
            mimetype: MimeType.JSON,
            data: new SerializableTodoList(serializable_todos).serialize(),
        }
    }
}
