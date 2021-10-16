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

app.post("/events", (req, res) => {
  const event = req.body;
  console.log("Event Received:", event);

  if (event.type === "CommentCreated") {
    const checkStatus = event.data.content.includes("orange")
      ? "rejected"
      : "approved";

    axios
      .post("http://event-bus-srv:4005/events", {
        type: "CommentModerated",
        data: { ...event.data, status: checkStatus },
      })
      .catch((err) => console.error(err));
  }

  res.send({ status: "OK" });
});

app.listen(4003, () => {
  console.log("Listening on 4003");
});
