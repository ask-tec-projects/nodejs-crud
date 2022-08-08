import { HTTPMethod } from "./method";
import { Route } from "./route";

export abstract class POSTRoute extends Route {
    public readonly method: HTTPMethod = HTTPMethod.POST;
}
