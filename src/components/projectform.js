import { Store } from "../modules/storage";
import { Sidebar } from "./sidebar"; 
import { Logic } from "../modules/logic";
import { Gui } from "../modules/gui";

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
        uicolor:       document.querySelector("#projectColor"),
        circle:        document.querySelector("#colorCircle")
    };
    
    /**
     * Initializes the project creation dialog by grabbin refereces to
     * inputs and activates buttons and menus.
     */
    function init() {
        dialog.closebtn.onclick = () => closeForm();
        dialog.uicolor.onchange = () => updateColorCircle(dialog.uicolor.value)
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
        updateColorCircle(project.uicolor)

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
    function closeForm() {
        dialog.modal.close();
        resetForm();
    }

    /**
     * Reset field values.
     */
    function resetForm() {        
        [dialog.name, dialog.description, dialog.uicolor].forEach(
            (field) => field.value = "")
    }

    /**
     * Saves new project with data provided in the input form.
     */
    function saveNewProject() {

        const newProject = Logic.createProject(
            dialog.name.value,
            dialog.description.value,
            dialog.uicolor.value
        );

        closeForm();
        
        Store.saveProject(newProject);
        Sidebar.showProjects();
    }

    function saveProjectChanges(project) {
        const propertiesToWatch = [
            "name", 
            "description", 
            "uicolor", 
        ]
        for (const property of propertiesToWatch) {
            
            const newValue = dialog[property].value;
            const oldValue = project[property];

            if (newValue !== oldValue) {
                Logic.editProject(project, property, newValue)
            }
        }
        
        Store.saveProject(project);
        Sidebar.showProjects();
        
        if (project === Gui.getCurrentProject()) Gui.switchProject(project)

    }

    /**
     * Changes the color of the circle next to color picker to
     * give user a preview.
     * @param {*} color 
     */
    function updateColorCircle(color) {
        dialog.circle.style.backgroundColor = color;
    }

    return { init, openForm }
})();
