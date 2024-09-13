export const Filter = (function() {

    const filter = {
        selector:   document.querySelector("#prop"),
        value:      document.querySelector("#value")
    }

    function init() {
        filter.selector.onchange = () => {
            const inputType = filter.selector.value === "dueDate" ? "date" : "number"
            value.setAttribute("type", inputType)
        }
    }

    return { init }
})();