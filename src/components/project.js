import { Utils } from "../modules/utils.js";
import Todo from "./todo";

/**
 *
 * A Project is a collection of todos that share a common
 * end goal. It provides functionality for grouping and
 * tracking multiple todos at once.
 * It comes with methods for serializing and parsing itself from JSON.
 *
 * @param name
 * @param description
 */
export default class Project {
    constructor(name, description, uicolor) {
        this.name = name.toLowerCase();
        this.description = description;
        this.uicolor = uicolor;
    }

    /** Project class fields */
    /**
     * The collection of todos that is associated with this
     * instance of the project.
     */
    todos = [];

    /**
     * Flag to check whether the project is pending or complete.
     */
    complete = false;

    //#region Getters and Setters
    get name() {
        return this._name;
    }

    set name(value) {
        if (Utils.isValidString("name", value)) this._name = value;
    }

    get description() {
        return this._description;
    }

    set description(value) {
        if (Utils.isValidString("description", value))
            this._description = value;
    }

    get uicolor() {
        return this._uicolor;
    }

    set uicolor(value) {
        this._uicolor = value;
    }
    //#endregion

    //#region Project methods

    /**
     * Flips the 'complete' project flag.
     */
    toggleStatus() {
        this.complete = this.complete === true ? false : true;
    }

    hasTodo(todo) {
        if (!this.todos.find((item) => item.getUid() === todo.getUid())) {
            console.error(`Todo is not inside project '${this.name}'.`);
            return false;
        }
        return true;
    }

    /**
     * Takes control of serialization process and makes sure that the saved
     * projects can be reinstantiated smoothly while preserving getter and
     * setter architecture and private variables.
     * @returns
     */
    toJSON() {
        return {
            name: this._name,
            description: this._description,
            todos: this.todos,
            complete: this.complete,
            uicolor: this._uicolor,
        };
    }

    /** Static method to create a Project instance from JSON once loaded from
     * storage. Also re-instantiates the Todos inside of the todos array.
     */
    static fromJSON(json) {
        const obj = JSON.parse(json);
        const project = new Project(obj.name, obj.description, obj.uicolor);

        if (obj.complete) project.toggleStatus();

        obj.todos.forEach((todo) => {
            project.todos.push(Todo.fromJSON(JSON.stringify(todo)));
        });
        return project;
    }

    //#endregion

    //#region Multiple todos functions

    /**
     * Getter method for the list of todos.
     * @returns
     */
    getTodosList() {
        return this.todos;
    }

    /**
     * Adds the desired Todo item to the project colletion.
     * Checks if the object passed as argument is an instance
     * of a Todo.
     * @param {*} todo
     */
    add(todo) {
        if (todo instanceof Todo) {
            this.todos.push(todo);
            console.info(`Added todo ${todo.title} to project ${this.name}`);
        } else {
            console.error(
                `The item ${todo.title} is not a valid Todo instance.`
            );
            return;
        }
    }

    //#endregion
}
