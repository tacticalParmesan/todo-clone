import { Gui } from "../modules/gui";
import { Logic } from "../modules/logic";
import { Store } from "../modules/storage";
import { Utils } from "../modules/utils";
import { TodoForm } from "./todoform";
import { Sidebar } from "./sidebar";
import { format, isToday } from "date-fns";

/**
 * Interface collecting functions that are called from within
 * or should hae effect on a Card displaying information
 * about a Todo. Also handles interactive elements such as
 * buttons to edit or delete todos.
 */
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
            Gui.getCurrentProject().name === todo.project
                ? Gui.getCurrentProject()
                : Store.loadProject(todo.project)
        );
    }

    /**
     * Edits the UI Card to reflect changes to the Todo item.
     * @param {*} element
     * @param {*} todoUI
     */
    static editTodoUI(element, todoUI) {
        const elementToEdit = todoUI.querySelector(`[prop=${element[0]}]`);
        let newValue = element[1];

        if (element[0] === "dueDate") {
            newValue = format(newValue, "d MMM yyyy");
        }

        if (elementToEdit) elementToEdit.textContent = newValue;
    }

    /**
     * Deletes a todo from the in-memory list and from the UI view.
     * @param {*} todo
     * @param {*} todoUI
     */
    static deleteTodo(todo, todoUI) {
        let project =
            Gui.getCurrentProject().name === todo.project
                ? Gui.getCurrentProject()
                : Store.loadProject(todo.project);

        document.querySelector("#todoView").removeChild(todoUI);

        Logic.deleteTodo(project, todo);
        Store.saveProject(project);

        Gui.update()
        Gui.checkIfFiltered()
    }

    /**
     * Creates a new UI todo from the supplied Todo instance. Builds
     * from the todo template inside the main html file and loads event
     * listeneres for buttons inside tha card. Also check at creation time
     * if the todo is already done or not and applies style accordingly.
     * @param {*} todo
     * @returns
     */
    static createCard(todo) {
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

        // Activates buttons functionality
        const editButton = newCard.querySelector(".editButton");
        editButton.onclick = () => TodoForm.openForm("edit", todo);

        const deleteButton = newCard.querySelector(".deleteButton");
        deleteButton.onclick = () => this.deleteTodo(todo, newCard);

        Gui.update()

        return newCard;
    }
}
