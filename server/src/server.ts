import { createServer, IncomingMessage, ServerResponse } from "http";
import { HTTPInternalServerError } from "./data/error/http_500";
import { HTTPErrorResponder } from "./data/error/responder";
import { ServerEnvironmentValidator } from "./io/server_environment_validator";
import { Router } from "./router";
import { DeleteTodoRoute } from "./routes/api/todo/delete_todo";
import { GetTodoRoute } from "./routes/api/todo/get_todo";
import { GetTodosRoute } from "./routes/api/todo/get_todos";
import { PostTodoRoute } from "./routes/api/todo/post_todo";
import { PutTodoRoute } from "./routes/api/todo/put_todo";
import { FileRoute } from "./routes/public/file";

new ServerEnvironmentValidator().validate_environment();
const router = new Router([
    new GetTodoRoute(),
    new GetTodosRoute(),
    new DeleteTodoRoute(),
    new PostTodoRoute(),
    new PutTodoRoute(),
    new FileRoute(__dirname),
]);

createServer(async (request: IncomingMessage, response: ServerResponse) => {
    console.log(`${request.method} ${request.url}`);
    try {
        const route = router.find_route(request);
        const payload = await route.respond(request);
        response.statusCode = payload.status_code;
        response.setHeader("Content-Type", payload.mimetype);
        response.end(payload.data);
    } catch (error) {
        if (error.status_text === undefined) {
            console.log(`Uncaught error: ${error}`);
            console.log(error.stack);
            error = new HTTPInternalServerError();
        }
        new HTTPErrorResponder().respond_to_error(response, error);
    }
}).listen(3000, () => console.log("Server up"))
