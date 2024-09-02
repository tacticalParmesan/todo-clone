import { Utils } from "./utils";

export class Gui {
    constructor() {}

    //#region Implementing singleton pattern
    static getInstance() {
        if (!Gui.instance) {
            Gui.instance = new Gui();
        }
        return Gui.instance;
    }
    //#endregion

    /**
     * Renders a Todo object in the GUI and lets the user interact
     * with it. Takes a Todo instance as argument.
     * @param {*} todo
     */
    static renderTodo(todo) {
        // <li class="todo" uid="anHex">
        const newTodoCard = document.createElement("li");
        newTodoCard.classList.add("todo");
        newTodoCard.setAttribute("uid", todo.getUid());

        // <input type="checkbox" name="doneCheck" id="doneCheck">
        const checkbox = document.createElement("input");
        checkbox.setAttribute("type", "checkbox");
        checkbox.classList.add("doneCheck");
        newTodoCard.append(checkbox);

        // Todo add event listener for editing ui and toggle status
        // If done==true ^^^

        /**
         * <div class="todoInfoTab">
         *     <h2 class="todoTitle">Stuff</h2>
         *     <p class="todoDesc">Stuff to do, places to see...</p>
         * </div>
         */
        const infoTab = document.createElement("div");
        infoTab.classList.add("todoInfoTab");

        const title = document.createElement("h2");
        title.classList.add("todoTitle");
        title.textContent = todo.title;

        const description = document.createElement("p");
        description.classList.add("todoDesc");
        description.textContent = todo.description;

        infoTab.appendChild(title);
        infoTab.appendChild(description);
        newTodoCard.appendChild(infoTab);

        /**
         * <div class="todoDateProjectTab">
         *     <time datetime="02/09/2024">02/09/2024</time>
         *     <p class="todoProject">Project Name</p>
         * </div>
         */
        const dateProjTab = document.createElement("div");
        dateProjTab.classList.add("todoDateProjectTab");

        const dueDate = document.createElement("time");
        dueDate.setAttribute("datetime", todo.dueDate);
        dueDate.textContent = todo.dueDate;

        const project = document.createElement("p");
        project.classList.add("todoProject");
        project.textContent = Utils.toTitleCase(todo.project);
        dateProjTab.appendChild(dueDate);
        dateProjTab.appendChild(project);

        // </li>
        newTodoCard.appendChild(dateProjTab);
        return newTodoCard;
    }
}
