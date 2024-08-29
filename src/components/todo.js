const { isDate, format } = require("date-fns");

/**
 * A class representing a Todo item: stores all data related to the
 * todo including, tile, description, due date and priority. Has an
 * internal status field that control wheter the task is done or not.
 */
export default class Todo {
    constructor({ title, description, dueDate, priority }) {
        this.title = title;
        this.description = description;
        this.dueDate = new Date(dueDate);
        this.priority = priority;
    }

    /** Checks wheter the task is done. */
    #done = false;

    // #region Getters and Setters
    get title() {
        return this._title;
    }

    set title(value) {
        if (this.#isValidStringInput("title", value)) this._title = value;
    }

    get description() {
        return this._description;
    }

    set description(value) {
        if (this.#isValidStringInput("description", value)) this._description = value
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

    /**
     * Private method to check if the provided string value is
     * a valid input for the property the user is editing.
     * @param {*} field
     * @param {*} value
     */
    #isValidStringInput(fieldName, value) {
        if (/\S/.test(value) && typeof value === "string") {
            return true;
        } else {
            throw new Error(
                `Value "${value}" is not a valid input for field "${fieldName}".`
            );
        }
    }
}
