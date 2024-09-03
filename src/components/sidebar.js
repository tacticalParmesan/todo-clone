export class Sidebar {
    constructor() {}

    //#region Implementing singleton pattern
    static getInstance() {
        if (!Sidebar.instance) {
            Sidebar.instance = new Sidebar();
        }
        return Sidebar.instance;
    }
    //#endregion
    static init() {}

    static showNewTodoModal() {}

    static foldSidebar() {}

    static showTodayTodos() {}

    static showProjects() {}
}
