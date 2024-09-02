import { endOfDay, endOfTomorrow } from "date-fns";
import { Logic } from "./modules/logic";
import { Store } from "./modules/storage";
import "./style/main.css";
import Project from "./components/project";
import { Gui } from "./modules/gui";

// const h = Logic.createProject("housework", "stuff")
const h = Store.loadProject("housework");

// Logic.createTodo({
//     title: "Clean kitchen",
//     description: "Make it shine!",
//     dueDate: Date.now(),
//     priority: 1,
//     projectName: h.name
// }, h)

const clean = h.getTodosList()[0];

// // Logic.deleteTodo(h, clean)

console.log(Gui.renderTodo(clean));
document.querySelector("#todoView").appendChild(Gui.renderTodo(clean));

Store.saveProject(h);
