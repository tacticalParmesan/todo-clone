import { format } from "date-fns";
import { Gui } from "./gui";

export const Filter = (function() {

    /**
     * A collection of GUI elements that interact with searchinf and filtering
     * functions.
     */
    const filter = {
        filterTab:      document.querySelector("#filters"),
        panel:          document.querySelector("#filterSelectionPanel"),
        selector:       document.querySelector("#prop"),
        value:          document.querySelector("#value"),
        projectName:    document.querySelector("#projectName"),
        projectDesc:    document.querySelector("#projectDescription"),
    }

    /**
     * Initializes filtering functionalities and loads event listeners.
     */
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

    /**
     * Shows the filtering options in the GUI once the search panel is
     * clicked by the user.
     */
    function showFilterPanel() {
        filter.panel.style.display = "flex";
        Gui.renderFiltered("title", undefined)
        filter.selector.value = "";
        filter.projectName.textContent = "Search & Filters";
        filter.projectDesc.textContent = "Filter Todos by desired value.";
    }
    
    /**
     * Hides the filtersd panel once the user clicks on another view.
     */
    function hideFilterPanel() {
        filter.panel.style.display = "none"
    }

    /**
     * Performs input validation and calls the GUI function to render filtered
     * results. Makes sure that the GUI does not get overwritten when inside
     * the filter view.
     */
    function lookup() {
        let property = filter.selector.value;
        let value = filter.value.value;
        const type = filter.value.getAttribute("type");
        
        if (type === "date") { value = format(value, "d MMM yyyy"); }
        else if (type === "text") { value = value.trim() }
        
        Gui.renderFiltered(property, value);
        checkIfEmpty();
    }
    
    /**
     * Perfoms emptyness cheking for showing the Empty Project graphics and avoid
     * html element persisting in the filtered view when search value is empty.
     */
    function checkIfEmpty() {
        if (filter.value.value === "") Gui.clearTodoView()
        Gui.checkForEmptyProject()
    }
    
    return { init, hideFilterPanel }
})();