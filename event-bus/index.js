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

const events = [];

app.post("/events", (req, res) => {
  const event = req.body;
  console.log("Event Received:", event);

  events.push(event);

  axios
    .post("http://posts-clusterip-srv:4000/events", event)
    .catch((err) => console.error(err));
  axios
    .post("http://comments-srv:4001/events", event)
    .catch((err) => console.error(err));
  axios
    .post("http://query-srv:4002/events", event)
    .catch((err) => console.error(err));
  axios
    .post("http://moderation-srv:4003/events", event)
    .catch((err) => console.error(err));

  res.send({ status: "OK" });
});

app.get("/events", (req, res) => {
  res.send(events);
});

app.listen(4005, () => {
  console.log("v2");
  console.log("Listening on 4005");
});
