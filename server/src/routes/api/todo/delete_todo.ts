import { IncomingMessage } from "http";
import { RouteAuthenticator } from "../../../auth";
import { HTTPResponseContext } from "../../../data/http_context";
import { MimeType } from "../../../data/mimetype";
import { re_uuidv4 } from "../../../data/regex";
import { UUIDv4 } from "../../../data/uuidv4";
import { TodoService } from "../../../service/todo";
import { DELETERoute } from "../../delete";

export class DeleteTodoRoute extends DELETERoute {
    public constructor() {
        super(new RegExp("^/api/todo/(" + re_uuidv4.source + ")/?$", "i"));
    }

    public async respond(request: IncomingMessage): Promise<HTTPResponseContext> {
        const user_id = RouteAuthenticator.get_identity(request);
        const id_raw = this.pattern.exec(request.url)[1];
        const id = new UUIDv4(id_raw);
        const service = await TodoService.get();
        await service.delete_todo(id, user_id);
        return {
            status_code: 204,
            mimetype: MimeType.JSON,
            data: "",
        }
    }
}
