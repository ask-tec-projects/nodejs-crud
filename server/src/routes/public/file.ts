import * as fs from "fs";
import * as pathlib from "path";
import { IncomingMessage } from "http";
import { HTTPResponseContext } from "../../data/http_context";
import { MimeType } from "../../data/mimetype";
import { HTTPMethod } from "../method";
import { Route } from "../route";
import { MimeTypeFactory } from "../../data/mimetype_factory";

export class FileRoute extends Route {
    protected readonly method: HTTPMethod = HTTPMethod.GET;
    protected readonly root: string;

    public constructor(root: string) {
        super(new RegExp(''));
        this.root = root;
    }

    protected path_to_fspath(path: string): string {
        if (path.endsWith("/")) {
            path += "index.html"
        }
        return pathlib.join(this.root, path)
    }

    public matches(path: string, method: HTTPMethod): boolean {
        if (method !== HTTPMethod.GET) {
            return false;
        }
        return fs.existsSync(this.path_to_fspath(path));
    }

    public async respond(request: IncomingMessage): Promise<HTTPResponseContext> {
        const fpath = this.path_to_fspath(request.url);
        return {
            status_code: 200,
            mimetype: new MimeTypeFactory().from_extension(pathlib.extname(fpath).substring(1)),
            data: fs.readFileSync(fpath).toString(),
        }
    }
}
