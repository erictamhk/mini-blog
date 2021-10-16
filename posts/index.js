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

const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/posts/create", (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;
  posts[id] = {
    id,
    title,
  };

  axios
    .post("http://event-bus-srv:4005/events", {
      type: "PostCreated",
      data: {
        id,
        title,
      },
    })
    .catch((err) => console.error(err));
  res.status(201).send(posts[id]);
});

app.post("/events", (req, res) => {
  const event = req.body;
  console.log("Event Received:", event);
  res.send({ status: "OK" });
});

app.listen(4000, () => {
  console.log("v8");
  console.log("Listening on 4000");
});
