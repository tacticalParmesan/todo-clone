import { Utils } from "./utils";
import { Store } from "./storage";
import { Card } from "../components/card";
import { Sidebar } from "../components/sidebar";
import Project from "./project";
import checklist from "../../assets/checklist-71.svg"
import scrum from "../../assets/scrum-board-27.svg"
import construction from "../../assets/construction-site-59.svg"

/**
 * Object that collects references and functions related to the Content Area
 * and the general behaviour of the GUI. Leaves autonomy to methods from
 * smaller components like Todo cards and the Sidebar, in separate entities.
 */
export const Gui = (function() {

    /**
     * Collection of references to UI elements not included
     * in smaller components.
     */
    const ui = {
        todoView:               document.querySelector("#todoView"),
        projectName:            document.querySelector("#projectName"),
        projectDesc:            document.querySelector("#projectDescription"),
        emptyPanel:             document.querySelector("#emptyProjectScreen"),
        editProjectButton:      document.querySelector("#editProject"),
    }

    /**
     * Collection of SVG imports to be displayed in the content panel
     * with the message to create a new project.
     */
    const svgs = [checklist, scrum, construction]

    /**
     * The current project shown in the content area.
     * Gets updated on project switching.
     */
    let currentProject;

    function setCurrentProject(value) {
        currentProject = value
    }

    function getCurrentProject() {
        return currentProject
    }

    /**
     * Clears the Todo view in the content panel by wiping
     * todo child elements.
     */
    function clearTodoView() {
        while (ui.todoView.firstChild) {
            todoView.removeChild(todoView.firstChild);
        }
    };

    /**
     * Loads the clicked project in the GUI by calling the Storage component
     * to acquire the project data and by calling the rendering method onto
     * the collection of todos.
     * @param {*} project
     */
    function renderProject(project) {
        clearTodoView();
        ui.projectName.textContent = Utils.toTitleCase(project.name);
        ui.projectDesc.textContent = project.description

        for (const todo of project.getTodosList()) {
            todoView.appendChild(Card.createCard(todo));
        }
    };

    /**
     * Switches the content view between projects, from current
     * to target one.
     * @param {*} target
     */
    function switchProject(target) {
        currentProject = target;
        renderProject(target);
        checkForEmptyProject();
    };

    /**
     * Creates a temporary project to store filtered todos and render them
     * in the dedicated tab. Checks for property and value.
     * @param {*} property 
     * @param {*} value 
     */
    function renderFiltered(property, value) {
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
        filteredTodos.forEach((todo) => tempProject.add(todo));
        switchProject(tempProject);
    };

    /**
     * Checks if the currently displayed project is empty and shows
     * call to action graphics if this is the case.
     */
    function checkForEmptyProject() {
        ui.emptyPanel.removeChild(ui.emptyPanel.firstChild)
        
        const svg = insertSvg(svgs[Utils.randMax(0, 2)])
        ui.emptyPanel.insertBefore(svg, ui.emptyPanel.firstChild) 
        
        ui.emptyPanel.style = ui.todoView.firstChild ? "none" : "flex"
        
    };

    /**
     * Displays an SVG graphic in the Content Area if the project is empty
     * by getting the imported <svg> element and parsing it into a new HTML
     * element to be later appended to the DOM.
     * @param {*} svg 
     * @returns 
     */
    function insertSvg(svg) {
        const svgImg = (new DOMParser()).parseFromString(svg, "image/svg+xml")
        const svgElement = svgImg.documentElement
        svgElement.id = "emptyImage"
        svgElement.style = false; // Resets style because the original has a style attr
        return svgElement
    }

    /**
     * Checks if the current viewed project is a temporary "filter"
     * project and in that case filters again to update displayed values.
     */
    function checkIfFiltered() {
        const project = currentProject;
        
        if (Array.isArray(project.filtered)) {
            this.renderFiltered(project.filtered.at(0), project.filtered[1]);
        }
    };

    /**
     * Updates dynamic UI elements like counters and panle that should be
     * hidden or visibile based on Todo state.
     */
    function update() {
        Sidebar.updateTodayTodos();
        this.checkForEmptyProject();
    };

    return {
        setCurrentProject,
        getCurrentProject,
        renderProject,
        switchProject,
        renderFiltered,
        checkForEmptyProject,
        checkIfFiltered,
        update
    }
})();
