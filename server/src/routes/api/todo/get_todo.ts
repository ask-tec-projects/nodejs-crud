import { IncomingMessage } from "http";
import { RouteAuthenticator } from "../../../auth";
import { HTTPBadRequestError } from "../../../data/error/http_400";
import { InvalidUUIDv4Error } from "../../../data/error/invalid_uuidv4";
import { HTTPResponseContext } from "../../../data/http_context";
import { MimeType } from "../../../data/mimetype";
import { re_uuidv4 } from "../../../data/regex";
import { SerializableTodo } from "../../../data/serializable_todo";
import { UUIDv4 } from "../../../data/uuidv4";
import { TodoService } from "../../../service/todo";
import { GETRoute } from "../../get";

export class GetTodoRoute extends GETRoute {
    public constructor() {
        super(new RegExp("^/api/todo/(" + re_uuidv4.source + ")/?$", "i"));
    }

    public async respond(request: IncomingMessage): Promise<HTTPResponseContext> {
        const user_id = RouteAuthenticator.get_identity(request);
        const id_raw = this.pattern.exec(request.url)[1];
        try {
            const id = new UUIDv4(id_raw);
            const service = await TodoService.get();
            const todo = await service.get_todo(id, user_id);
            return {
                status_code: 200,
                mimetype: MimeType.JSON,
                data: new SerializableTodo(id, todo.title, todo.description, todo.state).serialize(),
            }
        } catch (error) {
            if (error.name === "InvalidUUIDv4Error") {
                throw new HTTPBadRequestError(`Invalid UUID ${error.message}`);
            }
            throw error;
        }
    }
}
