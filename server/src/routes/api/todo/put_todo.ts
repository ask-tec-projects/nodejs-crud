import { IncomingMessage } from "http";
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
        try {
            const payload = await new JSONBodyReader<TodoPayload>().read(request);
            const id_raw = this.pattern.exec(request.url)[1];
            const id = new UUIDv4(id_raw);
            const todo = await TodoService.get().mutate_todo({ id, ...payload })
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
