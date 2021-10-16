import React from "react";
import PostCreate from "./PostCreate";
import PostList from "./PostList";

const App = () => {
  return (
    <div className="container">
      <h1>Create Post !!!!! </h1>
      <PostCreate />
      <PostList />
    </div>
  );
};

export default App;
