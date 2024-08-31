import Todo from "../components/todo";
import Project from "../components/project";
import { Store } from "./storage";

export class Logic {
    constructor(){}

    // Implementing singleton pattern
    static getInstance() {
        if (!Logic.instance) {
            Logic.instance = new Logic();
        }
        return Logic.instance;
    }

    /**
     * Creates a new Todo item with the data extracted from the
     * UI fields passed as an object. It also calls the Todo 
     * constructor and checks if the Todo belongs to an existing
     * project, in that it pushes it in its collection.
     * 
     * @param {*} properties A map containing the Todo properties.
     * @param {*} project Defaults to 'general' for non categorized Todos.
     */
    static createTodo(todoProperties, project="general"){
        const newTodo = new Todo(
            todoProperties.title,
            todoProperties.description,
            todoProperties.dueDate,
            todoProperties.priority
        )

        if (project !== "general") {
            project.add(newTodo)
        } else {
            
        }

        return newTodo
    }

    /**
     * Deletes the provided Todo element from the Project array.
     * @param {*} project 
     * @param {*} todo 
     */
    static deleteTodo(project, todo){
        try{
            if (project.todos.includes(todo)) { 
                project.todos.splice(project.todos.indexOf(todo), 1)
                console.info(`Deleted todo '${todo.title}' from project '${project.name}'.`)
            } else {
                throw new Error(`Todo is not inside project '${project.name}.'`);
            }
        } catch (Error) {
            console.error(Error)
            return
        }
    }

    static editTodo(todo, property, value){
        //if todo exist edit the field
    }

    /**
     * Creates and returnsv a new instance of a Project. Checks
     * if the project already exists in the storage.
     * @param {*} name 
     * @param {*} description 
     * @returns 
     */
    static createProject(name, description){
        if (!Store.doProjectExist()) {
            const newProject = new Project(name, description)
            console.info(`Created project ${name}.`)
            return newProject
        } else {
            console.error(`Project ${name} already exists in storage.`)
        }
    }

    static deleteProject(){}

    static editProject(){}
}