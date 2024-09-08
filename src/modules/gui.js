import { Utils } from "./utils";
import { Store } from "./storage";
import { Card } from "../components/card";
import { Sidebar } from "../components/sidebar";
import Project from "../components/project";

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
            todoView.appendChild(Card.createCard(todo));
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

    /**
     * Creates a temporary project to store filtered todos and render them
     * in the dedicated tab. Checks for property and value.
     * @param {*} property 
     * @param {*} value 
     */
    static renderFiltered(property, value) {
        const filterName = Utils.toTitleCase(property);
        const filteredTodos = Store.loadAllTodos().filter(
            (todo) => todo[property] === value
        );

        const tempProject = new Project(
            `${filterName}: ${value}`,
            "Filtered view.",
            "black",
            [property, value]
        );
        filteredTodos.map((todo) => tempProject.add(todo));
        this.switchProject(tempProject);
    }

    /**
     * Checks if the currently displayed project is empty and shows
     * call to action graphic if this is the case.
     */
    static checkForEmptyProject() {
        const empty = document.querySelector("#emptyProjectScreen");

        const todoView = document.querySelector("#todoView");

        if (todoView.firstChild) {
            empty.style.display = "none";
        } else {
            empty.style.display = "flex";
        }
    }

    /**
     * Checks if the current viewed project is a temporary "filter"
     * project and in that case filters again to update displayed values.
     */
    static checkIfFiltered() {
        const project = this.currentProject;
        
        if (Array.isArray(project.filtered)) {
            this.renderFiltered(project.filtered.at(0), project.filtered[1]);
        }
    }

    /**
     * Updates dynamic UI elements like counters and panle that should be
     * hidden or visibile based on Todo state.
     */
    static update() {
        Sidebar.updateTodayTodos();
        this.checkForEmptyProject();
    }
}
