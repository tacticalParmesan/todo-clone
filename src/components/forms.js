import { Logic } from "../modules/logic";
import { Gui } from "../modules/gui";
import { Store } from "../modules/storage";
import { Utils } from "../modules/utils";
import { format, isToday } from "date-fns";
import { Sidebar } from "./sidebar";
import { Card } from "./card";

/**
 * Interface for getting and manipulation data about a todo.
 * Handles static and interactive elements of the Todo dialog.
 */
export class TodoForm {
    dialog;
    inputs = {};

    /**
     * Initializes the form getting necessary references and adding
     * event listeners conncect for creation, saving and deletion of
     * todos in memory and UI.
     * @param mode
     */
    static init(mode = "create", todo = null) {
        this.dialog = document.querySelector("dialog");

        this.inputs = {
            title: this.dialog.querySelector("#formTitle"),
            description: this.dialog.querySelector("#formDesc"),
            dueDate: this.dialog.querySelector("#formDate"),
            priority: this.dialog.querySelector("#formPriority"),
            project: this.dialog.querySelector("#formProject"),
        };

        this.dialog.show();
        this.updateProjectSelection();

        this.dialog.querySelector("#closeForm").onclick = (e) => {
            e.preventDefault();
            this.dialog.close();
        };

        if (mode === "edit") {
            this.openForEditing(todo);
        } else if (mode === "create") {
            this.openForCreation();
        }
    }

    /**
     * Opens todo form in creation mode.
     */
    static openForCreation() {
        this.clearForm();

        this.inputs.project.value =
            Gui.currentProject.name != "general" ? Gui.currentProject.name : "";

        this.dialog.querySelector("#saveTodo").onclick = (e) => {
            e.preventDefault();
            this.saveNewTodo();
            this.dialog.close();
        };
    }

    /**
     * Opens todo form in editing mode.
     */
    static openForEditing(todo) {
        for (const key of Object.keys(this.inputs)) {
            this.inputs[key].value = todo[key];
        }

        this.dialog.querySelector("#formDate").value = format(
            todo.dueDate,
            "yyyy-MM-dd"
        );
        this.dialog.querySelector("#saveTodo").textContent = "Save changes";

        this.dialog.querySelector("#saveTodo").onclick = (e) => {
            e.preventDefault();
            this.saveTodoChanges(todo);
            this.dialog.close();
        };
    }

    /**
     * Visual command to signal the Logic component to create a new todo
     * in memory and the Store to save it in storage.
     */
    static saveNewTodo() {
        // Grabs Todo properties from input fields
        const todoProperties = {
            title: this.dialog.querySelector("#formTitle").value,
            description: this.dialog.querySelector("#formDesc").value,
            dueDate: this.validateDate(
                this.dialog.querySelector("#formDate").value
            ),
            priority: this.validatePriority(
                this.dialog.querySelector("#formPriority").value
            ),
            projectName: this.validateProject(
                this.dialog.querySelector("#formProject").value
            ),
        };

        /**
         * If the project to update is the currently displayed one it will
         * just save it instead of reloading all todos. This check has been
         * added to handle when the user creates a todo from the general view.
         */
        const projectToUpdate =
            Gui.currentProject.name === todoProperties.projectName
                ? Gui.currentProject
                : Store.loadProject(todoProperties.projectName);

        const newTodo = Logic.createTodo(todoProperties, projectToUpdate);
        Store.saveProject(projectToUpdate);

        if (projectToUpdate === Gui.currentProject) {
            Gui.renderProject(Gui.currentProject);
        }

        Gui.update()
        Gui.checkIfFiltered()

    }

