const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5050;

const dbURI = `mongodb://${process.env.useraccess}:${process.env.password}@cluster0-shard-00-00.m7xi6.mongodb.net:27017,cluster0-shard-00-01.m7xi6.mongodb.net:27017,cluster0-shard-00-02.m7xi6.mongodb.net:27017/todo-list?ssl=true&replicaSet=atlas-v0hkfh-shard-0&authSource=admin&retryWrites=true&w=majority`;
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => console.log("Connected to db"))
  .catch((err) => console.log(err));

const Todo = require("./models/todo");

app.get("/todos", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

app.post("/todos", (req, res) => {
  if (req.body.text.length >= 5) {
    const todo = new Todo({
      text: req.body.text,
    });
    todo.save();
    res.json(todo);
    return true;
  }
  return false;
});

app.delete("/todos/delete/:id", async (req, res) => {
  const result = await Todo.findByIdAndDelete(req.params.id);

  res.json(result);
});

app.get("/todos/completed/:id", async (req, res) => {
  const todo = await Todo.findById(req.params.id);

  todo.completed = !todo.completed;
  todo.save();

  res.json(todo);
});

if (process.env.NODE_ENV == "production") {
  app.use(express.static("client/build"));
}

app.listen(port, () => console.log("server started on port 5050"));
