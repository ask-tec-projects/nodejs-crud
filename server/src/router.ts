import { IncomingMessage } from "http";
import { HTTPNotFoundError } from "./data/error/http_404";
import { HTTPMethod } from "./routes/method";
import { Route } from "./routes/route";

export class Router {
    protected readonly routes: Route[];

    public constructor(routes: Route[]) {
        this.routes = routes;
    }

    public find_route(request: IncomingMessage): Route {
        for (const route of this.routes) {
            if (route.matches(request.url, request.method as HTTPMethod)) {
                return route;
            }
        }
        throw new HTTPNotFoundError(`${request.method} ${request.url}`);

    }
}
