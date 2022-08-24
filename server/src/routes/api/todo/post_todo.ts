import { IncomingMessage } from "http";
import { RouteAuthenticator } from "../../../auth";
import { JSONBodyReader } from "../../../data/body_reader/json_body_reader";
import { HTTPBadRequestError } from "../../../data/error/http_400";
import { HTTPResponseContext } from "../../../data/http_context";
import { MimeType } from "../../../data/mimetype";
import { TodoPayload } from "../../../data/payload/todo";
import { SerializableTodo } from "../../../data/serializable_todo";
import { TodoService } from "../../../service/todo";
import { POSTRoute } from "../../post";

export class PostTodoRoute extends POSTRoute {
    public constructor() {
        super(new RegExp("^/api/todo/?$", "i"));
    }

    public async respond(request: IncomingMessage): Promise<HTTPResponseContext> {
        const user_id = RouteAuthenticator.get_identity(request);
        const payload = await new JSONBodyReader<TodoPayload>().read(request).catch(() => {
            throw new HTTPBadRequestError();
        });
        const service = await TodoService.get();
        const todo = await service.create_todo(payload, user_id);
        return {
            status_code: 201,
            mimetype: MimeType.JSON,
            data: new SerializableTodo(todo.id, todo.title, todo.description, todo.state).serialize(),
        }
    }
}
