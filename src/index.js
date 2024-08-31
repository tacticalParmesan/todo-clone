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

