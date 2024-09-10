import { Logic } from "./modules/logic";
import { Gui } from "./modules/gui";
import { Sidebar } from "./components/sidebar";
import { TodoForm } from "./components/todoform";
import { ProjectForm } from "./components/projectform";
import "./style/main.css";

/**
 * Handles startup of the Todo app by loading event listeners
 * and calling initialization functions.
 */
const Startup = (function () {
    let general;

    document.addEventListener("DOMContentLoaded", () => {
        general = Logic.initDefaultProject();
        Gui.switchProject(general)
    });

    document.addEventListener("DOMContentLoaded", ()=>{
        Sidebar.init()
        Sidebar.showProjects()
    })

    document.addEventListener("DOMContentLoaded", () => {
        TodoForm.init()
        ProjectForm.init()
    })

    return { general };
})();





