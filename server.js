const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 5000;

app.use(express.json());

const filePath = "./data.json";

const readData = () => {
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
};

const writeData = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};


app.post("/name", (req, res) => {
  const users = readData();
  const newUser = {
    id: Date.now(),
    name: req.body.name,
    email: req.body.email,
  };

  users.push(newUser);
  writeData(users);

  res.status(201).json(newUser);
});


app.get("/getdata", (req, res) => {
  const users = readData();
  res.json(users);
});

// CRUD - Create - post, Read - Get , Update - Post, Put, Patch , Delete - delete

app.get("/users/:id", (req, res) => {
  const users = readData();
  const user = users.find(u => u.id == req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
});


app.put("/modify/:id", (req, res) => {
  const users = readData();
  const index = users.findIndex(u => u.id == req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  users[index] = {
    ...users[index],
    name: req.body.name,
    email: req.body.email
  };

  writeData(users);
  res.json(users[index]);
});


app.delete("/users/:id", (req, res) => {
  let users = readData();
  const filteredUsers = users.filter(u => u.id != req.params.id);

  if (users.length === filteredUsers.length) {
    return res.status(404).json({ message: "User not found" });
  }

  writeData(filteredUsers);
  res.json({ message: "User deleted successfully" });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
