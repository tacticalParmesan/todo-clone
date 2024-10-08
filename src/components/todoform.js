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
        savebtn:        document.querySelector("#saveTodo"),
    }

    /**
     * Initializes the form getting necessary references and adding
     * event listeners conncect for creation, saving and deletion of
     * todos in memory and UI.
     */
    function init() {
        dialog.form.onsubmit = (e) => e.preventDefault()
        dialog.closebtn.onclick = () => closeForm();
        dialog.title.oninput = () => preventEmptyTodo();
    }

    /**
     * Opens the form checking the mode: editing or creation.
     * @param {*} mode 
     * @param {*} todo 
     */
    function openForm(mode="create", todo=null) {
        updateProjectSelection();
        Gui.toggleOverlay();
        (mode === "edit") ? openForEditing(todo) : openForCreation();
    }

    /**
     * Closes the Todo form.
     */
    function closeForm() {
        Gui.toggleOverlay();
        dialog.modal.close();
        clearForm();
    }

    /**
     * Opens todo form in creation mode.
     */
    function openForCreation() {
        preventEmptyTodo();

        dialog.project.value = 
            !Gui.getCurrentProject().filtered 
            ? Gui.getCurrentProject().getUid() 
            : "aaa000"

        dialog.savebtn.onclick = (e) => {
            saveNewTodo();
            closeForm();
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
            closeForm();
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
            projectID:      validateProject(dialog.project.value),
        }
        /**
         * If the project to update is the currently displayed one it will
         * just save it instead of reloading all todos. This check has been
         * added to handle when the user creates a todo from the general view.
         */
        const projectToUpdate =
            Gui.getCurrentProject().getUid() === todoProperties.projectID
            ? Gui.getCurrentProject()
            : Store.loadProject(todoProperties.projectID);

        Logic.createTodo(todoProperties, projectToUpdate);

        Store.saveProject(projectToUpdate);

        if (projectToUpdate === Gui.getCurrentProject()) {
            Gui.renderProject(Gui.getCurrentProject());
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
            Gui.getCurrentProject().getUid() === todo.project
            ? Gui.getCurrentProject()
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
                todo = Logic.editTodo(
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
            newOption.value = project;
            newOption.textContent = Utils.toTitleCase(Store.loadProject(project).name);

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
            date = format(dateToValidate, "d MMM yyyy");
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
        return !project ? "aaa000" : project;
    }

    /**
     * Defaults the priority to the lowest (4) if the user does not provide an input.
     * @param {*} priority
     */
    function validatePriority(priority) {
        return !priority ? "4" : priority;
    }

    /**
     * Prevents creation of untitled todos by disabling the save button if
     * the user does not provide the title. The rest of values are set by
     * validation functions.
     */
    function preventEmptyTodo() {
        Utils.isValidString("title", dialog.title.value) 
        ? dialog.savebtn.removeAttribute("disabled")  
        : dialog.savebtn.setAttribute("disabled", true) 
    }

    return {  init, openForm  }
})();