import { endOfDay, endOfTomorrow } from "date-fns";
import { Logic } from "./modules/logic";
import { Store } from "./modules/storage";
import "./style/main.css";
import Project from "./components/project";
import { Gui } from "./modules/gui";

/**
 * Handles startup of the Todo app by loading event listeners
 * and calling initialization functions.
 */
const Startup = (function () {
    let general;

    document.addEventListener("DOMContentLoaded", () => {
        general = Logic.initDefaultProject();
        Gui.switchProject(Store.loadProject("Housework"))
    });

    return { general };
})();





