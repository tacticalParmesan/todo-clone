import { Utils } from "./utils";
import { Store } from "./storage";
import { Card } from "../components/card";
import { Sidebar } from "../components/sidebar";

export class Gui {
    constructor() {}

    //#region Implementing singleton pattern
    static getInstance() {
        if (!Gui.instance) {
            Gui.instance = new Gui();
        }
        return Gui.instance;
    }
    //#endregion

    /**
     * The current project shown in the content area.
     * Gets updated on project switching.
     */
    currentProject;

    /**
     * Clears the Todo view in the content panel by wiping
     * todo child elements.
     */
    static clearTodoView() {
        const todoView = document.querySelector("#todoView");

        while (todoView.firstChild) {
            todoView.removeChild(todoView.firstChild);
        }
    }

    /**
     * Loads the clicked project in the GUI by calling the Storage component
     * to acquire the project data and by calling the rendering method onto
     * the collection of todos.
     * @param {*} project
     */
    static renderProject(project) {
        const projectName = document.querySelector("#projectName");
        const todoView = document.querySelector("#todoView");
        const todoList = project.getTodosList();

        this.clearTodoView();
        projectName.textContent = Utils.toTitleCase(project.name);

        for (const todo of todoList) {
            todoView.appendChild(Card.create(todo));
        }
    }

    /**
     * Switches the content view between projects, from current
     * to target one.
     * @param {*} target
     */
    static switchProject(target) {
        this.currentProject = target;
        this.renderProject(target);
        this.checkForEmptyProject();
    }

    static renderFiltered(property, value) {}

    /**
     * Checks if the currently displayed project is empty and shows
     * call to action graphic if this is the case.
     */
    static checkForEmptyProject() {
        const empty = document.querySelector("#emptyProjectScreen");
        if (!this.currentProject.getTodosList()[0]) {
            empty.style.display = "flex";
        } else {
            empty.style.display = "none";
        }
    }
}
