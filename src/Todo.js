import React from "react";
import "./Todo.css";
import ReactHashtag from "react-hashtag";

function Todo(props) {
  return (
    <div className="todo">
      <li>
        <div
          className="todo-item"
          onClick={() => props.onComplete(props.todo.id)}
        >
          {props.todo.todo}
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

export default Todo;
