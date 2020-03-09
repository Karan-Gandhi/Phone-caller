const express = require("express");
const app = express();
const port = process.env.PORT || 3850;
const server = app.listen(port, () => console.log(`listening at ${port}`));
app.use(express.static("public"));
const io = require("socket.io")(server);

let clients = [];

app.get("/clients", (req, res) => res.json({ clients }));

io.on("connection", (socket) => clients.push(socket.id));
