import { Gui } from "../modules/gui";
import { Logic } from "../modules/logic";
import { Store } from "../modules/storage";

export class Card {
    constructor() {}

    //#region Implementing singleton pattern
    static getInstance() {
        if (!Card.instance) {
            Card.instance = new Card();
        }
        return Card.instance;
    }
    //#endregion

    /**
     * Changes the status of a Todo and its appearance to reflect the change.
     * @param {*} todo
     * @param {*} todoUI
     */
    static checkTodo(todo, todoUI) {
        todo.toggleStatus();
        todoUI.classList.toggle("done");

        // Ternary operator in case we are in the "General" view or in a filtered one.
        Store.saveProject(
            Gui.currentProject.name === todo.project
                ? Gui.currentProject
                : Store.loadProject(todo.project)
        );
    }

    static editTodo(todo, todoUI) {
        // Open form in edit mode

        // Saved values change the ones displayed
    }

    static deleteTodo(todo, todoUI) {
        let project =
            Gui.currentProject.name === todo.project
                ? Gui.currentProject
                : Store.loadProject(todo.project);

        Logic.deleteTodo(project, todo);
        document.querySelector("#todoView").removeChild(todoUI)

        // Ternary operator in case we are in the "General" view or in a filtered one.
        Store.saveProject(project);
    }
}
