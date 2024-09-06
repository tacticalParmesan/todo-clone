import Project from "../components/project";

export class Store {
    constructor() {}

    //#region Implementing singleton pattern
    static getInstance() {
        if (!Storage.instance) {
            Storage.instance = new Store();
        }
        return Storage.instance;
    }
    //#endregion

    /**
     * Saves a project in localStorage using the localStorage API.
     * @param {*} project
     */
    static saveProject(...projects) {
        for (const project of projects) {
            if (project instanceof Project) {
                localStorage.setItem(project.name, JSON.stringify(project));
                console.info(`Saved project ${project.name} in storage.`);
            }
        }
    }

    /**
     * Loads a project by name from localStorage and parses its
     * data to return an instance of Project class with the stored
     * properties and values.
     * @param {*} projectName
     * @returns a Project instance
     */
    static loadProject(projectName) {
        if (!this.doProjectExist(projectName)) {
            return;
        }

        const projectObject = localStorage.getItem(projectName);
        console.info(`Loaded project ${projectName} from storage.`);

        return Project.fromJSON(projectObject);
    }

    /**
     * Loads all todos from every project present in memory to let
     * the user interact with collection of all tasks without having
     * to traverse all projects.
     */
    static loadAllTodos() {
        let allTodos = [];
        for (const project of Object.keys(localStorage)) {
            const loadedProject = this.loadProject(project);
            allTodos = [...loadedProject.getTodosList()];
        }

        return allTodos;
    }

    /**
     * Uses localStorage API to remove a project.
     * @param {*} projectName
     */
    static removeProject(projectName) {
        localStorage.removeItem(projectName);
    }

    /**
     * Look up function to check if a project already exists in storage.
     * @param {*} projectName
     * @returns
     */
    static doProjectExist(projectName) {
        const check = localStorage.getItem(projectName) ? true : false;
        if (!check) console.info(`Project ${projectName} does not exist.`);
        return check;
    }
}
