import Project from "./project";

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
    static saveProject(project) {
        if (project instanceof Project) {
            localStorage.setItem(project.getUid(), JSON.stringify(project));
            console.info(`Saved project ${project.name} in storage.`);
        }
    }

    /**
     * Loads a project by name from localStorage and parses its
     * data to return an instance of Project class with the stored
     * properties and values.
     * @param {*} projectName
     * @returns a Project instance
     */
    static loadProject(uid) {
        if (!this.doProjectExistById(uid)) {
            return;
        }

        const project = Project.fromJSON(localStorage.getItem(uid));
        console.info(`Loaded project ${project.name} from storage.`);

        return project;
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
            allTodos.push(...loadedProject.getTodosList());
        }

        return allTodos;
    }

    /**
     * Uses localStorage API to remove a project.
     * @param {*} uid
     */
    static removeProject(uid) {
        localStorage.removeItem(uid);
    }

    /**
     * Look up function to check if a project already exists in storage.
     * @param {*} projectName
     * @returns
     */
    static doProjectExistById(uid) {
        const check = localStorage.getItem(uid);
        if (!check) console.info(`Project does not exist.`);
        return check;
    }

    // static doProjectExistByName(name) {
    //     for (const project in JSON.parse(localStorage)) {
    //         console.log(project)
    //         if (Project.fromJSON(project).name === name) {
    //             return true
    //         } else {
    //             continue
    //         }
    //     }
    //     return false

    // }
}
