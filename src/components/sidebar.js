import { Gui } from "../modules/gui";
import { Store } from "../modules/storage";
import { Utils } from "../modules/utils";
import { TodoForm } from "./todoform";
import { ProjectForm } from "./projectform";
import { isToday, format } from "date-fns";
import { Filter } from "../modules/filter";

export const Sidebar = (function() {

    const sidebar = {
        self:               document.querySelector("#sidebar"),
        addTodoButton:      document.querySelector(".addTodoButton"),
        addProjectButton:   document.querySelector("#addProject"),
        inboxTab:           document.querySelector("#inbox"),
        todayTab:           document.querySelector("#today"),
        todayNumber:        document.querySelector("#todoNumber"),
        projectList:        document.querySelector("#projectList"),
        foldButton:         document.querySelector(".foldButton"),
        unfoldButton:       document.querySelector(".foldButton.content")  
    }

    /**
     * Initalizes the Sidebar, gives the first update to dynamic sidebar
     * elements and activates buttons,
     */
    function init() {
        toggleTabSelection()
        updateTodayTodos();
        setTimeout(() => sidebar.self.classList.add("foldable"),500);

        [sidebar.foldButton, sidebar.unfoldButton]
        .forEach((btn) => btn.onclick = () => foldSidebar())
        sidebar.unfoldButton.style.display = "none";
        sidebar.addTodoButton.onclick = () => TodoForm.openForm();
        sidebar.addProjectButton.onclick = () => ProjectForm.openForm();

        sidebar.inboxTab.classList.toggle("current")
        sidebar.inboxTab.onclick = () => 
            Gui.switchProject(Store.loadProject("aaa000"));

        sidebar.todayTab.onclick = () => 
            Gui.renderFiltered("dueDate", format(new Date(), "d MMM yyyy"));
    }

        /**
     * Closes the sidebar and lets the content area to expand.
     */
    function foldSidebar() {
        sidebar.self.classList.toggle("folded");
        sidebar.unfoldButton.style.display = (
            sidebar.unfoldButton.style.display === 'none') 
            ? 'block' 
            : 'none';
    }

    /**
     * Updates the number of today todos displayed in the Sidebar.
     */
    function updateTodayTodos() {
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
    function clearProjects() {
        while (sidebar.projectList.firstChild) {
            sidebar.projectList.removeChild(projectList.firstChild);
        }
    }

    /**
     * Loads clickable projects tab under the porject list in the sidebar.
     * Uses the template from the hidden 'templates' html element.
     */
    function showProjects() {
        const template = document.querySelector("#projectTabTemplate");
        
        clearProjects();

        for (const project of Object.keys(localStorage)) {
            if (project === "aaa000") {
                continue;
            }

            const loaded = Store.loadProject(project)
            const tab = template.cloneNode(true);
            
            tab.id = project.toLowerCase();
            tab.querySelector(".projectName").textContent =
                Utils.toTitleCase(loaded.name);
            tab.querySelector("span").style.color =
                loaded.uicolor;
            tab.onclick = () => {
                Gui.switchProject(Store.loadProject(project));
            }
            sidebar.projectList.appendChild(tab);
        }
        toggleTabSelection()
    }

    /**
     * Enables graphical feedback for tab selection.
     */
    function toggleTabSelection() {
        const allSidebarTabs = document.querySelectorAll(".tab")
        allSidebarTabs.forEach((tab) => {
            tab.addEventListener("click", () => {
                allSidebarTabs.forEach(t => t.classList.remove("current"))
                tab.classList.toggle("current")
                if (tab.id !== "filters") Filter.hideFilterPanel()
            }) 
        })
    }

    /**
     * Dispatches a click event to the Inbox Tab when needed.
     */
    function showInbox() {
        sidebar.inboxTab.click()
    }

    return { init, foldSidebar, updateTodayTodos, showProjects, showInbox }
})();
