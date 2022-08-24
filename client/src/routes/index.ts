import { DOMFactory } from "../dom_factory";
import { EventFactory } from "../event_factory";

window.onload = () => {
    const dom_factory = new DOMFactory(document);
    fetch("/api/todo/").then((response) => {
        return response.json();
    }).then((todos) => {
        for (const todo of todos) {
            const dom_element = dom_factory.create_todo(todo);
            document.body.appendChild(dom_element);
        }
    }).catch(() => {
        window.location.href = "/login";
    });
};

(window as any).create_new_todo = function create_new_todo(): void {
    const title_element = document.getElementById("todoform-title") as HTMLInputElement;
    const description_element = document.getElementById("todoform-description") as HTMLTextAreaElement;
    const payload = { title: title_element.value, description: description_element.value, state: 0 };
    const dom_factory = new DOMFactory(document);

    fetch(`/api/todo`, { method: "POST", body: JSON.stringify(payload) }).then((response) => {
        return response.json();
    }).then((todo) => {
        const dom_element = dom_factory.create_todo(todo);
        document.body.appendChild(dom_element);
    });
}
