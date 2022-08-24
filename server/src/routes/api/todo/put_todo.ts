import { IncomingMessage } from "http";
import { RouteAuthenticator } from "../../../auth";
import { JSONBodyReader } from "../../../data/body_reader/json_body_reader";
import { HTTPBadRequestError } from "../../../data/error/http_400";
import { HTTPResponseContext } from "../../../data/http_context";
import { MimeType } from "../../../data/mimetype";
import { TodoPayload } from "../../../data/payload/todo";
import { re_uuidv4 } from "../../../data/regex";
import { SerializableTodo } from "../../../data/serializable_todo";
import { UUIDv4 } from "../../../data/uuidv4";
import { TodoService } from "../../../service/todo";
import { PUTRoute } from "../../put";

export class PutTodoRoute extends PUTRoute {
    public constructor() {
        super(new RegExp("^/api/todo/(" + re_uuidv4.source + ")/?$", "i"));
    }

    public async respond(request: IncomingMessage): Promise<HTTPResponseContext> {
        const user_id = RouteAuthenticator.get_identity(request);
        try {
            const payload = await new JSONBodyReader<TodoPayload>().read(request).catch(() => {
                throw new HTTPBadRequestError();
            });
            const id_raw = this.pattern.exec(request.url)[1];
            const id = new UUIDv4(id_raw);
            const service = await TodoService.get();
            const todo = await service.mutate_todo({ id, ...payload }, user_id);
            return {
                status_code: 200,
                mimetype: MimeType.JSON,
                data: new SerializableTodo(todo.id, todo.title, todo.description, todo.state).serialize(),
            }
        } catch (error) {
            if (error.name === "InvalidUUIDv4Error") {
                throw new HTTPBadRequestError(`Invalid UUID ${error.message}`);
            }
            throw error;
        }
    }
}
