import { HTTPBadRequestError } from "../error/http_400";
import { BodyReader } from "./body_reader";

export class JSONBodyReader<OutputType> extends BodyReader<OutputType> {
    protected postprocess(body: string): OutputType {
        try {
            return JSON.parse(body);
        } catch {
            throw new HTTPBadRequestError("Invalid JSON body");
        }
    }
}
