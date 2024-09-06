import { Logic } from "./modules/logic";
import { Store } from "./modules/storage";
import Project from "./components/project";
import { Gui } from "./modules/gui";
import { Sidebar } from "./components/sidebar";
import "./style/main.css";
import { Card } from "./components/card";

/**
 * Handles startup of the Todo app by loading event listeners
 * and calling initialization functions.
 */
const Startup = (function () {
    let general;

    document.addEventListener("DOMContentLoaded", () => {
        general = Logic.initDefaultProject();
        Gui.switchProject(Store.loadProject("housework"))
    });

    document.addEventListener("DOMContentLoaded", ()=>{
        Sidebar.init()
        Sidebar.showProjects()
    })

    return { general };
})();





