import { endOfDay } from "date-fns";
import { Logic } from "./modules/logic";
import { Store } from "./modules/storage";


const loaded = Store.loadProject("website")
console.log(loaded)
Logic.deleteTodo(loaded, loaded.getTodosList()[0])
Logic.deleteTodo(loaded, loaded.getTodosList()[1])

console.log(loaded)
