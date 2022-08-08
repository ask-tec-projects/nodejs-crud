import { HTTPError } from "./http";

export class HTTPBadRequestError extends HTTPError {
    public readonly name: string = "HTTPBadRequestError";
    public readonly status_code: number = 400;
    public readonly status_text: string = "Bad Request";
}
