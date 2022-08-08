import { IncomingMessage } from "http";
import { HTTPResponseContext } from "../data/http_context";
import { HTTPMethod } from "./method";

export abstract class Route {
    protected readonly pattern: RegExp;
    protected abstract readonly method: HTTPMethod;

    public constructor(pattern: RegExp) {
        this.pattern = pattern;
    }

    public matches(path: string, method: HTTPMethod): boolean {
        return this.method === method && path.match(this.pattern) !== null;
    }

    public abstract respond(request: IncomingMessage): Promise<HTTPResponseContext>;
}
