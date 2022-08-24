import { IncomingMessage } from "http";
import { RouteAuthenticator } from "../../../auth";
import { HTTPResponseContext } from "../../../data/http_context";
import { MimeType } from "../../../data/mimetype";
import { SerializableTodo } from "../../../data/serializable_todo";
import { SerializableTodoList } from "../../../data/serializable_todo_list";
import { TodoService } from "../../../service/todo";
import { GETRoute } from "../../get";

export class GetTodosRoute extends GETRoute {
    public constructor() {
        super(new RegExp("^/api/todo/?$", "i"));
    }

    public async respond(request: IncomingMessage): Promise<HTTPResponseContext> {
        const user_id = RouteAuthenticator.get_identity(request);
        const service = await TodoService.get();
        const todos = await service.get_todos(user_id);
        const serializable_todos = todos.map((todo) => new SerializableTodo(todo.id, todo.title, todo.description, todo.state));
        return {
            status_code: 200,
            mimetype: MimeType.JSON,
            data: new SerializableTodoList(serializable_todos).serialize(),
        }
    }
}
