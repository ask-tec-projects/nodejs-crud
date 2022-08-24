import { IncomingMessage } from "http";
import { JSONBodyReader } from "../../../data/body_reader/json_body_reader";
import { HTTPResponseContext } from "../../../data/http_context";
import { MimeType } from "../../../data/mimetype";
import { AccountPayload } from "../../../data/payload/account";
import { Session } from "../../../data/session";
import { AccountService } from "../../../service/account";
import { POSTRoute } from "../../post";

export class PostLoginRoute extends POSTRoute {
    public constructor() {
        super(new RegExp("^/api/account/login/?$", "i"));
    }

    public async respond(request: IncomingMessage): Promise<HTTPResponseContext> {
        const body = await new JSONBodyReader<AccountPayload>().read(request)
        const service = await AccountService.get();
        const email = await service.login(body);
        const headers: Record<string, string> = {};
        if (email !== undefined) {
            Session.get().add(email)
            const session_id = Session.get().user_to_session(email);
            headers["Set-Cookie"] = `cid=${session_id}`;
        }

        return {
            status_code: 201,
            mimetype: MimeType.JSON,
            data: JSON.stringify({ authenticated: email !== undefined }),
            headers,
        }
    }
}
