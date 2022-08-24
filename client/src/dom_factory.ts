import { EventFactory } from "./event_factory";
import { Todo } from "./todo";

export class DOMFactory {
    protected readonly root: Document;
    protected readonly event_factory: EventFactory;

    public constructor(root: Document) {
        this.root = root;
        this.event_factory = new EventFactory();
    }

    public create_todo(todo: Todo): HTMLElement {
        const wrapper_element = this.root.createElement("div");
        wrapper_element.classList.add("todo");
        wrapper_element.classList.add(`state-${todo.state}`);
        const title_element = this.root.createElement("span");
        title_element.classList.add("title");
        const description_element = this.root.createElement("span");
        description_element.classList.add("description");
        const delete_element = this.root.createElement("button");
        const completed_element = this.root.createElement("span");
        completed_element.classList.add("done");

        const completed_text = this.root.createTextNode("✔");
        completed_element.appendChild(completed_text);
        const title_text = this.root.createTextNode(todo.title);
        title_element.appendChild(title_text);
        const description_text = this.root.createTextNode(todo.description);
        description_element.appendChild(description_text);
        const delete_text = this.root.createTextNode("Delete");
        delete_element.appendChild(delete_text);
        delete_element.onclick = this.event_factory.create_todo_delete(todo, wrapper_element);

        wrapper_element.appendChild(completed_element);
        wrapper_element.appendChild(title_element);
        wrapper_element.appendChild(description_element);
        wrapper_element.appendChild(delete_element);
        wrapper_element.onclick = this.event_factory.create_todo_onclick(todo, wrapper_element);
        return wrapper_element;
    }
}
