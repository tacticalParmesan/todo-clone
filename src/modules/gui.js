import { Utils } from "./utils";
import { Store } from "./storage";
import { Card } from "../components/card";
import { Sidebar } from "../components/sidebar";

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
     * The current project shown in the content area.
     * Gets updated on project switching.
     */
    currentProject;

    /**
     * Clears the Todo view in the content panel by wiping
     * todo child elements.
     */
    static clearTodoView() {
        const todoView = document.querySelector("#todoView");

        while (todoView.firstChild) {
            todoView.removeChild(todoView.firstChild);
        }
    }

    /**
     * Loads the clicked project in the GUI by calling the Storage component
     * to acquire the project data and by calling the rendering method onto
     * the collection of todos.
     * @param {*} project
     */
    static renderProject(project) {
        const projectName = document.querySelector("#projectName");
        const todoView = document.querySelector("#todoView");
        const todoList = project.getTodosList();

        this.clearTodoView();
        projectName.textContent = Utils.toTitleCase(project.name);

        for (const todo of todoList) {
            todoView.appendChild(this.renderTodo(todo));
        }
    }

    /**
     * Switches the content view between projects, from current
     * to target one.
     * @param {*} target
     */
    static switchProject(target) {
        this.currentProject = target;
        this.renderProject(target);
        this.checkForEmptyProject();
    }

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

        // <input type="checkbox" name="doneCheck">
        const checkbox = document.createElement("input");
        checkbox.setAttribute("type", "checkbox");
        checkbox.classList.add("doneCheck");

        // Applies Css to done todos to tell them apart
        if (todo.getStatus()) {
            newTodoCard.classList.add("done");
            checkbox.checked = true;
        }

        checkbox.addEventListener("change", () =>
            Card.checkTodo(todo, newTodoCard)
        );
        newTodoCard.append(checkbox);

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
         * <div class="rightTab"
         *   <div class="buttonsTab">
         *       <button class="todoButton editButton"></button>
         *       <button class="todoButton deleteButton"></button>
         *   </div>
         */
        const rightSideTab = document.createElement("div");
        rightSideTab.classList.add("rightTab");

        const buttonsTab = document.createElement("div");
        buttonsTab.classList.add("buttonsTab");

        const editButton = document.createElement("button");
        editButton.classList.add("todoButton", "editButton");
        const editIcon = document.createElement("span");
        editIcon.classList.add("material-symbols-outlined")
        editIcon.textContent = "edit" 
        editButton.appendChild(editIcon)

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("todoButton", "deleteButton");
        const delIcon = document.createElement("span");
        delIcon.classList.add("material-symbols-outlined")
        delIcon.textContent = "delete" 
        deleteButton.appendChild(delIcon)

        buttonsTab.append(editButton, deleteButton);
        rightSideTab.append(buttonsTab);

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
        dateProjTab.append(dueDate, project);
        rightSideTab.append(dateProjTab);

        // </li>
        newTodoCard.appendChild(rightSideTab);
        return newTodoCard;
    }

    static renderFiltered(property, value) {}

    /**
     * Checks if the currently displayed project is empty and shows
     * call to action graphic if this is the case.
     */
    static checkForEmptyProject() {
        const empty = document.querySelector("#emptyProjectScreen");
        if (!this.currentProject.getTodosList()[0]) {
            empty.style.display = "flex";
        } else {
            empty.style.display = "none";
        }
    }
};
