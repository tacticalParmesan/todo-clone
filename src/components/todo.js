const { isDate, format } = require("date-fns");
import { Utils } from "../modules/utils.js";

/**
 * A class representing a Todo item: stores all data related to the
 * todo including uniquie ID, tile, description, due date and priority.
 * Has a private status field that control wheter the task is done.
 * It comes with methods for serializing and parsing itself from JSON.
 * @param title
 * @param description
 * @param dueDate
 * @param priority
 */
export default class Todo {
    constructor(title, description, dueDate, priority) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
    }

    #id = Utils.generateHexId();

    /** Checks wheter the task is done. */
    #done = false;

    //#region Getters and Setters
    get title() {
        return this._title;
    }

    set title(value) {
        if (Utils.isValidString("title", value)) this._title = value;
    }

    get description() {
        return this._description;
    }

    set description(value) {
        this._description = String(value);
    }

    get dueDate() {
        const date = this._dueDate;
        return format(date, "dd/MM/yyyy");
    }

    set dueDate(value) {
        this._dueDate = isDate(value) ? value : this._dueDate;
    }

    get priority() {
        return this._priority;
    }

    set priority(value) {
        this._priority = typeof value === "number" ? value : this._priority;
    }
    //#endregion

    //#region Instance Methods
    toggleStatus() {
        this.#done = this.#done === true ? false : true;
    }

    /**
     * Takes control of serialization process and makes sure that the saved
     * todo can be reinstantiated smoothly while preserving the getter and
     * setter architcture and private variables.
     * @returns 
     */
    toJSON() {
        return {
            title: this._title,
            description: this._description,
            dueDate: this._dueDate,
            priority: this._priority,
            done: this.#done,
        };
    }

    /** Static method to create a Todo instance from JSON once loaded from
     * storage.
     */
    static fromJSON(json) {
        const obj = JSON.parse(json);
        const todo = new Todo(obj.title, obj.description, obj.dueDate, obj.priority);
        todo.#done = obj.done;
        return todo;
    }
    //#endregion
}
