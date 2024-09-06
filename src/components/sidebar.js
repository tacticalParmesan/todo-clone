import { Gui } from "../modules/gui";
import { Store } from "../modules/storage";
import { Utils } from "../modules/utils";
import { Form } from "./form";
import { isToday } from "date-fns";

export class Sidebar {
    constructor() {}

    //#region Implementing singleton pattern
    static getInstance() {
        if (!Sidebar.instance) {
            Sidebar.instance = new Sidebar();
        }
        return Sidebar.instance;
    }
    //#endregion

    /**
     * Initalizes the Sidebar, gives the first update to dynamic sidebar
     * elements and activates buttons,
     */
    static init() {
        const addTodoButton = document.querySelector("#addTodoButton")
        addTodoButton.onclick = () => Form.init()

        this.showTodayTodos()
    }

    static foldSidebar() {}

    /**
     * Updates the number of today todos displayed in the Sidebar.
     */
    static showTodayTodos() {
        const todayNumber = document.querySelector("#todoNumber")
        const todayTodos = Store.loadAllTodos().filter((todo) => isToday(todo.dueDate))
        todayNumber.textContent = todayTodos.length
    }

    /**
     * Clears the Project list in the sidebar panel by wiping
     * todo child elements.
     */
    static clearProjects() {
        const projectList = document.querySelector("#projectList");

        while (projectList.firstChild) {
            projectList.removeChild(projectList.firstChild);
        }
    }

    /**
     * Loads clickable projects tab under the porject list in the sidebar.
     * Uses the template from the hidden 'templates' html element.
     */
    static showProjects() {
        const projectsList = document.querySelector("#projectList");
        const template = document.querySelector("#projectTabTemplate")
        this.clearProjects();

        for (const project of Object.keys(localStorage)) {
            if (project === "general") {
                continue;
            }

            const tab = template.cloneNode(true);
            tab.id = project.toLowerCase();

            tab.querySelector(".projectName").textContent = Utils.toTitleCase(project);
            tab.onclick = () => Gui.switchProject(Store.loadProject(project))
            projectsList.appendChild(tab);
        }
    }

    /**
     * Checks at the moment of creation and deletion if the number
     * of today todos in the Sidebar should be updated.
     * @param {*} todo 
     */
    static checkForToday(todo) {
        if (isToday(todo.dueDate)) {
            Sidebar.showTodayTodos();
        }
    }
}
