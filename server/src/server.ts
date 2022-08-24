import { createServer, IncomingMessage, ServerResponse } from "http";
import { HTTPInternalServerError } from "./data/error/http_500";
import { HTTPErrorResponder } from "./data/error/responder";
import { get_account_persister, get_todo_persister } from "./data/persister/persisters";
import { Session } from "./data/session";
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

(async () => {
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

    await get_account_persister();
    await get_todo_persister();

    createServer(async (request: IncomingMessage, response: ServerResponse) => {
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
            console.log(`\u001b[36m${request.method} ${request.url} -> ${payload.status_code}\u001b[0m`);
        } catch (error) {
            if (error.status_text === undefined) {
                console.log(`Uncaught error: ${error}`);
                console.log(error.stack);
                error = new HTTPInternalServerError();
            }
            new HTTPErrorResponder().respond_to_error(response, error);
            console.log(`\u001b[31m${request.method} ${request.url} -> ${error.status_code}\u001b[0m`);
        }
    }).listen(process.env["SERVER_PORT"], () => {
        console.log(`Server up on 0.0.0.0:${process.env["SERVER_PORT"]}`);
    })
})();
