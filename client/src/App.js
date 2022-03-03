import { useState, useEffect } from "react";
const API_BASE = "http://localhost:5050";
function App() {
  const [todos, setTodos] = useState(["initialised"]);
  const [completed, setcompleted] = useState([]);

  const [newTodo, setNewTodo] = useState([]);

  useEffect(() => {
    const GetTodos = () => {
      fetch(API_BASE + "/todos")
        .then((res) => res.json())
        .then((data) => {
          setTodos(data);
          console.log(data);
        })
        .catch((err) => console.error("Error:", err));
    };

    GetTodos();
  }, []);

  const completeTodo = async (id) => {
    const data = await fetch(API_BASE + "/todos/completed/" + id).then((res) =>
      res.json()
    );

    setTodos((todos) =>
      todos.map((todo) => {
        if (todo._id === data._id) {
          todo.completed = data.completed;
        }

        return todo;
      })
    );
  };
  let message = "";
  const addTodo = async () => {
    // if (newTodo.length < 5) {
    //   message = "Minimum length of task should be 5 letters!!";
    // } else {
    const data = await fetch(API_BASE + "/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: newTodo,
      }),
    }).then((res) => res.json());
    console.log(data);

    setTodos([...todos, data]);
    // setNewTodo = "";
    // }
  };

  const removeTodo = async () => {
    console.log("Data from remove todo", todos);
    for (let i = 0; i < todos.length; i++) {
      if (todos[i].completed === true) {
        setcompleted((oldArray) => [...oldArray, todos[i]]);
      }
    }
    setTodos(todos.filter((todo) => todo.completed === false));
  };

  return (
    <div className="App bg-gray-400">
      <h1>Todo List Web Application</h1>

      <div className=" flex">
        <div className="w-1/10"></div>
        <div className="w-2/5 ml-20">
          <div className="content">
            <h3>Create Task</h3>
            <input
              type="text"
              className="add-todo-input"
              onChange={(e) => setNewTodo(e.target.value)}
              value={newTodo}
            />
            <button
              className="bg-gray-400 border-2 border-black p-4 create-btn"
              onClick={addTodo}
            >
              Create
            </button>
          </div>

          <div className="show-error">{message}</div>
          <h3>All Tasks</h3>
          <div className="todos">
            {todos.map((todo) => {
              return (
                <div
                  className={"todo " + (todo.completed ? "is-complete" : "")}
                  key={todo._id}
                  onClick={() => completeTodo(todo._id)}
                >
                  <div className="text">{todo.text}</div>
                </div>
              );
            })}
          </div>
          <button
            className="bg-gray-400 border-2 border-black p-4 create-btn rmv-btn"
            onClick={removeTodo}
          >
            Remove Completed Tasks
          </button>
        </div>
        <div className="w-1/6"></div>
        <div className=" -ml-20 mt-28 w-2/5">
          <h3>Completed Tasks</h3>
          <div className="todos">
            {completed &&
              completed.map((todo) => {
                return (
                  <div className="todo bg-gray-100 right-side " key={todo._id}>
                    <div className="text">{todo.text}</div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
