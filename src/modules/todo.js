const { isDate, format } = require("date-fns");
import { Utils } from "./utils.js";
import { Store } from "./storage.js";

/**
 * A class representing a Todo item: stores all data related to the
 * todo including uniquie ID, tile, description, due date and priority.
 * Has a private status field that control wheter the task is done.
 * It comes with methods for serializing and parsing itself from JSON.
 * @param title
 * @param description
 * @param dueDate
 * @param priority
 * @param project
 */
export default class Todo {
    constructor(
        title,
        description,
        dueDate = new Date(),
        priority = "4",
        projectID = "aaa000"
    ) {
        this.title = title;
        this.description = description;
        this.dueDate = format(new Date(dueDate), "d MMM yyyy");
        this.priority = priority;
        this.project = projectID;
    }

    #uid = Utils.generateHexId();

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
        return this._dueDate;
    }

    set dueDate(value) {
        this._dueDate = value;
    }

    get priority() {
        return this._priority;
    }

    set priority(value) {
        this._priority = value;
    }

    get project() {
        return this._project;
    }

    set project(value) {
        this._project = Store.doProjectExistById(value) ? value : this._project;
    }

    getUid() {
        return this.#uid;
    }

    getStatus() {
        return this.#done;
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
            uid: this.#uid,
            title: this._title,
            description: this._description,
            dueDate: this._dueDate,
            priority: this._priority,
            project: this._project,
            done: this.#done,
        };
    }

    /** Static method to create a Todo instance from JSON once loaded from
     * storage.
     */
    static fromJSON(json) {
        const obj = JSON.parse(json);
        const todo = new Todo(
            obj.title,
            obj.description,
            obj.dueDate,
            obj.priority,
            obj.project
        );
        todo.#done = obj.done;
        todo.#uid = obj.uid;
        return todo;
    }
    //#endregion
}
