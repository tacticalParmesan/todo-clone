/**
 * A collection of useful method that are shared between different
 * components of the App but do not belong to a single component.
 */
class Utility {
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
    isValidString(fieldName, value) {
       if (/\S/.test(value) && typeof value === "string") {
           return true;
       } else {
           throw new Error(
               `Value "${value}" is not a valid input for field "${fieldName}".`
           );
       }
   }
}

export const Utils = Utility.getUtilsInstance();
