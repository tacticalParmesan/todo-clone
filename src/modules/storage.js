import Project from "../components/project";

export class Store {
    constructor() {}

    //#region Implementing singleton pattern
    static getInstance() {
        if (!Storage.instance) {
            Storage.instance = new Logic();
        }
        return Storage.instance;
    }
    //#endregion
    
    /**
     * Saves a project in localStorage using the localStorage API.
     * @param {*} project 
     */
    static saveProject(project){
        if (project instanceof Project) {
            localStorage.setItem(project.name, JSON.stringify(project))
        }
    }

    /**
     * Loads a project by name from localStorage and parses its
     * data to return an instance of Project class with the stored
     * properties and values.
     * @param {*} projectName 
     * @returns a Project instance
     */
    static loadProject(projectName){
        try{
            const projectObject = localStorage.getItem(projectName)
            return Project.fromJSON(projectObject)
        } catch {
            
        }
    }

    /**
     * Look up function to check if a project already exists in storage.
     * @param {*} projectName 
     * @returns 
     */
    static doProjectExist(projectName) {
        return (localStorage.getItem(projectName)) ? true : false
    }
}