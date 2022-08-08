import { HTTPError } from "./http";

export class HTTPInternalServerError extends HTTPError {
    public readonly name: string = "HTTPInternalServerErro";
    public readonly status_code: number = 500;
    public readonly status_text: string = "Internal Server Error";
}
