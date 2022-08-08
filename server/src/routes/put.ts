import { HTTPResponseContext } from "../data/http_context";
import { HTTPMethod } from "./method";
import { Route } from "./route";

export abstract class PUTRoute extends Route {
    public readonly method: HTTPMethod = HTTPMethod.PUT;
}
