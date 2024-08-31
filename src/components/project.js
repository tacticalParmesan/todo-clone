import { Utils } from "../modules/utils.js";
import Todo from "./todo";

/**
 *
 * A Project is a collection of todos that share a common
 * end goal. It provides functionality for grouping and
 * tracking multiple todos at once.
 * @param name
 * @param description
 */
export default class Project {
    constructor(name, description) {
        this.name = name;
        this.description = description;
    }

    /** Project class fields */
    /**
     * The collection of todos that is associated with this
     * instance of the project.
     */
    #todos = [];

    /**
     * Flag to check wheter the project is pending or complete.
     */
    #complete;

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
    //#endregion

    //#region Instance methods

    /**
     * Flips the 'complete' project flag.
     */
    toggleStatus() {
        this.#complete = this.#complete === true ? false : true;
    }

    //#endregion

    //#region Multiple todos functions

    /**
     * Getter method for the list of todos.
     * @returns
     */
    getTodosList() {
        return this.#todos;
    }

    /**
     * Adds the desired Todo item to the project colletion.
     * Checks if the object passed as argument is an instance
     * of a Todo.
     * @param {*} todo
     */
    addToProject(todo) {
        if (todo instanceof Todo) {
            this.#todos.push(todo);
            console.info(`Added todo ${todo.title} to project ${this.name}`);
        } else {
            console.error(`The item ${todo} is not a valid Todo instance.`);
            return;
        }
    }

    //#endregion
}
