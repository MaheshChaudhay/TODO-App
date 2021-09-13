import React from "react";
import ReactHashtag from "react-hashtag";
import "./FinishedTodo.css";

function FinishedTodo(props) {
  return (
    <div className="todo">
      <li style={{ backgroundColor: "rgb(3, 116, 3)" }}>
        <div className="todo-item">
          <strike style={{ color: "yellow" }}>{props.todo.todo}</strike>
        </div>
        <h4 className="hashtag">
          <ReactHashtag onHashtagClick={(val) => props.onHashTagFilter(val)}>
            {props.todo.hashTagText}
          </ReactHashtag>
        </h4>
      </li>
    </div>
  );
}

export default FinishedTodo;
