import { HTTPError } from "./http";

export class HTTPUnauthorizedError extends HTTPError {
    public readonly name: string = "HTTPUnauthorizedError";
    public readonly status_code: number = 401;
    public readonly status_text: string = "Unauthorized";
}
