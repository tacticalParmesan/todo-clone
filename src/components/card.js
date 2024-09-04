import { Gui } from "../modules/gui";
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
        Store.saveProject(Gui.currentProject);
    }

    static editTodo() {}

    static deleteTodo() {}
}
