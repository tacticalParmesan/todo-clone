import { Logic } from "./modules/logic";
import { Store } from "./modules/storage";
import { Utils } from "./modules/utils";
import { Gui } from "./modules/gui";
import { Sidebar } from "./components/sidebar";
import "./style/main.css";
import { Card } from "./components/card";
import { isToday } from "date-fns";
import { ProjectForm, TodoForm } from "./components/todoform";

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
    })

    return { general };
})();





