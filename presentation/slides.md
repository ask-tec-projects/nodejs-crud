---
# try also 'default' to start simple
theme: purplin
background: https://source.unsplash.com/collection/94734566/1920x1080
class: 'text-center'
highlighter: shiki
lineNumbers: true
info: ''
drawings:
  persist: false
css: unocss
---

# Cryptography

Native NodeJS HTTP, bcrypt & sqlite3


<!--
The last comment block of each slide will be treated as slide notes. It will be visible and editable in Presenter Mode along with the slide. [Read more in the docs](https://sli.dev/guide/syntax.html#notes)
-->

---

# Architecture choices

- **Common**
    - **TypeScript** JavaScript superset
    - **GNU Make** Build system
- **Server**
    - **Native NodeJS HTTP** Webserver
    - **Bcrypt** Cryptography module
    - **SQLite3** Database & driver
    - **Docker** Deployment platform
    - **Traefik** Edge router
    - **Letsencrypt** Certificate authority
- **Client**
    - **Vite** Bundler
    - **SASS** CSS superset

<!--
You can have `style` tag in markdown to override the style for the current page.
Learn more: https://sli.dev/guide/syntax#embedded-styles
-->

---

# Hashing

Bcrypt salt-less password adapter

```ts {all|11-15|7-9}
import { EmptyHashError } from "./error/empty_hash";
import * as bcrypt from "bcrypt";

export class Password {
    ...

    public async validate(input_hash: string): Promise<boolean> {
        return await bcrypt.compare(input_hash, this.hash);
    }

    public static async from_string(password_string: string): Promise<Password> {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password_string, salt);
        return new Password(hash);
    }
}
```

---

# Hashing

No salt lookup password validation

```ts {all|3|11-18}
return new Promise(async (resolve, reject) => {
    const db = await this.get_db();
    db.get("select password from account where email = ?;", [payload.email], async (error: Error | null, account: { password: string } | undefined) => {
        if (error !== null) {
            return reject(error)
        }
        if (account === undefined) {
            return reject(new HTTPUnauthorizedError());
        }

        const authenticated = await new Password(account.password).validate(payload.password)
        //                                       |                          |--> 'password'
        //                                       |--> '$2a$12$3Kw1Ujxdc/2kRr4hmMBJ/MbmeWn9ezXk3dLOKej43ew/ui'
        if (authenticated) {
            resolve(payload.email);
        } else {
            resolve(undefined);
        }
    });
});
```

---

# HTTPS TLS certificate

Traefik routing with `docker-compose` configuration file labels.

```yaml {all|13|14-16}
version: "3.7"

services:
  tec_nodejs_crud:
    image: kruhlmann/tec-nodejs-crud:latest
    container_name: tec-nodejs-crud
    restart: unless-stopped
    environment:
      - DB_PATH=/usr/app/todos.db
      - SERVER_PORT=3000
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.tec_nodejs_crud.rule=Host(`nodejs-crud.tec.kruhlmann.dev`)"
      - "traefik.http.routers.tec_nodejs_crud.tls=true"
      - "traefik.http.routers.tec_nodejs_crud.tls.certresolver=letsencrypt"
      - "traefik.http.routers.tec_nodejs_crud.entrypoints=https"
      - "traefik.http.routers.tec_nodejs_crud.priority=1"
      - "traefik.docker.network=web"
      - "com.centurylinklabs.watchtower.enable=true"
      - "traefik.http.services.tec_nodejs_crud.loadbalancer.server.port=3000"
```

---

# LetsEncrypt CA

*Simplified*

<div style="display: flex; justify-content: center">
```mermaid
graph TD
    A[Webserver certbot client] -->|Request mydomain.org ownership| B(LetsEncrypt CA)
    B --> |Serve 'abc' at mydomain.org/bdc| A
```
</div>

On DNS challenge completion

<div style="display: flex; justify-content: center">
```mermaid
graph TD
    A[Webserver certbot client] -->|Request signing mycert.pem| B(LetsEncrypt CA)
    B --> |Signs and returns mycert.pem| A
```
</div>

---

# Routing

<div style="display: flex; justify-content: center">
```mermaid {scale: 0.43}
classDiagram
    Router <|-- IncomingMessage
    Router : Route[] routes
    Router : find_route(request)
    GetTodosRoute <|-- Router
    GetTodosRoute : respond(request)
    GetTodosRoute : matches(path, method)
    GetTodosRoute : HTTPMethod method
    GetTodosRoute : RegExp pattern
    GetTodoRoute <|-- Router
    GetTodoRoute : respond(request)
    GetTodoRoute : matches(path, method)
    GetTodoRoute : HTTPMethod method
    GetTodoRoute : RegExp pattern
    DeleteTodoRoute <|-- Router
    DeleteTodoRoute : respond(request)
    DeleteTodoRoute : matches(path, method)
    DeleteTodoRoute : HTTPMethod method
    DeleteTodoRoute : RegExp pattern
    PostTodoRoute <|-- Router
    PostTodoRoute : respond(request)
    PostTodoRoute : matches(path, method)
    PostTodoRoute : HTTPMethod method
    PostTodoRoute : RegExp pattern
    PutTodoRoute <|-- Router
    PutTodoRoute : respond(request)
    PutTodoRoute : matches(path, method)
    PutTodoRoute : HTTPMethod method
    PutTodoRoute : RegExp pattern
    TodoService <|-- GetTodosRoute
    TodoService <|-- GetTodoRoute
    TodoService <|-- DeleteTodoRoute
    TodoService <|-- PostTodoRoute
    TodoService <|-- PutTodoRoute
    TodoService : TodoPersister persister
    TodoService : get_todos(user_id)
    TodoService : get_todo(id, user_id)
    TodoService : create_todo(todo, user_id)
    TodoService : delete_todo(id, user_id)
    TodoService : mutate_todo(todo, user_id)
    SQLite3TodoPersister <|-- TodoService
    SQLite3TodoPersister : get_todos(user_id)
    SQLite3TodoPersister : get_todo(id, user_id)
    SQLite3TodoPersister : create_todo(todo, user_id)
    SQLite3TodoPersister : delete_todo(id, user_id)
    SQLite3TodoPersister : mutate_todo(todo, user_id)
```
</div>

---

# XSS Protection

No raw HTML manipulation & opaque cookie

<div class="grid gap-4">
<div class="d2">
<img src="images/xsstest.png" class="rounded shadow" />
</div>
<div>
```ts {all|5,7}
const wrapper_element = this.root.createElement("div");

...

const title_text = this.root.createTextNode(todo.title);
title_element.appendChild(title_text);
const description_text = this.root.createTextNode(todo.description);
description_element.appendChild(description_text);

...

wrapper_element.appendChild(title_element);
wrapper_element.appendChild(description_element);
wrapper_element.onclick = this.event_factory.create_todo_onclick(todo, wrapper_element);
return wrapper_element;
```
</div>
<div>
```ts
Session.get().add(email)
const session_id = Session.get().user_to_session(email);
headers["Set-Cookie"] = `cid=${session_id}; Path=/`;
```
</div>
</div>

<style>
    .grid {
        grid-template-columns: 40% 60%;
        align-items: center;
    }

    .d2 {
        grid-row: span 2;
    }
</style>

---
class: 'text-center'
---

# Demo

<a href="https://nodejs-crud.tec.kruhlmann.dev">Public domain</a>
