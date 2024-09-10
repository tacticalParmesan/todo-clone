import { Store } from "../modules/storage";
import { Sidebar } from "./sidebar"; 
import { Logic } from "../modules/logic";

/**
 * Contains functionalities for the dialog and inner form
 * deployed to create and edit projects inside the app.
 */
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
        openForm()
        dialog.closebtn.onclick = () => closeModal();
        dialog.color.onchange = () => updateColorCircle(dialog.color.value)
    }
    
    /**
     * Opens the form checking the mode: editing or creation.
     * @param {} mode 
     * @param {*} project 
     */
    function openForm(mode="create", project=null) {
        dialog.modal.show();
        (mode === "edit") ? openForEditing(project) : openForCreation();
    }
    
    /**
     * Opens the Project form in creation mode.
     */
    function openForCreation() {
        dialog.savebtn.onclick = () => saveNewProject();
    }

    /**
     * Opens the Project form in editing mode.
     * @param {*} project 
     */
    function openForEditing(project) {
        
        const propertiesToUpdate = ["name", "description", "uicolor" ]
        .forEach((property) => dialog[property].value = project[property])

        dialog.savebtn.textContent = "Save changes";

        dialog.savebtn.onclick = (e) => {
            saveProjectChanges(project);
            closeForm();
        };

        dialog.modal.show()
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

    /**
     * Changes the color of the circle next to color picker to
     * give user a preview.
     * @param {*} color 
     */
    function updateColorCircle(color) {
        dialog.circle.style.backgroundColor = color;
    }

    return { init }
})();
