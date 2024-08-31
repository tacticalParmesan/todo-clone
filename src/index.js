import Project from "./components/project";
import Todo from "./components/todo";

const todo = new Todo(
    "Awesome todo",
    "I have to kiss my Gdf later",
    new Date(),
    1
);
console.log(todo);
todo.toggleStatus();
console.log(todo);

const proj = new Project("todos", "many things to do")
console.log(proj)
proj.addToProject(todo)
console.log(proj.getTodosList())