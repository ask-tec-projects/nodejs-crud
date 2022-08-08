import { HTTPBadRequestError } from "../error/http_400";
import { BodyReader } from "./body_reader";

export class StringBodyReader extends BodyReader<string> {
    protected postprocess(body: string): string {
        return body;
    }
}
