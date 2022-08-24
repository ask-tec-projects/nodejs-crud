import { Todo } from "./todo";

export class EventFactory {
    public create_todo_onclick(todo: Todo, element: HTMLElement): (e: MouseEvent) => void {
        return () => {
            const old_state = todo.state;
            todo.state = todo.state === 0 ? 1 : 0;
            const options = { method: "PUT", body: JSON.stringify(todo) };
            fetch(`/api/todo/${todo.id}`, options).then((response) => {
                if (response.ok) {
                    element.classList.remove(`state-${old_state}`);
                    element.classList.add(`state-${todo.state}`);
                }
            });
        }
    }

    public create_todo_delete(todo: Todo, element: HTMLElement): (e: MouseEvent) => void {
        return () => {
            const options = { method: "DELETE" };
            fetch(`/api/todo/${todo.id}`, options).then((response) => {
                if (response.ok) {
                    element.remove();
                }
            });
        }
    }
}
