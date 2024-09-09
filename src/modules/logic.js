import Todo from "./todo";
import Project from "./project";
import { Store } from "./storage";

export class Logic {
    constructor() {}

    // Implementing singleton pattern
    static getInstance() {
        if (!Logic.instance) {
            Logic.instance = new Logic();
        }
        return Logic.instance;
    }

    /**
     * Creates a new Todo item with the data extracted from the
     * UI fields passed as an object. It also calls the Todo
     * constructor and checks if the Todo belongs to an existing
     * project, in that case it pushes it in its collection.
     *
     * @param {*} properties {title, description, dueDate, priority}
     * @param {*} project Defaults to 'general' for non categorized Todos.
     */
    static createTodo(todoProperties, project) {
        console.log(todoProperties)
        const newTodo = new Todo(
            todoProperties.title,
            todoProperties.description,
            todoProperties.dueDate,
            todoProperties.priority,
            todoProperties.projectName
        );

        project.add(newTodo);
        console.info(
            `Created todo '${newTodo.title}'. Added to project '${project.name}'.`
        );

        return newTodo;
    }

    /**
     * Deletes the provided Todo element from the Project array.
     * Checks for Todo existence inside Project.
     * @param {*} project
     * @param {*} todo
     */
    static deleteTodo(project, todo) {
        if (!project.hasTodo(todo)) {
            return;
        }
        const indexToDelete = project.todos.findIndex(
            (t) => t.getUid() === todo.getUid()
        );
        project.todos.splice(indexToDelete, 1);
        console.log(project.getTodosList());
        console.info(
            `Deleted todo '${todo.title}' from project '${project.name}'.`
        );
    }

    /**
     * Edits the passed property replacing its value with the given one.
     * Check if the todo belongs to the project and if the property is
     * one of the Todo type.
     * @param {*} project
     * @param {*} todo
     * @param {*} property
     * @param {*} value
     * @returns
     */
    static editTodo(project, todo, property, value) {
        if (!project.hasTodo(todo)) {
            return;
        }
        const target = project.todos.find(
            (item) => item.getUid() === todo.getUid()
        );
        const oldValue = target[property];
        if (property in todo) target[property] = value;
        console.info(
            `Edited todo '${todo.title}' inside project '${project.name}.' ('${property}: old: ${oldValue} new:${value}')`
        );
    }

    /**
     * Moves a Todo object from source project to target project.
     * @param {*} source
     * @param {*} target
     * @param {*} todo
     */
    static moveTodo(source, target, todo) {
        const from = Store.loadProject(source);
        const to = Store.loadProject(target);

        this.deleteTodo(from, todo);
        Store.saveProject(from);
        console.log(localStorage);

        to.add(todo);
        Store.saveProject(to);

        console.info(
            `Moved todo ${todo.title} from '${from.name} to '${to.name}'`
        );
    }

    /**
     * Creates and returns a new instance of a Project. Checks
     * if the project already exists in the storage.
     * @param {*} name
     * @param {*} description
     * @returns An instance of the new Project
     */
    static createProject(name, description, color) {
        if (!Store.doProjectExist(name)) {
            const newProject = new Project(name, description, color);
            console.info(`Created project '${name}'.`);
            return newProject;
        } else {
            console.error(`Project '${name}' already exists in storage.`);
        }
    }

    /**
     * Deletes the given project from storage. Delegates to
     * the Store component the effective removing from localStorage.
     * @param {*} name
     * @returns
     */
    static deleteProject(name) {
        if (!Store.doProjectExist(name)) {
            return;
        }
        Store.removeProject(name);
        console.info(`Deleted project '${name}'.`);
    }

    /**
     * Changes details about the given project by accessing its properties
     * and calling the right setters. Checks if the property exists inside
     * the given project.
     * @param {*} project
     * @param {*} property
     * @param {*} value
     * @returns
     */
    static editProject(project, property, value) {
        if (Store.doProjectExist(project.name)) {
            if (property !== "todos" && property in project) {
                const oldValue = project[property];
                project[property] = value;
                console.info(
                    `Edited project '${project.name}.' ('${property}: old: ${oldValue} new:${value}')`
                );
            } else {
                console.error(
                    `Cannot access property '${property}' of project '${project.name}'.`
                );
            }
        } else {
            console.error(
                `Project '${project.name}' does not exist in storage.`
            );
            return;
        }
    }

    /**
     * Loads the 'general' project at startup to contain and serve
     * todos that do not belong to a named project. Creats the default
     * project if it does not exist.
     */
    static initDefaultProject() {
        let general = Store.loadProject("general");

        if (!general) {
            general = this.createProject(
                "general",
                "Container project for uncategorized todos."
            );
            Store.saveProject(general);
        }
        return general;
    }
}
