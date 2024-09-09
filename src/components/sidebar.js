import { Gui } from "../modules/gui";
import { Store } from "../modules/storage";
import { Utils } from "../modules/utils";
import { TodoForm } from "./todoform";
import { ProjectForm } from "./projectform";
import { isToday, format } from "date-fns";

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
        this.toggleTabSelection()

        const addTodoButton = document.querySelector("#addTodoButton");
        addTodoButton.onclick = () => TodoForm.openForm();

        const addProjectButton = document.querySelector("#addProject");
        addProjectButton.onclick = () => ProjectForm.init();

        const inboxTab = document.querySelector("#inbox");
        inboxTab.classList.toggle("current")
        inboxTab.onclick = () => {
            Gui.switchProject(Store.loadProject("general"));
        };

        const todayTab = document.querySelector("#today");
        todayTab.onclick = () => Gui.renderFiltered("dueDate", format(new Date(), "d MMM yyyy"));


        this.updateTodayTodos();
    }

    static foldSidebar() {}

    /**
     * Updates the number of today todos displayed in the Sidebar.
     */
    static updateTodayTodos() {
        const todayNumber = document.querySelector("#todoNumber");
        const todayTodos = Store.loadAllTodos().filter((todo) =>
            isToday(todo.dueDate)
        );
        todayNumber.textContent = todayTodos.length;
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
        const template = document.querySelector("#projectTabTemplate");
        this.clearProjects();

        for (const project of Object.keys(localStorage)) {
            if (project === "general") {
                continue;
            }

            const tab = template.cloneNode(true);
            tab.id = project.toLowerCase();

            tab.querySelector(".projectName").textContent =
                Utils.toTitleCase(project);
            tab.querySelector("span").style.color =
                Store.loadProject(project).uicolor;
            tab.onclick = () => {
                Gui.switchProject(Store.loadProject(project));
            }
            projectsList.appendChild(tab);
        }
        this.toggleTabSelection()
    }

    static toggleTabSelection() {
        const allSidebarTabs = document.querySelectorAll(".tab")
        allSidebarTabs.forEach((tab) => {
            tab.addEventListener("click", () => {
                allSidebarTabs.forEach(t => t.classList.remove("current"))
                tab.classList.toggle("current")
            }) 
        })
    }
}
