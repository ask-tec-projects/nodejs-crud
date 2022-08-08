import { IncomingMessage } from "http";
import { HTTPResponseContext } from "../../../data/http_context";
import { re_uuidv4 } from "../../../data/regex";
import { DELETERoute } from "../../delete";

export class DeleteTodoRoute extends DELETERoute {
    public constructor() {
        super(new RegExp("^/todo/" + re_uuidv4.source + "/?$", "i"));
    }

    public async respond(request: IncomingMessage): Promise<HTTPResponseContext> {
        throw new Error()
    }
}
