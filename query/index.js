const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(
  express.urlencoded({
    parameterLimit: 100000,
    extended: false,
  })
);
app.use(express.json());
app.use(cors());

const posts = {};

const handleEvent = (event) => {
  if (event.type === "PostCreated") {
    const { id, title } = event.data;
    posts[id] = {
      id,
      title,
      comments: [],
    };
  }

  if (event.type === "CommentCreated") {
    const { id, content, postId, status } = event.data;
    const post = posts[postId];
    post.comments.push({ id, content, status });
  }

  if (event.type === "CommentUpdated") {
    const post = posts[event.data.postId];
    const comment = post.comments.find(
      (comment) => comment.id == event.data.id
    );
    comment.status = event.data.status;
    comment.content = event.data.content;
  }
};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  const event = req.body;
  console.log("Event Received:", event);

  handleEvent(event);

  res.send({ status: "OK" });
});

app.listen(4002, () => {
  console.log("Listening on 4002");

  axios
    .get("http://event-bus-srv:4005/events")
    .then((res) => {
      for (let event of res.data) {
        console.log("Processing Event:", event);
        handleEvent(event);
      }
    })
    .catch((err) => console.error(err));
});
