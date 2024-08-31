import Todo from "../components/todo";
import Project from "../components/project";
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
     * project, in that it pushes it in its collection.
     *
     * @param {*} properties A map containing the Todo properties.
     * @param {*} project Defaults to 'general' for non categorized Todos.
     */
    static createTodo(todoProperties, project = "general") {
        const newTodo = new Todo(
            todoProperties.title,
            todoProperties.description,
            todoProperties.dueDate,
            todoProperties.priority
        );

        if (project !== "general") {
            project.add(newTodo);
            console.info(
                `Created todo '${newTodo.title}'. Added to project '${project}.'`
            );
        } else {
        }

        return newTodo;
    }

    /**
     * Deletes the provided Todo element from the Project array.
     * Checks for Todo existince inside Project.
     * @param {*} project
     * @param {*} todo
     */
    static deleteTodo(project, todo) {
        if (!project.hasTodo(todo)) {
            return;
        }
        project.todos.splice(project.todos.indexOf(todo), 1);
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
        const target = project.todos.find((item) => item === todo);
        const oldValue = target[property];
        if (property in todo) target[property] = value;
        console.info(
            `Edited todo '${todo.title}' inside project '${project.name}.' ('${property}: old: ${oldValue} new:${value}')`
        );
    }

    /**
     * Creates and returns a new instance of a Project. Checks
     * if the project already exists in the storage.
     * @param {*} name
     * @param {*} description
     * @returns
     */
    static createProject(name, description) {
        if (!Store.doProjectExist(name)) {
            const newProject = new Project(name, description);
            console.info(`Created project '${name}'.`);
            return newProject;
        } else {
            console.error(`Project '${name}' already exists in storage.`);
        }
    }

    static deleteProject(name) {
        if (!Store.doProjectExist(name)) { return }
        Store.removeProject(name)
        console.info(`Deleted project '${name}'.`)
    }

    static editProject() {}
}