    /**
     * Edits the todo according the modified fields of the Todo form.
     * Will overwrite only the effective changes both in memory and UI.
     * @param {*} todo
     */
    static saveTodoChanges(todo) {
        const todoUI = document.querySelector(`[uid="${todo.getUid()}"]`);
        const todoView = document.querySelector("#todoView");

        const projectToUpdate =
            Gui.currentProject.name === todo.project
                ? Gui.currentProject
                : Store.loadProject(todo.project);

        let hasProjectChanged;

        /**
         * If a property has changed with user input it will get
         * updated. This includes swapping todos between projects.
         */
        for (const property of Object.keys(this.inputs)) {
            const newValue = this.inputs[property].value;
            const oldValue = todo[property];

            if (newValue !== oldValue) {
                Logic.editTodo(
                    projectToUpdate,
                    todo,
                    property,
                    this.inputs[property].value
                );
                Card.editTodoUI([property, newValue], todoUI);

                if (property === "project") {
                    Logic.moveTodo(oldValue, newValue, todo);
                    hasProjectChanged = true;
                    todoView.removeChild(todoUI);
                }
            }
        }

        // Check to avoid saving two times and provoke a cloning behaviour.
        if (!hasProjectChanged) Store.saveProject(projectToUpdate);

        Gui.update()
        Gui.checkIfFiltered()
    }

    /**
     * Resets form values to default since the editing mode
     * overwrites them.
     */
    static clearForm() {
        for (const input of Object.keys(this.inputs)) {
            this.inputs[input].value = "";
        }
    }

    /**
     * Updates thew dropdown menu to reflect the created projects.
     */
    static updateProjectSelection() {
        const selection = this.dialog.querySelector("#formProject");

        for (const project of Object.keys(localStorage)) {
            // Skips the rendering of "general", reserved for "Inbox" tab

            const newOption = document.createElement("option");
            newOption.value = project.toLowerCase();
            newOption.textContent = Utils.toTitleCase(project);

            if (
                !selection.contains(
                    document.querySelector(`option[value="${newOption.value}"]`)
                )
            ) {
                selection.appendChild(newOption);
            }
        }
    }

    /**
     * Defaults the date to today if user does not provide an input.
     * @param {*} dateToValidate
     * @returns
     */
    static validateDate(dateToValidate) {
        let date;

        try {
            format(dateToValidate, "d MMM yyyy");
        } catch (Error) {
            {
                date = format(new Date(), "d MMM yyyy");
            }
        }
        return date;
    }

    /**
     * Defaults the project to the default one if the user does not provide an input.
     * @param {*} project
     * @returns
     */
    static validateProject(project) {
        return project === "" ? "general" : project;
    }

    /**
     * Defaults the priority to the lowest (4) if the user does not provide an input.
     * @param {*} prio
     */
    static validatePriority(prio) {
        return prio === "" ? "4" : prio;
    }


}

export const ProjectForm = (() => {
    
    const dialog = {
        modal:         document.querySelector("#projectForm"),
        closebtn:      document.querySelector("#closeProjectForm"),
        savebtn:       document.querySelector("#saveProject"),
        name:          document.querySelector("#projectFormName"),
        description:   document.querySelector("#projectDesc"),
        color:         document.querySelector("#projectColor"),
        circle:        document.querySelector("#colorCircle")
    };
    
    /**
     * Initializes the project creation dialog by grabbin refereces to
     * inputs and activates buttons and menus.
     */
    function init() {
        dialog.modal.show();
        dialog.closebtn.onclick = () => closeModal();
        dialog.savebtn.onclick = () => saveNewProject();
        dialog.color.onchange = () => updateColorCircle(dialog.color.value)
    }

    /**
     * Closes the project modal and resets field values.
     */
    function closeModal() {
        dialog.modal.close();
        resetForm();
    }

    /**
     * Reset field values.
     */
    function resetForm() {        
        [dialog.name, dialog.description, dialog.color].forEach(
            (field) => {field.value = ""})
    }

    /**
     * Saves new project with data provided in the input form.
     */
    function saveNewProject() {

        const newProject = Logic.createProject(
            dialog.name.value,
            dialog.description.value,
            dialog.color.value
        );

        closeModal();
        
        Store.saveProject(newProject);
        Sidebar.showProjects();
    }

    function updateColorCircle(color) {
        dialog.circle.style.backgroundColor = color;
    }

    return { init }
})();
