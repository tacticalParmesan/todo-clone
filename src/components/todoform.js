import { Logic } from "../modules/logic";
import { Gui } from "../modules/gui";
import { Store } from "../modules/storage";
import { Utils } from "../modules/utils";
import { format } from "date-fns";
import { Card } from "./card";

/**
 * Interface for getting and manipulation data about a todo.
 * Handles static and interactive elements of the Todo dialog.
 */
export const TodoForm = ( () => {
    
    const dialog = {
        modal:          document.querySelector("dialog"),
        form:           document.querySelector("#todoForm"),
        title:          document.querySelector("#formTitle"),
        description:    document.querySelector("#formDesc"),
        dueDate:        document.querySelector("#formDate"),
        priority:       document.querySelector("#formPriority"),
        project:        document.querySelector("#formProject"),
        closebtn:       document.querySelector("#closeForm"),
        savebtn:        document.querySelector("#saveTodo")
    }

    /**
     * Initializes the form getting necessary references and adding
     * event listeners conncect for creation, saving and deletion of
     * todos in memory and UI.
     */
    function init() {
        dialog.form.onsubmit = (e) => e.preventDefault()
        dialog.closebtn.onclick = () => closeForm();
    }

    /**
     * Opens the form checking the mode: editing or creation.
     * @param {*} mode 
     * @param {*} todo 
     */
    function openForm(mode="create", todo=null) {
        updateProjectSelection();
        (mode === "edit") ? openForEditing(todo) : openForCreation();
    }

    /**
     * Closes the Todo form.
     */
    function closeForm() {
        dialog.modal.close()
        clearForm();
    }

    /**
     * Opens todo form in creation mode.
     */
    function openForCreation() {
        console.log("creation", dialog.project.value === "")

        dialog.project.value =
        Gui.currentProject.name !== "general" 
        ? Gui.currentProject.name 
        : "";
        console.log("creation", dialog.project.value === "")

        dialog.savebtn.onclick = (e) => {
            saveNewTodo();
            dialog.modal.close();
        };
        
        dialog.modal.show()
    }

    /**
     * Opens todo form in editing mode.
     */
    function openForEditing(todo) {

        const propertiesToUpdate = ["title", "description", "priority", "project" ]
        .forEach((property) => dialog[property].value = todo[property])

        dialog.dueDate.value = format(todo.dueDate, "yyyy-MM-dd");
        dialog.savebtn.textContent = "Save changes";

        dialog.savebtn.onclick = (e) => {
            saveTodoChanges(todo);
            dialog.modal.close();
        };

        dialog.modal.show()
    }

    /**
     * Visual command to signal the Logic component to create a new todo
     * in memory and the Store to save it in storage.
     */
    function saveNewTodo() {   
        
        const todoProperties = {
            title:          dialog.title.value,
            description:    dialog.description.value,
            dueDate:        validateDate(dialog.dueDate.value),
            priority:       validatePriority(dialog.priority.value),
            projectName:    validateProject(dialog.project.value),
        }
        /**
         * If the project to update is the currently displayed one it will
         * just save it instead of reloading all todos. This check has been
         * added to handle when the user creates a todo from the general view.
         */
        const projectToUpdate =
            Gui.currentProject.name === todoProperties.projectName
            ? Gui.currentProject
            : Store.loadProject(todoProperties.projectName);

        Logic.createTodo(todoProperties, projectToUpdate);

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
    function saveTodoChanges(todo) {
        const todoView = document.querySelector("#todoView");
        const todoUI = document.querySelector(`[uid="${todo.getUid()}"]`);

        const projectToUpdate =
            Gui.currentProject.name === todo.project
            ? Gui.currentProject
            : Store.loadProject(todo.project);

        let hasProjectChanged;

        const propertiesToWatch = [
            "title", 
            "description", 
            "dueDate", 
            "priority", 
            "project" 
        ]
        /**
         * If a property has changed with user input it will get
         * updated. This includes swapping todos between projects.
         */
        for (const property of propertiesToWatch) {
            
            const newValue = dialog[property].value;
            const oldValue = todo[property];

            if (newValue !== oldValue) {
                Logic.editTodo(
                    projectToUpdate,
                    todo,
                    property,
                    dialog[property].value
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
    function clearForm() {

        [ 
            dialog.title, 
            dialog.description, 
            dialog.dueDate, 
            dialog.priority, 
            dialog.project
        ].forEach( (input) => input.value = "" )

        dialog.savebtn.textContent = "Add todo";

    }

    /**
     * Updates thew dropdown menu to reflect the created projects.
     */
    function updateProjectSelection() {
         const selection = dialog.project;

        for (const project of Object.keys(localStorage)) {

            const newOption = document.createElement("option");
            newOption.value = project.toLowerCase();
            newOption.textContent = Utils.toTitleCase(project);

            if (!selection.contains
                (
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
     * @returns A valid date
     */
    function validateDate(dateToValidate) {
        let date;

        try {
            format(dateToValidate, "d MMM yyyy");
        } catch (Error) {
            date = format(new Date(), "d MMM yyyy");
        }
        return date;
    }

    /**
     * Defaults the project to the "general" one if the user does not provide an input.
     * @param {*} project
     * @returns
     */
    function validateProject(project) {
        return !project ? "general" : project;
    }

    /**
     * Defaults the priority to the lowest (4) if the user does not provide an input.
     * @param {*} priority
     */
    function validatePriority(priority) {
        return !priority ? "4" : prio;
    }

    return {  init, openForm  }
})();

