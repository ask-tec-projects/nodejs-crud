import { createServer, IncomingMessage, ServerResponse } from "http";
import { HTTPInternalServerError } from "./data/error/http_500";
import { HTTPErrorResponder } from "./data/error/responder";
import { ServerEnvironmentValidator } from "./io/server_environment_validator";
import { Router } from "./router";
import { PostAccountRoute } from "./routes/api/account/post_account";
import { PostLoginRoute } from "./routes/api/account/post_login";
import { DeleteTodoRoute } from "./routes/api/todo/delete_todo";
import { GetTodoRoute } from "./routes/api/todo/get_todo";
import { GetTodosRoute } from "./routes/api/todo/get_todos";
import { PostTodoRoute } from "./routes/api/todo/post_todo";
import { PutTodoRoute } from "./routes/api/todo/put_todo";
import { FileRoute } from "./routes/public/file";

new ServerEnvironmentValidator().validate_environment();
const router = new Router([
    new PostAccountRoute(),
    new PostLoginRoute(),
    new GetTodoRoute(),
    new GetTodosRoute(),
    new DeleteTodoRoute(),
    new PostTodoRoute(),
    new PutTodoRoute(),
    new FileRoute(__dirname),
]);

createServer(async (request: IncomingMessage, response: ServerResponse) => {
    console.log(`${request.method} ${request.url}`);
    console.log(request.headers)
    try {
        const route = router.find_route(request);
        const payload = await route.respond(request);
        if (payload.headers) {
            for (const header_name of Object.keys(payload.headers)) {
                response.setHeader(header_name, payload.headers[header_name])
            }
        }
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
}).listen(process.env["SERVER_PORT"], () => {
    console.log(`Server up on 0.0.0.0:${process.env["SERVER_PORT"]}`);
})
