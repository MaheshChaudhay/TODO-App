import { Component } from "react";
import "./App.css";
import { FormControl, InputLabel, Input, Button } from "@material-ui/core";
import Todo from "./Todo";
import FinishedTodo from "./FinishedTodo";
import ClearAllIcon from "@material-ui/icons/ClearAll";

const todos = localStorage.getItem("todos")
  ? JSON.parse(localStorage.getItem("todos"))
  : [];

const completedTodos = localStorage.getItem("completedTodos")
  ? JSON.parse(localStorage.getItem("completedTodos"))
  : [];

class App extends Component {
  state = {
    todos: todos,
    input: "",
    completedTodos: completedTodos,
    hashTagFilters: [],
    filteredTodos: [],
    filteredCompletedTodos: [],
  };

  addTodoHandler = (e) => {
    e.preventDefault();
    const inputArr = this.state.input.trim().split(" ");
    const todoValue = inputArr.filter((inp) => inp[0] !== "#");
    const hashTagValue = inputArr.filter((inp) => inp[0] === "#");
    const newTodo = {
      id: this.state.todos.length + 1,
      todo: todoValue.join(" "),
      hashTagText: hashTagValue.join("         "),
      hashTags: hashTagValue,
    };
    const updatedTodos = [newTodo, ...this.state.todos];
    this.setState({
      ...this.state,
      input: "",
      todos: updatedTodos,
    });
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  };

  todoCompleteHandler = (id) => {
    const index = this.state.todos.findIndex((todo) => todo.id === id);
    const completed = this.state.todos[index];
    const updatedTodos = this.state.todos.filter((todo) => todo.id !== id);
    const completedTodos = [completed, ...this.state.completedTodos];
    this.setState({
      ...this.state,
      completedTodos: completedTodos,
      todos: updatedTodos,
    });
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
    localStorage.setItem("completedTodos", JSON.stringify(completedTodos));
  };

  clearAll = () => {
    this.setState({
      todos: [],
      input: "",
      completedTodos: [],
      hashTagFilters: [],
      filteredTodos: [],
      filteredCompletedTodos: [],
    });
  };

  getDisplayTodos = () => {
    if (this.state.filteredTodos.length === 0) {
      return this.state.todos;
    } else {
      return this.state.filteredTodos;
    }
  };

  getDisplayCompletedTodos = () => {
    if (this.state.filteredCompletedTodos.length === 0) {
      return this.state.completedTodos;
    } else {
      return this.state.filteredCompletedTodos;
    }
  };

  removeFilterHandler = () => {
    this.setState({
      hashTagFilters: [],
      filteredTodos: [],
      filteredCompletedTodos: [],
    });
  };

  hashTagFilterHandler = (value) => {
    let newFilteredTodos = [];
    let newFilteredCompletedTodos = [];
    if (this.state.filteredTodos.length === 0) {
      newFilteredTodos = this.state.todos.filter((todo) => {
        return todo.hashTags.indexOf(value) !== -1;
      });
      newFilteredCompletedTodos = this.state.completedTodos.filter((todo) => {
        return todo.hashTags.indexOf(value) !== -1;
      });
    } else {
      newFilteredTodos = this.state.filteredTodos.filter((todo) => {
        return todo.hashTags.indexOf(value) !== -1;
      });
      newFilteredCompletedTodos = this.state.filteredCompletedTodos.filter(
        (todo) => {
          return todo.hashTags.indexOf(value) !== -1;
        }
      );
    }
    this.setState({
      ...this.state,
      hashTagFilters: [value, ...this.state.hashTagFilters],
      filteredTodos: newFilteredTodos,
      filteredCompletedTodos: newFilteredCompletedTodos,
    });

    console.log("clicked hashtag>>>>>>>", this.state.hashTagFilters);
  };

  render() {
    const displayTodos = this.getDisplayTodos();
    const displayCompletedTodos = this.getDisplayCompletedTodos();
    return (
      <div className="App">
        <div
          className="header"
          style={{
            width: "100%",
            fontWeight: "bold",
            marginLeft: "35px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h1 style={{ textAlign: "center", width: "70%", display: "inline" }}>
            TODO APP
          </h1>
          <Button color="primary">
            {" "}
            <ClearAllIcon
              color="action"
              fontSize="large"
              onClick={this.clearAll}
              style={{ cursor: "pointer" }}
            />{" "}
          </Button>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row-reverse",
            width: "100%",
          }}
        >
          <Button
            color="secondary"
            disabled={this.state.filteredTodos.length === 0}
            onClick={this.removeFilterHandler}
          >
            Remove Filters
          </Button>
        </div>
        <form style={{ marginBottom: "25px", marginLeft: "-45px" }}>
          <FormControl
            color="secondary"
            style={{ marginTop: "15px", marginBottom: "!5px" }}
          >
            <InputLabel className="label">Enter a Todo</InputLabel>
            <Input
              className="input"
              value={this.state.input}
              onChange={(e) => this.setState({ input: e.target.value })}
            />
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            style={{
              marginLeft: "50px",
              marginTop: "15px",
              marginBottom: "!5px",
            }}
            type="submit"
            onClick={this.addTodoHandler}
            disabled={this.state.input === ""}
          >
            ADD TODO
          </Button>
        </form>
        <ul className="todo-list">
          {displayTodos.map((todo) => (
            <Todo
              key={todo.id}
              todo={todo}
              onComplete={this.todoCompleteHandler}
              onHashTagFilter={this.hashTagFilterHandler}
            />
          ))}
          {displayCompletedTodos.map((todo) => (
            <FinishedTodo todo={todo} />
          ))}
        </ul>
      </div>
    );
  }
}

export default App;
