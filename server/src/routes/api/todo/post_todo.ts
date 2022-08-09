import { IncomingMessage } from "http";
import { JSONBodyReader } from "../../../data/body_reader/json_body_reader";
import { HTTPResponseContext } from "../../../data/http_context";
import { MimeType } from "../../../data/mimetype";
import { TodoPayload } from "../../../data/payload/todo";
import { SerializableTodo } from "../../../data/serializable_todo";
import { SerializableTodoList } from "../../../data/serializable_todo_list";
import { TodoService } from "../../../service/todo";
import { POSTRoute } from "../../post";

export class PostTodoRoute extends POSTRoute {
    public constructor() {
        super(new RegExp("^/api/todo/?$", "i"));
    }

    public async respond(request: IncomingMessage): Promise<HTTPResponseContext> {
        const body = await new JSONBodyReader<TodoPayload>().read(request)
        const todo = await TodoService.get().create_todo(body);
        return {
            status_code: 201,
            mimetype: MimeType.JSON,
            data: new SerializableTodo(todo.id, todo.title, todo.description, todo.state).serialize(),
        }
    }
}
