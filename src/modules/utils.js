

/**
 * A collection of useful method that are shared between different
 * components of the App but do not belong to a single component.
 */
export class Utils {
    constructor() {}

    // Implementing singleton pattern
    static getUtilsInstance() {
        if (!Utility.instance) {
            Utility.instance = new Utility();
        }
        return Utility.instance;
    }

    /**
     * Mthod to check if the provided string value is a
     * valid input for the property the user is editing.
     * @param {*} field
     * @param {*} value
     */
    static isValidString(fieldName, value) {
        if (/\S/.test(value) && typeof value === "string") {
            return true;
        } else {
            throw new Error(
                `Value "${value}" is not a valid input for field "${fieldName}".`
            );
        }
    }

    /**
     * Generate a random hexadecimal identifier.
     */
    static generateHexId() {
        let hex = "";
        for (let i = 0; i < 6; i++) {
            const randN = Math.floor(Math.random() * 16);
            hex += randN.toString(16);
        }
        return hex;
    }

    /**
     * Sets the input text to Title Case.
     * @param {*} text
     * @returns
     */
    static toTitleCase(text) {
        return text
            .toLowerCase()
            .split(/\s+/)
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    }
}
