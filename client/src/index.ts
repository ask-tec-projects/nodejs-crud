import { DOMFactory } from "./dom_factory";

window.onload = () => {
    const dom_factory = new DOMFactory(document);
    fetch("/api/todo/").then((response) => {
        return response.json();
    }).then((todos) => {
        for (const todo of todos) {
            const dom_element = dom_factory.create_todo(todo);
            document.body.appendChild(dom_element);
        }
    });
};
