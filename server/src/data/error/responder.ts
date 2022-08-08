import { ServerResponse } from "http";
import { HTTPError } from "./http";

export class HTTPErrorResponder {
    public respond_to_error(response: ServerResponse, error: HTTPError): void {
        response.setHeader("Content-Type", "text/plain");
        response.statusCode = error.status_code;
        response.end(`${error.status_text}: ${error.message || ""}`);
    }
}
