import { format } from "date-fns";
import { Gui } from "./gui";

export const Filter = (function() {

    const filter = {
        filterTab:      document.querySelector("#filters"),
        panel:          document.querySelector("#filterSelectionPanel"),
        selector:       document.querySelector("#prop"),
        value:          document.querySelector("#value"),
        projectName:    document.querySelector("#projectName"),
        projectDesc:    document.querySelector("#projectDescription"),
    }

    function init() {

        filter.filterTab.onclick = () => showFilterPanel()

        filter.selector.onchange = () => {
            let inputType;
            switch (filter.selector.value) {
                case "dueDate":
                    filter.value.setAttribute("type", "date")
                    break;
                case "priority":
                    filter.value.setAttribute("type", "number")
                    filter.value.setAttribute("max", 4)
                    break
                case "title":
                    filter.value.setAttribute("type", "text")
                    break
                default:
                    filter.value.setAttribute("disabled", "true")
                    break;
            }
            Gui.clearTodoView()
            filter.value.value = ""
        }
        filter.value.oninput = () => lookup()
    }

    function showFilterPanel() {
        filter.panel.style.display = "flex";
        Gui.renderFiltered("title", undefined)
        filter.selector.value = "";
        filter.projectName.textContent = "Search and Filters";
        filter.projectDesc.textContent = "Filter Todos by desired value.";
    }

    function hideFilterPanel() {
        filter.panel.style.display = "none"
    }

    function lookup() {
        
        let property = filter.selector.value;
        let value = filter.value.value;
        const type = filter.value.getAttribute("type");
        
        if (type === "date") {
            value = format(value, "d MMM yyyy");
        } else if (type === "text") {
            value = value.trim()
        }
        
        Gui.renderFiltered(property, value);
        filter.projectName.textContent = "Search and Filters";
        filter.projectDesc.textContent = "Filter Todos by desired value."
        checkIfEmpty();
    }
    
    function checkIfEmpty() {
        if (filter.value.value === "") Gui.clearTodoView()
        Gui.checkForEmptyProject()
    }
    
    return { init, hideFilterPanel }
})();