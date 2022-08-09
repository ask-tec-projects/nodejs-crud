import { HTTPInternalServerError } from "./http_500";

export class UnknownMimetypeError extends HTTPInternalServerError {
    public name = "UnknownMimetypeError";
}
