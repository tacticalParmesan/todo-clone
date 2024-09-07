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
            dueDate: format(
                this.dialog.querySelector("#formDate").value,
                "d MMM yyyy"
            ),
            priority: this.dialog.querySelector("#formPriority").value,
            projectName: this.dialog.querySelector("#formProject").value,
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

        Sidebar.checkForToday(newTodo);
    }

    /**
     * Edits the todo according the modified fields of the Todo form.
     * Will overwrite only the effective changes both in memory and UI.
     * @param {*} todo
     */
    static saveTodoChanges(todo) {
        const projectToUpdate =
            Gui.currentProject.name === todo.project
                ? Gui.currentProject
                : Store.loadProject(todo.project);

        for (const property of Object.keys(this.inputs)) {
            const newValue = this.inputs[property].value;
            if (newValue !== todo[property]) {
                Logic.editTodo(
                    projectToUpdate,
                    todo,
                    property,
                    this.inputs[property].value
                );
                Card.editTodoUI(
                    [property, newValue],
                    document.querySelector(`[uid="${todo.getUid()}"]`)
                );
            }
        }
        Store.saveProject(projectToUpdate);
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
}

export class ProjectForm {
    dialog;

    static init() {
        this.dialog = document.querySelector("#projectForm");
        this.dialog.show();

        this.dialog.querySelector("#closeProjectForm").onclick = () => {
            this.dialog.close();
        };

        this.dialog.querySelector("#saveProject").onclick = () => {
            this.saveNewProject();
            this.dialog.close();
        };
    }

    static saveNewProject() {
        const newProject = Logic.createProject(
            this.dialog.querySelector("#projectName").value,
            this.dialog.querySelector("#projectDesc").value,
            this.dialog.querySelector("#projectColor").value
        );

        Store.saveProject(newProject);
        Sidebar.showProjects();
    }
}
