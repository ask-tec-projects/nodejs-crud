import { HTTPMethod } from "./method";
import { Route } from "./route";

export abstract class GETRoute extends Route {
    public readonly method: HTTPMethod = HTTPMethod.GET;
}
