import { Logic } from "../modules/logic";
import { Gui } from "../modules/gui";
import { Store } from "../modules/storage";
import { Utils } from "../modules/utils";
import { format } from "date-fns";

export class Form {
    constructor() {}

    dialog;

    static init() {
        console.log("bro");
        this.dialog = document.querySelector("dialog");
        this.dialog.show();

        this.updateProjectSelection()

        this.dialog.querySelector("#closeForm").onclick = (e) => {
            e.preventDefault();
            this.dialog.close();
        };

        this.dialog.querySelector("#saveTodo").onclick = (e) => {
            e.preventDefault();
            this.createTodo();
            this.dialog.close()
        };
    }

    static createTodo() {
        const todoProperties = {
            title: this.dialog.querySelector("#formTitle").value,
            description: this.dialog.querySelector("#formDesc").value,
            dueDate: format(this.dialog.querySelector("#formDate").value, "d MMM yyyy"),
            priority: this.dialog.querySelector("#formPriority").value,
            projectName: this.dialog.querySelector("#formProject").value,
        };

        console.log(todoProperties)
        const projectToUpdate =
            Gui.currentProject.name === todoProperties.projectName
                ? Gui.currentProject
                : Store.loadProject(todoProperties.projectName);
        
                Logic.createTodo(todoProperties, projectToUpdate);
        Store.saveProject(projectToUpdate)

        if (projectToUpdate === Gui.currentProject) {
            Gui.renderProject(Gui.currentProject)
        }
    }

    static updateProjectSelection() {
        const selection = this.dialog.querySelector("#formProject")
        for (const project of Object.keys(localStorage)) {
            if(project === "general") continue
            const newOption = document.createElement("option")
            newOption.value = project.toLowerCase()
            newOption.textContent = Utils.toTitleCase(project)
            selection.appendChild(newOption)
        }    
    }
}
