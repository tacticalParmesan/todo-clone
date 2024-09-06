import { Gui } from "../modules/gui";
import { Logic } from "../modules/logic";
import { Store } from "../modules/storage";
import { Utils } from "../modules/utils";

export class Card {
    constructor() {}

    //#region Implementing singleton pattern
    static getInstance() {
        if (!Card.instance) {
            Card.instance = new Card();
        }
        return Card.instance;
    }
    //#endregion

    /**
     * Changes the status of a Todo and its appearance to reflect the change.
     * @param {*} todo
     * @param {*} todoUI
     */
    static checkTodo(todo, todoUI) {
        todo.toggleStatus();
        todoUI.classList.toggle("done");

        // Ternary operator in case we are in the "General" view or in a filtered one.
        Store.saveProject(
            Gui.currentProject.name === todo.project
                ? Gui.currentProject
                : Store.loadProject(todo.project)
        );
    }

    static editTodo(todo, todoUI) {
        // Open form in edit mode
        // Saved values change the ones displayed
    }

    /**
     * Deletes a todo from the in-memory list and from the UI view.
     * @param {*} todo
     * @param {*} todoUI
     */
    static deleteTodo(todo, todoUI) {
        let project =
            Gui.currentProject.name === todo.project
                ? Gui.currentProject
                : Store.loadProject(todo.project);

        Logic.deleteTodo(project, todo);
        document.querySelector("#todoView").removeChild(todoUI);

        Store.saveProject(project);
    }

    /**
     * Creates a new UI todo from the supplied Todo instance. Builds
     * from the todo template inside the main html file and loads event
     * listeneres for buttons inside tha card. Also check at creation time
     * if the todo is already done or not and applies style accordingly.
     * @param {*} todo
     * @returns
     */
    static create(todo) {
        // Clones the todo to display from the template. Cleans its properties.
        const template = document.querySelector(".todoTemplate");
        const newCard = template.cloneNode(true);
        newCard.classList.remove("todoTemplate");
        newCard.classList.add("todo");
        newCard.setAttribute("uid", todo.getUid());

        // Checkbox activation and card styling according to todo status.
        const checkbox = newCard.querySelector(".doneCheck");
        if (todo.getStatus()) {
            newCard.classList.add("done");
            checkbox.checked = true;
        }
        checkbox.onchange = () => this.checkTodo(todo, newCard);

        // Populates the Todo card with data from the passed Todo  instance.
        newCard.querySelector(".todoTitle").textContent = todo.title;
        newCard.querySelector(".todoDesc").textContent = todo.description;
        newCard.querySelector(".todoProject").textContent = Utils.toTitleCase(
            todo.project
        );
        newCard.querySelector("time").datetime = todo.dueDate;
        newCard.querySelector("time").textContent = todo.dueDate;
        if (Utils.isToday(todo.dueDate)) console.log("today!")
        // Activates buttons functionality
        const deleteButton = newCard.querySelector(".deleteButton");
        deleteButton.onclick = () => this.deleteTodo(todo, newCard);

        return newCard;
    }
}
