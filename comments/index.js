const express = require("express");
const { randomBytes } = require("crypto");
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

const compentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  res.send(compentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;

  const comments = compentsByPostId[req.params.id] || [];

  const comment = { id: commentId, content, status: "pending" };
  comments.push(comment);

  compentsByPostId[req.params.id] = comments;

  axios
    .post("http://event-bus-srv:4005/events", {
      type: "CommentCreated",
      data: { ...comment, postId: req.params.id },
    })
    .catch((err) => console.error(err));

  res.status(201).send(comments);
});

app.post("/events", (req, res) => {
  const event = req.body;
  console.log("Event Received:", event);

  if (event.type === "CommentModerated") {
    const comments = compentsByPostId[event.data.postId];
    const comment = comments.find((comment) => comment.id == event.data.id);
    comment.status = event.data.status;

    axios
      .post("http://event-bus-srv:4005/events", {
        type: "CommentUpdated",
        data: { ...comment, postId: event.data.postId },
      })
      .catch((err) => console.error(err));
  }

  res.send({ status: "OK" });
});

app.listen(4001, () => {
  console.log("Listening on 4001");
});
