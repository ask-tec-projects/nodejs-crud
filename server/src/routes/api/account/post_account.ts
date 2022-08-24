import { IncomingMessage } from "http";
import { JSONBodyReader } from "../../../data/body_reader/json_body_reader";
import { HTTPBadRequestError } from "../../../data/error/http_400";
import { HTTPResponseContext } from "../../../data/http_context";
import { MimeType } from "../../../data/mimetype";
import { AccountPayload } from "../../../data/payload/account";
import { SerializableAccount } from "../../../data/serializable_account";
import { AccountService } from "../../../service/account";
import { POSTRoute } from "../../post";

export class PostAccountRoute extends POSTRoute {
    public constructor() {
        super(new RegExp("^/api/account/?$", "i"));
    }

    public async respond(request: IncomingMessage): Promise<HTTPResponseContext> {
        const body = await new JSONBodyReader<AccountPayload>().read(request).catch(() => {
            throw new HTTPBadRequestError();
        });
        const service = await AccountService.get();
        const account = await service.create_account(body);
        return {
            status_code: 201,
            mimetype: MimeType.JSON,
            data: new SerializableAccount(account.id, account.email, account.password).serialize(),
        }
    }
}
