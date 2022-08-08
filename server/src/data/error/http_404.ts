import { HTTPError } from "./http";

export class HTTPNotFoundError extends HTTPError {
    public readonly name: string = "HTTPNotFoundError";
    public readonly status_code: number = 404;
    public readonly status_text: string = "Not Found";
}
