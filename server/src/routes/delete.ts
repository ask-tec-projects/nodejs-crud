import { HTTPMethod } from "./method";
import { Route } from "./route";

export abstract class DELETERoute extends Route {
    public readonly method: HTTPMethod = HTTPMethod.DELETE;
}
