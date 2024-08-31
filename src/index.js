import { endOfDay } from "date-fns";
import { Logic } from "./modules/logic";
import { Store } from "./modules/storage";


const loaded = Store.loadProject("website")
console.log(loaded)
console.log(loaded.getTodosList()[0])
Logic.editTodo(loaded, loaded.getTodosList()[0], "title", "frontend")

console.log(loaded)
