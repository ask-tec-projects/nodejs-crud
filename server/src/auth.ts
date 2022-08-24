import { IncomingMessage } from "http";
import { Cookie } from "./data/cookie";
import { HTTPUnauthorizedError } from "./data/error/http_401";
import { Session } from "./data/session";
import { UUIDv4 } from "./data/uuidv4";

export class RouteAuthenticator {
    public static get_identity(request: IncomingMessage): UUIDv4 {
        if (request.headers["cookie"] === undefined) {
            throw new HTTPUnauthorizedError();
        }
        const cookie = Cookie.parse(request.headers["cookie"])
        const session_id = cookie["cid"];
        if (session_id === undefined) {
            throw new HTTPUnauthorizedError();
        }
        const identity = Session.get().session_to_user(session_id);
        if (identity === undefined) {
            throw new HTTPUnauthorizedError();
        }
        return identity;
    }
}
