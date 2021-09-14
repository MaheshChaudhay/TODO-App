import { Component } from "react";
import "./App.css";
import { FormControl, InputLabel, Input, Button } from "@material-ui/core";
import Todo from "./Todo";
import FinishedTodo from "./FinishedTodo";
import ClearAllIcon from "@material-ui/icons/ClearAll";
import Chip from "@material-ui/core/Chip";

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
    });
  };

  getDisplayTodos = () => {
    console.log("get displayed todos");
    if (this.state.hashTagFilters.length === 0) {
      return this.state.todos;
    } else {
      const newFilteredTodos = [];
      for (let i = 0; i < this.state.todos.length; i++) {
        let todo = this.state.todos[i];
        let flag = true;
        for (let j = 0; j < this.state.hashTagFilters.length; j++) {
          if (todo.hashTags.indexOf(this.state.hashTagFilters[j]) === -1) {
            flag = false;
          }
        }
        if (flag === true) {
          const requiredTodo = { ...todo };
          newFilteredTodos.push(requiredTodo);
        }
      }
      console.log("new filtered todos>>>>>", newFilteredTodos);
      return newFilteredTodos;
    }
  };

  getDisplayCompletedTodos = () => {
    if (this.state.hashTagFilters.length === 0) {
      return this.state.completedTodos;
    } else {
      const newFilteredTodos = [];
      for (let i = 0; i < this.state.completedTodos.length; i++) {
        let todo = this.state.completedTodos[i];
        let flag = true;
        for (let j = 0; j < this.state.hashTagFilters.length; j++) {
          if (todo.hashTags.indexOf(this.state.hashTagFilters[j]) === -1) {
            flag = false;
          }
        }
        if (flag === true) {
          const requiredTodo = { ...todo };
          newFilteredTodos.push(requiredTodo);
        }
      }
      console.log("new filtered todos>>>>>", newFilteredTodos);

      return newFilteredTodos;
    }
  };

  removeFilterHandler = () => {
    this.setState({
      hashTagFilters: [],
    });
  };

  hashTagFilterHandler = (value) => {
    if (this.state.hashTagFilters.indexOf(value) === -1) {
      this.setState({
        hashTagFilters: [value, ...this.state.hashTagFilters],
      });
    }
  };

  handleDeleteFilter = (value) => {
    console.log(value);
    const updatedHashTagFilters = this.state.hashTagFilters.filter(
      (hashtag) => hashtag !== value
    );
    this.setState({
      hashTagFilters: updatedHashTagFilters,
    });
    console.log(updatedHashTagFilters);
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
            disabled={this.state.hashTagFilters.length === 0}
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

        {this.state.hashTagFilters.length === 0 ? (
          ""
        ) : (
          <div className="applied-filters">
            {this.state.hashTagFilters.map((hashtag) => (
              <Chip
                data={hashtag}
                className="chip"
                label={hashtag}
                color="primary"
                onDelete={() => this.handleDeleteFilter(hashtag)}
              />
            ))}
          </div>
        )}
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
            <FinishedTodo
              todo={todo}
              onHashTagFilter={this.hashTagFilterHandler}
            />
          ))}
        </ul>
      </div>
    );
  }
}

export default App;
