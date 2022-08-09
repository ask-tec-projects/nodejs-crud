import { Todo } from "./todo";

export class DOMFactory {
    protected readonly root: Document;

    public constructor(root: Document) {
        this.root = root;
    }

    public create_todo(todo: Todo): HTMLElement {
        const wrapper_element = this.root.createElement("div");
        wrapper_element.classList.add("todo")
        const title_element = this.root.createElement("span");
        title_element.classList.add("title");
        const description_element = this.root.createElement("span");
        description_element.classList.add("description");

        const title_text = this.root.createTextNode(todo.title);
        const description_text = this.root.createTextNode(todo.description);
        return element;
    }
}
