import { Gui } from "../modules/gui";
import { Store } from "../modules/storage";
import { Utils } from "../modules/utils";
import { Form } from "./form";

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
    static init() {
        const addTodoButton = document.querySelector("#addTodoButton")
        addTodoButton.onclick = () => Form.init()
    }

    static showNewTodoModal() {}

    static foldSidebar() {}

    static showTodayTodos() {}

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
     */
    static showProjects() {
        const projectsList = document.querySelector("#projectList");
        this.clearProjects();
        for (const project of Object.keys(localStorage)) {
            if (project === "general") {
                continue;
            }

            const tab = document.createElement("li");
            tab.classList.add("tab", "projectTab");
            tab.id = project.toLowerCase();

            const icon = document.createElement("span");
            icon.classList.add("material-symbols-outlined");
            icon.textContent = "tactic";

            const projectName = document.createElement("p");
            projectName.classList.add("projectName");
            projectName.textContent = Utils.toTitleCase(project);

            tab.append(icon, projectName);
            tab.addEventListener("click", () =>
                Gui.switchProject(Store.loadProject(project))
            );
            projectsList.appendChild(tab);
        }
    }
}
